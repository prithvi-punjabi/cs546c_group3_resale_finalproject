const users = require("./users");
const products = require("./products");
const comments = require("./comments");
const multer = require("multer");
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
var upload = multer({ storage: storage });

module.exports = async (app) => {
  // app.use("/", (req, res) => {
  // 	return res.render("layouts/index");
  // });

  app.use("/users", users);
  app.use("/products", products);
  app.use("/comments", comments);

  app.post("/upload", upload.single("image"), (req, res) => {
    return res.json(req.file.destination + "/" + req.file.filename);
  });

  app.use("/*", (req, res) => {
    res.status(404).json({
      status: "Error",
      message: "Not found",
    });
  });
};
