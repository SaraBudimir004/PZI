// controllers/pdfController.js
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
const pdfParse = require("pdf-parse");
const Pdf = require("../models/pdf"); // tvoj PDF model

dotenv.config();

// Helper funkcija za poziv AI API-ja
async function callAI(prompt) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = "llama-3.3-70b-versatile";

    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            messages: [{ role: "user", content: prompt }],
            model: GROQ_MODEL
        },
        {
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            timeout: 60000
        }
    );

    return response.data?.choices?.[0]?.message?.content || "";
}

// Upload PDF i spremanje texta
exports.uploadPdf = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "PDF nije poslan" });

        const pdfBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(pdfBuffer);
        const text = data.text?.trim() || "";

        const newPdf = new Pdf({
            user: req.user.id,             // ID prijavljenog korisnika
            filename: req.file.filename,
            originalName: req.file.originalname,
            text: text                     // <--- Sprema text za kasniju obradu
        });

        await newPdf.save();

        fs.unlink(req.file.path, () => {}); // obriši temp file

        res.json({ message: "PDF spremljen u bazu", pdfId: newPdf._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Greška pri uploadu PDF-a", details: err.message });
    }
};

// Flashcards generator
exports.generateFlashcards = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.pdfId);
        if (!pdf) return res.status(404).json({ error: "PDF nije pronađen" });

        const clipped = pdf.text?.slice(0, 20000) || "";

        const prompt = `
Pročitaj pažljivo sljedeći tekst i kreiraj  3 flashcards (pitanja i odgovore) na temelju sadržaja. Napravi **onoliko flashcards koliko je potrebno da obuhvatiš sve važne pojmove i informacije iz teksta**. 

- Svako pitanje treba biti jasno i precizno.
- Odgovori trebaju biti detaljni, napisani književnim hrvatskim jezikom, lako razumljivi i samostalni (da se mogu pročitati bez ponovnog čitanja teksta).
- Vrati rezultat u **JSON formatu**: 
[
  {
    "pitanje": "...",
    "odgovor": "..."
  },
  ...
]

Tekst:
${clipped}
`;

        const answer = await callAI(prompt);

        let flashcards = [];
        try {
            // Regex za izvlačenje JSON liste unutar stringa
            const match = answer.match(/\[\s*{[\s\S]*}\s*\]/);
            if (match) {
                flashcards = JSON.parse(match[0]); // parsiraj stvarni JSON
            } else {
                flashcards = [{ pitanje: "Greška pri parsiranju", odgovor: answer }];
            }
        } catch (err) {
            flashcards = [{ pitanje: "Greška pri parsiranju", odgovor: answer }];
        }

        res.json({ flashcards });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Greška pri generiranju flashcards" });
    }
};

exports.generateQuiz = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.pdfId);
        if (!pdf) return res.status(404).json({ error: "PDF nije pronađen" });

        // Uzmi prvih 20 000 znakova da AI ne preoptereti prompt
        const clipped = pdf.text?.slice(0, 20000) || "";

        // Prompt za AI da vrati isključivo JSON
        const prompt = `
Pročitaj pažljivo tekst i na temelju njega napravi kviz. Napiši dovoljno pitanja da obuhvatiš sve bitne dijelove teksta.  
Svako pitanje treba imati 4 odgovora (označena "a", "b", "c", "d") i označi točan odgovor.  
Vrati **isključivo JSON** u ovom formatu:
[
  { "pitanje": "...", "odgovori": ["a) ...","b) ...","c) ...","d) ..."], "tocan": "b" }
]
Tekst: ${clipped}
`;

        const answer = await callAI(prompt);

        let quiz = [];
        try {
            // pokušaj parsiranja AI odgovora kao JSON
            quiz = JSON.parse(answer);
            if (!Array.isArray(quiz)) throw new Error("Odgovor nije niz");
        } catch (err) {
            console.error("Greška pri parsiranju AI odgovora:", err);
            // fallback ako AI ne vrati validan JSON
            quiz = [{ pitanje: "AI odgovor nije parsiran", odgovori: [], tocan: "" }];
        }

        res.json({ quiz });
    } catch (err) {
        console.error("Greška pri generiranju kviza:", err);
        res.status(500).json({ error: "Greška pri generiranju kviza" });
    }
};
// Sažetak PDF-a
exports.generateSummary = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.pdfId);
        if (!pdf) return res.status(404).json({ error: "PDF nije pronađen" });

        const clipped = pdf.text?.slice(0, 20000) || "";

        const prompt = `
Pročitaj tekst i napiši sažetak od najbitnijih dijelova.

Tekst:
${clipped}
`;

        const summary = await callAI(prompt);

        res.json({ summary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Greška pri generiranju sažetka" });
    }
};
