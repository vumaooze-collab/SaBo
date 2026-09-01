"use strict";

/* =========================================================
   SaBo Marketplace Application
========================================================= */

const SUPABASE_URL =
  "https://xqmqgmeewnahrdzoiwyu.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_HB8q-p6LCcM9fq6FgNlVgg_8zXEV3cI";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

/* =========================================================
   DOM
========================================================= */

const elements = {
  sellButton:
    document.getElementById("sellButton"),

  categories:
    document.getElementById("categories"),

  products:
    document.getElementById("products"),

  productsTitle:
    document.getElementById("productsTitle"),

  productCount:
    document.getElementById("productCount"),

  searchInput:
    document.getElementById("searchInput"),

  allProductsButton:
    document.getElementById("allProductsButton")
};

/* =========================================================
   Application State
========================================================= */

const state = {
  products: [],
  categories: [],

  activeCategoryId: null,

  searchQuery: "",

  loading: {
    products: false,
    categories: false
  }
};

/* =========================================================
   Initialization
========================================================= */

async function initializeSaBo() {

  bindEvents();

  await Promise.all([
    loadCategories(),
    loadProducts()
  ]);

}

/* =========================================================
   Event Binding
========================================================= */

function bindEvents() {

  elements.sellButton?.addEventListener(
    "click",
    () => {
      window.location.href = "sell.html";
    }
  );

  elements.allProductsButton?.addEventListener(
    "click",
    showAllProducts
  );

  elements.searchInput?.addEventListener(
    "input",
    handleSearch
  );

}

/* =========================================================
   Categories
========================================================= */

async function loadCategories() {

  state.loading.categories = true;

  renderCategoryLoading();

  const {
    data,
    error
  } = await supabaseClient
    .from("categories")
    .select(
      "id,name,slug,image_url,created_at"
    )
    .order("name", {
      ascending: true
    });

  state.loading.categories = false;

  if (error) {

    console.error(
      "Category loading error:",
      error
    );

    renderError(
      elements.categories,
      "Unable to load categories."
    );

    return;
  }

  state.categories = data || [];

  renderCategories();
}

/* =========================================================
   Category Rendering
========================================================= */

function renderCategories() {

  elements.categories.innerHTML = "";

  if (!state.categories.length) {

    elements.categories.innerHTML = `
      <div class="empty-state">
        <h3>No categories yet</h3>
        <p>Categories will appear here when available.</p>
      </div>
    `;

    return;
  }

  state.categories.forEach(
    (category) => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className = "category";

      button.textContent =
        category.name;

      button.dataset.categoryId =
        category.id;

      if (
        state.activeCategoryId ===
        category.id
      ) {
        button.classList.add("active");
      }

      button.addEventListener(
        "click",
        () => {
          selectCategory(category.id);
        }
      );

      elements.categories.appendChild(
        button
      );
    }
  );
}

/* =========================================================
   Category Selection
========================================================= */

function selectCategory(categoryId) {

  state.activeCategoryId =
    categoryId;

  const category =
    state.categories.find(
      (item) =>
        item.id === categoryId
    );

  elements.productsTitle.textContent =
    category?.name || "Products";

  renderCategories();

  renderFilteredProducts();
}

/* =========================================================
   Show All
========================================================= */

function showAllProducts() {

  state.activeCategoryId = null;

  state.searchQuery = "";

  if (elements.searchInput) {
    elements.searchInput.value = "";
  }

  elements.productsTitle.textContent =
    "Featured Products";

  renderCategories();

  renderProducts(state.products);
}

/* =========================================================
   Products
========================================================= */

