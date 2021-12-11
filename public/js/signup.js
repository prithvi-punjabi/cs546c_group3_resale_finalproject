function removeErrorClass(element) {
  element.classList.remove("is-invalid");
  document.getElementById("error-div").classList.add("visually-hidden");
}

(function ($) {
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const userName = document.getElementById("userName");
  const password = document.getElementById("password");
  const biography = document.getElementById("biography");
  const dob = document.getElementById("dob");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phoneNumber");
  const street = document.getElementById("street");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");
  const address = document.getElementById("invalid-address-label");

  const error = document.getElementById("error-div");
  error.classList.add("visually-hidden");

  const form = document.getElementById("create-user");

  // $( "#phoneNumber" ).change(function() {
  //   alert( "Handler for .change() called." );
  // });

  $("input[name='phoneNumber']").keyup(function () {
    console.log($(this).val().length);
    if ($(this).val().length >= 8) {
      $(this).val(
        $(this)
          .val()
          .replace(/^(\d{3})(-\d{3})(\d+)$/, "$1$2-$3")
      );
    } else if ($(this).val().length <= 6 && $(this).val().length > 3) {
      $(this).val(
        $(this)
          .val()
          .replace(/^(\d{3})(\d+)$/, "$1-$2")
      );
    }
  });

  form.addEventListener("submit", function addUser(event) {
    event.preventDefault();

    $("#error-div").addClass("visually-hidden");
    let isValid = true;
    firstName.value = firstName.value.replace(/\s/g, "");
    if (firstName.value.length == 0) {
      firstName.classList.add("is-invalid");
      firstName.focus();
      isValid = false;
    }

    lastName.value = lastName.value.replace(/\s/g, "");
    if (lastName.value.length == 0) {
      lastName.classList.add("is-invalid");
      lastName.focus();
      isValid = false;
    }

    userName.value = userName.value.replace(/\s/g, "");
    if (userName.value.length == 0) {
      userName.classList.add("is-invalid");
      userName.focus();
      isValid = false;
    } else if (userName.value.length < 5) {
      userName.classList.add("is-invalid");
      userName.focus();
      document.getElementById("invalid-username-label").innerHTML =
        "Username must be at least 5 characters long";
      isValid = false;
    }

    password.value = password.value.replace(/\s/g, "");
    if (password.value.length == 0) {
      password.classList.add("is-invalid");
      password.focus();
      isValid = false;
    } else if (password.value.length < 6) {
      password.classList.add("is-invalid");
      password.focus();
      document.getElementById("invalid-password-label").innerHTML =
        "Password must be at least 6 characters long";
      isValid = false;
    } else if (!isValidPassword(password.value)) {
      password.classList.add("is-invalid");
      password.focus();
      document.getElementById(
        "invalid-password-label"
      ).innerHTML = `Password must contain at least one upper, one lower, one special character and one number`;
      isValid = false;
    }

    biography.value = biography.value.trim();
    if (biography.value.length == 0) {
      biography.classList.add("is-invalid");
      biography.focus();
      isValid = false;
    }

    dob.value = dob.value.replace(/\s/g, "");
    if (dob.value.length == 0) {
      dob.classList.add("is-invalid");
      dob.focus();
      isValid = false;
    } else {
      let today = new Date().toLocaleDateString();
      let currmonth = parseInt(today.split("/")[0]);
      let currday = parseInt(today.split("/")[1]);
      let curryear = parseInt(today.split("/")[2]);
      let month = parseInt(dob.value.split("-")[1]);
      let day = parseInt(dob.value.split("-")[2]);
      let year = parseInt(dob.value.split("-")[0]);
      if (currmonth === month && currday === day && curryear === year) {
        dob.classList.add("is-invalid");
        dob.focus();
        document.getElementById(
          "invalid-dob-label"
        ).innerHTML = `Your birthday cannot be today`;
        isValid = false;
      }
      // Check if inputted date is in the future
      else if (
        (day > currday && month == currmonth && year == curryear) ||
        (day > currday && month > currmonth && year > curryear) ||
        (month > currmonth && year > curryear) ||
        (month > currmonth && year == curryear) ||
        year > curryear
      ) {
        dob.classList.add("is-invalid");
        dob.focus();
        document.getElementById(
          "invalid-dob-label"
        ).innerHTML = `Your birthday cannot be in the future`;
        isValid = false;
      } else if (year > curryear - 13) {
        dob.classList.add("is-invalid");
        dob.focus();
        document.getElementById(
          "invalid-dob-label"
        ).innerHTML = `You need to be at least 13 years old to access re$ale`;
        isValid = false;
      }
      // Check if day in date supplied is out of range of month
      else if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12
      ) {
        if (day < 0 || day > 31) {
          dob.classList.add("is-invalid");
          dob.focus();
          document.getElementById(
            "invalid-dob-label"
          ).innerHTML = `${day} does not exist in ${month}`;
          isValid = false;
        }
      } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        if (day < 0 || day > 30) {
          dob.classList.add("is-invalid");
          dob.focus();
          document.getElementById(
            "invalid-dob-label"
          ).innerHTML = `${day} does not exist in ${month}`;
          isValid = false;
        }
      } else if (month === 2) {
        if (day < 0 || day > 28) {
          dob.classList.add("is-invalid");
          dob.focus();
          document.getElementById(
            "invalid-dob-label"
          ).innerHTML = `${day} does not exist in ${month}`;
          isValid = false;
        }
      }
    }

    email.value = email.value.replace(/\s/g, "");
    if (email.value.length == 0) {
      email.classList.add("is-invalid");
      email.focus();
      isValid = false;
    } else if (!isEmail(email.value)) {
      email.classList.add("is-invalid");
      email.focus();
      document.getElementById("invalid-email-label").innerHTML =
        "Please enter a valid email id";
      isValid = false;
    }

    phoneNumber.value = phoneNumber.value.replace(/\s/g, "");
    if (phoneNumber.value.length == 0) {
      phoneNumber.classList.add("is-invalid");
      phoneNumber.focus();
      isValid = false;
    } else if (!checkPhoneNumber(phoneNumber.value)) {
      phoneNumber.classList.add("is-invalid");
      phoneNumber.focus();
      document.getElementById("invalid-phoneNumber-label").innerHTML =
        "Please enter a valid phone number (xxx-xxx-xxxx)";
      isValid = false;
    }

    let gender;
    if (document.getElementById("gender_male").checked) {
      gender = "male";
    } else if (document.getElementById("gender_female").checked) {
      gender = "female";
    } else {
      gender = "other";
    }

    street.value = street.value.trim();
    if (street.value.length == 0) {
      street.classList.add("is-invalid");
      street.focus();
      isValid = false;
    }

    city.value = city.value.trim();
    if (city.value.length == 0) {
      city.classList.add("is-invalid");
      city.focus();
      isValid = false;
    }

    state.value = state.value.replace(/\s/g, "");
    if (state.value.length == 0) {
      state.classList.add("is-invalid");
      state.focus();
      isValid = false;
    } else if (!checkState(state.value)) {
      state.classList.add("is-invalid");
      state.focus();
      isValid = false;
    }

    zip.value = zip.value.replace(/\s/g, "");
    if (zip.value.length == 0) {
      zip.classList.add("is-invalid");
      zip.focus();
      isValid = false;
    } else if (!checkZip(zip.value)) {
      zip.classList.add("is-invalid");
      zip.focus();
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    if (document.getElementById("imageUpload").files.length > 0) {
      var formData = new FormData();
      const files = document.getElementById("imageUpload").files;
      const file = files[0];
      formData.append("image", file);

      $.ajax({
        type: "POST",
        url: "/uploadSingle",
        contentType: false,
        data: formData,
        processData: false,
        success: function (path) {
          const newPost = {
            firstName: firstName.value,
            lastName: lastName.value,
            userName: userName.value,
            password: password.value,
            images: path,
            email: email.value,
            phoneNumber: phoneNumber.value,
            dob: dob.value,
            biography: biography.value,
            street: street.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            gender: gender,
          };

          $.ajax({
            type: "POST",
            url: "/users/add",
            contentType: "application/json",
            data: JSON.stringify(newPost),
            dataType: "text",
            success: function (responseMessage) {
              window.location.replace("/");
            },
            error: function (error) {
              const msg = JSON.parse(error.responseText).message.preventXSS();
              $("#error-div").text(msg);
              $("#error-div").removeClass("visually-hidden");
            },
          });
        },
        error: function (error) {
          const msg = JSON.parse(error.responseText).message.preventXSS();
          $("#error-div").text(msg);
          $("#error-div").removeClass("visually-hidden");
        },
      });
    } else {
      const path = "/public/images/default.jpeg";
      const newPost = {
        firstName: firstName.value,
        lastName: lastName.value,
        userName: userName.value,
        password: password.value,
        images: path,
        email: email.value,
        phoneNumber: phoneNumber.value,
        dob: dob.value,
        biography: biography.value,
        street: street.value,
        city: city.value,
        state: state.value,
        zip: zip.value,
        gender: gender,
      };
      $.ajax({
        type: "POST",
        url: "/users/add/",
        contentType: "application/json",
        data: JSON.stringify(newPost),
        dataType: "text",
        success: function (responseMessage) {
          window.location.replace("/");
        },
        error: function (error) {
          const msg = JSON.parse(error.responseText).message;
          $("#error-div").text(msg);
          $("#error-div").removeClass("visually-hidden");
        },
      });
    }
  });
})(window.jQuery);
