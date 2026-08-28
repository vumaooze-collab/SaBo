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

async function testConnection() {

  productsContainer.innerHTML =
    "<p>Testing Supabase connection...</p>";

  categoriesContainer.innerHTML =
    "<p>Testing categories...</p>";


  // Test products
  const productsResult =
    await supabaseClient
      .from("products")
      .select("*")
      .limit(5);


  if (productsResult.error) {

    productsContainer.innerHTML = `
      <h3>PRODUCT DATABASE ERROR</h3>
      <p>${productsResult.error.message}</p>
      <p>Code: ${productsResult.error.code || "none"}</p>
      <p>Details: ${productsResult.error.details || "none"}</p>
      <p>Hint: ${productsResult.error.hint || "none"}</p>
    `;

  } else {

    productsContainer.innerHTML = `
      <h3>PRODUCT CONNECTION WORKS</h3>
      <p>Products found: ${productsResult.data.length}</p>
    `;

  }


  // Test categories
  const categoriesResult =
    await supabaseClient
      .from("categories")
      .select("*")
      .limit(20);


  if (categoriesResult.error) {

    categoriesContainer.innerHTML = `
      <h3>CATEGORY DATABASE ERROR</h3>
      <p>${categoriesResult.error.message}</p>
      <p>Code: ${categoriesResult.error.code || "none"}</p>
      <p>Details: ${categoriesResult.error.details || "none"}</p>
      <p>Hint: ${categoriesResult.error.hint || "none"}</p>
    `;

  } else {

    categoriesContainer.innerHTML = `
      <h3>CATEGORY CONNECTION WORKS</h3>
      <p>Categories found: ${categoriesResult.data.length}</p>
    `;

  }

}

testConnection();
