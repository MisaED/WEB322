var express = require("express");
var router = express.Router();
var upload = require("../config");
var fs = require("fs");
const { PHOTODIRECTORY } = require("../PHOTODIRECTORY.js");

router.get("/images/add", function (req, res) {
  res.render("addImage");
});

router.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

router.get("/images", function (req, res) {
  fs.readdir(PHOTODIRECTORY, function (err, items) {
    if (err) {
      res.status(400).json({ ERROR: "something went wrong" });
    }

    // res.status(200).json({ "images": items })
    res.status(200).render("images", { items });
  });
});

module.exports = router;