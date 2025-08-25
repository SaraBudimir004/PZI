const express = require("express");
const router = express.Router();
const { guestLogin, guestLimit } = require("../controllers/gostControllers");
const { protect } = require("../middlewares/userMiddlewares");
const { uploadPdf } = require("../controllers/pdfController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Login ruta za gosta
router.post("/login", guestLogin);

// Upload PDF-a sa provjerom autentifikacije i ograničenjem za goste
router.post("/upload", protect, guestLimit, upload.single("file"), uploadPdf);

module.exports = router;
