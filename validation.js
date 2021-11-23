const validator = require("email-validator");

module.exports = {
  // Check if the supplied input is null
  checkNull: (input) => {
    if (!input || input == undefined)
      throw "An input is either missing or undefined";
  },
  // Check if the supplied string input is a string
  checkString: (input) => {
    if (typeof input !== "string")
      throw "An expected string input is not a string";
    if (input.trim().length === 0)
      throw "A string input is empty or a string of spaces";
  },
  // Check if phone number provided matches a valid phone number format
  checkPhone: (input) => {
    if (!input.match("^[0-9]{3}-[0-9]{3}-[0-9]{4}$"))
      throw "Phone number format is incorrect";
  },
  // Check if the email provided is of a valid format
  checkEmail: (input) => {
    if (!input.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/))
      throw "Email Address format is incorrect";
  },
  // Check date of birth of the user
  checkDob: (input) => {
    let today = new Date().toLocaleDateString();
    let currmonth = parseInt(today.split("/")[0]);
    let currday = parseInt(today.split("/")[1]);
    let curryear = parseInt(today.split("/")[2]);
    if (input === today) throw "Your birthday cannot be today";
    let month = parseInt(input.split("/")[0]);
    let day = parseInt(input.split("/")[1]);
    let year = parseInt(input.split("/")[2]);
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
    )
      throw "Your birthday cannot be in the future";
  },
  // Check user's address
  checkAddress: (address) => {
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
};