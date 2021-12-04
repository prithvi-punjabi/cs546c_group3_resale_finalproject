const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const userData = require("./users");
const productsData = require("./products");
let { ObjectId } = require("mongodb");
const utils = require("../helper/utils");

async function highestRating() {
  const usercol = await users();
  const allUserRatings = await usercol
    .find({}, { projection: { rating: 1 } })
    .toArray();
  let highestId, finrating;
  let highestRating = 0,
    count = 0,
    currrate = 0;
  let result = {};
  allUserRatings.forEach((thisrating) => {
    thisrating.rating.forEach((x) => {
      currrate += x.rating;
      count += 1;
    });
    finrating = currrate / count;
    if (finrating > highestRating) {
      highestRating = finrating;
      highestId = thisrating._id.toString();
    }
    count = 0;
    currrate = 0;
  });
  if (highestId !== undefined) {
    const thisuser = await userData.get(highestId);
    result["name"] = thisuser.firstName + " " + thisuser.lastName;
    result["profilePicture"] = thisuser.profilePicture;
    result["finalRating"] = highestRating;
    return result;
  } else return false;
}

async function mostListings() {
  const usercol = await users();
  const maxListings = await usercol
    .aggregate([
      { $project: { listedsize: { $size: "$listedProducts" } } },
      { $sort: { listedsize: -1 } },
      { $limit: 1 },
    ])
    .toArray();
  const thisuser = await userData.get(maxListings[0]._id.toString());
  let result = {};
  result["name"] = thisuser.firstName + " " + thisuser.lastName;
  result["profilePicture"] = thisuser.profilePicture;
  result["numOfProducts"] = maxListings[0].listedsize;
  return result;
}

async function highestProductListedByMonth() {
  const listingByMonth = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };
  try {
    const products = await productsData.getAll(true);
    products.forEach((product) => {
      const dateListed = utils.getDateObject(product.dateListed);
      listingByMonth[utils.getMonthInString(dateListed.getMonth())] += 1;
    });
  } catch (error) {}
  let max = listingByMonth.January;
  let maxMonth = "January";
  for (const key in listingByMonth) {
    if (Object.hasOwnProperty.call(listingByMonth, key)) {
      const noOfListings = listingByMonth[key];
      if (noOfListings > max) {
        max = noOfListings;
        maxMonth = key;
      }
    }
  }
  return { month: maxMonth, count: max };
}

async function highestProductListedByCity() {
  const listingByCity = {};
  try {
    const products = await productsData.getAll(true);
    products.forEach((product) => {
      if (listingByCity[product.location.city] == null) {
        listingByCity[product.location.city] = 1;
      } else {
        listingByCity[product.location.city] += 1;
      }
    });
  } catch (error) {}
  let max = 0;
  let maxCity = "N/A";
  for (const key in listingByCity) {
    if (Object.hasOwnProperty.call(listingByCity, key)) {
      const noOfListings = listingByCity[key];
      if (noOfListings > max) {
        max = noOfListings;
        maxCity = key;
      }
    }
  }
  return { city: maxCity, count: max };
}

async function highestProductListedByCategory() {
  const listingByCategory = await getListingsByCategory();
  let max = 0;
  let maxCategory = "N/A";
  for (const key in listingByCategory) {
    if (Object.hasOwnProperty.call(listingByCategory, key)) {
      const noOfListings = listingByCategory[key];
      if (noOfListings > max) {
        max = noOfListings;
        maxCategory = key;
      }
    }
  }
  return { category: maxCategory, count: max };
}

async function getListingsByCategory() {
  const listingByCategory = {};
  try {
    const products = await productsData.getAll(true);
    products.forEach((product) => {
      product.category.forEach((category) => {
        if (listingByCategory[category] == null) {
          listingByCategory[category] = 1;
        } else {
          listingByCategory[category] += 1;
        }
      });
    });
  } catch (error) {}
  return listingByCategory;
}

module.exports = {
  highestRating,
  mostListings,
  highestProductListedByMonth,
  highestProductListedByCity,
  highestProductListedByCategory,
  getListingsByCategory,
};
