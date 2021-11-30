const mongoCollections = require("../config/mongoCollections");
const userCollections = mongoCollections.users;
const usersData = require("../data/users");
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const { ObjectId } = require("mongodb");

const getUserById = async (my_user_id, user_id) => {
  validator.checkNonNull(my_user_id, user_id);
  validator.checkString(my_user_id, "my_user_id");
  validator.checkString(user_id, "user_id");

  my_user_id = utils.parseObjectId(my_user_id);
  user_id = utils.parseObjectId(user_id);
  const usersCol = await userCollections();
  const user = await usersCol.findOne(
    {
      $and: [{ _id: my_user_id }, { "chat.user_id": user_id }],
    },
    { projection: { _id: 0, "chat.$": 1 } }
  );
  if (user == null || user.chat == null || user.chat.length == 0) {
    const error = new Error(`No chat found for user - ${user_id.toString()}`);
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  return user.chat[0];
};

const addToChat = async (my_user_id, user_id, msg) => {
  validator.checkNonNull(my_user_id, user_id, msg);
  validator.checkString(msg, "msg");
  validator.checkString(my_user_id, "my_user_id");
  validator.checkString(user_id, "user_id");

  try {
    const chat = await getUserById(my_user_id, user_id);
    my_user_id = utils.parseObjectId(my_user_id, "MyUserId");
    user_id = utils.parseObjectId(user_id, "UserId");
    const users = await userCollections();
    const newMessage = {
      _id: ObjectId(),
      msg: msg,
      status: 0,
      time: new Date(),
    };
    if (chat.message == null && !Array.isArray(chat.message)) {
      chat.message = [newMessage];
    } else {
      chat.message.push(newMessage);
    }
    const updateInfo = await users.updateOne(
      { $and: [{ _id: my_user_id }, { "chat.user_id": user_id }] },
      { $set: { "chat.$": chat } }
    );
    if (updateInfo.matchedCount == 0 && updateInfo.modifiedCount == 0) {
      const error = new Error("Could not add chat");
      error.code = errorCode.INTERNAL_SERVER_ERROR;
      throw error;
    }
  } catch (e) {
    my_user_id = utils.parseObjectId(my_user_id, "MyUserId");
    user_id = utils.parseObjectId(user_id, "UserId");
    if (e.code == errorCode.NOT_FOUND) {
      const users = await userCollections();
      const newChat = {
        _id: ObjectId(),
        user_id: user_id,
        message: [
          {
            _id: ObjectId(),
            msg: msg,
            status: 0,
            time: new Date(),
          },
        ],
      };
      const updateInfo = await users.updateOne(
        { _id: my_user_id },
        { $push: { chat: newChat } }
      );
      if (updateInfo.matchedCount == 0 && updateInfo.modifiedCount == 0) {
        const error = new Error("Could not add chat");
        error.code = errorCode.INTERNAL_SERVER_ERROR;
        throw error;
      }
    } else {
      throw "Something went wrong - " + e.message;
    }
  }
  return "Message sent";
};

module.exports = {
  getUserById,
  addToChat,
};
