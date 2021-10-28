const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");

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
    addres: address,
    password: password,
    biography: biography,
    rating: 0,
    listedProducts: [],
    favouriteProducts: [],
  };
  const insertInfo = await userCol.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add restaurant";
  return "success";
}

module.exports = {
  create,
};
