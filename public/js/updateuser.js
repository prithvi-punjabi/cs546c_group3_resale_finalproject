function removeErrorClass(element) {
  element.classList.remove("is-invalid");
  document.getElementById("error-div").classList.add("visually-hidden");
}

(function ($) {
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });

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

  const form = document.getElementById("update-user");
  form.addEventListener("submit", function updateUser(event) {
    event.preventDefault();
    let isValid = true;

    let firstName = event.target.firstName;
    firstName.value = firstName.value.replace(/\s/g, "");
    if (firstName.value.length == 0) {
      firstName.classList.add("is-invalid");
      firstName.focus();
      isValid = false;
    }

    let lastName = event.target.lastName;
    lastName.value = lastName.value.replace(/\s/g, "");
    if (lastName.value.length == 0) {
      lastName.classList.add("is-invalid");
      lastName.focus();
      isValid = false;
    }

    let biography = event.target.biography;
    biography.value = biography.value.trim();
    if (biography.value.length == 0) {
      biography.classList.add("is-invalid");
      biography.focus();
      isValid = false;
    }

    let email = event.target.email;
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

    let phoneNumber = event.target.phoneNumber;
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

    let street = event.target.street;
    street.value = street.value.trim();
    if (street.value.length == 0) {
      street.classList.add("is-invalid");
      street.focus();
      isValid = false;
    }

    let city = event.target.city;
    city.value = city.value.trim();
    if (city.value.length == 0) {
      city.classList.add("is-invalid");
      city.focus();
      isValid = false;
    }

    let state = event.target.state;
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

    let zip = event.target.zip;
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

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }
    form.classList.add("was-validated");

    let gender;
    if (document.getElementById("gender_male").checked) {
      gender = "male";
    } else if (document.getElementById("gender_female").checked) {
      gender = "female";
    } else {
      gender = "other";
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
            images: path,
            email: email.value,
            phoneNumber: phoneNumber.value,
            biography: biography.value,
            street: street.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            gender: gender,
          };

          $.ajax({
            type: "POST",
            url: "/users/update",
            contentType: "application/json",
            data: JSON.stringify(newPost),
            dataType: "text",
            success: function (responseMessage) {
              window.location.href = "/user/" + $("#userID").val().preventXSS();
            },
            error: function (error) {
              alert(JSON.parse(error.responseText).message.preventXSS());
            },
          });
        },
        error: function (error) {
          console.log(JSON.parse(error.responseText).message);
          alert(JSON.parse(error.responseText).message.preventXSS());
        },
      });
    } else {
      const path = "";
      const newPost = {
        firstName: firstName.value,
        lastName: lastName.value,
        images: path,
        email: email.value,
        phoneNumber: phoneNumber.value,
        biography: biography.value,
        street: street.value,
        city: city.value,
        state: state.value,
        zip: zip.value,
        gender: gender,
      };
      $.ajax({
        type: "POST",
        url: "/users/update",
        contentType: "application/json",
        data: JSON.stringify(newPost),
        dataType: "text",
        success: function (responseMessage) {
          window.location.href = "/user/" + $("#userID").val().preventXSS();
        },
        error: function (error) {
          alert(JSON.parse(error.responseText).message.preventXSS());
        },
      });
    }
  });
})(window.jQuery);
