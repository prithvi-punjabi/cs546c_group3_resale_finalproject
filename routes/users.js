const express = require("express");
const router = express.Router();
const data = require("../data");
const validate = require("../validation");
const users = data.users;

//Important: Do not pass a hashed password to the create function, the password hashing takes place before insertion

router.post("/add/", async (req, res) => {
  const userData = req.body;
  //User input validation on user route by calling validation.js
  try {
    validate.checkNull(userData.firstName);
    validate.checkNull(userData.lastName);
    validate.checkNull(userData.email);
    validate.checkNull(userData.phoneNumber);
    validate.checkNull(userData.userName);
    validate.checkNull(userData.dob);
    validate.checkNull(userData.gender);
    validate.checkNull(userData.profilePicture);
    validate.checkNull(userData.address);
    validate.checkNull(userData.password);
    validate.checkNull(userData.biography);
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
    validate.checkPhone(userData.phoneNumber);
    validate.checkDob(userData.dob);
    validate.checkAddress(userData.address);
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
    const newUser = await users.create(
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
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    validate.checkNull(id);
    validate.checkString(id);

    const users = await data.users.remove(id);
    res.json("The ${id} is deleted");
  } catch (e) {
    res.status(500).json("No id");
  }
});
//update
router.put("/update/:id", async (req, res) => {
  console.log("update");
  const userData = req.body;
  const id = req.params.id;
  // update validation in routes
  try {
    validate.checkNull(id);
    validate.checkString(id);
    validate.checkNull(userData.firstName);
    validate.checkNull(userData.lastName);
    validate.checkNull(userData.email);
    validate.checkNull(userData.phoneNumber);
    validate.checkNull(userData.userName);
    validate.checkNull(userData.dob);
    validate.checkNull(userData.gender);
    validate.checkNull(userData.profilePicture);
    validate.checkNull(userData.address);
    validate.checkNull(userData.password);
    validate.checkNull(userData.biography);
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
    validate.checkPhone(userData.phoneNumber);
    validate.checkDob(userData.dob);
    validate.checkAddress(userData.address);
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
    const newUser = await users.update(
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
