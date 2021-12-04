const mongoCollections = require("../config/mongoCollections");
const userCollections = mongoCollections.users;
const usersData = require("../data/users");
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const { ObjectId } = require("mongodb");

const getAllChats = async (my_user_id) => {
  validator.checkNonNull(my_user_id);
  validator.checkString(my_user_id, "my_user_id");

  my_user_id = utils.parseObjectId(my_user_id);
  const usersCol = await userCollections();
  const user = await usersCol.findOne({ _id: my_user_id });
  if (user == null || user.chat == null) {
    return [];
  }
  return user.chat;
};

const getChatByUserId = async (my_user_id, user_id) => {
  if (my_user_id == user_id) {
    const error = new Error("Cannot chat with yourself");
    error.code = errorCode.BAD_REQUEST;
    throw error;
  }
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
    await addEmptyChat(my_user_id.toString(), user_id.toString());
    return await getChatByUserId(my_user_id.toString(), user_id.toString());
  }
  return user.chat[0];
};

const addEmptyChat = async (my_user_id, user_id) => {
  if (my_user_id == user_id) {
    const error = new Error("Cannot chat with yourself");
    error.code = errorCode.BAD_REQUEST;
    throw error;
  }

  const user = await usersData.get(user_id);
  const myUser = await usersData.get(my_user_id);
  my_user_id = utils.parseObjectId(my_user_id, "MyUserId");
  user_id = utils.parseObjectId(user_id, "UserId");
  const users = await userCollections();
  const myNewChat = {
    _id: ObjectId(),
    user_id: user_id,
    userName: user.userName,
    profilePicture: user.profilePicture,
    message: [],
  };
  let updateInfo = await users.updateOne(
    { _id: my_user_id },
    { $push: { chat: myNewChat } }
  );
  if (updateInfo.matchedCount == 0 && updateInfo.modifiedCount == 0) {
    const error = new Error("Could not add chat");
    error.code = errorCode.INTERNAL_SERVER_ERROR;
    throw error;
  }

  const newChat = {
    _id: ObjectId(),
    user_id: my_user_id,
    userName: myUser.userName,
    profilePicture: myUser.profilePicture,
    message: [],
  };
  updateInfo = await users.updateOne(
    { _id: user_id },
    { $push: { chat: newChat } }
  );
  if (updateInfo.matchedCount == 0 && updateInfo.modifiedCount == 0) {
    const error = new Error("Could not add chat");
    error.code = errorCode.INTERNAL_SERVER_ERROR;
    throw error;
  }
};

const addToChat = async (my_user_id, user_id, msg, isSent) => {
  if (my_user_id == user_id) {
    const error = new Error("Cannot chat with yourself");
    error.code = errorCode.BAD_REQUEST;
    throw error;
  }
  validator.checkNonNull(my_user_id, user_id, msg, isSent);
  validator.checkString(msg, "msg");
  validator.checkString(my_user_id, "my_user_id");
  validator.checkString(user_id, "user_id");
  if (typeof isSent != "boolean") {
    throw "isSent must be boolean";
  }

  try {
    const myChat = await getChatByUserId(my_user_id, user_id);
    const chat = await getChatByUserId(user_id, my_user_id);
    my_user_id = utils.parseObjectId(my_user_id, "MyUserId");
    user_id = utils.parseObjectId(user_id, "UserId");
    const users = await userCollections();
    const time = new Date();
    const myNewMessage = {
      _id: ObjectId(),
      msg: msg,
      isSent: isSent,
      time: time,
    };
    if (myChat.message == null && !Array.isArray(myChat.message)) {
      myChat.message = [myNewMessage];
    } else {
      myChat.message.push(myNewMessage);
    }
    let updateInfo = await users.updateOne(
      { $and: [{ _id: my_user_id }, { "chat.user_id": user_id }] },
      { $set: { "chat.$": myChat } }
    );
    if (updateInfo.matchedCount == 0 && updateInfo.modifiedCount == 0) {
      const error = new Error("Could not add chat");
      error.code = errorCode.INTERNAL_SERVER_ERROR;
      throw error;
    }

    const newMessage = {
      _id: ObjectId(),
      msg: msg,
      isSent: !isSent,
      time: time,
    };
    if (chat.message == null && !Array.isArray(chat.message)) {
      chat.message = [newMessage];
    } else {
      chat.message.push(newMessage);
    }
    updateInfo = await users.updateOne(
      { $and: [{ _id: user_id }, { "chat.user_id": my_user_id }] },
      { $set: { "chat.$": chat } }
    );
    if (updateInfo.matchedCount == 0 && updateInfo.modifiedCount == 0) {
      const error = new Error("Could not add chat");
      error.code = errorCode.INTERNAL_SERVER_ERROR;
      throw error;
    }
  } catch (e) {
    const user = await usersData.get(user_id);
    const myUser = await usersData.get(my_user_id);
    my_user_id = utils.parseObjectId(my_user_id, "MyUserId");
    user_id = utils.parseObjectId(user_id, "UserId");
    if (e.code == errorCode.NOT_FOUND) {
      const users = await userCollections();
      const myNewChat = {
        _id: ObjectId(),
        user_id: user_id,
        userName: user.userName,
        profilePicture: user.profilePicture,
        message: [
          {
            _id: ObjectId(),
            msg: msg,
            isSent: true,
            time: new Date(),
          },
        ],
      };
      let updateInfo = await users.updateOne(
        { _id: my_user_id },
        { $push: { chat: myNewChat } }
      );
      if (updateInfo.matchedCount == 0 && updateInfo.modifiedCount == 0) {
        const error = new Error("Could not add chat");
        error.code = errorCode.INTERNAL_SERVER_ERROR;
        throw error;
      }

      const newChat = {
        _id: ObjectId(),
        user_id: my_user_id,
        userName: myUser.userName,
        profilePicture: myUser.profilePicture,
        message: [
          {
            _id: ObjectId(),
            msg: msg,
            isSent: false,
            time: myNewChat.message[0].time,
          },
        ],
      };
      updateInfo = await users.updateOne(
        { _id: user_id },
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
  getAllChats,
  getChatByUserId,
  addToChat,
  addEmptyChat,
};
