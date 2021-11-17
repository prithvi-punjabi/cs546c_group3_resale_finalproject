const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const products = require("./products");
const { ObjectId } = require("mongodb");
const { comments } = require("../config/mongoCollections");

async function create(product_id, user_id, comment) {
  validator.checkNonNull(product_id),
    validator.checkNonNull(user_id),
    validator.checkNonNull(comment);
  validator.checkString(product_id, "Product ID"),
    validator.checkString(user_id, "User ID"),
    validator.checkString(comment, "Comment");
  const thisproduct = await products.getById(product_id);
  // const thisproduct = await comments.getById(product_id);
  const comments = await comments();
  if (thisproduct) {
    let newComment = {
      _id: new ObjectId(),
      user_id: ObjectId(user_id),
      dateAdded: new Date(),
      comment: comment,
    };
    const insertinfo = await comments.updateOne(
      { product_id: ObjectId(product_id) },
      { $push: { comments: newComment } }
    );
  } else {
    let newProdComment = {
      product_id: ObjectId(product_id),
      comments: [
        {
          _id: new ObjectId(),
          user_id: ObjectId(user_id),
          dateAdded: new Date(),
          comment: comment,
        },
      ],
    };
    const insertinfo = await comments.insertOne(newProdComment);
  }
}

module.exports = {};
