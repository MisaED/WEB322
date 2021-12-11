var express = require("express");
var router = express.Router();

router.get("/envs", function (req, res) {
  res.status(200).json(process.env);
});

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/about", function (req, res) {
  res.render("about");
});

module.exports = router;
