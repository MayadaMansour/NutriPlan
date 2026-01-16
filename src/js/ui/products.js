const API_BASE = "https://www.themealdb.com/api/json/v1/1";

let allProducts = [];

/* ==========================
   PRODUCT MODEL
========================== */
class Product {
  constructor(item) {
    this.barcode = item.barcode;
    this.name = item.name;
    this.brand = item.brand;
    this.image = item.image || "https://via.placeholder.com/300";
    this.nutriScore = item.nutritionGrade.toLowerCase();
    this.nova = item.novaGroup;

    this.nutrients = {
      calories: item.nutrients.calories,
      protein: item.nutrients.protein,
      carbs: item.nutrients.carbs,
      fat: item.nutrients.fat,
      sugar: item.nutrients.sugar,
    };
  }
}

/* ==========================
   API CALLS
========================== */

// 🔍 Search by name
async function searchByName(query) {
  const res = await fetch(`${API_BASE}/products/search?query=${query}`);
  const data = await res.json();

  allProducts = data.results.map((p) => new Product(p));
  renderProducts(allProducts);
}

// 📦 Search by barcode
async function searchByBarcode(code) {
  const res = await fetch(`${API_BASE}/products/barcode/${code}`);
  const data = await res.json();

  renderProducts([new Product(data.result)]);
}

// 🗂️ Load Categories
export async function loadProductCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  const data = await res.json();

  const container = document.getElementById("product-categories");
  container.innerHTML = "";

  data.categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className =
      "product-category-btn px-4 py-2 bg-emerald-100 rounded-lg text-sm";
    btn.dataset.category = cat;
    btn.innerText = cat;

    btn.onclick = () => loadProductsByCategory(cat);

    container.appendChild(btn);
  });
}

// 🧺 Products by Category
export async function loadProductsByCategory(category) {
  const res = await fetch(`${API_BASE}/products/category/${category}`);
  const data = await res.json();

  allProducts = data.results.map((p) => new Product(p));
  renderProducts(allProducts);
}

/* ==========================
   FILTER
========================== */
function filterByNutriScore(score) {
  if (!score) {
    renderProducts(allProducts);
    return;
  }

  renderProducts(allProducts.filter((p) => p.nutriScore === score));
}

/* ==========================
   RENDER
========================== */
function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  const count = document.getElementById("products-count");

  grid.innerHTML = "";
  count.innerText = `Showing ${products.length} products`;

  if (!products.length) {
    grid.innerHTML = `
      <p class="col-span-full text-center text-gray-500">
        No products found
      </p>`;
    return;
  }

  products.forEach((p) => {
    grid.innerHTML += `
      <div class="bg-white rounded-xl shadow-sm hover:shadow-lg">
        <div class="relative h-40 bg-gray-100 flex items-center justify-center">
          <img src="${p.image}" class="w-full h-full object-contain" />

          <span class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Nutri-Score ${p.nutriScore.toUpperCase()}
          </span>

          <span class="absolute top-2 right-2 bg-lime-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
            ${p.nova}
          </span>
        </div>

        <div class="p-4">
          <p class="text-xs text-emerald-600 font-semibold">${p.brand}</p>
          <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
            ${p.name}
          </h3>

          <div class="grid grid-cols-4 gap-1 text-center">
            <div class="bg-emerald-50 rounded p-1.5">
              <p class="text-xs font-bold">${p.nutrients.protein}g</p>
              <p class="text-[10px]">Protein</p>
            </div>
            <div class="bg-blue-50 rounded p-1.5">
              <p class="text-xs font-bold">${p.nutrients.carbs}g</p>
              <p class="text-[10px]">Carbs</p>
            </div>
            <div class="bg-purple-50 rounded p-1.5">
              <p class="text-xs font-bold">${p.nutrients.fat}g</p>
              <p class="text-[10px]">Fat</p>
            </div>
            <div class="bg-orange-50 rounded p-1.5">
              <p class="text-xs font-bold">${p.nutrients.sugar}g</p>
              <p class="text-[10px]">Sugar</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/* ==========================
   EVENTS
========================== */
export function initProductScanner() {
  document.getElementById("search-product-btn").onclick = () => {
    const val = document.getElementById("product-search-input").value.trim();
    if (val) searchByName(val);
  };

  document.getElementById("lookup-barcode-btn").onclick = () => {
    const val = document.getElementById("barcode-input").value.trim();
    if (val) searchByBarcode(val);
  };

  document.querySelectorAll(".nutri-score-filter").forEach((btn) => {
    btn.onclick = () => filterByNutriScore(btn.dataset.grade);
  });
}
