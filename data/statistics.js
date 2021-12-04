const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const userData = require("./users");
let { ObjectId } = require("mongodb");

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

module.exports = {
  highestRating,
  mostListings,
};
