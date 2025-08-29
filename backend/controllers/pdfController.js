const fs = require("fs");
const path = require("path");
const Pdf = require("../models/pdf"); 
const pdfParse = require("pdf-parse");

exports.uploadPdf = async (req, res) => {
    try {
        //Provjera da li je poslan file
        if (!req.file) {
            return res.status(400).json({ error: "PDF nije poslan" });
        }
        console.log(req.user, "req.user prije 1 kreiranja PDF-a")
        // Učitaj PDF iz temp mape (koju multer kreira)
        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(pdfBuffer);

        const pageCount = pdfData.numpages;
        const pdfText = pdfData.text?.trim() || "";

        //Kreiraj novi PDF dokument za bazu
        const newPdf = new Pdf({
          filename: req.file.filename,               
          originalName: req.body.name || req.file.originalname,
          data: pdfBuffer,
          user: req.user.role === "user" ? req.user.id : null,        // Samo ako je registrirani korisnik
          guestTokenId: req.user.role === "guest" ? req.user.tokenId : null, // Samo ako je gost
          text: pdfText,
          filePath: req.file.path,
          contentType: req.file.mimetype,
          totalPages: pageCount,
          uploadedAt: new Date()
      });


        console.log(req.user, "req.user prije kreiranja PDF-a")

        // Spremi PDF u MongoDB
        await newPdf.save();



        //Vrati podatke frontendu
        console.log("Parsed PDF text:", pdfText); // ispravno logiranje
        res.json({
            message: "PDF je uspješno uploadan i spremljen u bazu!",
            pdfId: newPdf._id,
            pdfName: newPdf.originalName,
            totalPages: pageCount
        });

    } catch (err) {
        console.error("Greška pri uploadu PDF-a:", err);
        res.status(500).json({ error: "Greška na serveru prilikom uploada PDF-a" });
    }
};

exports.getPdfById = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) return res.status(404).json({ message: "PDF nije pronađen" });

        const absolutePath = path.resolve(pdf.filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ message: "Fajl više ne postoji na serveru" });
        }

        res.contentType(pdf.contentType);
        res.sendFile(absolutePath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška prilikom učitavanja PDF-a", error: err.message });
    }
};

// Dohvati sve PDF-ove korisnika ili gosta
exports.getUserPdfs = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === "guest") {
            query = { guestTokenId: req.user.tokenId };
        } else {
            query = { user: req.user.id };
        }

        const pdfs = await Pdf.find(query).sort({ createdAt: -1 });

        res.json(pdfs.map(pdf => ({
            id: pdf._id,
            name: pdf.originalName,
            totalPages: pdf.totalPages,
            date: pdf.createdAt.toISOString().split("T")[0]
        })));
    } catch (error) {
        console.error("Greška u getUserPdfs:", error);
        res.status(500).json({ message: "Greška pri dohvaćanju PDF-ova." });
    }
};


exports.deletePdf = async (req, res) => {
    try {
        if (req.user.role === "guest") {
            return res.status(403).json({ message: "Gosti ne mogu brisati PDF-ove" });
        }

        const pdfId = req.params.id;
        const pdf = await Pdf.findOne({ _id: pdfId, user: req.user.id });

        if (!pdf) {
            return res.status(404).json({ message: "PDF nije pronađen" });
        }

        // Briši fajl sa diska
        if (fs.existsSync(pdf.filePath)) {
            fs.unlinkSync(pdf.filePath);
        }

        // Briši zapis iz baze
        await pdf.deleteOne();

        res.json({ message: "PDF je obrisan" });
    } catch (err) {
        console.error("Greška pri brisanju PDF-a:", err);
        res.status(500).json({ message: "Greška pri brisanju PDF-a", error: err.message });
    }
};


// Dohvati sve PDF-ove gosta
exports.getGuestPdfs = async (req, res) => {
    try {
        // req.user.role i req.user.tokenId dolaze iz protect middleware-a
        if (req.user.role !== "guest") {
            return res.status(403).json({ message: "Samo gosti mogu pristupiti ovoj ruti" });
        }

        const pdfs = await Pdf.find({ guestTokenId: req.user.tokenId }).sort({ createdAt: -1 });

        res.json(pdfs.map(pdf => ({
            id: pdf._id,
            name: pdf.originalName,
            totalPages: pdf.totalPages,
            date: pdf.createdAt.toISOString().split("T")[0]
        })));
    } catch (err) {
        console.error("Greška u getGuestPdfs:", err);
        res.status(500).json({ message: "Greška pri dohvaćanju PDF-ova gosta." });
    }
};

