const mongoCollections = require("../config/mongoCollections");
const productCollections = mongoCollections.products;
const userCollections = mongoCollections.users;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const userData = require("./users");
let { ObjectId } = require("mongodb");

async function placeBid(userId, bidAmt, prodId, userName, userEmail) {
  validator.checkNonNull(userId),
    validator.checkNonNull(bidAmt),
    validator.checkNonNull(prodId),
    validator.checkNonNull(userName),
    validator.checkNonNull(userEmail);
  validator.isValidObjectID(userId), validator.isValidObjectID(prodId);
  validator.checkNumber(bidAmt);
  validator.checkEmail(userEmail);

  const prodCol = await productCollections();
  const alreadyBidded = await prodCol.findOne(
    {
      _id: ObjectId(prodId),
      bids: { $elemMatch: { user_id: ObjectId(userId) } },
    },
    { projection: { bids: 1, _id: 0 } }
  );
  if (alreadyBidded) {
    const updBid = await prodCol.updateOne(
      {
        _id: ObjectId(prodId),
        "bids.user_id": ObjectId(userId),
      },
      { $set: { "bids.$.price": bidAmt } }
    );
    if (updBid.modifiedCount === 0) {
      throw "Could not update bid";
    }
    return [alreadyBidded.bids[0].price, bidAmt];
  } else {
    let thisBid = {
      _id: new ObjectId(),
      user_id: ObjectId(userId.trim()),
      name: userName,
      email: userEmail,
      price: bidAmt,
    };
    const addedBid = await prodCol.updateOne(
      { _id: ObjectId(prodId) },
      { $push: { bids: thisBid } }
    );
    if (addedBid.modifiedCount === 0) {
      throw "Could not add bid";
    }
    return true;
  }
}

async function getAll(prodId) {
  validator.checkNonNull(prodId);
  validator.isValidObjectID(prodId);

  const prodCol = await productCollections();
  const allBids = await prodCol.findOne(
    { _id: ObjectId(prodId) },
    { projection: { bids: 1, _id: 0 } }
  );
  if (Object.keys(allBids).length > 0) {
    if (allBids.bids.length > 0) {
      allBids.bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      return allBids.bids;
    }
  }
  return allBids.bids;
}

async function getById(bidId) {
  validator.checkNonNull(bidId);
  validator.isValidObjectID(bidId);
  const prodCol = await productCollections();
  const thisBid = await prodCol
    .aggregate([
      { $project: { bids: 1, _id: 0, name: 1 } },
      { $match: { "bids._id": ObjectId(bidId) } },
      { $unwind: "$bids" },
      { $match: { "bids._id": ObjectId(bidId) } },
    ])
    .toArray();
  return thisBid[0];
}

async function acceptBid(bidId) {
  validator.checkNonNull(bidId);
  validator.isValidObjectID(bidId);
  const prodCol = await productCollections();
  const sellProd = await prodCol.updateOne(
    {
      "bids._id": ObjectId(bidId),
    },
    { $set: { status: "Sold" } }
  );
  const pullBids = await prodCol.updateOne(
    { "bids._id": ObjectId(bidId) },
    { $unset: { bids: 1 } }
  );
  return `Sold to bidder ${bidId}`;
}

module.exports = {
  placeBid,
  getAll,
  getById,
  acceptBid,
};
