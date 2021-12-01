(function ($) {
  $("#btn-send").on("click", function (event) {
    $.ajax({
      type: "POST",
      url: "/chat/add",
      data: JSON.stringify({
        user_id: $("#user_id").val(),
        msg: $("#input-msg").val(),
        isSent: true,
      }),
      contentType: "application/json",
      success: function (responseMessage) {
        console.log(responseMessage.message);
        window.location.reload();
      },
      error: function (error) {
        alert(error.message);
      },
    });
    $("#input-msg").val("");
  });
})(window.jQuery);
