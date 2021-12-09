const express = require("express");
const router = express.Router();
const data = require("../data");
const validate = require("../helper/validator");
const utils = require("../helper/utils");
const usersData = data.users;
const productData = data.products;
const validator = require("../helper/validator");
const { errorCode } = require("../helper/common");
const { ErrorMessage } = require("../helper/message");
const { getById } = require("../data/products");
//Important: Do not pass a hashed password to the create function, the password hashing takes place before insertion

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  return res.render("login");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    validator.checkNonNull(username, password);
    validator.checkString(username, "username");
    validator.checkString(password, "password");

    const user = await usersData.loginUser(username, password);
    req.session.user = user;
    return res.json(user);
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = errorCode.BAD_REQUEST;
    }
    return res.status(e.code).json(ErrorMessage(e.message));
  }
});

//delete data
router.delete("/users/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    validate.checkNonNull(id);
    validate.checkString(id);

    const deluser = await data.users.remove(id);
    res.json("The ${id} is deleted");
  } catch (e) {
    res.status(500).json("No id");
  }
});

// get user
router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  if (id !== req.session.user._id) {
    return res.redirect(
      "/?error=" + encodeURIComponent("You cannot view another user's profile.")
    );
  }
  try {
    validate.checkNonNull(id);
    validate.checkString(id);
    utils.parseObjectId(id, "User ID");
    const thisuser = await usersData.get(id);
    const listprod = await thisuser.listedProducts;
    const finRating = await usersData.getRating(id);
    let arr = [];
    for (let i = 0; i < listprod.length; i++) {
      let obj = {};
      obj.image = listprod[i].images[0];
      obj.names = listprod[i].name;
      obj.price = listprod[i].price;
      obj.idno = listprod[i]._id.toString();
      arr.push(obj);
    }
    let listlike = await thisuser.favouriteProducts;
    // let prod = await productData;
    let arr1 = [];
    for (let j = 0; j < listlike.length; j++) {
      let getprod = await getById(listlike[j].toString());
      let idno = listlike[j];
      let imgdis = getprod.images[0];
      let prodname = getprod.name;
      let pricep = getprod.price;
      let obj1 = {};
      obj1.imageprod = imgdis;
      obj1.prodname = prodname;
      obj1.prodid = idno;
      obj1.prices = pricep;
      arr1.push(obj1);
    }
    // return res.status(200).json(thisuser);
    return res.render("userprofile", {
      nameOfUser: thisuser.firstName + " " + thisuser.lastName,
      email: thisuser.email,
      phoneNumber: thisuser.phoneNumber,
      userName: thisuser.userName,
      dob: thisuser.dob,
      gender: thisuser.gender,
      profilePicture: thisuser.profilePicture,
      address: thisuser.address,
      biography: thisuser.biography,
      rating: finRating,
      listedProducts: arr,
      favouriteProducts: arr1,
    });
  } catch (e) {
    return res.render("error", { code: errorCode.NOT_FOUND, error: e });
  }
});

