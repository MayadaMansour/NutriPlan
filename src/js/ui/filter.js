import { fetchMeals, fetchMealsByFilter } from "./meals.js";

const API = "https://nutriplan-api.vercel.app/api";

let selectedArea = "";
let selectedCategory = "";

//! CATEGORIES 
export async function loadCategoriesGrid() {
  const res = await fetch(`${API}/meals/categories`);
  const data = await res.json();

  const grid = document.getElementById("categories-grid");
  grid.innerHTML = "";

  data.results.forEach((item) => {
    const card = createCategoryCard(item.name, item.thumbnail);
    grid.appendChild(card);
  });
}
function createCategoryCard(name, img) {
  const card = document.createElement("div");

  card.className = `
    category-card
    border
    rounded-2xl
    flex
    items-center
    gap-3
    cursor-pointer
    transition
    hover:ring-2
    ring-emerald-500
  `;

  card.innerHTML = `
    ${img ? `<img src="${img}" class="w-10 h-10 object-contain px-2" />` : ""}
    <span class="font-semibold text-gray-900">${name}</span>
  `;

  card.onclick = () => {
    selectedCategory = name;
    setActive(
      document.getElementById("categories-grid"),
      card,
      "category-card"
    );
    applyFilters();
  };

  return card;
}

//! AREAS 
export async function loadAreasFilters() {
  const res = await fetch(`${API}/meals/areas`);
  const data = await res.json();

  const container = document.getElementById("areas-filters");
  container.innerHTML = "";
  const allBtn = createAreaBtn("All", () => {
    selectedArea = "";
    fetchMeals();
    setActive(container, allBtn);
  });
  container.appendChild(allBtn);
  setActive(container, allBtn); 
  data.results.forEach((item) => {
    const areaName = item.name;

    const btn = createAreaBtn(areaName, () => {
      selectedArea = areaName;
      setActive(container, btn);
      applyFilters();
    });

    container.appendChild(btn);
  });
}
function createAreaBtn(text, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className =
    "area-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-emerald-600 hover:text-white transition";
  btn.onclick = onClick;
  return btn;
}

//! FILTER
function applyFilters() {
  let params = [];

  if (selectedCategory) {
    params.push(`category=${encodeURIComponent(selectedCategory)}`);
  }

  if (selectedArea) {
    params.push(`area=${encodeURIComponent(selectedArea)}`);
  }

  fetchMealsByFilter(params.join("&"));
}
function setActive(container, activeEl, className = "area-btn") {
  container.querySelectorAll(`.${className}`).forEach((el) => {
    el.classList.remove("bg-emerald-600", "text-white", "ring-2");
    el.classList.add("bg-gray-100", "text-gray-700");
  });

  activeEl.classList.remove("bg-gray-100", "text-gray-700");
  activeEl.classList.add("bg-emerald-600", "text-white", "ring-2");
}
