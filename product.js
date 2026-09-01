"use strict";

/* =========================================================
   SaBo Product Details
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
  backButton:
    document.getElementById("backButton"),

  productImage:
    document.getElementById("productImage"),

  productName:
    document.getElementById("productName"),

  productPrice:
    document.getElementById("productPrice"),

  productLocation:
    document.getElementById("productLocation"),

  productDescription:
    document.getElementById(
      "productDescription"
    ),

  productCondition:
    document.getElementById(
      "productCondition"
    ),

  productStock:
    document.getElementById(
      "productStock"
    ),

  sellerName:
    document.getElementById("sellerName"),

  sellerLocation:
    document.getElementById(
      "sellerLocation"
    ),

  contactButton:
    document.getElementById(
      "contactButton"
    )
};

/* =========================================================
   Product ID
========================================================= */

const params =
  new URLSearchParams(
    window.location.search
  );

const productId =
  params.get("id");

/* =========================================================
   Navigation
========================================================= */

elements.backButton?.addEventListener(
  "click",
  () => {

    if (
      window.history.length > 1
    ) {
      window.history.back();
    } else {
      window.location.href =
        "index.html";
    }

  }
);

/* =========================================================
   Load Product
========================================================= */

async function loadProduct() {

  if (!productId) {

    showProductError(
      "Product not found."
    );

    return;
  }

  const {
    data: product,
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
    .eq("id", productId)
    .maybeSingle();

  if (error) {

    console.error(
      "Product error:",
      error
    );

    showProductError(
      "Unable to load this product."
    );

    return;
  }

  if (!product) {

    showProductError(
      "Product not found."
    );

    return;
  }

  renderProduct(product);
}

/* =========================================================
   Render Product
========================================================= */

function renderProduct(product) {

  document.title =
    `SaBo — ${product.name}`;

  elements.productName.textContent =
    product.name;

  elements.productPrice.textContent =
    formatPrice(
      product.price,
      product.currency
    );

  elements.productLocation.textContent =
    product.location ||
    "Location not specified";

  elements.productDescription.textContent =
    product.description ||
    "No description provided.";

  elements.productCondition.textContent =
    `Condition: ${
      product.condition || "Not specified"
    }`;

  elements.productStock.textContent =
    `Stock: ${
      Number.isFinite(Number(product.stock))
        ? product.stock
        : "Not specified"
    }`;

  elements.sellerName.textContent =
    product.seller_name ||
    "Seller";

  elements.sellerLocation.textContent =
    product.location ||
    "Location not specified";

  renderProductImage(product);

  setupContactButton(product);
}

/* =========================================================
   Product Image
========================================================= */

function renderProductImage(product) {

  elements.productImage.innerHTML = "";

  if (!product.image_url) {

    elements.productImage.innerHTML = `
      <div class="product-placeholder">
        No Image Available
      </div>
    `;

    return;
  }

  const image =
    document.createElement("img");

  image.src =
    product.image_url;

  image.alt =
    product.name || "Product image";

  image.addEventListener(
    "error",
    () => {

      elements.productImage.innerHTML = `
        <div class="product-placeholder">
          Image unavailable
        </div>
      `;
    }
  );

  elements.productImage.appendChild(
    image
  );
}

/* =========================================================
   Contact Seller
========================================================= */

function setupContactButton(product) {

  elements.contactButton.onclick =
    () => {

      const phone =
        String(
          product.seller_phone || ""
        ).trim();

      if (!phone) {

        alert(
          "This seller has not provided a phone number."
        );

        return;
      }

      /*
       * Temporary contact implementation.
       *
       * Later this button can become:
       * SaBo internal encrypted messaging.
       */

      const cleanPhone =
        phone.replace(
          /[^0-9+]/g,
          ""
        );

      window.location.href =
        `tel:${cleanPhone}`;
    };
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

  return `${currency} ${
    numericPrice.toLocaleString()
  }`;
}

/* =========================================================
   Error State
========================================================= */

function showProductError(message) {

  elements.productName.textContent =
    message;

  elements.productPrice.textContent =
    "";

  elements.productLocation.textContent =
    "";

  elements.productDescription.textContent =
    "We could not load this product.";

  elements.productImage.innerHTML = `
    <div class="product-placeholder">
      Product unavailable
    </div>
  `;

  elements.contactButton.disabled =
    true;
}

/* =========================================================
   Start
========================================================= */

loadProduct();
