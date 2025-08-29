const jwt = require("jsonwebtoken");
const Guest = require("../models/gost");
const { v4: uuidv4 } = require("uuid");

const guestLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const existingGuest = await Guest.findOne({ tokenId: decoded.tokenId });
        if (existingGuest) {
          // Vrati isti token, ne kreiraj novog
          return res.json({ token,
            message: "Gost je već prijavljen.",
            guestId: existingGuest._id
          });
        }
      } catch (err) {
        // Token istekao → kreirat ćemo novog gosta
      }
    }

    // Ako token ne postoji ili je istekao → kreiraj novog gosta
    const tokenId = uuidv4();
    const guest = new Guest({ tokenId });
    await guest.save();

    const token = jwt.sign({ role: "guest", tokenId }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.json({
      token,
      message: "Gost je prijavljen.",
      guestId: guest._id
    });
  } catch (err) {
    res.status(500).json({ message: "Greška pri loginu gosta", error: err.message });
  }
};

// Middleware za limitiranje PDF-ova
const guestLimit = async (req, res, next) => {
  if (req.user.role !== "guest") return next();

  try {
    const guest = await Guest.findOne({ tokenId: req.user.tokenId });

    if (!guest) return res.status(401).json({ message: "Nevažeći gost token." });
    if (guest.uploads >= 2) return res.status(403).json({ message: "Iskoristili ste svoj limit." });

    guest.uploads += 1;
    await guest.save();

    next();
  } catch (err) {
    res.status(500).json({ message: "Greška pri provjeri gosta", error: err.message });
  }
};

module.exports = { guestLogin, guestLimit };
