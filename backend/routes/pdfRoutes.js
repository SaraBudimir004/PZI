const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/userMiddlewares");
const { uploadPdf, getPdfById, getUserPdfs, deletePdf, getGuestPdfs } = require("../controllers/pdfController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", protect, upload.single("file"), uploadPdf);

router.get("/user", protect, getUserPdfs);

router.get("/guest", protect, getGuestPdfs);

router.delete("/:id", protect, deletePdf);

router.get("/:id", protect, getPdfById);

module.exports = router;


