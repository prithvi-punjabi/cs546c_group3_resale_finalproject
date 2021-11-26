function favouriteProduct() {
  let favIcon = document.getElementById("favProdIcon");
  if (favIcon.className === "bi bi-star") favIcon.className = "bi bi-star-fill";
  else if (favIcon.className === "bi bi-star-fill")
    favIcon.className = "bi bi-star";
}

