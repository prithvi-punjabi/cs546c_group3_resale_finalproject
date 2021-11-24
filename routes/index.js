const users = require("./users");
const products = require("./products");
const comments = require("./comments");
const multer = require("multer");
const { ErrorMessage } = require("../helper/message");
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

  app.use("/*", (req, res) => {
    res.status(404).json({
      status: "Error",
      message: "Not found",
    });
  });
};
