const express = require("express");
const router = express.Router();
const data = require("../data");
const validate = require("../helper/validator");
const utils = require("../helper/utils");
const userData = data.users;
const validator = require("../helper/validator");
const { errorCode } = require("../helper/common");
const { ErrorMessage } = require("../helper/message");

router.get("/", async (req, res) => {
  try {
    const maxRating = await userData.highestRating();
    const maxListings = await userData.mostListings();
    res.render("statistics", { rating: maxRating, listing: maxListings });
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
