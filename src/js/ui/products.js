const API = "https://nutriplan-api.vercel.app/api";

let allProducts = [];
let activeNutri = "";
let activeCategory = "";

/* =====================
   PRODUCT MODEL
===================== */
class Product {
  constructor(item) {
    this.barcode = item.barcode;
    this.name = item.name;
    this.brand = item.brand || "";
    this.image = item.image || "https://via.placeholder.com/300";
    this.nutri = item.nutritionGrade?.toUpperCase() || "";
    this.nova = item.novaGroup || "-";

    this.nutrients = {
      protein: item.nutrients?.protein ?? 0,
      carbs: item.nutrients?.carbs ?? 0,
      fat: item.nutrients?.fat ?? 0,
      sugar: item.nutrients?.sugar ?? 0,
    };
  }
}

/* =====================
   UI HELPERS
===================== */
const grid = () => document.getElementById("products-grid");
const loading = () => document.getElementById("products-loading");
const empty = () => document.getElementById("products-empty");
const count = () => document.getElementById("products-count");

function showLoading() {
  loading().classList.remove("hidden");
  grid().classList.add("hidden");
  empty().classList.add("hidden");
}

function showEmpty() {
  loading().classList.add("hidden");
  grid().classList.add("hidden");
  empty().classList.remove("hidden");
}

function showGrid() {
  loading().classList.add("hidden");
  empty().classList.add("hidden");
  grid().classList.remove("hidden");
}

/* =====================
   SEARCH BY NAME ✅
===================== */
async function searchByName(query) {
  showLoading();

  const res = await fetch(
    `${API}/products/search?q=${query}&page=1&limit=24`
  );
  const data = await res.json();

  allProducts = (data.results || []).map(
    (item) => new Product(item)
  );

  applyFilters();
}

/* =====================
   SEARCH BY BARCODE ✅
===================== */
async function searchByBarcode(code) {
  showLoading();

  try {
    const res = await fetch(`${API}/products/barcode/${code}`);
    const data = await res.json();

    if (!data.result) {
      allProducts = [];
    } else {
      allProducts = [new Product(data.result)];
    }

    renderProducts(allProducts);
  } catch {
    allProducts = [];
    renderProducts([]);
  }
}

/* =====================
   FILTERS
===================== */
function applyFilters() {
  let filtered = [...allProducts];

  if (activeNutri) {
    filtered = filtered.filter(
      (p) => p.nutri === activeNutri
    );
  }

  // ⚠️ category مؤقتة (client-side)
  if (activeCategory) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(activeCategory.toLowerCase())
    );
  }

  renderProducts(filtered);
}

/* =====================
   RENDER
===================== */
function renderProducts(products) {
  grid().innerHTML = "";
  count().textContent = `Showing ${products.length} products`;

  if (!products.length) {
    showEmpty();
    return;
  }

  showGrid();

  products.forEach((p) => {
    grid().innerHTML += `
      <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition">
        <div class="relative h-44 bg-gray-100 flex items-center justify-center">
          <img src="${p.image}" class="h-full object-contain"/>

          ${
            p.nutri
              ? `<span class="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded bg-green-500 text-white">
                  NUTRI-SCORE ${p.nutri}
                </span>`
              : ""
          }

          <span class="absolute top-2 right-2 w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
            ${p.nova}
          </span>
        </div>

        <div class="p-4">
          <p class="text-xs text-emerald-600 font-semibold">
            ${p.brand}
          </p>

          <h3 class="font-bold text-gray-900 mb-3 line-clamp-2">
            ${p.name}
          </h3>

          <div class="grid grid-cols-4 gap-1 text-xs text-center">
            <div class="bg-emerald-50 rounded p-1">
              <b>${p.nutrients.protein}g</b><div>Protein</div>
            </div>
            <div class="bg-blue-50 rounded p-1">
              <b>${p.nutrients.carbs}g</b><div>Carbs</div>
            </div>
            <div class="bg-purple-50 rounded p-1">
              <b>${p.nutrients.fat}g</b><div>Fat</div>
            </div>
            <div class="bg-orange-50 rounded p-1">
              <b>${p.nutrients.sugar}g</b><div>Sugar</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/* =====================
   INIT EVENTS
===================== */
export function initProductScanner() {
  document.getElementById("search-product-btn").onclick = () => {
    const v = document.getElementById("product-search-input").value.trim();
    if (v) searchByName(v);
  };

  document.getElementById("lookup-barcode-btn").onclick = () => {
    const v = document.getElementById("barcode-input").value.trim();
    if (v) searchByBarcode(v);
  };

  document.querySelectorAll(".nutri-score-filter").forEach((btn) => {
    btn.onclick = () => {
      activeNutri = btn.dataset.grade
        ? btn.dataset.grade.toUpperCase()
        : "";
      applyFilters();
    };
  });

  document.querySelectorAll(".product-category-btn").forEach((btn) => {
    btn.onclick = () => {
      activeCategory = btn.dataset.category || "";
      applyFilters();
    };
  });
}
