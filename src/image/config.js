const multer = require("multer");
const path = require("path")
const { PHOTODIRECTORY } = require("./PHOTODIRECTORY.js");

// multer
var storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });

module.exports = upload;