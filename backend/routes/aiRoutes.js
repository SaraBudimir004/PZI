const express = require("express");
const { protect } = require("../middlewares/userMiddlewares")
const {
    generateFlashcards,
    generateQuiz,
    generateSummary
} = require("../controllers/aiControllers");

const router = express.Router();

// Svaka ruta zahtijeva prijavljenog korisnika
router.get("/flashcards/:pdfId", protect, generateFlashcards);
router.get("/quiz/:pdfId", protect, generateQuiz);
router.get("/summary/:pdfId", protect, generateSummary);

module.exports = router;
