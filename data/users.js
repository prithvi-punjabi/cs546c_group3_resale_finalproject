const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const validate = require("../helper/validator");
const sha256 = require("js-sha256");

//Important: Do not pass a hashed password to the create function, the password hashing takes place before insertion

async function create(
  firstName,
  lastName,
  email,
  phoneNumber,
  userName,
  dob,
  gender,
  profilePicture,
  address,
  password,
  biography
) {
  // Input Validation by calling functions from validation.js
  validate.checkNonNull(firstName);
  validate.checkNonNull(lastName);
  validate.checkNonNull(email);
  validate.checkNonNull(phoneNumber);
  validate.checkNonNull(userName);
  validate.checkNonNull(dob);
  validate.checkNonNull(gender);
  validate.checkNonNull(profilePicture);
  validate.checkNonNull(address);
  validate.checkNonNull(password);
  validate.checkNonNull(biography);
  validate.checkString(firstName);
  validate.checkString(lastName);
  validate.checkString(email);
  validate.checkString(phoneNumber);
  validate.checkString(userName);
  validate.checkString(dob);
  validate.checkString(gender);
  validate.checkString(profilePicture);
  validate.checkString(password);
  validate.checkString(biography);
  validate.checkEmail(email);
  validate.checkPhoneNumber(phoneNumber);
  validate.checkDob(dob);
  validate.checkLocation(address);

  const userCol = await users();

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    userName: userName,
    dob: dob,
    gender: gender,
    profilePicture: profilePicture,
    address: address,
    //Using js-SHA256 to hash the password before insertion into db
    hashedPassword: sha256(password),
    biography: biography,
    rating: 0,
    listedProducts: [],
    favouriteProducts: [],
  };

  const insertInfo = await userCol.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user";
  const newId = insertInfo.insertedId;
  const curruser = await this.get(newId.toString());
  return curruser;
}

async function get(id) {
  validate.checkNonNull(id);
  validate.checkString(id);
  if (ObjectId.isValid(id) !== true) throw "ID is not a valid Object ID";

  const usercol = await users();
  const user = await usercol.findOne({ _id: ObjectId(id) });
  if (user) {
    user._id = user._id.toString();
    return user;
  } else throw "Could not find user in database";
}
// update data
async function update(
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
  userName,
  dob,
  gender,
  profilePicture,
  address,
  password,
  biography,
  rating,
  listedProducts,
  favouriteProducts
) {
  validate.checkNonNull(id);
  validate.checkString(id); //update validation
  validate.checkNonNull(firstName);
  validate.checkNonNull(lastName);
  validate.checkNonNull(email);
  validate.checkNonNull(phoneNumber);
  validate.checkNonNull(userName);
  validate.checkNonNull(dob);
  validate.checkNonNull(gender);
  validate.checkNonNull(profilePicture);
  validate.checkNonNull(address);
  validate.checkNonNull(password);
  validate.checkNonNull(biography);
  validate.checkString(firstName);
  validate.checkString(lastName);
  validate.checkString(email);
  validate.checkString(phoneNumber);
  validate.checkString(userName);
  validate.checkString(dob);
  validate.checkString(gender);
  validate.checkString(profilePicture);
  validate.checkString(password);
  validate.checkString(biography);
  validate.checkEmail(email);
  validate.checkPhoneNumber(phoneNumber);
  validate.checkDob(dob);
  validate.checkLocation(address);
  const userCol = await users();
  const updated_users = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    userName: userName,
    dob: dob,
    gender: gender,
    profilePicture: profilePicture,
    address: address,
    hashedPassword: password,
    biography: biography,
    rating: rating,
    listedProducts: listedProducts,
    favouriteProducts: favouriteProducts,
  };
  const updatedone = await userCol.updateOne(
    { _id: ObjectId(id) },
    { $set: updated_users }
  );

  if (updatedone.modifiedCount == 0) {
    throw "Could not update";
  }
  let a = await this.get(id);

  return a;
}
// delete data
async function remove(id) {
  validate.checkNonNull(id);
  validate.checkString(id);
  const user = await users();
  const Del = await user.findOne({ _id: ObjectId(id) });

  const usersdel = await user.deleteOne({ _id: ObjectId(id) });

  if (usersdel.deletedCount !== 1)
    throw new Error(`No user exists with id${id}`);
  return { deleted: true };
}

module.exports = {
  create,
  get,
  update,
  remove,
};
