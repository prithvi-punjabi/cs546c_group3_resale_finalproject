const errorCode = require("./common").errorCode;
const { ObjectId } = require("mongodb");
const moment = require("moment");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

module.exports = {
  parseObjectId(id, varName) {
    if (varName == null) varName = "Id";
    if (typeof id === "string") {
      try {
        return ObjectId(id.trim());
      } catch (e) {
        const error = new Error(`Invalid ${varName} (${e.message})`);
        error.code = errorCode.BAD_REQUEST;
        throw error;
      }
    }
    return id;
  },
  isEmptyObject(obj) {
    return obj == null || Object.keys(obj).length == 0;
  },
  isEmptyObject(obj) {
    return obj == null || Object.keys(obj).length == 0;
  },
  formatDaysAgo(value, locale) {
    const date = new Date(value);
    let delta = (date.getTime() - Date.now()) / (1000 * 3600 * 24);
    const formatter = new Intl.RelativeTimeFormat(locale);
    delta = Math.round(delta);
    if (delta == 0) {
      return "Today";
    } else if (delta <= -365) {
      delta /= 365;
      delta = Math.round(delta);
      return formatter.format(delta, "years");
    } else {
      return formatter.format(delta, "days");
    }
  },
  isUserLoggedIn(req) {
    return req.session.user != null;
  },
  getDateObject(date) {
    return moment(date, "MM/DD/YYYY").toDate();
  },
  getMonthInString(month) {
    return months[month];
  },
  replaceSpaceInUrl(string) {
    return string.replace(/ /g, "%20");
  },
};
