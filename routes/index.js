const users = require("./users");
const products = require("./products");
const comments = require("./comments");
const multer = require("multer");
const { ErrorMessage } = require("../helper/message");
const productsData = require("../data").products;
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const usersData = require("../data/users");
const { errorCode } = require("../helper/common");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const splitted = file.originalname.split(".");
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + splitted[splitted.length - 1]
    );
  },
});
var uploadSingle = multer({ storage: storage }).single("image");
var uploadArray = multer({ storage: storage }).array("image", 5);

module.exports = async (app) => {
  // app.use("/", (req, res) => {
  // 	return res.render("layouts/index");
  // });

  app.use("/users", users);
  app.use("/products", products);
  app.use("/comments", comments);

  app.post("/uploadSingle", (req, res) => {
    uploadSingle(req, res, function (err) {
      if (err) {
        return res.status(500).json("Failed to upload image");
      }
      return res.json(req.file.destination + "/" + req.file.filename);
    });
  });

  app.post("/upload", (req, res) => {
    uploadArray(req, res, function (err) {
      if (err) {
        return res.status(500).json("Failed to upload image");
      }
      const images = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        images.push(file.path);
      }
      return res.json(images);
    });
  });

  app.get("/login", (req, res) => {
    return res.render("login");
  });

  app.get("/logout", (req, res) => {
    req.session.destroy();
    return res.render("/");
  });

  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      validator.checkNonNull(username, password);
      validator.checkString(username, "username");
      validator.checkString(password, "password");

      const user = await usersData.loginUser(username, password);
      req.session.user = user;
      return res.json(user);
    } catch (e) {
      if (typeof e == "string") {
        e = new Error(e);
        e.code = errorCode.BAD_REQUEST;
      }
      return res.status(e.code).json(ErrorMessage(e.message));
    }
  });

  app.get("/", async (req, res) => {
    try {
      let products;
      if (utils.isEmptyObject(req.query)) {
        products = await productsData.getAll();
      } else {
        products = await productsData.getByQuery(req.query);
      }
      products.forEach((x) => {
        x.images = x.images[0];
      });
      return res.render("products", {
        user: req.session.user,
        products: products,
        title: "re$ale",
      });
    } catch (e) {
      if (typeof e == "string") {
        e = new Error(e);
        e.code = 400;
      }
      if (e.code != null)
        return res.status(e.code).json(ErrorMessage(e.message));
      else return res.status(500).json(ErrorMessage(e.message));
    }
  });

  app.use("/*", (req, res) => {
    res.status(404).json({
      status: "Error",
      message: "Not found",
    });
  });
};
