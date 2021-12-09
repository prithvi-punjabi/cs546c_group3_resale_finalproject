const moment = require("moment");
const { ObjectId } = require("mongodb");

module.exports = {
  checkNonNull() {
    for (let i = 0; i < arguments.length; i++) {
      const val = arguments[i];
      if (val == null) throw `A field is either null or not passed`; //used == to also consider undefined values
    }
  },

  checkNumber(num, varName) {
    if (varName == null) varName = "Parameter";
    if (num == null) throw `Must pass ${varName}`;
    num = parseFloat(num);
    if (isNaN(num)) throw `${varName} must be a number`;
  },

  checkString(str, varName) {
    if (!varName) varName = "Parameter";
    if (str == null) throw `Must pass ${varName}`;
    if (typeof str !== "string") throw `${varName} must be a string`;
    if (str.trim().length == 0)
      throw `${varName} must not be just empty spaces`;
  },

  checkStatus(str) {
    this.checkString(str, "Status");
    if (str.toLowerCase() != "available" && str.toLowerCase() != "sold") {
      throw "Status must be in (Available/Sold)";
    }
  },

  checkCondition(str) {
    this.checkString(str, "Condition");
    if (
      str.toLowerCase() != "new" &&
      str.toLowerCase() != "barely used" &&
      str.toLowerCase() != "fairly used"
    ) {
      throw "Condition must be in (New/Barely Used/Fairly Used)";
    }
  },

  checkPassword(str) {
    this.checkString(str, "Password");
    const regEx =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
    if (!str.match(regEx))
      throw `Password must contain at least one upper, one lower, one special character and one number`;
  },

  checkPhoneNumber(phone) {
    if (phone == null) throw `Must pass phone number`;
    phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6, 15);
    const regEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/g;
    if (!phone.match(regEx)) throw `Invalid phone number`;
  },

  checkEmail(email) {
    if (email == null) throw `Must pass email address`;
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/g;
    if (!email.match(regex)) throw `Invalid email address`;
  },

  checkDate(date, varName) {
    if (varName == null) varName = "Date";
    if (!moment(date, "MM/DD/YYYY").isValid())
      throw `Invalid ${varName} (Required format: MM/DD/YYYY)`;
  },

  checkDesignation(designation) {
    if (designation == null) throw `Must pass designation`;
    if (common.designation[designation.toLowerCase()] == null)
      throw `Invalid designation`;
  },

  isValidObject(obj) {
    return typeof obj == "object" && !Array.isArray(obj);
  },

  checkLocation: (address) => {
    if (typeof address !== "object") throw "Address is not an Object";
    if (Object.keys(address).length === 0) throw "Address cannot be empty";
    if (
      !address.hasOwnProperty("streetAddress") ||
      !address.hasOwnProperty("city") ||
      !address.hasOwnProperty("state") ||
      !address.hasOwnProperty("zip")
    )
      throw "Address requires all properties: streetAddress, city, state and zipcode";
    if (
      typeof address.streetAddress !== "string" ||
      typeof address.city !== "string" ||
      typeof address.state !== "string" ||
      typeof address.zip !== "string"
    )
      throw "Address values need to be strings";
    // Validation for state (eg: NJ) and zip (eg: 07030)
    if (address.state.length > 2) throw "State can only be 2 character string";
    if (address.zip.length > 5) throw "Invalid zip code";
  },

  checkDob: (input) => {
    let today = new Date().toLocaleDateString();
    let currmonth = parseInt(today.split("/")[0]);
    let currday = parseInt(today.split("/")[1]);
    let curryear = parseInt(today.split("/")[2]);
    let month = parseInt(input.split("-")[1]);
    let day = parseInt(input.split("-")[2]);
    let year = parseInt(input.split("-")[0]);
    if (currmonth === month && currday === day && curryear === year)
      throw "Your birthday cannot be today";
    if (year > 2007) {
      throw "You need to be older than 13 to access re$ale";
    }
    // Check if day in date supplied is out of range of month
    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    ) {
      if (day < 0 || day > 31) throw `${day} does not exist in ${month}`;
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (day < 0 || day > 30) throw `${day} does not exist in ${month}`;
    }
    if (month === 2) {
      if (day < 0 || day > 28) throw `${day} does not exist in ${month}`;
    }
    // Check if inputted date is in the future
    if (
      (day > currday && month == currmonth && year == curryear) ||
      (day > currday && month > currmonth && year > curryear) ||
      (month > currmonth && year > curryear) ||
      (month > currmonth && year == curryear) ||
      year > curryear
    ) {
      throw "Your birthday cannot be in the future";
    }
  },

  isEmptyObject(obj) {
    if (this.isValidObject(obj)) {
      return Object.keys(obj).length == 0;
    }
    return true;
  },

  isValidObjectID(id) {
    if (!ObjectId.isValid(id)) {
      throw `Invalid id: ${id}`;
    }
    return ObjectId(id);
  },
};
