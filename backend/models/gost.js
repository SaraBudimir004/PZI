const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
    tokenId: { type: String, unique: true },   
    uploads: { type: Number, default: 0 },     
    expiresAt: { 
        type: Date, 
        default: () => Date.now() + 3*24*60*60*1000, 
        index: { expires: '3d' } //automatski briše nakon 3 dana
    }
});

module.exports = mongoose.model("Guest", guestSchema);
