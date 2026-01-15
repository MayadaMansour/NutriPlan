import { renderMeals, fetchAllMeals } from "./meals.js";

const API = "https://www.themealdb.com/api/json/v1/1";

let selectedArea = "";
let selectedCategory = "";

/* ========= AREAS ========= */
export async function loadAreasFilters() {
  const res = await fetch(`${API}/list.php?a=list`);
  const data = await res.json();

  const container = document.getElementById("areas-filters");
  const allBtn = container.querySelector("[data-area='']");

  allBtn.onclick = () => {
    selectedArea = "";
    setActiveArea(allBtn);
    applyFilters();
  };

  data.meals.forEach((a) => {
    const btn = document.createElement("button");
    btn.className =
      "area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm";
    btn.dataset.area = a.strArea;
    btn.textContent = a.strArea;

    btn.onclick = () => {
      selectedArea = a.strArea;
      setActiveArea(btn);
      applyFilters();
    };

    container.appendChild(btn);
  });
}

function setActiveArea(active) {
  document.querySelectorAll(".area-btn").forEach((b) => {
    b.classList.remove("bg-emerald-600", "text-white");
    b.classList.add("bg-gray-100", "text-gray-700");
  });

  active.classList.add("bg-emerald-600", "text-white");
}

/* ========= CATEGORIES ========= */
export async function loadCategoriesGrid() {
  const res = await fetch(`${API}/categories.php`);
  const data = await res.json();

  const grid = document.getElementById("categories-grid");
  grid.innerHTML = "";

  data.categories.forEach((c) => {
    const card = document.createElement("div");
    card.className =
      "category-card bg-gray-50 rounded-xl p-3 border cursor-pointer";
    card.dataset.category = c.strCategory;

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${c.strCategoryThumb}" class="w-10 h-10 rounded-lg" />
        <h3 class="font-bold text-sm">${c.strCategory}</h3>
      </div>
    `;

    card.onclick = () => {
      selectedCategory = c.strCategory;
      setActiveCategory(card);
      applyFilters();
    };

    grid.appendChild(card);
  });
}

function setActiveCategory(active) {
  document.querySelectorAll(".category-card").forEach((c) =>
    c.classList.remove("border-emerald-500", "bg-emerald-50")
  );
  active.classList.add("border-emerald-500", "bg-emerald-50");
}

/* ========= APPLY FILTER ========= */
async function applyFilters() {
  if (!selectedArea && !selectedCategory) {
    fetchAllMeals();
    return;
  }

  let meals = [];

  if (selectedCategory) {
    const r = await fetch(`${API}/filter.php?c=${selectedCategory}`);
    meals = (await r.json()).meals || [];
  }

  if (selectedArea) {
    const r = await fetch(`${API}/filter.php?a=${selectedArea}`);
    const byArea = (await r.json()).meals || [];
    meals = meals.length
      ? meals.filter((m) => byArea.some((a) => a.idMeal === m.idMeal))
      : byArea;
  }

  const fullMeals = await Promise.all(
    meals.slice(0, 24).map((m) =>
      fetch(`${API}/lookup.php?i=${m.idMeal}`)
        .then((r) => r.json())
        .then((d) => d.meals[0])
    )
  );

  renderMeals(fullMeals);
}
