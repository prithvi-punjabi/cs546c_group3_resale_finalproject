function removeErrorClass(element) {
  element.classList.remove("is-invalid");
  document.getElementById("error-div").classList.add("visually-hidden");
  document.getElementById("usernameHelp").classList.remove("visually-hidden");
}
(function ($) {
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });
  if ($("#loginAlert")[0].innerHTML == "") $("#loginAlert").hide();
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const error = document.getElementById("error-div");
  error.classList.add("visually-hidden");
  document.getElementById("usernameHelp").classList.remove("visually-hidden");

  const form = document.getElementById("login-form");
  form.addEventListener("submit", function addProduct(event) {
    event.preventDefault();

    let isValid = true;
    if (username.value.length == 0) {
      username.classList.add("is-invalid");
      username.focus();
      document.getElementById("usernameHelp").classList.add("visually-hidden");
      isValid = false;
    } else if (username.value.length < 5) {
      username.classList.add("is-invalid");
      username.focus();
      document.getElementById("invalid-username-label").innerHTML =
        "Username must be at least 5 characters long";
      document.getElementById("usernameHelp").classList.add("visually-hidden");
      isValid = false;
    } else {
      document
        .getElementById("usernameHelp")
        .classList.remove("visually-hidden");
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

    if (!isValid) {
      return;
    }

    $.ajax({
      type: "POST",
      url: "/login",
      contentType: "application/json",
      data: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
      dataType: "text",
      success: function (responseMessage) {
        window.location.replace("/");
      },
      error: function (responseError) {
        error.innerHTML = JSON.parse(
          responseError.responseText
        ).message.preventXSS();
        error.classList.remove("visually-hidden");
      },
    });
  });
})(window.jQuery);
