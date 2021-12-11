/*********************************************************************************
 * WEB322 – Assignment 02
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Misato Endo      Student ID: 158516195     Date: 2021/10/10
 *
 * Online (Heroku) URL: https://aqueous-refuge-30289.herokuapp.com/
 *
 ********************************************************************************/

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var session = require("express-session");
var { helpers } = require("./hbs/helper");
// var { middleware } = require("./middleware");

hbs_config = {
  extname: ".hbs",
  // defaultLayout: "main",
  // layoutsDir: path.join(__dirname, 'views/layouts'),
  // partialsDir: path.join(__dirname, 'views/partials')
  helpers: helpers
};

app.set("views", "./src/views");
app.engine(".hbs", exphbs(hbs_config));
app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("src/public"));
// var { v4: uuidv4 } = require('uuid');

app.use(
  session({
    name: "web322",
    secret: "this is keyword",
    resave: false,
    saveUninitialized: false,
    path: '/',
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
      secure: process.env.NODE_ENV === "production"
    }
    // genid: (req) => {
    //   console.log('Inside the session middleware/sessionConfig: ')
    //   console.log({ session: req.sessionID })
    //   return uuidv4() // use UUIDs for session IDs
    // },
    // cookie: { maxAge: 60000 }
  })
);

// app.use(middleware.session);
// app.use(middleware.urlRoute);

var auth = require("./auth/config");
app.use("/", require("./auth/routes"));

const {
  initialize,
  getManagers,
} = require("./data-server");

// used in hbs custom helper
app.use(function (req, res, next) {
  var route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/', require('./base/routes'));
app.use('/', require('./employee/routes/index'));
app.use('/', require('./department/routes/index'));
app.use('/', require('./image/routes/index'));
app.get("/managers", function (req, res) {
  getManagers()
    .then((response) => res.json(response.data))
    .catch((err) => res.json(err));
});

initialize()
  .then((msg) => {
    auth
      .initialize()
      .then((response) => {
        console.log(response);
        app.listen(PORT, () => console.log(`app running ${PORT}`));
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => console.log(err));


  // Promise.all([initialize, auth.initialize]).then((values) => {
  //   console.log({values})
  // })

