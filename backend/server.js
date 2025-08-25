const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const pdfRoutes = require("./routes/pdfRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const guestRoutes = require('./routes/gostRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Povezivanje na MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => console.log(err));

// Rute
app.use("/pdf", pdfRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/gost', guestRoutes);

// Test ruta
app.get("/", (req, res) => {
  res.send("Backend radi! 🚀");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server pokrenut na http://localhost:${PORT}`));
