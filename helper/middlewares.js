const utils = require("./utils");

module.exports = async (app) => {
  app.use("/products/new", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect("/login");
    }
    next();
  });
};
