const SUPABASE_URL = "https://pjvczlisouoiwgqppttm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_HB8q-p6LCcM9fq6FgNlVgg_8zXEV3cI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
  if (!productId) {
    document.querySelector("#product-name").textContent =
      "Product not found";
    return;
  }

  const { data: product, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !product) {
    console.error(error);
    document.querySelector("#product-name").textContent =
      "Product not found";
    return;
  }

  document.querySelector("#product-name").textContent = product.name;

  document.querySelector("#product-price").textContent =
    `MWK ${Number(product.price).toLocaleString()}`;

  document.querySelector("#product-location").textContent =
    product.location || "Location not specified";

  document.querySelector("#product-description").textContent =
    product.description || "No description provided.";

  if (product.image_url) {
    document.querySelector(".product-details-image").innerHTML =
      `<img src="${product.image_url}" alt="${product.name}">`;
  }

  if (product.seller_id) {
    const { data: seller } = await supabaseClient
      .from("profiles")
      .select("full_name, location")
      .eq("id", product.seller_id)
      .single();

    if (seller) {
      document.querySelector("#seller-name").textContent =
        seller.full_name || "Seller";

      document.querySelector("#seller-location").textContent =
        seller.location || "";
    }
  }
}

loadProduct();
