(function ($) {
  let myAlert = $('#myToast');
  let bsAlert = new bootstrap.Toast(myAlert);
  bsAlert.show();
  $("#testimAlert").hide();
  $("#buyresale").click(function (event) {
    $(location).attr("href", "/");
  });
  $("#closeTestimAlert").click(function (event) {
    $("#testimAlert").hide();
  });
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });
  $("#testFormSubmit").click(function (event) {
    event.preventDefault();
    const testDiv = $("#allTestimonials");
    const testForm = $("#testForm");
    const testimAlert = $("#testimAlert");
    const testimMsgAlert = $("#testimMsgAlert");
    const msg = $("#message").val();
    if (msg.length === 0) {
      event.preventDefault();
      testimMsgAlert.html("Your testimonial cannot be empty!");
      testimAlert.show();
    } else if (msg.trim().length === 0) {
      event.preventDefault();
      testimMsgAlert.html("Your testimonial cannot be empty spaces!");
      testimAlert.show();
      $("#message").val("");
    } else {
      $.ajax({
        type: "POST",
        url: testForm.attr("action"),
        data: testForm.serialize(),
        complete: function (response) {
          console.log(response.responseJSON);
          let thistest = response.responseJSON;
          $("#testButClose").trigger("click");
          testDiv.append(
            "<div class='card'><div class='card-header'>" +
              thistest.usersName +
              "</div><div class='divimage2'><img src='" +
              thistest.userImg +
              "' class='card-img-top2' alt='" +
              thistest.usersName +
              "' /></div><div class='card-body'><p class='card-text'>" +
              thistest.message +
              "</p></div></div>"
          );
          Swal.fire({
            title: "Thank you!",
            text: `Thank you for the testimonial ${thistest.usersName}! We hope you're enjoying re$ale!`,
            icon: "success",
            confirmButtonText: "I sure am!",
          });
        },
      });
    }
  });
})(window.jQuery);
