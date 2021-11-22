const users = require("./users");
const products = require("./products");
const comments = require("./comments");

module.exports = async (app) => {
  // app.use("/", (req, res) => {
  // 	return res.render("layouts/index");
  // });

  app.use("/users", users);
  app.use("/products", products);
  app.use("/comments", comments);

  app.use("/*", (req, res) => {
    res.status(404).json({
      status: "Error",
      message: "Not found",
    });
  });
};
