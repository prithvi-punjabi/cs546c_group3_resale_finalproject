function noProduct(parameter) {
  let cards = document.getElementsByClassName("card");
  let count = 0;
  for (i = 0; i < cards.length; i++) {
    if (cards[i].className == "card") {
      count += 1;
    }
  }
  if (count === 0) {
    Swal.fire({
      title: "Error!",
      text: `No results found for the given ${parameter}. Please modify your search parameter.`,
      icon: "error",
      confirmButtonText: "Got it!",
    });
    clearAllFilters();
    showAllCards();
  }
}

function searchBar() {
  let input, filter, cards, names, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  cards = document.getElementsByClassName("card");
  names = document.getElementsByClassName("card-header");
  for (i = 0; i < names.length; i++) {
    if (
      cards[i].className !== "card hiddenByPrice" &&
      cards[i].className !== "card hiddenByLoc" &&
      cards[i].className !== "card hiddenByCat"
    ) {
      txtValue = names[i].innerHTML;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        cards[i].hidden = false;
        cards[i].className = "card";
      } else {
        cards[i].hidden = true;
        cards[i].className = "card hiddenBySearch";
      }
    }
  }
  noProduct("name");
}

let slider = document.getElementById("price");
let output = document.getElementById("priceVal");
output.innerHTML = slider.value;
slider.oninput = function () {
  output.innerHTML = this.value;
};

function filterByPrice() {
  let cards = document.getElementsByClassName("card");
  let prices = document.getElementsByClassName("card-title");
  let checkPrice = parseInt(slider.value);
  for (i = 0; i < prices.length; i++) {
    if (
      cards[i].className !== "card hiddenBySearch" &&
      cards[i].className !== "card hiddenByLoc" &&
      cards[i].className !== "card hiddenByCat"
    ) {
      txtValue = prices[i].innerHTML;
      priceToCheck = txtValue.replace("$", "");
      if (parseInt(priceToCheck) < checkPrice) {
        cards[i].hidden = false;
        cards[i].className = "card";
      } else {
        cards[i].hidden = true;
        cards[i].className = "card hiddenByPrice";
      }
    }
  }
  noProduct("price");
}
function clearInput() {
  let input = document.getElementById("myInput");
  let cards = document.getElementsByClassName("card");
  input.value = "";
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].className === "card hiddenBySearch")
      cards[i].className = "card";
  }
}

function showAllCards() {
  let cards = document.getElementsByClassName("card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].className = "card";
    cards[i].hidden = false;
  }
}

function filterLocation() {
  let nyCheck = document.getElementById("NewYork");
  let njCheck = document.getElementById("NewJersey");
  let selectedLoc = [];
  if (nyCheck.checked === true) selectedLoc.push("NY");
  if (njCheck.checked === true) selectedLoc.push("NJ");
  let cards = document.getElementsByClassName("card");
  let locationState = document.getElementsByClassName("locationState");
  for (let i = 0; i < locationState.length; i++) {
    if (
      cards[i].className !== "card hiddenByPrice" &&
      cards[i].className !== "card hiddenBySearch" &&
      cards[i].className !== "card hiddenByCat"
    ) {
      if (selectedLoc.includes(locationState[i].innerHTML)) {
        cards[i].hidden = false;
        cards[i].className = "card";
      } else {
        cards[i].hidden = true;
        cards[i].className = "card hiddenByLoc";
      }
    }
  }
  noProduct("location");
}

function filterCategory() {
  let obj = {};
  obj["Books"] = document.getElementById("Books").checked;
  obj["Clothing"] = document.getElementById("Clothing").checked;
  obj["Electronics"] = document.getElementById("Electronics").checked;
  obj["Footwear"] = document.getElementById("Footwear").checked;
  obj["Furniture"] = document.getElementById("Furniture").checked;
  obj["Household"] = document.getElementById("Household").checked;
  obj["Kitchenware"] = document.getElementById("Kitchenware").checked;
  obj["Office"] = document.getElementById("Office").checked;
  obj["Storage"] = document.getElementById("Storage").checked;
  obj["Other"] = document.getElementById("Other").checked;
  let selectedCat = [];
  for (let cat in obj) {
    if (obj[cat] === true) {
      selectedCat.push(cat);
    }
  }
  let cards = document.getElementsByClassName("card");
  let categoryList = document.getElementsByClassName("card-category");
  let availableCats = [];
  for (let i = 0; i < categoryList.length; i++) {
    if (
      cards[i].className !== "card hiddenByPrice" &&
      cards[i].className !== "card hiddenBySearch" &&
      cards[i].className !== "card hiddenByLoc"
    ) {
      availableCats = categoryList[i].innerHTML.split(",");
      if (selectedCat.some((item) => availableCats.includes(item))) {
        cards[i].hidden = false;
        cards[i].className = "card";
      } else {
        cards[i].className = "card hiddenByCat";
        cards[i].hidden = true;
      }
      availableCats = [];
    }
  }
  noProduct("category");
}

function clearAllFilters() {
  slider.value = 1000;
  output.innerHTML = slider.value;
  let aa = document.querySelectorAll("input[type=checkbox]");
  for (var i = 0; i < aa.length; i++) {
    aa[i].checked = true;
  }
  clearInput();
  showAllCards();
}
