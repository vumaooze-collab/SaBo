"use strict";

/* =========================================================
SaBo — Supabase Configuration
========================================================= */

const SUPABASE_URL =
  "https://xqmqgmeewnahrdzoiwyu.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_HB8q-p6LCcM9fq6FgNlVgg_8zXEV3cI";

/* =========================================================
Validate Supabase SDK
========================================================= */

if (!window.supabase) {

document.body.innerHTML = "<main style=" max-width:700px; margin:60px auto; padding:20px; font-family:Arial,sans-serif; "> <h1>SaBo</h1> <h2>Supabase SDK failed to load</h2> <p> The Supabase JavaScript library could not be loaded. </p> <p> Check your internet connection and refresh the page. </p> </main>";

throw new Error(
"Supabase JavaScript SDK is unavailable."
);

}

/* =========================================================
Create Supabase Client
========================================================= */

const supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

/* =========================================================
DOM
========================================================= */

const categoriesElement =
document.getElementById("categories");

const productsElement =
document.getElementById("products");

const productsTitleElement =
document.getElementById("productsTitle");

const searchElement =
document.getElementById("searchInput");

const sellButton =
document.getElementById("sellButton");

/* =========================================================
Application State
========================================================= */

let allProducts = [];

let allCategories = [];

let activeCategory = null;

/* =========================================================
Error UI
========================================================= */

function showDatabaseError(
container,
title,
error
) {

console.error(
"[SaBo] ${title}",
error
);

const message =
error?.message ||
"Unknown database error";

container.innerHTML = `

<div class="database-error">

  <h3>${escapeHTML(title)}</h3>

  <p>
    ${escapeHTML(message)}
  </p>

  ${
    error?.hint
      ? `
        <small>
          ${escapeHTML(error.hint)}
        </small>
      `
      : ""
  }

</div>

`;

}

/* =========================================================
Load Categories
========================================================= */

async function loadCategories() {

categoriesElement.innerHTML =
"<p>Loading categories...</p>";

const {
data,
error
} =
await supabaseClient

  .from("categories")

  .select(
    "id,name,slug,image_url"
  )

  .order(
    "name",
    {
      ascending: true
    }
  );

if (error) {

showDatabaseError(
  categoriesElement,
  "Unable to load categories",
  error
);

return;

}

allCategories =
data || [];

renderCategories();

}

/* =========================================================
Render Categories
========================================================= */

function renderCategories() {

categoriesElement.innerHTML = "";

const allButton =
document.createElement("button");

allButton.type =
"button";

allButton.className =
"category";

allButton.textContent =
"All";

allButton.addEventListener(
"click",
function() {

  activeCategory =
    null;

  productsTitleElement.textContent =
    "Featured Products";

  renderProducts(
    allProducts
  );

}

);

categoriesElement.appendChild(
allButton
);

allCategories.forEach(
function(category) {

  const button =
    document.createElement("button");


  button.type =
    "button";

  button.className =
    "category";

  button.textContent =
    category.name;


  button.addEventListener(
    "click",
    function() {

      activeCategory =
        category.id;


      productsTitleElement.textContent =
        category.name;


      const filtered =
        allProducts.filter(
          function(product) {

            return (
              product.category_id ===
              category.id
            );

          }
        );


      renderProducts(
        filtered
      );

    }
  );


  categoriesElement.appendChild(
    button
  );

}

);

}

/* =========================================================
Load Products
========================================================= */

async function loadProducts() {

productsElement.innerHTML =
"<p>Loading products...</p>";

const {
data,
error
} =
await supabaseClient

  .from("products")

  .select(
    "id,name,description,price,currency,category_id,image_url,location,seller_name,condition,stock,is_available,is_featured,created_at"
  )

  .eq(
    "is_available",
    true
  )

  .order(
    "created_at",
    {
      ascending: false
    }
  );

if (error) {

showDatabaseError(
  productsElement,
  "Unable to load products",
  error
);

return;

}

allProducts =
data || [];

renderProducts(
allProducts
);

}

/* =========================================================
Render Products
========================================================= */

function renderProducts(
products
) {

productsElement.innerHTML = "";

if (!products.length) {

productsElement.innerHTML = `
  <div class="empty-state">
    <h3>No products found</h3>
    <p>
      Try another search or category.
    </p>
  </div>
`;

return;

}

products.forEach(
function(product) {

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
      product.name ||
      "Product";


    image.loading =
      "lazy";


    image.onerror =
      function() {

        imageContainer.innerHTML =
          `<div class="product-placeholder">
            No Image
          </div>`;

      };


    imageContainer.appendChild(
      image
    );

  } else {

    imageContainer.innerHTML =
      `<div class="product-placeholder">
        No Image
      </div>`;

  }


  const info =
    document.createElement("div");


  info.className =
    "product-info";


  const name =
    document.createElement("h3");


  name.textContent =
    product.name ||
    "Unnamed product";


  const price =
    document.createElement("div");


  price.className =
    "price";


  price.textContent =
    `${product.currency || "MWK"} ${
      Number(
        product.price || 0
      ).toLocaleString()
    }`;


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

      window.location.href =
        `product.html?id=${encodeURIComponent(
          product.id
        )}`;

    }
  );


  productsElement.appendChild(
    card
  );

}

);

}

/* =========================================================
Search
========================================================= */

searchElement.addEventListener(
"input",
function() {

const query =
  searchElement.value
    .trim()
    .toLowerCase();


if (!query) {

  if (activeCategory) {

    const categoryProducts =
      allProducts.filter(
        function(product) {

          return (
            product.category_id ===
            activeCategory
          );

        }
      );


    renderProducts(
      categoryProducts
    );

  } else {

    productsTitleElement.textContent =
      "Featured Products";


    renderProducts(
      allProducts
    );

  }

  return;

}


productsTitleElement.textContent =
  "Search Results";


const results =
  allProducts.filter(
    function(product) {

      return (

        String(
          product.name || ""
        )
          .toLowerCase()
          .includes(query)

        ||

        String(
          product.description || ""
        )
          .toLowerCase()
          .includes(query)

        ||

        String(
          product.location || ""
        )
          .toLowerCase()
          .includes(query)

        ||

        String(
          product.seller_name || ""
        )
          .toLowerCase()
          .includes(query)

      );

    }
  );


renderProducts(
  results
);

}
);

/* =========================================================
Sell Button
========================================================= */

if (sellButton) {

sellButton.addEventListener(
"click",
function() {

  window.location.href =
    "sell.html";

}

);

}

/* =========================================================
HTML Safety
========================================================= */

function escapeHTML(
value
) {

return String(value)
.replace(
/&/g,
"&"
)
.replace(
/</g,
"<"
)
.replace(
/>/g,
">"
)
.replace(
/"/g,
"""
)
.replace(
/'/g,
"'"
);

}

/* =========================================================
Application Bootstrap
========================================================= */

async function initializeSaBo() {

try {

await Promise.all([
  loadCategories(),
  loadProducts()
]);

} catch (error) {

console.error(
  "[SaBo] Application startup failed:",
  error
);

}

}

initializeSaBo();
