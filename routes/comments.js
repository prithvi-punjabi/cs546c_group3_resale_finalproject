const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const utils = require("../helper/utils");
const validator = require("../helper/validator");

router.post("/add/:id", async (req, res) => {
  try {
    const prodId = req.params.id;
    const userId = req.session.user._id.toString();
    const thisComment = req.body.commentBox;
    validator.checkNonNull(prodId),
      validator.checkNonNull(userId),
      validator.checkNonNull(thisComment);
    validator.isValidObjectID(prodId),
      validator.isValidObjectID(userId),
      validator.checkString(thisComment);
    const addedComment = await comments.create(prodId, userId, thisComment);
    res.json({
      usersname: req.session.user.firstName + " " + req.session.user.lastName,
      userimg: req.session.user.profilePicture,
      comment: thisComment,
      time: "Right now",
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
