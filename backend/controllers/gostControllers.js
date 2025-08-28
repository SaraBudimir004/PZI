const jwt = require("jsonwebtoken");
const Guest = require("../models/gost");
const { v4: uuidv4 } = require("uuid");

// Gost login
const guestLogin = async (req, res) => {
    try {
        const tokenId = uuidv4();

        const guest = new Guest({ tokenId });
        console.log("Priprema gosta:", guest);
        await guest.save();
        console.log("Gost spremljen u bazu:", guest);

        const token = jwt.sign(
            { role: "guest", tokenId }, 
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.json({ token, message: "Gost je prijavljen." });
    } catch (err) {
        console.error("Greška pri loginu gosta:", err);
        res.status(500).json({ message: "Greška pri loginu gosta", error: err.message });
    }
};

// Middleware za limitiranje PDF-ova
const guestLimit = async (req, res, next) => {
    if (req.user.role !== "guest") return next();

    try {
        const guest = await Guest.findOne({ tokenId: req.user.tokenId });

        if (!guest) return res.status(401).json({ message: "Nevažeći gost token." });
        if (guest.uploads >= 2) return res.status(403).json({ message: "Gost je iskoristio svoj limit." });

        guest.uploads += 1;
        await guest.save();

        next();
    } catch (err) {
        res.status(500).json({ message: "Greška pri provjeri gosta", error: err.message });
    }
};

module.exports = { guestLogin, guestLimit };
