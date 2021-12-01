(function ($) {
  $("#buyresale").click(function (event) {
    $(location).attr("href", "/");
  });
  $(document).ready(function () {
    $("#myToast").toast("show");
  });
  $("#testFormSubmit").click(function (event) {
    const testDiv = $("#allTestimonials");
    const testForm = $("#testForm");
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: testForm.attr("action"),
      data: testForm.serialize(),
      complete: function (response) {
        console.log(response.responseJSON);
        let thistest = response.responseJSON;
        $("#testButClose").trigger("click");
        testDiv.append(
          "<div class='card prodCard'><div class='card-header'>" +
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
  });
})(window.jQuery);
