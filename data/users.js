const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const validate = require("../validation");
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
  validate.checkNull(firstName);
  validate.checkNull(lastName);
  validate.checkNull(email);
  validate.checkNull(phoneNumber);
  validate.checkNull(userName);
  validate.checkNull(dob);
  validate.checkNull(gender);
  validate.checkNull(profilePicture);
  validate.checkNull(address);
  validate.checkNull(password);
  validate.checkNull(biography);
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
  validate.checkPhone(phoneNumber);
  validate.checkDob(dob);
  validate.checkAddress(address);

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
  validate.checkNull(id);
  validate.checkString(id);
  if (ObjectId.isValid(id) !== true) throw "ID is not a valid Object ID";

  const usercol = await users();
  const user = await usercol.findOne({ _id: ObjectId(id) });
  if (user) {
    user._id = user._id.toString();
    return user;
  } else throw "Could not find user in database";
}

module.exports = {
  create,
  get,
};
