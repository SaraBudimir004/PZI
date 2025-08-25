const jwt = require('jsonwebtoken');

// U memoriji pratimo koliko je PDF-ova gost uploadovao (po tokenu)
const guestUploads = {}; 

// Gost se prijavljuje bez lozinke 
exports.guestLogin = (req, res) => {
    const token = jwt.sign(
        { role: 'guest' },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    );

    res.json({ token, message: 'Gost je prijavljen.' });
};

// Middleware koji ograničava gosta na max 2 PDF-a
exports.guestLimit = (req, res, next) => {
    if (req.user.role !== 'guest') return next(); // ograničenje samo za goste

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Nedostaje token." });
    }

    guestUploads[token] = guestUploads[token] || 0;

    if (guestUploads[token] >= 2) {
        return res.status(403).json({ message: "Gost može uploadati maksimalno 2 PDF-a." });
    }

    guestUploads[token] += 1;
    next();
};
