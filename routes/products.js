const express = require("express");
const router = express.Router();
const productsData = require("../data").products;
const userData = require("../data/users");
const bidData = require("../data/bids");
const commentData = require("../data/comments");
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const errorCode = require("../helper/common").errorCode;
const ErrorMessage = require("../helper/message").ErrorMessage;
const moment = require("moment");
let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "resalegroup3@gmail.com",
    pass: "rwckkyxaaveoxakw",
  },
});

router.get("/", async (req, res, next) => {
  try {
    let products;
    if (utils.isEmptyObject(req.query)) {
      products = await productsData.getAll();
    } else {
      products = await productsData.getByQuery(req.query);
    }
    return res.json(products);
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    utils.parseObjectId(productId, "ProductId");
    const product = await productsData.getById(productId);
    const comments = await commentData.getAllComments(productId);
    const thisUserFav = await userData.get(req.session.user._id.toString());
    const allBids = await bidData.getAll(productId);
    const allusers = await userData.getAll();
    comments.forEach((x, index) => {
      comments[index].dateAdded = utils.formatDaysAgo(x.dateAdded);
      comments[index]._id = x._id.toString();
      allusers.forEach((curr) => {
        if (curr.id === x.user_id.toString()) {
          x.userName = curr.name;
          x.profilePicture = curr.img;
        }
      });
    });
    product.streetUrl = utils.replaceSpaceInUrl(product.location.streetAddress);
    product.cityUrl = utils.replaceSpaceInUrl(product.location.city);
    product.isSold = product.status.toLowerCase() == "sold";
    let update = {};
    let alreadyFav = 0;
    thisUserFav.favouriteProducts.forEach((x) => {
      if (x.toString() === productId) alreadyFav += 1;
    });
    if (req.session.user._id === product.seller._id.toString()) {
      update.updated = true;

      return res.render("thisproduct", {
        product: product,
        title: product.name,
        comments: comments,
        update: update,
        fav: alreadyFav,
        user: req.session.user,
        bids: allBids,
      });
    } else {
      return res.render("thisproduct", {
        product: product,
        title: product.name,
        comments: comments,
        fav: alreadyFav,
        user: req.session.user,
      });
    }
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null)
      return res
        .status(e.code)
        .render("error", { code: e.code, error: e.message });
    else
      return res.status(500).render("error", { code: 500, error: e.message });
  }
});

router.get("/new", async (req, res) => {
  try {
    return res.render("addProduct", {
      user: req.session.user,
      title: "List a product",
    });
  } catch (e) {
    console.log(e);
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null)
      return res
        .status(e.code)
        .render("error", { code: e.code, error: e.message });
    else
      return res.status(500).render("error", { code: 500, error: e.message });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    utils.parseObjectId(productId, "ProductId");

    try {
      const product = await productsData.getById(req.params.id);
      if (product.seller_id.toString() != req.session.user._id.toString()) {
        return res.status(e.code).render("error", {
          code: 403,
          error: "You're not authorized to edit others' products",
        });
      }

      let category = null,
        keywords = null;
      for (const key in product.category) {
        const value = product.category[key];
        if (category == null) {
          category = value;
        } else {
          category += ", " + value;
        }
      }
      product.category = category;
      for (const key in product.keywords) {
        const value = product.keywords[key];
        if (keywords == null) {
          keywords = value;
        } else {
          keywords += ", " + value;
        }
      }
      product.keywords = keywords;
      product.isAvailable = product.status.toLowerCase() == "available";
      product.isNew = product.condition.toLowerCase() == "new";
      product.isBarelyUsed = product.condition.toLowerCase() == "barely used";
      product.isFairlyUsed = product.condition.toLowerCase() == "fairly used";
      return res.render("addProduct", {
        product: product,
        title: `Update ${product.name}`,
      });
    } catch (e) {
      if (typeof e == "string") {
        e = new Error(e);
        e.code = 500;
      }
      return res
        .status(e.code)
        .render("error", { code: e.code, error: e.message });
    }
  } catch (e) {
    console.log(e);
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null)
      return res
        .status(e.code)
        .render("error", { code: e.code, error: e.message });
    else
      return res.status(500).render("error", { code: 500, error: e.message });
  }
});

router.post("/post/:id", async (req, res) => {
  let id = req.params.id;
  let from = req.session.user.email;
  let seller_id = req.body.idOfSeller;
  let to = req.body.emailOfSeller;
  let msg = req.body.message;
  if (seller_id.toString() === req.session.user._id.toString()) {
    return res.status(403).render("error", {
      code: 403,
      error: "You cannot email yourself.",
    });
  }
  let mailOptions = {
    from: from,
    to: to,
    subject: `Email from: ${from}`,
    text: msg,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.json({ data: "Email Sent" });
    }
  });
});

router.post("/new", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const {
      name,
      category,
      keywords,
      price,
      images,
      description,
      location,
      status,
      condition,
    } = req.body;
    validator.checkNonNull(
      name,
      category,
      keywords,
      price,
      images,
      description,
      location,
      status,
      condition
    );
    validator.checkString(name, "name");
    if (!Array.isArray(category)) throw "Category must be an array";
    if (!Array.isArray(keywords)) throw "keywords must be an array";
    validator.checkNumber(price, "price");

    if (!Array.isArray(images)) throw "Images must be an array";
    validator.checkString(description, "description");
    validator.checkLocation(location);
    validator.checkString(status, "status");
    validator.checkString(condition, "Barely used");

    if (!utils.isUserLoggedIn(req)) {
      return res
        .status(403)
        .json(ErrorMessage("Login to start listing products"));
    }

    const seller_id = req.session.user._id.toString();
    const dateListed = moment().format("MM/DD/YYYY");

    const product = await productsData.create(
      name,
      category,
      keywords,
      price,
      seller_id,
      images,
      description,
      location,
      status,
      condition,
      dateListed
    );
    return res.json(product);
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

router.post("/edit/:id", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const {
      name,
      category,
      keywords,
      price,
      images,
      description,
      location,
      status,
      condition,
    } = req.body;
    validator.checkNonNull(
      name,
      category,
      keywords,
      price,
      images,
      description,
      location,
      status,
      condition
    );
    validator.checkString(name, "name");
    if (!Array.isArray(category)) throw "Category must be an array";
    if (!Array.isArray(keywords)) throw "keywords must be an array";
    validator.checkNumber(price, "price");
    if (!Array.isArray(images)) throw "Images must be an array";
    validator.checkString(description, "description");
    validator.checkLocation(location);
    validator.checkString(status, "status");
    validator.checkString(condition, "Barely used");

    try {
      const product = await productsData.getById(req.params.id);
      if (product.seller_id.toString() != req.session.user._id.toString()) {
        return res
          .status(403)
          .json(ErrorMessage("You're not authorized to edit others' products"));
      }
    } catch (e) {
      return res.status(404).json(ErrorMessage("Product not found"));
    }

    const product = await productsData.update(
      req.params.id,
      name,
      category,
      keywords,
      price,
      images,
      description,
      location,
      status,
      condition
    );
    return res.json(product);
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

router.post("/remove/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    utils.parseObjectId(productId, "ProductId");
    try {
      const product = await productsData.getById(req.params.id);
      if (product.seller_id.toString() != req.session.user._id.toString()) {
        return res
          .status(403)
          .json(
            ErrorMessage("You're not authorized to remove others' products")
          );
      }
    } catch (e) {
      return res.status(404).json(ErrorMessage("Product not found"));
    }
    const product = await productsData.remove(productId);
    return res.json(product);
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

module.exports = router;
