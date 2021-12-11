(function ($) {
  if ($("#user_id").val() == "") {
    $(".chat").empty();
    $(".chat").append(
      "<h3 class='text-center py-5'>Select user to start chatting</h3>"
    );
  }
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });
  $("#ul-chat li").each(function (inx, li) {
    $(li).click(function (event) {
      window.location.href = "/chat/" + $(li).attr("id").preventXSS();
    });
  });
  if ($("#ul-chat li").length == 0) {
    $("#ul-chat").append("<li class='text-center'>No chats<li>");
  }
  $("#input-msg").focus();
  $("#input-msg").keypress(function (e) {
    var key = e.which;
    if (key == 13) {
      // the enter key code
      $("#btn-send").click();
      return false;
    }
  });
  $("#btn-send").on("click", function (event) {
    if ($("#input-msg").val() == "") {
      return;
    }
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
        window.location.reload();
      },
      error: function (error) {
        alert(error.responseJSON.message.preventXSS());
      },
    });
    $("#input-msg").val("");
  });
})(window.jQuery);