router.post("/users/favourite/:id", async (req, res) => {
  try {
    let prodId = req.params.id;
    let userId = req.session.user._id.toString();
    const favourited = await usersData.addFavourite(userId, prodId);
    if (favourited === true) {
      res.json(true);
    } else if (typeof favourited == "string") {
      res.json(false);
    }
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

router.post("/users/removefavourite/:id", async (req, res) => {
  try {
    let prodId = req.params.id;
    let userId = req.session.user._id.toString();
    const removed = await usersData.removeFavourite(userId, prodId);
    if (removed === true) {
      res.json(true);
    } else if (typeof removed == "string") {
      res.json(false);
    }
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

router.post("/users/rate/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    let rating = req.body.rating;
    let thisUser = req.session.user._id;
    const rated = await usersData.rateUser(userId, rating, thisUser);
    res.json(rated);
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    if (e.code != null) return res.status(e.code).json(ErrorMessage(e.message));
    else return res.status(500).json(ErrorMessage(e.message));
  }
});

//signup

router.get("/users/add", async (req, res) => {
  if (!req.session.user) {
    return res.render("signup");
  } else {
    return res.redirect("/");
  }
});

router.post("/users/add", async (req, res) => {
  const userData = req.body;
  //User input validation on user route by calling validation.js
  try {
    validate.checkNonNull(userData.firstName);
    validate.checkNonNull(userData.lastName);
    validate.checkNonNull(userData.email);
    validate.checkNonNull(userData.phoneNumber);
    validate.checkNonNull(userData.userName);
    validate.checkNonNull(userData.dob);
    validate.checkNonNull(userData.gender);
    validate.checkNonNull(userData.images);
    validate.checkNonNull(userData.street);
    validate.checkNonNull(userData.city);
    validate.checkNonNull(userData.state);
    validate.checkNonNull(userData.zip);
    validate.checkNonNull(userData.password);
    validate.checkNonNull(userData.biography);
    validate.checkString(userData.firstName);
    validate.checkString(userData.lastName);
    validate.checkString(userData.email);
    validate.checkString(userData.phoneNumber);
    validate.checkString(userData.userName);
    validate.checkString(userData.dob);
    validate.checkString(userData.gender);
    validate.checkString(userData.images);
    validate.checkString(userData.password);
    validate.checkString(userData.biography);
    validate.checkString(userData.street);
    validate.checkString(userData.city);
    validate.checkString(userData.state);
    validate.checkString(userData.zip);
    validate.checkEmail(userData.email);
    validate.checkPhoneNumber(userData.phoneNumber);
    validate.checkDob(userData.dob);
    let address = {};
    address.streetAddress = userData.street;
    address.city = userData.city;
    address.state = userData.state;
    address.zip = userData.zip;
    userData.address = address;
    validate.checkLocation(userData.address);
  } catch (e) {
    return res.status(400).json(ErrorMessage(e));
  }
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      userName,
      dob,
      gender,
      images,
      address,
      password,
      biography,
    } = userData;
    const newUser = await usersData.create(
      firstName,
      lastName,
      email,
      phoneNumber,
      userName,
      dob,
      gender,
      images,
      address,
      password,
      biography
    );
    req.session.user = newUser;
    res.redirect("/");
  } catch (e) {
    return res.status(400).json(ErrorMessage(e));
  }
});

//update
router.get("/users/update", async (req, res) => {
  if (req.session.user) {
    try {
      let userId = req.session.user._id.toString();
      const userInfo = await usersData.get(userId);
      if (userInfo.gender.toLowerCase() == "male") {
        userInfo.isMale = true;
      } else if (userInfo.gender.toLowerCase() == "female") {
        userInfo.isFemale = true;
      } else {
        userInfo.isOther = true;
      }
      return res.render("updateuser", {
        title: "Update Profile",
        user: userInfo,
        nameOfUser: userInfo.firstName + " " + userInfo.lastName,
      });
    } catch (e) {
      if (typeof e == "string") {
        e = new Error(e);
        e.code = 400;
      }
      if (e.code != null)
        return res.status(e.code).json(ErrorMessage(e.message));
      else return res.status(500).json(ErrorMessage(e.message));
    }
  } else {
    return res.render("login");
  }
});

router.post("/users/update/", async (req, res) => {
  const userData = req.body;
  const id = req.session.user._id.toString();
  // update validation in routes
  try {
    validate.checkNonNull(userData.firstName);
    validate.checkNonNull(userData.lastName);
    validate.checkNonNull(userData.email);
    validate.checkNonNull(userData.phoneNumber);
    validate.checkNonNull(userData.gender);
    validate.checkNonNull(userData.street);
    validate.checkNonNull(userData.city);
    validate.checkNonNull(userData.state);
    validate.checkNonNull(userData.zip);
    validate.checkNonNull(userData.biography);
    validate.checkString(userData.firstName);
    validate.checkString(userData.lastName);
    validate.checkString(userData.email);
    validate.checkString(userData.phoneNumber);
    validate.checkString(userData.gender);
    validate.checkString(userData.street);
    validate.checkString(userData.city);
    validate.checkString(userData.state);
    validate.checkString(userData.zip);
    let address = {};
    address.streetAddress = userData.street;
    address.city = userData.city;
    address.state = userData.state;
    address.zip = userData.zip;
    userData.address = address;
    validate.checkString(userData.biography);
    validate.checkEmail(userData.email);
    validate.checkPhoneNumber(userData.phoneNumber);
    validate.checkLocation(userData.address);
    if (userData.images) {
      validate.checkString(userData.images);
    }
  } catch (e) {
    if (req.session.user.gender.toLowerCase() == "male") {
      req.session.user.isMale = true;
    } else if (req.session.user.gender.toLowerCase() == "female") {
      req.session.user.isFemale = true;
    } else {
      req.session.user.isOther = true;
    }
    return res.render("updateuser", {
      title: "Update Profile",
      nameOfUser: req.session.user.firstName + " " + req.session.user.lastName,
      user: req.session.user,
      error: e,
    });
  }
  try {
    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const email = userData.email;
    const phoneNumber = userData.phoneNumber;
    const gender = userData.gender;
    const address = userData.address;
    const biography = userData.biography;
    let profilePicture = "";
    if (userData.images != "") {
      profilePicture = userData.images;
    } else {
      profilePicture = req.session.user.profilePicture;
    }
    const newUser = await usersData.update(
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      profilePicture,
      address,
      biography
    );
    req.session.user = newUser;
    res.redirect("/");
  } catch (e) {
    if (req.session.user.gender.toLowerCase() == "male") {
      req.session.user.isMale = true;
    } else if (req.session.user.gender.toLowerCase() == "female") {
      req.session.user.isFemale = true;
    } else {
      req.session.user.isOther = true;
    }
    return res.render("updateuser", {
      title: "Update Profile",
      nameOfUser: req.session.user.firstName + " " + req.session.user.lastName,
      user: req.session.user,
      error: e,
    });
    //res.status(500).json({ error: e });
  }
});
module.exports = router;
