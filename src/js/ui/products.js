import { addMealToFoodLog } from "./foodLog.js";

const API = "https://nutriplan-api.vercel.app/api";

let allProducts = [];
let activeNutri = "";
let activeCategory = "";
let selectedProduct = null;

const modal = document.getElementById("log-meal-modal");
const modalImg = document.getElementById("modal-meal-image");
const modalName = document.getElementById("modal-meal-name");
const modalCalories = document.getElementById("modal-calories");
const modalProtein = document.getElementById("modal-protein");
const modalCarbs = document.getElementById("modal-carbs");
const modalFat = document.getElementById("modal-fat");
const confirmBtn = document.getElementById("confirm-log");
const cancelBtn = document.getElementById("cancel-log");

const grid = () => document.getElementById("products-grid");
const loading = () => document.getElementById("products-loading");
const empty = () => document.getElementById("products-empty");
const count = () => document.getElementById("products-count");

class Product {
  constructor(item) {
    this.barcode = item.barcode;
    this.name = item.name;
    this.brand = item.brand || "";
    this.image = item.image || "https://via.placeholder.com/300";
    this.nutri = item.nutritionGrade ? item.nutritionGrade.toUpperCase() : "";
    this.nova = item.novaGroup ?? "-";
    this.nutrients = {
      calories: item.nutrients?.calories ?? 0,
      protein: item.nutrients?.protein ?? 0,
      fat: item.nutrients?.fat ?? 0,
      carbs: item.nutrients?.carbs ?? 0,
      sugar: item.nutrients?.sugar ?? 0,
    };
  }
}

function showLoading() {
  loading()?.classList.remove("hidden");
  grid()?.classList.add("hidden");
  empty()?.classList.add("hidden");
}

function showEmpty() {
  loading()?.classList.add("hidden");
  grid()?.classList.add("hidden");
  empty()?.classList.remove("hidden");
}

function showGrid() {
  loading()?.classList.add("hidden");
  empty()?.classList.add("hidden");
  grid()?.classList.remove("hidden");
}

//! SEARCH BY NAME
async function searchByName(query) {
  showLoading();
  try {
    const res = await fetch(
      `${API}/products/search?q=${encodeURIComponent(query)}&page=1&limit=24`
    );
    const data = await res.json();
    allProducts = (data.results || []).map((i) => new Product(i));
    applyFilters();
  } catch {
    allProducts = [];
    showEmpty();
  }
}

//! SEARCH BY BARCODE
async function searchByBarcode(code) {
  showLoading();
  try {
    const res = await fetch(`${API}/products/barcode/${code}`);
    const data = await res.json();
    if (!data.result) return showEmpty();
    allProducts = [new Product(data.result)];
    renderProducts(allProducts);
  } catch {
    showEmpty();
  }
}

//! FILTERS
function applyFilters() {
  let filtered = [...allProducts];
  if (activeNutri) {
    filtered = filtered.filter((p) => p.nutri === activeNutri);
  }
  if (activeCategory) {
    const cat = activeCategory.toLowerCase();

    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(cat) ||
        (p.brand && p.brand.toLowerCase().includes(cat))
    );
  }

  renderProducts(filtered);
}

//! PARAGRAPH
function openProductModal(product) {
  selectedProduct = product;
  modalImg.src = product.image;
  modalName.textContent = product.name;
  modalCalories.textContent = product.nutrients.calories;
  modalProtein.textContent = product.nutrients.protein + "g";
  modalCarbs.textContent = product.nutrients.carbs + "g";
  modalFat.textContent = product.nutrients.fat + "g";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}
function closeProductModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  selectedProduct = null;
}
cancelBtn.onclick = closeProductModal;
confirmBtn.onclick = () => {
  if (!selectedProduct) return;

  addMealToFoodLog({
    name: selectedProduct.name,
    image: selectedProduct.image,
    calories: selectedProduct.nutrients.calories,
    protein: selectedProduct.nutrients.protein,
    carbs: selectedProduct.nutrients.carbs,
    fat: selectedProduct.nutrients.fat,
    servings: 1,
    type: "Product",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  closeProductModal();
};

//! PRODUCTS
function renderProducts(products) {
  grid().innerHTML = "";
  count().textContent = `Showing ${products.length} products`;

  if (!products.length) return showEmpty();
  showGrid();

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer";
    card.onclick = () => openProductModal(p);

    card.innerHTML = `
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
        <p class="text-xs text-emerald-600 font-semibold">${p.brand}</p>
        <h3 class="font-bold text-gray-900 mb-3 line-clamp-2">${p.name}</h3>

        <div class="grid grid-cols-4 gap-1 text-xs text-center">
          <div class="bg-emerald-50 rounded p-1"><b>${
            p.nutrients.protein
          }g</b><div>Protein</div></div>
          <div class="bg-blue-50 rounded p-1"><b>${
            p.nutrients.carbs
          }g</b><div>Carbs</div></div>
          <div class="bg-purple-50 rounded p-1"><b>${
            p.nutrients.fat
          }g</b><div>Fat</div></div>
          <div class="bg-orange-50 rounded p-1"><b>${
            p.nutrients.sugar
          }g</b><div>Sugar</div></div>
        </div>
      </div>
    `;
    grid().appendChild(card);
  });
}
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
      activeNutri = btn.dataset.grade ? btn.dataset.grade.toUpperCase() : "";
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
