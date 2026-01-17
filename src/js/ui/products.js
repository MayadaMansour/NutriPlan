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

/* ======================
   SEARCH BY BARCODE
====================== */
async function searchByBarcode(code) {
  showLoading();

  try {
    const res = await fetch(`${API}/products/barcode/${code}`);
    const data = await res.json();

    if (!data.result) {
      showEmpty();
      return;
    }

    allProducts = [formatProduct(data.result)];
    renderProducts(allProducts);
  } catch {
    showEmpty();
  }
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

//! FILTERS

function applyFilters() {
  let result = allProducts;

  if (activeNutri) {
    result = result.filter(p => p.nutri === activeNutri);
  }

  if (activeCategory) {
    const text = activeCategory.toLowerCase();
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(text) ||
        p.brand.toLowerCase().includes(text)
    );
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

  if (!products.length) {
    showEmpty();
    return;
  }

  showGrid();

  products.forEach(product => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow-sm hover:shadow-lg cursor-pointer";

    card.onclick = () => openProductModal(product);

    card.innerHTML = `
      <div class="relative h-44 bg-gray-100 flex items-center justify-center">
        <img src="${product.image}" class="h-full object-contain"/>

        ${
          product.nutri
            ? `<span class="absolute top-2 left-2 px-2 py-1 text-xs bg-green-500 text-white rounded">
                NUTRI ${product.nutri}
              </span>`
            : ""
        }

        <span class="absolute top-2 right-2 w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
          ${product.nova}
        </span>
      </div>

      <div class="p-4">
        <p class="text-xs text-emerald-600">${product.brand}</p>
        <h3 class="font-bold mb-3">${product.name}</h3>

        <div class="grid grid-cols-4 gap-1 text-xs text-center">
          <div><b>${product.nutrients.protein}g</b><div>Protein</div></div>
          <div><b>${product.nutrients.carbs}g</b><div>Carbs</div></div>
          <div><b>${product.nutrients.fat}g</b><div>Fat</div></div>
          <div><b>${product.nutrients.sugar}g</b><div>Sugar</div></div>
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
      activeCategory = btn.dataset.category || "";
      applyFilters();
    };
  });
}
