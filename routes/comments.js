const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const errorCode = require("../helper/common").errorCode;
const ErrorMessage = require("../helper/message").ErrorMessage;
const xss = require("xss");

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
      commentId: addedComment.toString(),
      userId: req.session.user._id,
      usersname: req.session.user.firstName + " " + req.session.user.lastName,
      userimg: req.session.user.profilePicture,
      comment: thisComment,
      time: "Right now",
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/getall/:id", async (req, res) => {
  try {
    const prodId = req.params.id;
    validator.checkNonNull(prodId);
    validator.isValidObjectID(prodId);
    const userId = req.session.user._id;
    const allProdComms = await comments.getAllComments(prodId);
    let userComms = [];
    allProdComms.forEach((x) => {
      if (userId === x.user_id.toString()) {
        userComms.push(x._id.toString());
      }
    });
    res.json(userComms);
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = errorCode.BAD_REQUEST;
    }
    return res
      .status(e.code)
      .render("error", { code: e.code, error: e.message });
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    const commId = req.params.id;
    const prodId = req.body.prodId;
    const delComment = await comments.deleteCommentById(commId, prodId);
    const allProdComments = await comments.getAllComments(prodId);
    if (allProdComments.length === 0) {
      await comments.deleteAllComments(prodId);
    }
    if (delComment) res.json(true);
  } catch (e) {
    console.log(e);
    if (typeof e == "string") {
      e = new Error(e);
      e.code = errorCode.BAD_REQUEST;
    }
    return res
      .status(e.code)
      .render("error", { code: e.code, error: e.message });
  }
});

module.exports = router;
