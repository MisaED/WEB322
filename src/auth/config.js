var mongoose = require("mongoose");
var { v4: uuidv4 } = require("uuid");

module.exports.initialize = function () {
  
  const {
    MONGO_USERNAME = "admin", 
    MONGO_PASSWORD = "admin1234",
    MONGO_DATABASE = "assignment6"
  } = process.env;

  var uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.hxh7d.mongodb.net/${MONGO_DATABASE}`;

  return new Promise(function (resolve, reject) {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((result) => {
        resolve("MongoDB successfully connected");
      })
      .catch((err) => reject(err));
  });
};

module.exports.sessionConfig = {
  name: "",
  genid: (req) => {
    console.log("Inside the session middleware/sessionConfig: ");
    console.log({ session: req.sessionID });
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: "this is keyword",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
  // cookie: { secure: true }
};

// // cookies
// app.get('/set-cookies', (req, res) => {
//   // res.setHeader('Set-Cookie', 'newUser=HIDE');

//   res.cookie('newUser', false);
//   res.cookie('isEmployee', true, {maxAge: 1000*60*60*24, httpOnly: true});

//   res.send('you got a cookie')
// })

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);

//   res.json(cookies);
// })
