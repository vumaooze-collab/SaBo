const SUPABASE_URL = "https://pjvczlisouoiwgqppttm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_HB8q-p6LCcM9fq6FgNlVgg_8zXEV3cI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const productsContainer = document.querySelector(".products");
const searchInput = document.querySelector(".search");

let products = [];

async function loadProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Could not load products:", error);
    return;
  }

  products = data;
  displayProducts(products);
}

function displayProducts(items) {
  productsContainer.innerHTML = "";

  items.forEach(function (product) {
    const productElement = document.createElement("div");
    productElement.className = "product";

    productElement.innerHTML = `
      <div class="product-image">
        ${
          product.image_url
            ? `<img src="${product.image_url}" alt="${product.name}">`
            : "Product Image"
        }
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price">MWK ${Number(product.price).toLocaleString()}</div>
        <div class="location">${product.location || "Location not specified"}</div>
      </div>
    `;

    productsContainer.appendChild(productElement);
  });
}

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredProducts = products.filter(function (product) {
    return product.name.toLowerCase().includes(searchTerm);
  });

  displayProducts(filteredProducts);
});

loadProducts();
