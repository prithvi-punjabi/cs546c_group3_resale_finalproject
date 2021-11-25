// document.getElementById("error-div").classList.add("visible");
// document.getElementById("error-div").classList.remove("invisible");

const form = document.getElementById("login-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  form.classList.add("was-validated");

  $.ajax({
    type: "POST",
    url: "/login",
    contentType: "application/json",
    data: JSON.stringify({
      username: event.target.username.value,
      password: event.target.password.value,
    }),
    dataType: "text",
    success: function (responseMessage) {
      console.log(responseMessage);
      window.location.replace("/");
    },
    error: function (error) {
      console.log(error);
      document.getElementById("error-div").classList.add("visible");
      document.getElementById("error-div").classList.remove("invisible");
    },
  });
});
