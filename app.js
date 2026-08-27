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
  productsContainer.innerHTML = "<p>Loading products...</p>";

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);

    productsContainer.innerHTML =
      "<p>Unable to load products. Please refresh the page.</p>";

    return;
  }

  products = data || [];

  displayProducts(products);
}

function displayProducts(items) {
  productsContainer.innerHTML = "";

  if (items.length === 0) {
    productsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  items.forEach(function (product) {
    const card = document.createElement("div");

    card.className = "product";

    const image = product.image_url
      ? `<img src="${product.image_url}" alt="${product.name}">`
      : `<div class="product-placeholder">No Image</div>`;

    card.innerHTML = `
      <div class="product-image">
        ${image}
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>

        <div class="price">
          MWK ${Number(product.price).toLocaleString()}
        </div>

        <div class="location">
          ${product.location || "Location not specified"}
        </div>
      </div>
    `;

    card.addEventListener("click", function () {
      window.location.href = "product.html?id=" + product.id;
    });

    productsContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(function (product) {
    return (
      product.name &&
      product.name.toLowerCase().includes(searchTerm)
    );
  });

  displayProducts(filtered);
});

loadProducts();
