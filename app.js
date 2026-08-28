"use strict";

const SUPABASE_URL =
  "https://xqmqgmeewnahrdzoiwyu.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_HB8q-p6LCcM9fq6FgNlVgg_8zXEV3cI";

const supabaseClient =
  window.supabase.createClient(
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

let products = [];
let categories = [];


/* =========================
   LOAD EVERYTHING
========================= */

async function initializeSaBo() {

  await loadCategories();

  await loadProducts();

}


/* =========================
   CATEGORIES
========================= */

async function loadCategories() {

  const result =
    await supabaseClient
      .from("categories")
      .select("id,name,slug,image_url")
      .order("name");

  if (result.error) {

    categoriesContainer.innerHTML =
      `<p>${result.error.message}</p>`;

    console.error(result.error);

    return;
  }

  categories =
    result.data || [];

  renderCategories();

}


function renderCategories() {

  categoriesContainer.innerHTML = "";

  categories.forEach(function(category) {

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

        productsTitle.textContent =
          category.name;

        const filtered =
          products.filter(function(product) {

            return (
              product.category_id ===
              category.id
            );

          });

        renderProducts(filtered);

      }
    );

    categoriesContainer.appendChild(
      button
    );

  });

}


/* =========================
   PRODUCTS
========================= */

async function loadProducts() {

  const result =
    await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (result.error) {

    productsContainer.innerHTML =
      `<p>${result.error.message}</p>`;

    console.error(result.error);

    return;
  }

  products =
    result.data || [];

  renderProducts(products);

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(items) {

  productsContainer.innerHTML = "";

  if (!items.length) {

    productsContainer.innerHTML =
      "<p>No products found.</p>";

    return;
  }


  items.forEach(function(product) {

    const card =
      document.createElement("article");

    card.className =
      "product";


    const imageBox =
      document.createElement("div");

    imageBox.className =
      "product-image";


    if (product.image_url) {

      const image =
        document.createElement("img");

      image.src =
        product.image_url;

      image.alt =
        product.name;

      image.loading =
        "lazy";

      imageBox.appendChild(
        image
      );

    } else {

      imageBox.innerHTML =
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
      product.name;


    const price =
      document.createElement("div");

    price.className =
      "price";

    price.textContent =
      `${product.currency || "MWK"} ${
        Number(product.price).toLocaleString()
      }`;


    const location =
      document.createElement("div");

    location.className =
      "location";

    location.textContent =
      product.location ||
      "Location not specified";


    info.appendChild(name);

    info.appendChild(price);

    info.appendChild(location);


    card.appendChild(imageBox);

    card.appendChild(info);


    card.addEventListener(
      "click",
      function() {

        window.location.href =
          `product.html?id=${encodeURIComponent(
            product.id
          )}`;

      }
    );


    productsContainer.appendChild(
      card
    );

  });

}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
  "input",
  function() {

    const query =
      searchInput.value
        .trim()
        .toLowerCase();


    if (!query) {

      productsTitle.textContent =
        "Featured Products";

      renderProducts(products);

      return;
    }


    productsTitle.textContent =
      "Search Results";


    const results =
      products.filter(function(product) {

        return (

          String(product.name || "")
            .toLowerCase()
            .includes(query)

          ||

          String(product.description || "")
            .toLowerCase()
            .includes(query)

          ||

          String(product.location || "")
            .toLowerCase()
            .includes(query)

        );

      });


    renderProducts(results);

  }
);


/* =========================
   START
========================= */

initializeSaBo();
