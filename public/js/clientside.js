function searchBar() {
  let input, filter, cards, names, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  cards = document.getElementsByClassName("card");
  names = document.getElementsByClassName("card-header");
  for (i = 0; i < names.length; i++) {
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
    if (cards[i].className !== "card hiddenBySearch") {
      txtValue = prices[i].innerHTML;
      priceToCheck = txtValue.replace("$", "");
      if (parseInt(priceToCheck) < checkPrice) {
        cards[i].hidden = false;
      } else cards[i].hidden = true;
    }
  }
}
function clearInput() {
  let input = document.getElementById("myInput");
  input.value = "";
  searchBar();
}

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

function filterLocation() {
  let nyCheck = document.getElementById("NewYork");
  let njCheck = document.getElementById("NewJersey");
  let selectedLoc = [];
  if (nyCheck.checked === true) selectedLoc.push("NY");
  if (njCheck.checked === true) selectedLoc.push("NJ");
  let cards = document.getElementsByClassName("card");
  let locationState = document.getElementsByClassName("locationState");
  filterByPrice();
  for (let i = 0; i < locationState.length; i++) {
    if (cards[i].hidden !== true) {
      if (selectedLoc.includes(locationState[i].innerHTML)) {
        cards[i].hidden = false;
      } else cards[i].hidden = true;
    }
  }
}

function clearAllFilters() {
  let nyCheck = document.getElementById("NewYork");
  let njCheck = document.getElementById("NewJersey");
  slider.value = 1000;
  output.innerHTML = slider.value;
  nyCheck.checked = true;
  njCheck.checked = true;
  clearInput();
}