async function loadProducts() {

  state.loading.products = true;

  renderProductLoading();

  const {
    data,
    error
  } = await supabaseClient
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      currency,
      category_id,
      image_url,
      location,
      seller_name,
      seller_phone,
      condition,
      stock,
      is_available,
      is_featured,
      created_at,
      updated_at
    `)
    .eq("is_available", true)
    .order("created_at", {
      ascending: false
    });

  state.loading.products = false;

  if (error) {

    console.error(
      "Product loading error:",
      error
    );

    renderError(
      elements.products,
      "Unable to load products."
    );

    return;
  }

  state.products = data || [];

  renderProducts(state.products);
}

/* =========================================================
   Product Filtering
========================================================= */

function getFilteredProducts() {

  let results =
    [...state.products];

  if (state.activeCategoryId) {

    results =
      results.filter(
        (product) =>
          product.category_id ===
          state.activeCategoryId
      );
  }

  if (state.searchQuery) {

    const query =
      state.searchQuery
        .toLowerCase();

    results =
      results.filter(
        (product) => {

          const searchableText =
            [
              product.name,
              product.description,
              product.location,
              product.seller_name,
              product.condition
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return searchableText.includes(
            query
          );
        }
      );
  }

  return results;
}

/* =========================================================
   Render Filtered Products
========================================================= */

function renderFilteredProducts() {

  const results =
    getFilteredProducts();

  renderProducts(results);
}

/* =========================================================
   Product Rendering
========================================================= */

function renderProducts(items) {

  elements.products.innerHTML = "";

  updateProductCount(items.length);

  if (!items.length) {

    elements.products.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
        <p>
          Try another search or choose a different category.
        </p>
      </div>
    `;

    return;
  }

  const fragment =
    document.createDocumentFragment();

  items.forEach(
    (product) => {

      const card =
        createProductCard(product);

      fragment.appendChild(card);
    }
  );

  elements.products.appendChild(
    fragment
  );
}

/* =========================================================
   Product Card
========================================================= */

function createProductCard(product) {

  const card =
    document.createElement("article");

  card.className = "product";

  card.tabIndex = 0;

  card.setAttribute(
    "role",
    "button"
  );

  card.setAttribute(
    "aria-label",
    `View ${product.name}`
  );

  /* Image */

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
      product.name || "Product image";

    image.loading = "lazy";

    image.addEventListener(
      "error",
      () => {
        image.remove();

        imageBox.innerHTML = `
          <div class="product-placeholder">
            No Image
          </div>
        `;
      }
    );

    imageBox.appendChild(image);

  } else {

    imageBox.innerHTML = `
      <div class="product-placeholder">
        No Image
      </div>
    `;
  }

  /* Information */

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
    formatPrice(
      product.price,
      product.currency
    );

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

  if (product.condition) {

    const condition =
      document.createElement("span");

    condition.className =
      "condition";

    condition.textContent =
      product.condition;

    info.appendChild(condition);
  }

  card.appendChild(imageBox);
  card.appendChild(info);

  /* Reactive navigation */

  const openProduct = () => {

    window.location.href =
      `product.html?id=${encodeURIComponent(
        product.id
      )}`;
  };

  card.addEventListener(
    "click",
    openProduct
  );

  card.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        openProduct();
      }
    }
  );

  return card;
}

/* =========================================================
   Search
========================================================= */

function handleSearch(event) {

  state.searchQuery =
    event.target.value.trim();

  if (state.searchQuery) {

    elements.productsTitle.textContent =
      "Search Results";

  } else if (
    state.activeCategoryId
  ) {

    const category =
      state.categories.find(
        (item) =>
          item.id ===
          state.activeCategoryId
      );

    elements.productsTitle.textContent =
      category?.name || "Products";

  } else {

    elements.productsTitle.textContent =
      "Featured Products";
  }

  renderFilteredProducts();
}

/* =========================================================
   Formatting
========================================================= */

function formatPrice(
  price,
  currency = "MWK"
) {

  const numericPrice =
    Number(price);

  if (!Number.isFinite(numericPrice)) {
    return `${currency} 0`;
  }

  return `${currency} ${numericPrice.toLocaleString()}`;
}

/* =========================================================
   Product Count
========================================================= */

function updateProductCount(count) {

  elements.productCount.textContent =
    `${count} ${
      count === 1
        ? "product"
        : "products"
    }`;
}

/* =========================================================
   Loading States
========================================================= */

function renderCategoryLoading() {

  elements.categories.innerHTML = `
    <div class="loading">
      Loading categories...
    </div>
  `;
}

function renderProductLoading() {

  elements.products.innerHTML = `
    <div class="loading">
      Loading products...
    </div>
  `;
}

/* =========================================================
   Error Handling
========================================================= */

function renderError(
  container,
  message
) {

  container.innerHTML = `
    <div class="error-message">
      ${escapeHtml(message)}
    </div>
  `;
}

/* =========================================================
   HTML Escaping
========================================================= */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   Start Application
========================================================= */

initializeSaBo();
