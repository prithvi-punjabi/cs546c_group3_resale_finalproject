const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const products = require("./products");
const { ObjectId } = require("mongodb");

async function create(product_id, user_id, comment) {
  validator.checkNonNull(product_id),
    validator.checkNonNull(user_id),
    validator.checkNonNull(comment);
  validator.checkString(product_id, "Product ID"),
    validator.checkString(user_id, "User ID"),
    validator.checkString(comment, "Comment");
  validator.isValidObjectID(ObjectId(product_id)),
    validator.isValidObjectID(ObjectId(user_id));
  const thisproduct = await products.getById(product_id);
  const currentproduct = await getAllComments(product_id);
  const comments = await comments();
  if (thisproduct) {
    if (currentproduct) {
      let newComment = {
        _id: new ObjectId(),
        user_id: ObjectId(user_id),
        dateAdded: new Date(),
        comment: comment,
      };
      const insertInfo = await comments.updateOne(
        { product_id: ObjectId(product_id) },
        { $push: { comments: newComment } }
      );
      if (insertInfo.modifiedCount === 0) throw "Could not add comment";
      else return insertInfo.upsertedId;
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
      const insertInfo = await comments.insertOne(newProdComment);
      if (insertInfo.insertedCount === 0) throw "Could not add comment";
      else return insertInfo.insertedId;
    }
  } else throw `Product with ID ${product_id} does not exist`;
}

async function getAllComments(reviewId) {}

async function getCommentById(id) {}

async function deleteCommentById(id) {
  validator.checkNonNull(id),
    validator.checkString(id),
    validator.isValidObjectID(id);
  let thiscomment = getCommentById(id);
  if (thiscomment) {
    const comments = await comments();
    const deletedInfo = await comments.deleteOne({
      _id: ObjectId(id),
    });
    if (deletedInfo.deletedCount === 0) throw "Could not delete comment";
  } else throw `Comment with ID ${id} does not exist`;
}

async function deleteAllComments(product_id) {
  validator.checkNonNull(product_id),
    validator.checkString(product_id),
    validator.isValidObjectID(product_id);
  const comments = await comments();
  const deletedInfo = await comments.deleteOne({
    product_id: ObjectId(product_id),
  });
  if (deletedInfo.deletedCount === 0) throw "Could not delete all comments";
  return `All comments for Product with ID ${product_id} deleted successfully`;
}

module.exports = {
  create,
  getAllComments,
  getCommentById,
  deleteCommentById,
  deleteAllComments,
};
