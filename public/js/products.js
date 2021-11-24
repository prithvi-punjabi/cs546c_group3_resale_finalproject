const form = document.getElementById("form-product");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  form.classList.add("was-validated");

  let category = event.target.category.value;
  category = category.replace(" ", "").split(",");
  let keywords = event.target.keywords.value;
  keywords = keywords.replace(" ", "").split(",");

  let status;
  if (document.getElementById("status_sold").checked) {
    status = "Sold";
  } else {
    status = "Available";
  }

  let condition;
  if (document.getElementById("condition_new").checked) {
    condition = "New";
  } else if (document.getElementById("condition_fairly_used").checked) {
    condition = "Fairly Used";
  } else {
    condition = "Barely Used";
  }

  var formData = new FormData();
  formData.append("image", document.getElementById("imageUpload").files[0]); // since inputs allow multi files submission, therefore files are in array

  $.ajax({
    type: "POST",
    url: "/upload",
    contentType: false,
    data: formData,
    processData: false,
    success: function (path) {
      const newPost = {
        name: event.target.name.value,
        images: [path],
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

      $.ajax({
        type: "POST",
        url: "/products",
        contentType: "application/json",
        data: JSON.stringify(newPost),
        dataType: "text",
        success: function (responseMessage) {
          console.log(responseMessage);
          window.location.replace("/products");
        },
        error: function (error) {
          console.log(error);
          window.location.replace("/products/new");
        },
      });
    },
    error: function (error) {
      console.log(error);
      window.location.replace("/products/new");
    },
  });
});
