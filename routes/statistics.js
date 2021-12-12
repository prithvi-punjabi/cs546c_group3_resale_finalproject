const express = require("express");
const router = express.Router();
const data = require("../data");
const utils = require("../helper/utils");
const statData = data.statistics;
const validator = require("../helper/validator");
const { errorCode } = require("../helper/common");
const { ErrorMessage } = require("../helper/message");

router.get("/", async (req, res) => {
  try {
    const maxRating = await statData.highestRating();
    const maxListings = await statData.mostListings();
    const highestListingMonth = await statData.highestProductListedByMonth();
    const highestListingCity = await statData.highestProductListedByCity();
    const highestListingCategory =
      await statData.highestProductListedByCategory();
    const listingsByCategory = await statData.getListingsByCategory();
    const categories = [],
      categoryCounts = [];
    for (const key in listingsByCategory) {
      if (Object.hasOwnProperty.call(listingsByCategory, key)) {
        categories.push(key.toString());
        categoryCounts.push(listingsByCategory[key]);
      }
    }
    if (maxRating !== false) {
      res.render("statistics", {
        rating: maxRating,
        listing: maxListings,
        highestListingMonth,
        highestListingCity,
        highestListingCategory,
        categories: categories,
        categoryCounts: categoryCounts,
        user: req.session.user,
        title: "re$ale Statistics",
      });
    } else {
      res.render("statistics", {
        noRating: true,
        listing: maxListings,
        highestListingMonth,
        highestListingCity,
        highestListingCategory,
        categories: categories,
        categoryCounts: categoryCounts,
        user: req.session.user,
        title: "re$ale Statistics",
      });
    }
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .render("error", {
        code: validator.isValidResponseStatusCode(e.code) ? e.code : 500,
        error: e.message,
        user: req.session.user,
      });
  }
});

module.exports = router;
