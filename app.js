const SUPABASE_URL =
"https://pjvczlisouoiwgqppttm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_HB8q-p6LCcM9fq6FgNlVgg_8zXEV3cI";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

const productsContainer =
document.getElementById("products");

const categoriesContainer =
document.getElementById("categories");

const searchInput =
document.getElementById("searchInput");

const productsTitle =
document.getElementById("productsTitle");

const sellButton =
document.getElementById("sellButton");

let products = [];

// ================================
// LOAD CATEGORIES
// ================================

async function loadCategories() {

categoriesContainer.innerHTML =
"<p>Loading categories...</p>";

const { data, error } =
await supabaseClient
.from("categories")
.select("*")
.order("name", {
ascending: true
});

if (error) {

console.error(
  "CATEGORY ERROR:",
  error
);

categoriesContainer.innerHTML =
  "<p>Category error. Check console.</p>";

return;

}

categoriesContainer.innerHTML = "";

data.forEach(function(category) {

const button =
  document.createElement("button");

button.className = "category";

button.textContent =
  category.name;


button.addEventListener(
  "click",
  function() {

    filterProducts(
      category.id,
      category.name
    );

  }
);


categoriesContainer.appendChild(
  button
);

});

}

// ================================
// LOAD PRODUCTS
// ================================

async function loadProducts() {

productsContainer.innerHTML =
"<p>Loading products...</p>";

const { data, error } =
await supabaseClient
.from("products")
.select("*")
.eq("is_available", true)
.order("created_at", {
ascending: false
});

if (error) {

console.error(
  "PRODUCT ERROR:",
  error
);

productsContainer.innerHTML =
  "<p>Product error. Check console.</p>";

return;

}

products = data || [];

displayProducts(products);

}

// ================================
// DISPLAY PRODUCTS
// ================================

function displayProducts(items) {

productsContainer.innerHTML = "";

if (!items.length) {

productsContainer.innerHTML =
  "<p>No products found.</p>";

return;

}

items.forEach(function(product) {

const card =
  document.createElement("div");

card.className =
  "product";


const image =
  product.image_url

    ? `
      <img
        src="${product.image_url}"
        alt="${escapeHTML(product.name)}"
        loading="lazy"
      >
    `

    : `
      <div class="product-placeholder">
        No Image
      </div>
    `;


card.innerHTML = `

  <div class="product-image">
    ${image}
  </div>

  <div class="product-info">

    <h3>
      ${escapeHTML(product.name)}
    </h3>

    <div class="price">
      ${product.currency || "MWK"}
      ${Number(product.price).toLocaleString()}
    </div>

    <div class="location">
      ${escapeHTML(
        product.location ||
        "Location not specified"
      )}
    </div>

  </div>

`;


card.addEventListener(
  "click",
  function() {

    window.location.href =
      "product.html?id=" +
      encodeURIComponent(product.id);

  }
);


productsContainer.appendChild(card);

});

}

// ================================
// CATEGORY FILTER
// ================================

function filterProducts(
categoryId,
categoryName
) {

productsTitle.textContent =
categoryName;

const filtered =
products.filter(
function(product) {

    return (
      product.category_id ===
      categoryId
    );

  }
);

displayProducts(filtered);

}

// ================================
// SEARCH
// ================================

searchInput.addEventListener(
"input",
function() {

const term =
  searchInput.value
    .toLowerCase()
    .trim();


if (!term) {

  productsTitle.textContent =
    "Featured Products";

  displayProducts(products);

  return;
}


productsTitle.textContent =
  "Search Results";


const filtered =
  products.filter(
    function(product) {

      return (

        product.name
          ?.toLowerCase()
          .includes(term)

        ||

        product.description
          ?.toLowerCase()
          .includes(term)

        ||

        product.location
          ?.toLowerCase()
          .includes(term)

      );

    }
  );


displayProducts(filtered);

}
);

// ================================
// SELL BUTTON
// ================================

sellButton.addEventListener(
"click",
function() {

window.location.href =
  "sell.html";

}
);

// ================================
// SECURITY
// ================================

function escapeHTML(value) {

return String(value)
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");

}

// ================================
// START
// ================================

async function startSaBo() {

await loadCategories();

await loadProducts();

}

startSaBo();
