const express = require('express');
const { protect, adminOnly } = require('../middlewares/userMiddlewares'); 
const {
    adminLogin,
    getAllUsers,
    deleteUser,
    getAllPdfs,
    deletePdf,
    getPdfsByUser
} = require('../controllers/adminControllers');

const router = express.Router();

// Login admina
router.post('/login', adminLogin);

//Sve rute ispod zahtijevaju autentifikaciju i da je admin
router.use(protect);
router.use(adminOnly);

router.get('/panel', (req, res) => {
    res.json({ message: 'Dobrodošao u admin panel!', user: req.user });
});

// Korisnici 
router.get('/users', getAllUsers);               // pregled svih korisnika
router.delete('/users/:userId', deleteUser);    // brisanje korisnika (i njegovih PDF-ova)

//PDF
router.get('/pdfs', getAllPdfs);                     // pregled svih PDF-ova
router.get('/pdfs/user/:userId', getPdfsByUser);    // filtriranje PDF-ova po korisniku
router.delete('/pdfs/:pdfId', deletePdf);           // brisanje PDF-a

module.exports = router;
