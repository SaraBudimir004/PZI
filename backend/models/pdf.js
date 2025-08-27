const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  data: { type: Buffer, required: true }, // PDF sadržaj
  contentType: { type: String, required: true },
  totalPages: { type: Number },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pdf", pdfSchema);













/*const mongoose = require('mongoose');

const PdfSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  questions: [
    {
      pitanje: String,
      odgovor: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pdf', PdfSchema,'pdfs');*/
