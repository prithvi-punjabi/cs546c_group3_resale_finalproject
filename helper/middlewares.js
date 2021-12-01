const utils = require("./utils");

function checkLogin(req, res, next) {
  if (!utils.isUserLoggedIn(req)) {
    return res.redirect("/login");
  }
  next();
}

module.exports = async (app) => {
  app.use("/products/new", checkLogin);
  app.use("/chat", checkLogin);
};
