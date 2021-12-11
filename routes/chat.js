const express = require("express");
const router = express.Router();
const chatData = require("../data/chat");
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const message = require("../helper/message");
const xss = require("xss");

router.get("/", async (req, res) => {
  if (!utils.isUserLoggedIn(req)) {
    return res.redirect(
      "/login?error=" + encodeURIComponent("You need to be logged in to chat!")
    );
  }
  try {
    const my_user_id = req.session.user._id;
    const chats = await chatData.getAllChats(my_user_id);
    if (chats.length != 0) {
      res.redirect("/chat/" + chats[0].user_id);
    } else {
      res.render("chat", {
        chats: chats,
        currChat: null,
        user: req.session.user,
        title: "Chat",
      });
    }
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
    }
    return res.status(500).json(message.ErrorMessage(e.message));
  }
});

router.get("/:id", async (req, res) => {
  if (!utils.isUserLoggedIn(req)) {
    return res.redirect(
      "/login?error=" + encodeURIComponent("You need to be logged in to chat!")
    );
  }
  try {
    const my_user_id = req.session.user._id;
    const user_id = req.params.id;
    if (my_user_id == user_id) {
      return res.redirect(req.get("referer")); //reload previous page
    }
    const chats = await chatData.getAllChats(my_user_id);
    let currChat = await chatData.getChatByUserId(my_user_id, user_id);
    res.render("chat", {
      chats: chats,
      currChat: currChat,
      user: req.session.user,
    });
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
    }
    return res.status(500).json(message.ErrorMessage(e.message));
  }
});

router.post("/add", async (req, res) => {
  if (!utils.isUserLoggedIn(req)) {
    return res
      .status(403)
      .json(message.ErrorMessage("Please login to send message"));
  }
  try {
    const my_user_id = req.session.user._id;
    let { user_id, msg } = req.body;
    if (my_user_id == null) {
      return res
        .status(403)
        .json(
          message.ErrorMessage("Something went wrong, logged in user not found")
        );
    }
    if (user_id == null) {
      return res
        .status(400)
        .json(message.ErrorMessage("User_id must not be empty"));
    }
    if (msg == null) {
      return res
        .status(400)
        .json(message.ErrorMessage("Message must not be empty"));
    }
    validator.checkString(msg, "Message");
    const updateMsg = await chatData.addToChat(my_user_id, user_id, msg);
    return res.json(message.SuccessMessage(updateMsg));
  } catch (e) {
    if (typeof e == "string") {
      e = new Error(e);
      e.code = 400;
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

module.exports = router;
