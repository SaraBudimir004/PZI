const fs = require("fs");
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
};
