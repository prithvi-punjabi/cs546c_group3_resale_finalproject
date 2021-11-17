const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const products = require("./products");
const { ObjectId } = require("mongodb");
const { reviews } = require("../../../Lab6/config/mongoCollections");

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
  const currentproduct = await comments.getById(product_id);
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
      if (insertInfo.insertedCount === 0) throw "Could not add comment";
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
    }
  } else throw `Product with ID ${product_id} does not exist`;
}

async function getAllComments(product_id){
  if (!product_id) throw 'You must provide a product id to search for';
  validator.checkNonNull(product_id);
  validator.checkString(product_id);
  validator.isValidObjectID(product_id);
  const commentsCollection = await comments();
  const productComments = commentsCollection.findOne({product_id: ObjectId(product_id)});
  if (productComments === null){
    throw 'The given product does not exist or has no comments';
  }
  const comments = productComments.comments;
  return comments;

}

async function getCommentById(id){
  if (!id) throw 'You must provide a comment id to search with';
  validator.checkNonNull(id);
  validator.checkString(id);
  validator.isValidObjectID(id);
  const commentsCollection = await comments();
  let product = await commentsCollection.find({"comments": {$elemMatch: {_id: ObjectId(id)}}}).toArray();
  for(let index in product[0].comments){
    if(product[0].comments[index]._id.toString() === id){
      return product[0].comments[index];
    }
  }
  throw 'No comment with the provided id found';
}

async function getCommentByUser(user_id){
  if (!user_id) throw 'You must provide an user id to search with';
  validator.checkNonNull(user_id);
  validator.checkString(user_id);
  validator.isValidObjectID(user_id);
  const commentsCollection = await comments();
  let product = await commentsCollection.find({"comments": {$elemMatch: {user_id: ObjectId(user_id)}}}).toArray();
  let count = 0;
  for(let i in product){
    for(let index in product[i].comments){
      if(product[i].comments[index].user_id.toString() === user_id){
        count++;
      }
    }
  }
  if(count == 0){
    throw 'No comments were found by the specified user';
  }
  else{
    return count;
  }
}

module.exports = {
  create,
  getAllComments,
  getCommentById,
  getCommentByUser
};
