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


async function testSaBo() {

  productsContainer.innerHTML =
    "<p>Testing products...</p>";

  categoriesContainer.innerHTML =
    "<p>Testing categories...</p>";


  const products =
    await supabaseClient
      .from("products")
      .select("*")
      .limit(5);


  const categories =
    await supabaseClient
      .from("categories")
      .select("*")
      .limit(20);


  productsContainer.innerHTML = `
    <h3>PRODUCT TEST</h3>

    <p>
      ${
        products.error
          ? products.error.message
          : "SUCCESS — " +
            products.data.length +
            " products found"
      }
    </p>

    ${
      products.error
        ? `
          <p>Code: ${products.error.code || "none"}</p>
          <p>Details: ${products.error.details || "none"}</p>
          <p>Hint: ${products.error.hint || "none"}</p>
        `
        : ""
    }
  `;


  categoriesContainer.innerHTML = `
    <h3>CATEGORY TEST</h3>

    <p>
      ${
        categories.error
          ? categories.error.message
          : "SUCCESS — " +
            categories.data.length +
            " categories found"
      }
    </p>

    ${
      categories.error
        ? `
          <p>Code: ${categories.error.code || "none"}</p>
          <p>Details: ${categories.error.details || "none"}</p>
          <p>Hint: ${categories.error.hint || "none"}</p>
        `
        : ""
    }
  `;
}


testSaBo();
