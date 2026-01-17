import { fetchMeals, fetchMealsByFilter } from "./meals.js";

const API = "https://nutriplan-api.vercel.app/api";

let selectedCategory = "";
let selectedArea = "";

//! CATEGORIES
export async function loadCategoriesGrid() {
  const res = await fetch(`${API}/meals/categories`);
  const data = await res.json();

  const grid = document.getElementById("categories-grid");
  grid.innerHTML = "";
  grid.classList.add("flex", "flex-wrap", "justify-center", "gap-3");
  const allCard = document.createElement("div");
  allCard.className =
    "category-card border rounded-full px-4 py-2 cursor-pointer text-sm font-medium";

  allCard.innerHTML = `<span>All</span>`;

  allCard.onclick = function () {
    selectedCategory = "";
    setActive(grid, allCard, "category-card");
    applyFilters();
  };

  grid.appendChild(allCard);
  setActive(grid, allCard, "category-card");
  data.results.forEach((item) => {
    const card = document.createElement("div");
    card.className =
      "category-card border rounded-full px-4 py-2 cursor-pointer text-sm font-medium flex items-center gap-2";

    card.innerHTML = `
      ${item.thumbnail ? `<img src="${item.thumbnail}" class="w-6 h-6" />` : ""}
      <span>${item.name}</span>
    `;

    card.onclick = function () {
      selectedCategory = item.name;
      setActive(grid, card, "category-card");
      applyFilters();
    };

    grid.appendChild(card);
  });
}
//! AREAS
export async function loadAreasFilters() {
  const res = await fetch(`${API}/meals/areas`);
  const data = await res.json();

  const container = document.getElementById("areas-filters");
  container.innerHTML = "";

  const allBtn = createAreaButton("All");
  allBtn.onclick = function () {
    selectedArea = "";
    setActive(container, allBtn);
    applyFilters();
  };

  container.appendChild(allBtn);
  setActive(container, allBtn);

  data.results.forEach((item) => {
    const btn = createAreaButton(item.name);

    btn.onclick = function () {
      selectedArea = item.name;
      setActive(container, btn);
      applyFilters();
    };

    container.appendChild(btn);
  });
}

function createAreaButton(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className =
    "area-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium";
  return btn;
}

//! FILTERS
function applyFilters() {
  const params = [];

  if (selectedCategory) {
    params.push(`category=${encodeURIComponent(selectedCategory)}`);
  }

  if (selectedArea) {
    params.push(`area=${encodeURIComponent(selectedArea)}`);
  }

  if (params.length === 0) {
    fetchMeals();
  } else {
    fetchMealsByFilter(params.join("&"));
  }
}


function setActive(container, activeEl, className = "area-btn") {
  container.querySelectorAll(`.${className}`).forEach((el) => {
    el.classList.remove("bg-emerald-600", "text-white", "ring-2");
    el.classList.add("bg-gray-100", "text-gray-700");
  });

  activeEl.classList.remove("bg-gray-100", "text-gray-700");
  activeEl.classList.add("bg-emerald-600", "text-white", "ring-2");
}
