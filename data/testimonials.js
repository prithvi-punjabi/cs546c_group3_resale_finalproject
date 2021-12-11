const mongoCollections = require("../config/mongoCollections");
const testimonials = mongoCollections.testimonials;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const { ObjectId } = require("mongodb");

async function create(userId, userImg, name, message) {
  validator.checkNonNull(userId),
    validator.checkNonNull(userImg),
    validator.checkNonNull(name),
    validator.checkNonNull(message);
  validator.checkString(userImg),
    validator.checkString(name),
    validator.checkString(message);
  validator.isValidObjectID(userId);

  let newTest = {
    user_id: ObjectId(userId),
    profilePicture: userImg,
    usersName: name,
    message: message,
  };
  const testCol = await testimonials();
  const newTestimonial = await testCol.insertOne(newTest);
  if (newTestimonial.insertedCount === 0) throw "Could not add testimonial";
  return true;
}

async function getAll() {
  const testCol = await testimonials();
  const allTest = testCol.find({}).toArray();
  return allTest;
}

module.exports = {
  create,
  getAll,
};
