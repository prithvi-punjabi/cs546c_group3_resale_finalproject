const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const products = require("./products");
const { ObjectId } = require("mongodb");
const { comments } = require("../config/mongoCollections");

async function create(product_id, user_id, comment) {
  const thisproduct = await products.getById(product_id);
  // const thisproduct = await comments.getById(product_id);
  const comments = await comments();
  if (thisproduct) {
    let newComment = {
      _id: new ObjectId(),
      user_id: user_id,
      dateAdded: new Date(),
      comment: comment,
    };
    const insertinfo = await comments.updateOne(
      { product_id: product_id },
      { $push: { comments: newComment } }
    );
  } else {
    let newProdComment = {
      product_id: product_id,
      comments: [
        {
          _id: new ObjectId(),
          user_id: user_id,
          dateAdded: new Date(),
          comment: comment,
        },
      ],
    };
    const insertinfo = await comments.insertOne(newProdComment);
  }
}

module.exports = {};
