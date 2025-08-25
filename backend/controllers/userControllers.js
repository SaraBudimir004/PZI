const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: 'Korisničko ime ili email već postoji.' });

        const newUser = new User({ username, email, password, role: 'user' });
        await newUser.save();

        res.status(201).json({ message: 'Registracija uspješna.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.', error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, role: 'user' });
        if (!user) return res.status(401).json({ message: 'Korisnik nije pronađen.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Pogrešna lozinka.' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Prijava uspješna.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška na serveru.', error: err.message });
    }
};
