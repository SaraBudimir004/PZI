const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/userMiddlewares");
const { uploadPdf } = require("../controllers/pdfController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", protect, upload.single("file"), uploadPdf);

module.exports = router;
