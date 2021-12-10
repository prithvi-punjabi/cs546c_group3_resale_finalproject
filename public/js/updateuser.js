(function ($) {
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });
  const form = document.getElementById("update-user");
  form.addEventListener("submit", function updateUser(event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    form.classList.add("was-validated");

    let firstName = event.target.firstName.value;
    firstName = firstName.replace(" ", "");
    let lastName = event.target.lastName.value;
    lastName = lastName.replace(" ", "");
    let biography = event.target.biography.value;
    biography = biography.replace(" ", "");
    let email = event.target.email.value;
    email = email.replace(" ", "");
    let phoneNumber = event.target.phoneNumber.value;
    phoneNumber = phoneNumber.replace(" ", "");

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
            firstName: firstName,
            lastName: lastName,
            images: path,
            email: email,
            phoneNumber: phoneNumber,
            biography: event.target.biography.value,
            street: event.target.street.value,
            city: event.target.city.value,
            state: event.target.state.value,
            zip: event.target.zip.value,
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
        firstName: firstName,
        lastName: lastName,
        images: path,
        email: email,
        phoneNumber: phoneNumber,
        biography: event.target.biography.value,
        street: event.target.street.value,
        city: event.target.city.value,
        state: event.target.state.value,
        zip: event.target.zip.value,
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
