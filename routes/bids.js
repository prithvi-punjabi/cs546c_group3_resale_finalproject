const express = require("express");
const router = express.Router();
const bids = require("../data/bids");
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const errorCode = require("../helper/common").errorCode;
const ErrorMessage = require("../helper/message").ErrorMessage;
let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "resalegroup3@gmail.com",
    pass: "rwckkyxaaveoxakw",
  },
});

router.post("/add/:id", async (req, res) => {
  try {
    const prodId = req.params.id;
    validator.checkNonNull(prodId);
    validator.isValidObjectID(prodId);
    let sellerId = req.body.sellerId;
    let bidAmt = req.body.bidPrice;
    validator.checkNonNull(bidAmt);
    validator.checkNumber(bidAmt);
    bidAmt = parseInt(bidAmt);
    const userId = req.session.user._id;
    if (sellerId === userId) {
      return res
        .status(403)
        .json(ErrorMessage("You cannot bid on your own products"));
    }
    const usersName =
      req.session.user.firstName + " " + req.session.user.lastName;
    const userEmail = req.session.user.email;
    const addBid = await bids.placeBid(
      userId,
      bidAmt,
      prodId,
      usersName,
      userEmail
    );
    if (addBid == true) {
      return res.json(true);
    } else if (Array.isArray(addBid)) {
      return res.json({ oldBid: addBid[0], newBid: addBid[1] });
    } else {
      throw "Something went wrong";
    }
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

router.post("/accept/:id", async (req, res) => {
  try {
    const bidId = req.params.id;
    validator.checkNonNull(bidId);
    validator.isValidObjectID(bidId);
    let from = req.session.user.email;
    let sellerName =
      req.session.user.firstName + " " + req.session.user.lastName;
    const getBid = await bids.getById(bidId);
    let to = getBid.bids.email;
    if (from === to) {
      return res.status(403).json(ErrorMessage("You cannot email yourself"));
    }
    let msg = `${sellerName} has accepted your $${getBid.bids.price} bid for his product: ${getBid.name}. Please get in touch with the seller at: ${from}, for further details.`;
    let mailOptions = {
      from: from,
      to: to,
      subject: `Your $${getBid.bids.price} bid for ${getBid.name} was accepted!`,
      text: msg,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
    });
    const soldProd = await bids.acceptBid(bidId);
    return res.json({
      status: "sold",
      to: getBid.bids.name,
      prodName: getBid.name,
      amount: getBid.bids.price,
    });
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
