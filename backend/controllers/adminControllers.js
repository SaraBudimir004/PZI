const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pdf = require('../models/pdf'); 


exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, role: 'admin' });
        if (!user) return res.status(401).json({ message: 'Ne postoji admin s tim korisničkim imenom.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Pogrešna lozinka.' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Uspješna prijava admina.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.' });
    }
};
// Dohvat svih korisnika
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri dohvaćanju korisnika.' });
    }
};

//Brisanje korisnika (i njegovih PDF-ova) 
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        await User.findByIdAndDelete(userId);
        await Pdf.deleteMany({ user: userId });
        res.json({ message: 'Korisnik i njegovi PDF-ovi obrisani.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri brisanju korisnika.' });
    }
};

//Dohvat svih PDF-ova
exports.getAllPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find().select('_id originalName filename contentType createdAt user').populate('user', 'username email');
        res.json(pdfs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri dohvaćanju PDF-ova.' });
    }
};

//Brisanje PDF
exports.deletePdf = async (req, res) => {
    const { pdfId } = req.params;
    try {
        await Pdf.findByIdAndDelete(pdfId);
        res.json({ message: 'PDF obrisan.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri brisanju PDF-a.' });
    }
};

//Dohvat PDF-ova po korisniku
exports.getPdfsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const pdfs = await Pdf.find({ user: userId }).populate('user', 'username email');
        res.json(pdfs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri dohvaćanju PDF-ova korisnika.' });
    }
};
// Dohvat PDF-a po ID-u s tekstom (za admina)
exports.getPdfContent = async (req, res) => {
    const { pdfId } = req.params;
    try {
        const pdf = await Pdf.findById(pdfId).populate('user', 'username email');
        if (!pdf) return res.status(404).json({ message: 'PDF nije pronađen.' });

        res.json({
            pdfId: pdf._id,
            originalName: pdf.originalName,
            filename: pdf.filename,
            totalPages: pdf.totalPages,
            uploadedAt: pdf.createdAt,
            user: pdf.user,
            text: pdf.text, // Ovdje je sadržaj PDF-a
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri dohvaćanju sadržaja PDF-a.' });
    }
};