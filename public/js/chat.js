(function ($) {
  if ($("#user_id").val() == "") {
    $(".chat").empty();
    $(".chat").append(
      "<h3 class='text-center py-5'>Select user to start chatting</h3>"
    );
  }
  $("#ul-chat li").each(function (inx, li) {
    $(li).click(function (event) {
      window.location.href = "/chat/" + $(li).attr("id");
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
