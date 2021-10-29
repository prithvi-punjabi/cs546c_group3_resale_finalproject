const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const validate = require("../validation");
const sha256 = require("js-sha256");

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
  // Input Validation
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
  return;
}

module.exports = {
  create,
};
