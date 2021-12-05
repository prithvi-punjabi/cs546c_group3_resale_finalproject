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
    validate.checkNonNull(userData.profilePicture);
    validate.checkNonNull(userData.address);
    validate.checkNonNull(userData.password);
    validate.checkNonNull(userData.biography);
    validate.checkString(userData.firstName);
    validate.checkString(userData.lastName);
    validate.checkString(userData.email);
    validate.checkString(userData.phoneNumber);
    validate.checkString(userData.userName);
    validate.checkString(userData.dob);
    validate.checkString(userData.gender);
    validate.checkString(userData.profilePicture);
    validate.checkString(userData.password);
    validate.checkString(userData.biography);
    validate.checkEmail(userData.email);
    validate.checkPhoneNumber(userData.phoneNumber);
    validate.checkDob(userData.dob);
    validate.checkLocation(userData.address);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
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
      profilePicture,
      address,
      password,
      biography,
    } = req.body;
    const newUser = await usersData.create(
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
    );
    res.status(200).json({
      success: `New user ${firstName} ${lastName} added successfully`,
    });
  } catch (e) {
    res.status(500).json({ error: e });
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
  try {
    console.log("here id");
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
      obj.idno = listprod[i]._id.toString();
      arr.push(obj);
    }
    console.log(arr);
    let listlike = await thisuser.favouriteProducts;
    let prod = await productData;
    let arr1 = [];
    for (let j = 0; j < listlike.length; j++) {
      let getprod = await getById(listlike[j]);
      let idno = listlike[j];
      let imgdis = getprod.images[0];
      let prodname = getprod.name;
      let obj1 = {};
      obj1.imageprod = imgdis;
      obj1.prodname = prodname;
      obj1.prodid = idno;
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
    console.log(e);
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

//update
router.put("users/update/:id", async (req, res) => {
  console.log("update");
  const userData = req.body;
  const id = req.params.id;
  // update validation in routes
  try {
    validate.checkNonNull(id);
    validate.checkString(id);
    validate.checkNonNull(userData.firstName);
    validate.checkNonNull(userData.lastName);
    validate.checkNonNull(userData.email);
    validate.checkNonNull(userData.phoneNumber);
    validate.checkNonNull(userData.userName);
    validate.checkNonNull(userData.dob);
    validate.checkNonNull(userData.gender);
    validate.checkNonNull(userData.profilePicture);
    validate.checkNonNull(userData.address);
    validate.checkNonNull(userData.password);
    validate.checkNonNull(userData.biography);
    validate.checkString(userData.firstName);
    validate.checkString(userData.lastName);
    validate.checkString(userData.email);
    validate.checkString(userData.phoneNumber);
    validate.checkString(userData.userName);
    validate.checkString(userData.dob);
    validate.checkString(userData.gender);
    validate.checkString(userData.profilePicture);
    validate.checkString(userData.password);
    validate.checkString(userData.biography);
    validate.checkEmail(userData.email);
    validate.checkPhoneNumber(userData.phoneNumber);
    validate.checkDob(userData.dob);
    validate.checkLocation(userData.address);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
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
      profilePicture,
      address,
      password,
      biography,
      rating,
      listedProducts,
      favouriteProducts,
    } = req.body;
    const newUser = await usersData.update(
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
    );
    res.status(200).json(newUser);
    console.log(newUser);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
module.exports = router;
