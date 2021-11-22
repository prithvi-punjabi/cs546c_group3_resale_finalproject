const express = require("express");
const router = express.Router();
const productsData = require("../data").products;
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const errorCode = require("../helper/common").errorCode;
const ErrorMessage = require("../helper/message").ErrorMessage;

router.get("/", async (req, res, next) => {
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
    return res.render("products", { products: products, title: "re$ale" });
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    utils.parseObjectId(productId, "ProductId");
    const product = await productsData.getById(productId);
    return res.render("thisproduct", { product: product });
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

router.post("/", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const {
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
      dateListed,
    } = req.body;
    validator.checkNonNull(
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
    validator.checkString(name, "name");
    if (!Array.isArray(category)) throw "Category must be an array";
    if (!Array.isArray(keywords)) throw "keywords must be an array";
    validator.checkNumber(price, "price");
    validator.checkString(seller_id, "seller_id");
    if (!Array.isArray(images)) throw "Images must be an array";
    validator.checkString(description, "description");
    validator.checkLocation(location);
    validator.checkString(status, "status");
    validator.checkString(condition, "Barely used");
    validator.checkDate(dateListed, "Date Listed");

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

router.put("/:id", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const {
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
      dateListed,
    } = req.body;
    validator.checkNonNull(
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
    validator.checkString(name, "name");
    if (!Array.isArray(category)) throw "Category must be an array";
    if (!Array.isArray(keywords)) throw "keywords must be an array";
    validator.checkNumber(price, "price");
    validator.checkString(seller_id, "seller_id");
    if (!Array.isArray(images)) throw "Images must be an array";
    validator.checkString(description, "description");
    validator.checkLocation(location);
    validator.checkString(status, "status");
    validator.checkString(condition, "Barely used");
    validator.checkDate(dateListed, "Date Listed");

    try {
      await productsData.getById(req.params.id);
    } catch (e) {
      res.status(404).json({ message: "Product not found" });
    }

    const product = await productsData.update(
      req.params.id,
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

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    utils.parseObjectId(productId, "ProductId");
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
