const express = require("express");
const router = express.Router();
const data = require("../data");
const validate = require("../helper/validator");
const utils = require("../helper/utils");
const testimonialsData = data.testimonials;
const validator = require("../helper/validator");
const { errorCode } = require("../helper/common");
const { ErrorMessage } = require("../helper/message");
const userData = require("../data/users");

router.get("/", async (req, res) => {
  try {
    const allTestimonials = await testimonialsData.getAll();
    for (let testimonial in allTestimonials) {
      const testimonialUser = await userData.get(
        allTestimonials[testimonial].user_id.toString()
      );
      allTestimonials[testimonial].profilePicture =
        testimonialUser.profilePicture;
      allTestimonials[testimonial].usersName =
        testimonialUser.firstName + " " + testimonialUser.lastName;
    }
    res.render("about", {
      test: allTestimonials,
      user: req.session.user,
      title: "About re$ale",
    });
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = errorCode.BAD_REQUEST;
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .render("error", {
        code: validator.isValidResponseStatusCode(e.code) ? e.code : 500,
        error: e.message,
      });
  }
});

router.post("/add/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    validator.isValidObjectID(userId);
    let userImg = req.session.user.profilePicture;
    let usersName =
      req.session.user.firstName + " " + req.session.user.lastName;
    let message = req.body.message;
    validator.checkNonNull(message);
    validator.checkString(message);
    const addedTest = await testimonialsData.create(
      userId,
      userImg,
      usersName,
      message
    );
    if (addedTest === true) {
      res.json({
        userId: userId,
        userImg: userImg,
        usersName: usersName,
        message: message,
      });
    }
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = errorCode.BAD_REQUEST;
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

module.exports = router;
