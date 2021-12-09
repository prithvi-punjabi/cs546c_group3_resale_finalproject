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
  form.addEventListener("submit", function addUser(event) {
    event.preventDefault();

    $("#error-div").addClass("visually-hidden");
    let isValid = true;

    if (firstName.value.length == 0) {
      firstName.classList.add("is-invalid");
      firstName.focus();
      isValid = false;
    }

    if (lastName.value.length == 0) {
      lastName.classList.add("is-invalid");
      lastName.focus();
      isValid = false;
    }

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
    }

    if (biography.value.length == 0) {
      biography.classList.add("is-invalid");
      biography.focus();
      isValid = false;
    }

    if (dob.value.length == 0) {
      dob.classList.add("is-invalid");
      dob.focus();
      isValid = false;
    }

    if (email.value.length == 0) {
      email.classList.add("is-invalid");
      email.focus();
      isValid = false;
    }

    if (phoneNumber.value.length == 0) {
      phoneNumber.classList.add("is-invalid");
      phoneNumber.focus();
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

    if (street.value.length == 0) {
      street.classList.add("is-invalid");
      street.focus();
      isValid = false;
    }

    if (city.value.length == 0) {
      city.classList.add("is-invalid");
      city.focus();
      isValid = false;
    }

    if (state.value.length == 0) {
      state.classList.add("is-invalid");
      state.focus();
      isValid = false;
    }

    if (zip.value.length == 0) {
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
            biography: event.target.biography.value,
            street: event.target.street.value,
            city: event.target.city.value,
            state: event.target.state.value,
            zip: event.target.zip.value,
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
              const msg = JSON.parse(error.responseText).message;
              $("#error-div").val(msg);
              $("#error-div").removeClass("visually-hidden");
            },
          });
        },
        error: function (error) {
          const msg = JSON.parse(error.responseText).message;
          $("#error-div").val(msg);
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
        biography: event.target.biography.value,
        street: event.target.street.value,
        city: event.target.city.value,
        state: event.target.state.value,
        zip: event.target.zip.value,
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
