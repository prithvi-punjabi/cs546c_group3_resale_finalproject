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
  const commentcol = await comments();
  const currentproduct = await getAllComments(product_id);
  if (thisproduct) {
    if (currentproduct.length > 0) {
      let newComment = {
        _id: new ObjectId(),
        user_id: ObjectId(user_id),
        dateAdded: new Date().toLocaleString(),
        comment: comment,
      };
      const insertInfo = await commentcol.updateOne(
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
            dateAdded: new Date().toLocaleString(),
            comment: comment,
          },
        ],
      };
      const insertInfo = await commentcol.insertOne(newProdComment);
      if (insertInfo.insertedCount === 0) throw "Could not add comment";
      else return insertInfo.insertedId;
    }
  } else throw `Product with ID ${product_id} does not exist`;
}

async function deleteCommentById(id) {
  validator.checkNonNull(id),
    validator.checkString(id),
    validator.isValidObjectID(id);
  let thiscomment = getCommentById(id);
  if (thiscomment) {
    const commentcol = await comments();
    const deletedInfo = await commentcol.deleteOne({
      _id: ObjectId(id),
    });
    if (deletedInfo.deletedCount === 0) throw "Could not delete comment";
  } else throw `Comment with ID ${id} does not exist`;
}

async function deleteAllComments(product_id) {
  validator.checkNonNull(product_id),
    validator.checkString(product_id),
    validator.isValidObjectID(product_id);
  const commentcol = await comments();
  const deletedInfo = await commentcol.deleteOne({
    product_id: ObjectId(product_id),
  });
  if (deletedInfo.deletedCount === 0) throw "Could not delete all comments";
  return `All comments for Product with ID ${product_id} deleted successfully`;
}

async function getAllComments(product_id) {
  if (!product_id) throw "You must provide a product id to search for";
  validator.checkNonNull(product_id);
  validator.checkString(product_id);
  validator.isValidObjectID(product_id);
  const commentcol = await comments();
  const productComments = await commentcol.findOne({
    product_id: ObjectId(product_id),
  });
  if (productComments === null) {
    const comments1 = [];
    return comments1;
  }
  const comments1 = productComments.comments;
  return comments1;
}

async function getCommentById(id) {
  if (!id) throw "You must provide a comment id to search with";
  validator.checkNonNull(id);
  validator.checkString(id);
  validator.isValidObjectID(id);
  const commentsCollection = await comments();
  let product = await commentsCollection
    .find({ comments: { $elemMatch: { _id: ObjectId(id) } } })
    .toArray();
  for (let index in product[0].comments) {
    if (product[0].comments[index]._id.toString() === id) {
      return product[0].comments[index];
    }
  }
  throw "No comment with the provided id found";
}

async function getCommentByUser(user_id) {
  if (!user_id) throw "You must provide an user id to search with";
  validator.checkNonNull(user_id);
  validator.checkString(user_id);
  validator.isValidObjectID(user_id);
  const commentsCollection = await comments();
  let product = await commentsCollection
    .find({ comments: { $elemMatch: { user_id: ObjectId(user_id) } } })
    .toArray();
  let count = 0;
  for (let i in product) {
    for (let index in product[i].comments) {
      if (product[i].comments[index].user_id.toString() === user_id) {
        count++;
      }
    }
  }
  if (count == 0) {
    throw "No comments were found by the specified user";
  } else {
    return count;
  }
}

module.exports = {
  create,
  getAllComments,
  getCommentById,
  deleteCommentById,
  deleteAllComments,
  getCommentByUser,
};
