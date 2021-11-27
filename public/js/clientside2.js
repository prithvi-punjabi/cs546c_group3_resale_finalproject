(function ($) {
  // const emailForm = $("#emailForm");
  $(document).ready(function () {
    $("#emailFormSubmit").click(function (event) {
      const emailForm = $("#emailForm");
      const seller = $("#nameOfSeller").val();
      event.preventDefault();
      $.ajax({
        type: "POST",
        url: emailForm.attr("action"),
        data: emailForm.serialize(),
        complete: function (response) {
          $("#emailButClose").trigger("click");
          Swal.fire({
            title: "Success!",
            text: `Your email to ${seller} has been sent succesfully!`,
            icon: "success",
            confirmButtonText: "Got it!",
          });
        },
      });
    });

    $("#submitComment").click(function (event) {
      const commentForm = $("#commentForm");
      const commentDiv = $("#displayedComments");
      const commentBox = $("#commentBox");
      event.preventDefault();
      $.ajax({
        type: "POST",
        url: commentForm.attr("action"),
        data: commentForm.serialize(),
        complete: function (response) {
          commentBox.val("");
          commentDiv.append(
            "<div class='list-group-item list-group-item-action' aria-current='true'>" +
              "<div class='d-flex w-100 justify-content-between'>" +
              " <h5 class='mb-1 commentUserName'>" +
              response.responseJSON.usersname +
              "</h5>" +
              "<img src='" +
              response.responseJSON.userimg +
              "'class='commentImgs'/>" +
              "</div> <p class='mb-1'>" +
              response.responseJSON.comment +
              "</p> <small class='dateAdded'>" +
              response.responseJSON.time +
              "</small>"
          );
        },
      });
    });
    $("#favProdIcon").click(function (event) {
      const starIcon = $("#favProdIcon");
      const prodId = $("#prodID").text();
      event.preventDefault();
      if (starIcon.hasClass("bi bi-star")) {
        starIcon.removeClass("bi bi-star").addClass("bi bi-star-fill");
      } else if (starIcon.hasClass("bi bi-star-fill")) {
        starIcon.removeClass("bi bi-star-fill").addClass("bi bi-star");
      }
    });
  });
})(window.jQuery);
