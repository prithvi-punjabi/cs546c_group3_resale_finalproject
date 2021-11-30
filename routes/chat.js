const express = require("express");
const router = express.Router();
const chatData = require("../data/chat");
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const message = require("../helper/message");

router.post("/add", async (req, res) => {
  if (!utils.isUserLoggedIn(req)) {
    return res
      .status(403)
      .json(message.ErrorMessage("Please login to send message"));
  }
  try {
    const my_user_id = req.session.user._id;
    const { user_id, msg } = req.body;
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
    console.log(e);
    return res.status(500).json(message.ErrorMessage(e.message));
  }
});

module.exports = router;
