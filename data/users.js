const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const validate = require("../helper/validator");
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");
const saltRounds = 8;

//Important: Do not pass a hashed password to the create function, the password hashing takes place before insertion

async function loginUser(username, password) {
  validate.checkNonNull(username);
  validate.checkNonNull(password);

  validate.checkString(username);
  validate.checkString(password);

  const usercol = await users();
  const user = await usercol.findOne({ userName: username.toLowerCase() });
  if (user == null) {
    const error = new Error("Either username or password is invalid");
    error.code = 403;
    throw error;
  }

  let isAuthenticated = false;
  try {
    isAuthenticated = await bcrypt.compare(password, user.password);
  } catch (e) {
    throw new Error(e.message);
  }

  if (!isAuthenticated) {
    const error = new Error("Either username or password is invalid");
    error.code = 403;
    throw error;
  } else {
    return user;
  }
}

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
  const existingUser = await userCol.findOne({ userName: userName });
  if (existingUser != null) {
    throw `Username not available!`;
  }
  password = await bcrypt.hash(password, saltRounds);

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    userName: userName.toLowerCase(),
    dob: dob,
    gender: gender,
    profilePicture: profilePicture,
    address: address,
    password: password,
    biography: biography,
    rating: [],
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
  gender,
  profilePicture,
  address,
  biography
) {
  validate.checkNonNull(id);
  validate.checkString(id); //update validation
  validate.checkNonNull(firstName);
  validate.checkNonNull(lastName);
  validate.checkNonNull(email);
  validate.checkNonNull(phoneNumber);
  validate.checkNonNull(gender);
  validate.checkNonNull(profilePicture);
  validate.checkNonNull(address);
  validate.checkNonNull(biography);
  validate.checkString(firstName);
  validate.checkString(lastName);
  validate.checkString(email);
  validate.checkString(phoneNumber);
  validate.checkString(gender);
  validate.checkString(profilePicture);
  validate.checkEmail(email);
  validate.checkPhoneNumber(phoneNumber);
  validate.checkLocation(address);
  const userCol = await users();

  const updated_users = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    gender: gender,
    profilePicture: profilePicture,
    address: address,
    biography: biography,
  };

  const updatedone = await userCol.updateOne(
    { _id: ObjectId(id) },
    { $set: updated_users }
  );

  if (updatedone.modifiedCount == 0) {
    throw "No update made to profile";
  }
  let a = await this.get(id);
  return a;
}

async function updateTheme(userId, darkTheme) {
  validate.checkNonNull(userId);
  validate.checkString(userId);
  validate.isValidObjectID(userId);
  validate.checkNonNull(darkTheme);
  if (typeof darkTheme != "boolean") {
    throw "Darktheme must be a boolean";
  }
  const userCol = await users();
  const updatedone = await userCol.updateOne(
    { _id: ObjectId(userId) },
    { $set: { darkTheme: darkTheme } }
  );
  if (updatedone.modifiedCount == 0 && updatedone.matchedCount == 0) {
    throw "Failed to change theme";
  }
  return true;
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

async function getAll() {
  const usercol = await users();
  const allusers = await usercol.find({}).toArray();
  let finalUsers = [];
  let thisUser = {};
  allusers.forEach((x) => {
    thisUser["id"] = x._id.toString();
    fname = x.firstName;
    lname = x.lastName;
    thisUser["name"] = fname + " " + lname;
    thisUser["img"] = x.profilePicture;
    finalUsers.push(thisUser);
    thisUser = {};
  });
  if (!Array.isArray(finalUsers) || finalUsers.length == 0) {
    const error = new Error(`No users found`);
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  return finalUsers;
}

async function addFavourite(userId, prodId) {
  validate.checkNonNull(userId), validate.checkNonNull(prodId);
  validate.isValidObjectID(userId), validate.isValidObjectID(prodId);
  const usercol = await users();
  const thisUser = await usercol.findOne({ _id: ObjectId(userId) });
  const addedFav = await usercol.updateOne(
    { _id: ObjectId(userId) },
    { $push: { favouriteProducts: ObjectId(prodId) } }
  );
  if (addedFav.modifiedCount === 0) {
    throw "Could not add product into favourites";
  }
  return true;
}

async function removeFavourite(userId, prodId) {
  validate.checkNonNull(userId), validate.checkNonNull(prodId);
  validate.isValidObjectID(userId), validate.isValidObjectID(prodId);
  const usercol = await users();
  const thisUser = await usercol.findOne({ _id: ObjectId(userId) });
  let alreadyFav = 0;
  thisUser.favouriteProducts.forEach((x) => {
    if (x.toString() === prodId) alreadyFav += 1;
  });
  if (alreadyFav !== 0) {
    const removedFav = await usercol.updateOne(
      { _id: ObjectId(userId) },
      { $pull: { favouriteProducts: ObjectId(prodId) } }
    );
    if (removedFav.modifiedCount === 0) {
      throw "Could not remove product from favourites";
    }
    return true;
  } else return "Product does not exist in favourites";
}

async function rateUser(userId, currrating, thisUser) {
  currrating = parseInt(currrating);
  validate.checkNonNull(userId),
    validate.checkNonNull(currrating),
    validate.checkNonNull(thisUser);
  validate.isValidObjectID(userId), validate.isValidObjectID(thisUser);
  validate.checkNumber(currrating);
  const usercol = await users();
  const alreadyRated = await usercol.findOne(
    {
      _id: ObjectId(userId),
      rating: { $elemMatch: { rater_id: thisUser } },
    },
    { projection: { rating: 1, _id: 0 } }
  );
  if (alreadyRated) {
    const updateRating = await usercol.updateOne(
      {
        _id: ObjectId(userId),
        "rating.rater_id": thisUser,
      },
      { $set: { "rating.$.rating": currrating } }
    );
    return { alreadyRated: currrating };
  } else {
    let thisUsersRating = {};
    thisUsersRating["rater_id"] = thisUser;
    thisUsersRating["rating"] = currrating;
    const userRating = await usercol.updateOne(
      { _id: ObjectId(userId) },
      { $push: { rating: thisUsersRating } }
    );
    if (userRating.modifiedCount === 0) {
      throw "Could not add rating";
    }
    return currrating;
  }
}

async function getRating(userId) {
  validate.checkNonNull(userId);
  validate.isValidObjectID(userId);
  const usercol = await users();
  const usersRating = await usercol.findOne(
    { _id: ObjectId(userId) },
    { projection: { rating: 1, _id: 0 } }
  );
  let count = 0;
  let totalRating = 0;
  if (usersRating.rating.length > 0) {
    usersRating.rating.forEach((x) => {
      totalRating += x.rating;
      count += 1;
    });
    let finRating = totalRating / count;
    return Math.round(finRating * 100) / 100;
  } else return 0;
}

module.exports = {
  create,
  get,
  update,
  remove,
  getAll,
  loginUser,
  addFavourite,
  removeFavourite,
  rateUser,
  getRating,
  updateTheme,
};
