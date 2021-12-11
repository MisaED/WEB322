var { User } = require("../schemas");
const bcrypt = require("bcrypt");

function validatePassword(userPassword, dbPassword) {
  // console.log({ userPassword, dbPassword });
  if (userPassword === dbPassword) {
    return true;
  }
  return false;
}

function updateLoginHistory(email, userAgent) {
  return new Promise(function (resolve, reject) {
    User.findOneAndUpdate(
      { email: email },
      {
        $push: {
          loginHistory: {
            dateTime: new Date().toString(),
            userAgent: userAgent,
          },
        },
      }
    )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("updateLoginHistory():", err);
        reject(err);
      });
  });
}

module.exports.registerUser = function (userData) {
  return new Promise(async function (resolve, reject) {
    var { password, password2 } = userData;
    if (password != password2) {
      reject("Passwords do not match");
    }

    // Hash password
    var salt = await bcrypt.genSalt(10);
    var hashPassword = await bcrypt.hash(password, salt);

    new User({ ...userData, password: hashPassword })
      .save()
      .then((response) => resolve(response))
      .catch((err) => {
        console.log("ERROR: registerUser():", err);
        if (err.code === 11000) {
          reject("Email already taken");
        } else {
          reject("There was an error creating the user: " + err);
        }
      });
  });
};

module.exports.checkUser = function (userData, session) {
  return new Promise(function (resolve, reject) {
    console.log(userData);
    var { userName, password } = userData;

    User.find({ userName })
      .then(async (response) => {
        if (response.length == 0) {
          reject("Unable to find user: ", userName);
        }

        var isPasswordValid = await bcrypt.compare(
          password,
          response[0].password
        );

        if (isPasswordValid) {
          // update loginHistory
          updateLoginHistory(response[0]["email"], response[0]["userName"])
            .then((res) => {
              // console.log({ res })

              // store user info in session
              session.user = res;
              resolve(res);
            })
            .catch((err) => {
              console.log("There was an error verifying the user: ", err);
              reject(err);
            });
        } else {
          reject("Incorrect Password for user: ", userName);
        }
      })
      .catch((err) => {
        console.log("ERROR: checkUser():", err);
        reject("Unable to find user: ", err);
      });
  });
};

module.exports.logout = function (req) {
  return new Promise(function (resolve, reject) {
    req.session.destroy();
    res.clearCookie("web322");

    resolve();
  });
};
