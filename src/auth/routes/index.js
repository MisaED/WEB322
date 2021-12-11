var express = require("express");
var router = express.Router();

var { registerUser, checkUser, logout } = require("../services/index");

router.post("/register", (req, res) => {
  registerUser(req.body)
    .then((response) => res.status(200).render("register"))
    .catch((err) => res.status(400).json(err));
});

router.post("/login", (req, res) => {
  req.body.userAgent = req.get('User-Agent');

  checkUser(req.body, req.session)
    .then((response) => {
      req.session.user = "testing"
      res.status(200).redirect("/")
    })
    // .then((response) => res.status(200).json())
    .catch((err) => res.status(401).json(err));
});

router.get("/reqsession", (req, res) => {
  res.status(200).json({
    reqSession: req.session,
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("web322");
  res.json({ ok: 200 });
  // resolve();
  // logout(req)
  //   .then(() => res.redirect('/'));
});

router.get("/login", (req, res) => {
  res.status(200).render("login");
});

router.get("/register", (req, res) => {
  res.status(200).render("register");
});

// router.post('/', blogController.blog_create_post);
// router.get('/:id', blogController.blog_details);
// router.delete('/:id', blogController.blog_delete);
module.exports = router;
