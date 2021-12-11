module.exports.middleware = {
  urlRoute: function (req, res, next) {
    var route = req.baseUrl + req.path;
    app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
    next();
  },
  session (req, res, next) {
    res.locals.session = req.session;
    next();
  }
}