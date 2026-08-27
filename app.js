const searchInput = document.querySelector(".search");
const products = document.querySelectorAll(".product");

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();

  products.forEach(function (product) {
    const productName = product
      .querySelector("h3")
      .textContent
      .toLowerCase();

    if (productName.includes(searchTerm)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
});
