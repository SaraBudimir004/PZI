const fs = require("fs");
const pdfParse = require("pdf-parse");

const pdfBuffer = fs.readFileSync("C:/Users/Lenovo/PZI/backend/uploads/luka.pdf");


pdfParse(pdfBuffer).then(data => {
    console.log("PDF text:", data.text);
}).catch(err => {
    console.error("Greška:", err);
});
