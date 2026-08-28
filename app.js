const SUPABASE_URL =
"https://pjvczlisouoiwgqppttm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_HB8q-p6LCcM9fq6FgNlVgg_8zXEV3cI";

/* =====================================================
SUPABASE
===================================================== */

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

/* =====================================================
PAGE ELEMENTS
===================================================== */

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

/* =====================================================
APP STATE
===================================================== */

let products = [];
let categories = [];

/* =====================================================
START Sabo
===================================================== */

async function startSaBo() {

showLoading();

const categoriesLoaded =
await loadCategories();

const productsLoaded =
await loadProducts();

if (!categoriesLoaded && !productsLoaded) {

showConnectionError();

}

}

/* =====================================================
LOADING
===================================================== */

function showLoading() {

if (categoriesContainer) {

categoriesContainer.innerHTML =
  "<p>Loading categories...</p>";

}

if (productsContainer) {

productsContainer.innerHTML =
  "<p>Loading products...</p>";

}

}

/* =====================================================
LOAD CATEGORIES
===================================================== */

async function loadCategories() {

if (!categoriesContainer) {
return false;
}

const { data, error } =
await supabaseClient
.from("categories")
.select("*")
.order("name", {
ascending: true
});

if (error) {

console.error(
  "SaBo category error:",
  error
);


categoriesContainer.innerHTML = `
  <p>
    Unable to load categories.
  </p>
`;

return false;

}

categories =
data || [];

renderCategories(
categories
);

return true;

}

/* =====================================================
RENDER CATEGORIES
===================================================== */

function renderCategories(items) {

categoriesContainer.innerHTML = "";

if (!items.length) {

categoriesContainer.innerHTML =
  "<p>No categories available.</p>";

return;

}

items.forEach(function(category) {

const button =
  document.createElement("button");


button.className =
  "category";


button.type =
  "button";


button.textContent =
  category.name;


button.addEventListener(
  "click",
  function() {

    filterByCategory(
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

/* =====================================================
LOAD PRODUCTS
===================================================== */

async function loadProducts() {

if (!productsContainer) {
return false;
}

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
  "SaBo product error:",
  error
);


productsContainer.innerHTML = `
  <p>
    Unable to load products.
  </p>
`;

return false;

}

products =
data || [];

displayProducts(
products
);

return true;

}

/* =====================================================
DISPLAY PRODUCTS
===================================================== */

function displayProducts(items) {

productsContainer.innerHTML = "";

if (!items.length) {

productsContainer.innerHTML = `
  <p class="no-products">
    No products found.
  </p>
`;

return;

}

items.forEach(function(product) {

const card =
  document.createElement("article");


card.className =
  "product";


const imageContainer =
  document.createElement("div");


imageContainer.className =
  "product-image";


if (product.image_url) {

  const image =
    document.createElement("img");


  image.src =
    product.image_url;


  image.alt =
    product.name || "Product";


  image.loading =
    "lazy";


  image.onerror =
    function() {

      imageContainer.innerHTML = `
        <div class="product-placeholder">
          No Image
        </div>
      `;

    };


  imageContainer.appendChild(
    image
  );

} else {

  imageContainer.innerHTML = `
    <div class="product-placeholder">
      No Image
    </div>
  `;

}


const info =
  document.createElement("div");


info.className =
  "product-info";


const name =
  document.createElement("h3");


name.textContent =
  product.name || "Unnamed product";


const price =
  document.createElement("div");


price.className =
  "price";


const currency =
  product.currency || "MWK";


price.textContent =
  `${currency} ${Number(
    product.price || 0
  ).toLocaleString()}`;


const location =
  document.createElement("div");


location.className =
  "location";


location.textContent =
  product.location ||
  "Location not specified";


info.appendChild(
  name
);


info.appendChild(
  price
);


info.appendChild(
  location
);


card.appendChild(
  imageContainer
);


card.appendChild(
  info
);


card.addEventListener(
  "click",
  function() {

    openProduct(
      product.id
    );

  }
);


productsContainer.appendChild(
  card
);

});

}

/* =====================================================
OPEN PRODUCT
===================================================== */

function openProduct(productId) {

window.location.href =
"product.html?id=" +
encodeURIComponent(
productId
);

}

/* =====================================================
CATEGORY FILTER
===================================================== */

function filterByCategory(
categoryId,
categoryName
) {

if (productsTitle) {

productsTitle.textContent =
  categoryName;

}

const filtered =
products.filter(
function(product) {

    return (
      product.category_id ===
      categoryId
    );

  }
);

displayProducts(
filtered
);

}

/* =====================================================
SEARCH
===================================================== */

if (searchInput) {

searchInput.addEventListener(
"input",
function() {

  const searchTerm =
    searchInput.value
      .toLowerCase()
      .trim();


  if (!searchTerm) {

    if (productsTitle) {

      productsTitle.textContent =
        "Featured Products";

    }


    displayProducts(
      products
    );

    return;
  }


  if (productsTitle) {

    productsTitle.textContent =
      "Search Results";

  }


  const filtered =
    products.filter(
      function(product) {

        const name =
          String(
            product.name || ""
          ).toLowerCase();


        const description =
          String(
            product.description || ""
          ).toLowerCase();


        const location =
          String(
            product.location || ""
          ).toLowerCase();


        return (
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          location.includes(searchTerm)
        );

      }
    );


  displayProducts(
    filtered
  );

}

);

}

/* =====================================================
SELL BUTTON
===================================================== */

if (sellButton) {

sellButton.addEventListener(
"click",
function() {

  window.location.href =
    "sell.html";

}

);

}

/* =====================================================
DATABASE CONNECTION ERROR
===================================================== */

function showConnectionError() {

if (productsContainer) {

productsContainer.innerHTML = `
  <div class="database-error">
    <h3>SaBo couldn't connect</h3>

    <p>
      Check your Supabase publishable key
      and refresh the page.
    </p>
  </div>
`;

}

if (categoriesContainer) {

categoriesContainer.innerHTML = `
  <p>
    Database connection unavailable.
  </p>
`;

}

}

/* =====================================================
RUN APPLICATION
===================================================== */

startSaBo();
