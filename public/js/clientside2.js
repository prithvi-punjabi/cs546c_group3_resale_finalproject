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
  });
})(window.jQuery);

function favouriteProduct() {
  let favIcon = document.getElementById("favProdIcon");
  if (favIcon.className === "bi bi-star") favIcon.className = "bi bi-star-fill";
  else if (favIcon.className === "bi bi-star-fill")
    favIcon.className = "bi bi-star";
}
