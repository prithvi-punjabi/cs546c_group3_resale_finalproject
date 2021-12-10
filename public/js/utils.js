String.prototype.preventXSS = function () {
  var tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return this.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};

function isEmail(email) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/g;
  return regex.test(email);
}

function checkPhoneNumber(phone) {
  const regEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/g;
  const regExSimple = /^[0-9]{10}$/g;
  if (!phone.match(regEx) && !phone.match(regExSimple)) return false;
  else return true;
}

function isValidPassword(str) {
  const regEx =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
  if (str.match(regEx)) {
    return true;
  } else {
    return false;
  }
}

function checkState(state) {
  if (state.length > 2) {
    return false;
  } else {
    const regex = /^[a-zA-Z]{2}$/g;
    if (!state.match(regex)) {
      return false;
    } else {
      return true;
    }
  }
}

function checkZip(zip) {
  if (zip.length > 5) {
    return false;
  } else {
    const regex = /^[0-9]{5}$/g;
    if (!zip.match(regex)) {
      return false;
    } else {
      return true;
    }
  }
}

function checkUsername(username) {
  if (username == null || username.length == 0 || username.trim().length == 0) {
    throw "Please enter username";
  }
  if (username.length < 5) {
    throw "Username must be at least 5 characters long";
  }
}

function checkPassword(password) {
  if (password == null || password.length == 0 || password.trim().length == 0) {
    throw "Please enter password";
  }
  if (password.length < 6) {
    throw "Password must be at least 6 characters long";
  }
  if (!isValidPassword(password)) {
    throw "Password must contain at least one upper, one lower, one special character and one number";
  }
}
