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
    } else {
      cards[i].hidden = true;
    }
  }
}
