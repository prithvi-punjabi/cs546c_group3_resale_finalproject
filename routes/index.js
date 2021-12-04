const users = require("./users");
const products = require("./products");
const comments = require("./comments");
const statistics = require("./statistics");
const about = require("./about");
const chats = require("./chat");
const multer = require("multer");
const { ErrorMessage } = require("../helper/message");
const productsData = require("../data").products;
const utils = require("../helper/utils");

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
  app.use("/", users);
  app.use("/products", products);
  app.use("/comments", comments);
  app.use("/about", about);
  app.use("/statistics", statistics);
  app.use("/chat", chats);

  app.post("/uploadSingle", (req, res) => {
    uploadSingle(req, res, function (err) {
      if (err) {
        return res.status(500).json("Failed to upload image");
      }
      return res.json("/" + req.file.destination + "/" + req.file.filename);
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
        images.push("/" + file.path);
      }
      return res.json(images);
    });
  });

  app.get("/", async (req, res) => {
    try {
      let products;
      if (req.query.sort_by == null) {
        req.query.sort_by = "date";
      } else {
        if (
          req.query.sort_by != "date" &&
          req.query.sort_by != "user_rating" &&
          req.query.sort_by != "price" &&
          req.query.sort_by != "price_low_to_high" &&
          req.query.sort_by != "price_high_to_low"
        ) {
          req.query.sort_by = "date";
        }
      }
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
        isSortByDate:
          req.query.sort_by != null &&
          req.query.sort_by.toLowerCase() == "date",
        isSortByUserRating:
          req.query.sort_by != null &&
          req.query.sort_by.toLowerCase() == "user_rating",
        isSortByPrice:
          req.query.sort_by != null &&
          (req.query.sort_by.toLowerCase() == "price" ||
            req.query.sort_by.toLowerCase() == "price_low_to_high"),
        isSortByPriceHighToLow:
          req.query.sort_by != null &&
          req.query.sort_by.toLowerCase() == "price_high_to_low",
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
