const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
    tokenId: { type: String, unique: true },   // ID gosta (vežemo ga uz JWT)
    uploads: { type: Number, default: 0 },     // koliko je fajlova uploadano
    expiresAt: { 
        type: Date, 
        default: () => Date.now() + 3*24*60*60*1000, // 3 dana od logina
        index: { expires: '3d' } // Mongo automatski briše nakon 3 dana
    }
});

module.exports = mongoose.model("Guest", guestSchema);
