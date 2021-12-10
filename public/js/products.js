function imageUploadChange() {
  //get the file name
  let fileName = "";
  for (let i = 0; i < $("#fileUpload").files.length; i++) {
    if (fileName.length != 0) {
      fileName += ", ";
    }
    fileName += $("#fileUpload").files[i].name;
  }
  //replace the "Choose a file" label
  $("#image-upload-label").attr(innerHTML).val(fileName);
}

(function ($) {
  $("#logo").on("click", function (event) {
    $(location).attr("href", "/");
  });
  const product_id = $("#product_id").val();
  function isEdit() {
    return product_id != null && product_id != "";
  }
  function addPost(newPost) {
    $.ajax({
      type: "POST",
      url: "/products/" + (isEdit() ? "edit/" + product_id : "/new"),
      contentType: "application/json",
      data: JSON.stringify(newPost),
      dataType: "text",
      success: function (responseMessage) {
        console.log(responseMessage);
        window.location.replace("/");
      },
      error: function (error) {
        alert(JSON.parse(error.responseText).message.preventXSS());
      },
    });
  }

  $(".uploaded-img").click(function (event) {
    $(this).parent().remove();
  });

  $("#form-product").submit(function (event) {
    event.preventDefault();
    $("#invalid-image").removeClass("d-block");
    $("#invalid-category").removeClass("d-block");

    if (!$("#form-product")[0].checkValidity()) {
      event.stopPropagation();
      $("#form-product").addClass("was-validated");
      return;
    }

    $("#form-product").addClass("was-validated");

    let category = [];
    if ($("#cate-book").is(":checked")) {
      category.push("Books");
    }
    if ($("#cate-clothing").is(":checked")) {
      category.push("Clothing");
    }
    if ($("#cate-electronics").is(":checked")) {
      category.push("Electronics");
    }
    if ($("#cate-other").is(":checked")) {
      category.push("Other");
    }
    if ($("#cate-footwear").is(":checked")) {
      category.push("Footwear");
    }
    if ($("#cate-furniture").is(":checked")) {
      category.push("Furniture");
    }
    if ($("#cate-household").is(":checked")) {
      category.push("Household");
    }
    if ($("#cate-kitchenware").is(":checked")) {
      category.push("Kitchenware");
    }
    if ($("#cate-office").is(":checked")) {
      category.push("Office");
    }
    if ($("#cate-storage").is(":checked")) {
      category.push("Storage");
    }

    if (category.length == 0) {
      $("#invalid-category").addClass("d-block");
      return;
    }
    let keywords = $("#keywords").val();
    keywords = keywords.replace(" ", "").split(",");

    let status = "Available";
    if ($("#status_sold").is(":checked")) {
      status = "Sold";
    }

    let condition = "Barely Used";
    if ($("#condition_new").is(":checked")) {
      condition = "New";
    } else if ($("#condition_fairly_used").is(":checked")) {
      condition = "Fairly Used";
    }

    let uploadedImg = [];
    for (let i = 0; i < $("#uploaded-imgs").children().length; i++) {
      const div = $("#uploaded-imgs").children()[i];
      uploadedImg.push($($(div).children()[0]).attr("src"));
    }

    const newPost = {
      name: event.target.name.value,
      images: uploadedImg,
      category: category,
      keywords: keywords,
      price: event.target.price.value,
      description: event.target.description.value,
      location: {
        streetAddress: event.target.street.value,
        city: event.target.city.value,
        state: event.target.state.value,
        zip: event.target.zip.value,
      },
      status: status,
      condition: condition,
    };

    var formData = new FormData();
    const files = $("#imageUpload")[0].files;
    if (files == null || files.length == 0) {
      if (newPost.images.length == 0) {
        $("#invalid-image").addClass("d-block");
        return;
      }
      addPost(newPost);
    } else {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("image", file); // since inputs allow multi files submission, therefore files are in array
      }

      $.ajax({
        type: "POST",
        url: "/upload",
        contentType: false,
        data: formData,
        processData: false,
        success: function (path) {
          newPost.images = newPost.images.concat(path);
          addPost(newPost);
        },
        error: function (error) {
          console.log(JSON.parse(error.responseText).message);
          alert(JSON.parse(error.responseText).message.preventXSS());
        },
      });
    }
  });
})(window.jQuery);
