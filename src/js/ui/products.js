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

const grid = document.getElementById("products-grid");
const loading = document.getElementById("products-loading");
const empty = document.getElementById("products-empty");
const count = document.getElementById("products-count");


function showLoading() {
  loading.classList.remove("hidden");
  grid.classList.add("hidden");
  empty.classList.add("hidden");
}

function showEmpty() {
  loading.classList.add("hidden");
  grid.classList.add("hidden");
  empty.classList.remove("hidden");
}

function showGrid() {
  loading.classList.add("hidden");
  empty.classList.add("hidden");
  grid.classList.remove("hidden");
}

//! PRODUCT

function formatProduct(item) {
  return {
    name: item.name,
    brand: item.brand || "",
    image: item.image || "https://via.placeholder.com/300",
    nutri: item.nutritionGrade ? item.nutritionGrade.toUpperCase() : "",
    nova: item.novaGroup || "-",
    nutrients: {
      calories: item.nutrients?.calories || 0,
      protein: item.nutrients?.protein || 0,
      carbs: item.nutrients?.carbs || 0,
      fat: item.nutrients?.fat || 0,
      sugar: item.nutrients?.sugar || 0,
    },
  };
}

//! SEARCH BY NAME

async function searchByName(query) {
  showLoading();
  try {
    const res = await fetch(`${API}/products/search?q=${query}&page=1&limit=24`);
    const data = await res.json();
    allProducts = (data.results || []).map(formatProduct);
    applyFilters();
  } catch {
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
    allProducts = [formatProduct(data.result)];
    renderProducts(allProducts);
  } catch {
    showEmpty();
  }
}

//! CATEGORY FILTER 
async function fetchByCategory(category) {
  showLoading();
  try {
    const res = await fetch(
      `${API}/products/category/${category}?page=1&limit=24`
    );
    const data = await res.json();
    allProducts = (data.results || []).map(formatProduct);
    applyFilters();
  } catch {
    showEmpty();
  }
}

//! FILTERS

function applyFilters() {
  let result = allProducts;

  if (activeNutri) {
    result = result.filter(p => p.nutri === activeNutri);
  }

  renderProducts(result);
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

confirmBtn.onclick = function () {
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
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  closeProductModal();
};

//! RENDER PRODUCTS

function renderProducts(products) {
  grid.innerHTML = "";
  count.textContent = `Showing ${products.length} products`;

  if (!products.length) return showEmpty();
  showGrid();

  products.forEach(product => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-sm hover:shadow-lg cursor-pointer overflow-hidden";

    card.onclick = () => openProductModal(product);

    const nutriLabel = product.nutri
      ? `NUTRI-SCORE ${product.nutri}`
      : "NUTRI-SCORE UNKNOWN";

    card.innerHTML = `
      <!-- IMAGE -->
      <div class="relative h-44 bg-gray-100 flex items-center justify-center">
        <img src="${product.image}" class="h-full object-contain"/>

        <!-- Nutri Score -->
        <span class="absolute top-2 left-2 px-3 py-1 text-xs font-bold rounded-full
          ${
            product.nutri === "A"
              ? "bg-green-500 text-white"
              : product.nutri === "B"
              ? "bg-lime-500 text-white"
              : product.nutri === "C"
              ? "bg-yellow-500 text-white"
              : product.nutri === "D"
              ? "bg-orange-500 text-white"
              : product.nutri === "E"
              ? "bg-red-500 text-white"
              : "bg-gray-400 text-white"
          }">
          ${nutriLabel}
        </span>

        <!-- NOVA -->
        <span class="absolute top-2 right-2 w-7 h-7 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          ${product.nova}
        </span>
      </div>

      <!-- CONTENT -->
      <div class="p-4">
        <p class="text-sm text-emerald-600 font-semibold">
          ${product.brand || ""}
        </p>

        <h3 class="font-bold text-gray-900 mb-2 line-clamp-1">
          ${product.name}
        </h3>

        <div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span>
            <i class="fa-solid fa-scale-balanced mr-1"></i>
            100 g
          </span>
          <span>
            <i class="fa-solid fa-fire mr-1"></i>
            ${product.nutrients.calories} kcal/100g
          </span>
        </div>

        <!-- NUTRIENTS -->
        <div class="grid grid-cols-4 gap-2 text-xs text-center font-semibold">
          <div class="bg-emerald-50 rounded-lg py-2">
            <div class="text-emerald-600">${product.nutrients.protein}g</div>
            <div class="text-gray-500">Protein</div>
          </div>

          <div class="bg-blue-50 rounded-lg py-2">
            <div class="text-blue-600">${product.nutrients.carbs}g</div>
            <div class="text-gray-500">Carbs</div>
          </div>

          <div class="bg-purple-50 rounded-lg py-2">
            <div class="text-purple-600">${product.nutrients.fat}g</div>
            <div class="text-gray-500">Fat</div>
          </div>

          <div class="bg-orange-50 rounded-lg py-2">
            <div class="text-orange-600">${product.nutrients.sugar}g</div>
            <div class="text-gray-500">Sugar</div>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}


export function initProductScanner() {
  document.getElementById("search-product-btn").onclick = () => {
    const value = document.getElementById("product-search-input").value.trim();
    if (value) searchByName(value);
  };

  document.getElementById("lookup-barcode-btn").onclick = () => {
    const value = document.getElementById("barcode-input").value.trim();
    if (value) searchByBarcode(value);
  };

  document.querySelectorAll(".nutri-score-filter").forEach(btn => {
    btn.onclick = () => {
      activeNutri = btn.dataset.grade
        ? btn.dataset.grade.toUpperCase()
        : "";
      applyFilters();
    };
  });

  document.querySelectorAll(".product-category-btn").forEach(btn => {
    btn.onclick = () => {
      activeCategory = btn.dataset.category;
      fetchByCategory(activeCategory);
    };
  });
}
