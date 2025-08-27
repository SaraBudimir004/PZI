const fs = require("fs");
const Pdf = require("../models/pdf"); // Tvoj Mongoose model PDF-a
const pdfParse = require("pdf-parse");

exports.uploadPdf = async (req, res) => {
    try {
        // ✅ Provjera da li je poslan file
        if (!req.file) {
            return res.status(400).json({ error: "PDF nije poslan" });
        }

        // ✅ Učitaj PDF iz temp mape (koju multer kreira)
        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(pdfBuffer);

        const pageCount = pdfData.numpages;
        const pdfText = pdfData.text?.trim() || "";

        // ✅ Kreiraj novi PDF dokument za bazu
        const newPdf = new Pdf({
            user: req.user.id,
            filename: req.file.filename,               // Generirano ime na serveru
            originalName: req.body.name || req.file.originalname, // Ime korisnika ili originalno
            data: pdfBuffer,                           // Binarni sadržaj PDF-a
            text: pdfText,                             // Tekst iz PDF-a
            contentType: req.file.mimetype,            // MIME tip (application/pdf)
            totalPages: pageCount,
            uploadedAt: new Date()                     // Datum uploada
        });

        // ✅ Spremi PDF u MongoDB
        await newPdf.save();

        // ✅ Obriši privremeni file iz uploads foldera
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Greška pri brisanju temp file-a:", err);
        });

        // ✅ Vrati podatke frontendu
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

// Dohvat PDF-a po ID-u
exports.getPdfById = async (req, res) => {
    try {
        const pdfDoc = await Pdf.findById(req.params.id);
        if (!pdfDoc) return res.status(404).send('PDF nije pronađen');

        res.contentType(pdfDoc.contentType);
        res.send(pdfDoc.data);
    } catch (error) {
        console.error("Greška prilikom dohvata PDF-a:", error);
        res.status(500).send('Greška prilikom dohvata PDF-a');
    }
};










/*const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
const pdfParse = require("pdf-parse");
const Pdf = require("../models/pdf"); // <-- tvoj PDF model

dotenv.config();

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF nije poslan" });

    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    const text = data.text?.trim() || "";

    const clipped = text.slice(0, 20000);

    const prompt = `
Pročitaj sljedeći tekst. Napiši 10 pitanja i na ta pitanja daj odgovore iz teksta.
Vrati odgovor u JSON formatu: [{ "pitanje": "...", "odgovor": "..." }, ...].

Tekst:
${clipped}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60000
      }
    );

    const answer = response.data?.choices?.[0]?.message?.content || "";

    // Parsiranje AI odgovora u JSON
    let qa = [];
    try {
      qa = JSON.parse(answer);
    } catch (e) {
      console.warn("Odgovor AI-a nije validan JSON, sprema se kao tekst");
      qa = [{ pitanje: "AI odgovor nije parsiran", odgovor: answer }];
    }

    // Spremanje u bazu
    const newPdf = new Pdf({
      user: req.user.id,             // ID prijavljenog korisnika
      filename: req.file.filename,
      originalName: req.file.originalname,
      questions: qa
    });
    await newPdf.save();

    fs.unlink(req.file.path, () => {});

    res.json({ message: "PDF i pitanja spremljeni u bazu", qa });

  } catch (err) {
    console.error("Detaljna greška:", err.response?.data || err.message || err);
    res.status(500).json({
      error: "Greška pri obradi PDF-a ili Groq API",
      details: err.response?.data || err.message
    });
  }
};*/
