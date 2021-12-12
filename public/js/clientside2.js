(function ($) {
  // const emailForm = $("#emailForm");
  $(".btn-danger").hide();
  $("#emailAlert").hide();
  $("#commentAlert").hide();
  $("#ratingAlert").hide();
  $("#bidAlert").hide();
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });
  const prodId = $("#prodID").text();
  var comms = new Array();
  $(".commId").each(function () {
    var comment = $(this).text();
    comms.push(comment);
  });
  $.ajax({
    type: "GET",
    url: `/comments/getall/${prodId}`,
    complete: function (response) {
      response.responseJSON.forEach((x) => {
        comms.forEach((y) => {
          if (x === y) {
            $(`#${y}`).show();
          }
        });
      });
    },
  });

  $(".btn-danger").click(function (event) {
    const commId = this.id;
    const prodId = $("#prodID").text();
    const delButt = $(`#${commId}`);
    $.ajax({
      type: "POST",
      url: `/comments/delete/${commId}`,
      data: { prodId: prodId },
      complete: function (response) {
        if (response.responseJSON === true) {
          event.target.closest(".list-group-item").remove();
          Swal.fire({
            title: "Success!",
            text: `Your comment has been deleted!`,
            icon: "success",
            confirmButtonText: "Got it, thank you!",
          });
        }
      },
    });
  });

  $("#closeEmailAlert").click(function (event) {
    $("#emailAlert").hide();
  });

  $("#closeCommentAlert").click(function (event) {
    $("#commentAlert").hide();
  });

  $("#closeRatingAlert").click(function (event) {
    $("#ratingAlert").hide();
  });

  $("#closeBidAlert").click(function (event) {
    $("#bidAlert").hide();
  });

  $(".bidAcc").click(function (event) {
    event.preventDefault();
    $("#viewBidButClose").trigger("click");
    const url = $(this).attr("href");
    console.log(url);
    $.ajax({
      type: "POST",
      url: url,
      success: function (response) {
        console.log(response);
        Swal.fire({
          title: "Success!",
          text: `Yay! You have accepted ${response.to}'s bid of $${response.amount} for your product: ${response.prodName}. An email has been sent to ${response.to} notifying them of their bid acceptance.`,
          icon: "success",
          confirmButtonText: "Got it!",
        }).then(function () {
          location.reload(true);
        });
      },
    });
  });

  $("#bidFormSubmit").click(function (event) {
    event.preventDefault();
    const bidForm = $("#bidForm");
    const bid = $("#bidPrice").val();
    const bidAlert = $("#bidAlert");
    const bidAlertMsg = $("#bidMsgAlert");
    const prodName = $("#prodTitle").text();
    if (bid.length === 0) {
      event.preventDefault();
      bidAlertMsg.html("Your bid cannot be empty!");
      bidAlert.show();
    } else if (bid.trim().length === 0) {
      event.preventDefault();
      bidAlertMsg.html("Your bid cannot be empty spaces!");
      bidAlert.show();
      $("#bidPrice").val("");
    } else if (isNaN(parseInt(bid)) == true || parseInt(bid) === null) {
      event.preventDefault();
      bidAlertMsg.html("Your bid needs to be numeric!");
      bidAlert.show();
      $("#bidPrice").val("");
    } else {
      $.ajax({
        type: "POST",
        url: bidForm.attr("action"),
        data: bidForm.serialize(),
        complete: function (response) {
          $("#bidPrice").val("");
          $("#bidButClose").trigger("click");
          if (response.responseJSON == true) {
            Swal.fire({
              title: "Success!",
              text: `Your $${bid} bid on ${prodName} was successfuly recorded!`,
              icon: "success",
              confirmButtonText: "Got it!",
            });
          } else {
            Swal.fire({
              title: "Success!",
              text: `Your bid has been updated from $${response.responseJSON.oldBid} to $${response.responseJSON.newBid}`,
              icon: "success",
              confirmButtonText: "Got it!",
            });
          }
        },
      });
    }
  });

  $("#emailFormSubmit").click(function (event) {
    event.preventDefault();
    const emailForm = $("#emailForm");
    const msg = $("#message").val();
    const emailAlert = $("#emailAlert");
    const emailMsgAlert = $("#emailMsgAlert");
    const seller = $("#nameOfSeller").val();
    if (msg.length === 0) {
      event.preventDefault();
      emailMsgAlert.html("Your email cannot be empty!");
      emailAlert.show();
    } else if (msg.trim().length === 0) {
      event.preventDefault();
      emailMsgAlert.html("Your email cannot be empty spaces!");
      emailAlert.show();
      $("#message").val("");
    } else {
      $.ajax({
        type: "POST",
        url: emailForm.attr("action"),
        data: emailForm.serialize(),
        complete: function (response) {
          $("#message").val("");
          $("#emailButClose").trigger("click");
          Swal.fire({
            title: "Success!",
            text: `Your email to ${seller} has been sent succesfully!`,
            icon: "success",
            confirmButtonText: "Got it!",
          });
        },
      });
    }
  });

  $("#btn-chat").click(function () {
    window.location.href = "/chat/" + $("#product_id").val().preventXSS();
  });

  $("#ratingFormSubmit").click(function (event) {
    event.preventDefault();
    const ratingForm = $("#ratingForm");
    const ratingAlert = $("#ratingAlert");
    const ratingMsgAlert = $("#ratingMsgAlert");
    const seller = $("#nameOfSeller").val();
    const rating = $("input[name='rating']:checked").val();
    if (!rating || rating === undefined) {
      event.preventDefault();
      ratingMsgAlert.html("Your rating cannot be empty!");
      ratingAlert.show();
    } else {
      $.ajax({
        type: "POST",
        url: ratingForm.attr("action"),
        data: ratingForm.serialize(),
        complete: function (response) {
          $("#ratingButClose").trigger("click");
          if (typeof response.responseJSON === "number") {
            const thisRate = parseInt(response.responseJSON);
            if (thisRate >= 3) {
              Swal.fire({
                title: "Yay!",
                text: `${seller} appreciates your ${thisRate} star rating!`,
                icon: "success",
                confirmButtonText: "That's great!",
              });
            } else if (thisRate > 0 && thisRate < 3) {
              Swal.fire({
                title: "Awww..",
                text: `${seller} will take your ${thisRate} star rating into account, and improve!`,
                icon: "success",
                confirmButtonText: "Good to know!",
              });
            }
          } else {
            Swal.fire({
              title: "Updated rating!",
              text: `We have updated your rating for ${seller} to ${response.responseJSON.alreadyRated} stars!`,
              icon: "success",
              confirmButtonText: "That's great!",
            });
          }
        },
      });
    }
  });

  $("#submitComment").click(function (event) {
    event.preventDefault();
    const prodId = $("#prodID").text();
    const commentForm = $("#commentForm");
    const commentDiv = $("#displayedComments");
    const commentBox = $("#commentBox");
    const commentAlert = $("#commentAlert");
    const commentMsgAlert = $("#commentMsgAlert");
    if (commentBox.val().length === 0) {
      event.preventDefault();
      commentMsgAlert.html("Your comment cannot be empty!");
      commentAlert.show();
    } else if (commentBox.val().trim().length === 0) {
      event.preventDefault();
      commentMsgAlert.html("Your comment cannot be empty spaces!");
      commentAlert.show();
      commentBox.val("");
    }
    $.ajax({
      type: "POST",
      url: commentForm.attr("action"),
      data: commentForm.serialize(),
      complete: function (response) {
        commentBox.val("");
        commentDiv.append(
          "<div class='list-group-item list-group-item-action' aria-current='true'>" +
            "<span class='commId' hidden>" +
            response.responseJSON.commentId.preventXSS() +
            "</span>" +
            "<div class='d-flex w-100 justify-content-between'>" +
            " <h5 class='mb-1 commentUserName'>" +
            response.responseJSON.usersname.preventXSS() +
            "</h5>" +
            "<img src='" +
            response.responseJSON.userimg.preventXSS() +
            "'class='commentImgs'/>" +
            "</div> <p class='mb-1'>" +
            response.responseJSON.comment.preventXSS() +
            "</p> <small class='dateAdded'>" +
            response.responseJSON.time.preventXSS() +
            "</small>" +
            "<button class='btn btn-danger btn-sm' id='" +
            response.responseJSON.commentId.preventXSS() +
            "'>Delete</button> </div>"
        );
        $(`#${response.responseJSON.commentId}`).on("click", function (event) {
          $.ajax({
            type: "POST",
            url: `/comments/delete/${response.responseJSON.commentId}`,
            data: { prodId: prodId },
            complete: function (response) {
              if (response.responseJSON === true) {
                event.target.closest(".list-group-item").remove();
                Swal.fire({
                  title: "Success!",
                  text: `Your comment has been deleted!`,
                  icon: "success",
                  confirmButtonText: "Got it, thank you!",
                });
              }
            },
          });
        });
      },
    });
  });
  $("#favProdIcon").click(function (event) {
    const starIcon = $("#favProdIcon");
    const prodId = $("#prodID").text();
    event.preventDefault();
    if (starIcon.hasClass("bi bi-star")) {
      starIcon.removeClass("bi bi-star").addClass("bi bi-star-fill");
      $.ajax({
        type: "POST",
        url: `/users/favourite/${prodId}`,
        complete: function (response) {
          if (response.responseJSON === false) {
            Swal.fire({
              title: "Hmm..",
              text: "This product already exists in your favourites list!",
              icon: "info",
              confirmButtonText: "Oops! Got it!",
            });
          }
          if (response.responseJSON === true) {
            Swal.fire({
              title: "Yay!",
              text: "Product added to your favourite list!",
              icon: "success",
              confirmButtonText: "Thank you!",
            });
          }
        },
      });
    } else if (starIcon.hasClass("bi bi-star-fill")) {
      starIcon.removeClass("bi bi-star-fill").addClass("bi bi-star");
      $.ajax({
        type: "POST",
        url: `/users/removefavourite/${prodId}`,
        complete: function (response) {
          console.log(response);
          if (response.responseJSON === false) {
            Swal.fire({
              title: "Hmm..",
              text: "This product does not exist in your favourites list!",
              icon: "info",
              confirmButtonText: "Oops! Got it!",
            });
          }
          if (response.responseJSON === true) {
            Swal.fire({
              title: "Done!",
              text: "Product removed from your favourite list!",
              icon: "info",
              confirmButtonText: "Thank you!",
            });
          }
        },
      });
    }
  });
})(window.jQuery);
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
