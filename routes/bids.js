const express = require("express");
const router = express.Router();
const bids = require("../data/bids");
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const errorCode = require("../helper/common").errorCode;
const ErrorMessage = require("../helper/message").ErrorMessage;
const xss = require("xss");
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
    let sellerId = xss(req.body.sellerId);
    let bidAmt = req.body.bidPrice;
    bidAmt = parseInt(xss(bidAmt));
    validator.checkNonNull(bidAmt);
    validator.checkNumber(bidAmt);
    const userId = req.session.user._id;
    if (sellerId === userId) {
      return res.render("error", {
        code: 403,
        error: "You cannot bid on your own products",
      });
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
      res.json(true);
    } else if (Array.isArray(addBid)) {
      res.json({ oldBid: addBid[0], newBid: addBid[1] });
    }
  } catch (e) {
    console.log(e);
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
      return res.status(403).render("error", {
        code: 403,
        error: "You cannot email yourself.",
      });
    }
    let msg = `${sellerName} has accepted your $${getBid.bids.price} for his product: ${getBid.name}. Please get in touch with the seller at: ${from}, for further details.`;
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
    console.log(e);
  }
});

module.exports = router;
