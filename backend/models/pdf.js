const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  originalName: { type: String, required: true },

  // Ili korisnik ili gost
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  guestTokenId: { type: String, required: false }, // tokenId gosta

  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  contentType: { type: String, required: true },

  totalPages: { type: Number },
  text: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pdf", pdfSchema);
