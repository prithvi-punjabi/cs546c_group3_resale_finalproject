(function ($) {
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });

  $("#error-div").hide();

  $("#dark-mode-switch").on("change.bootstrapSwitch", function (event, state) {
    const darkTheme = $("#dark-mode-switch").is(":checked");
    $.ajax({
      type: "POST",
      url: "/users/changeTheme",
      data: JSON.stringify({ darkTheme: darkTheme }),
      contentType: "application/json",
      success: function (successResponse) {
        window.location.reload();
      },
      error: function (errorResponse) {
        $("#error-div").show();
      },
    });
  });
})(window.jQuery);
