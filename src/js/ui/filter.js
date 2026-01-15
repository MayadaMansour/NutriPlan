import { renderMeals, fetchAllMeals } from "./meals.js";

const API = "https://www.themealdb.com/api/json/v1/1";

let selectedArea = "";
let selectedCategory = "";

/* ========= CATEGORY COLORS ========= */
const CATEGORY_COLORS = {
  Beef: "bg-red-50 border-red-200",
  Chicken: "bg-yellow-50 border-yellow-200",
  Dessert: "bg-pink-50 border-pink-200",
  Lamb: "bg-orange-50 border-orange-200",
  Miscellaneous: "bg-slate-50 border-slate-200",
  Pasta: "bg-amber-50 border-amber-200",
  Pork: "bg-rose-50 border-rose-200",
  Seafood: "bg-sky-50 border-sky-200",
  Side: "bg-emerald-50 border-emerald-200",
  Starter: "bg-cyan-50 border-cyan-200",
  Vegan: "bg-green-50 border-green-200",
  Vegetarian: "bg-lime-50 border-lime-200",
};

/* ================= AREAS ================= */
export async function loadAreasFilters() {
  const res = await fetch(`${API}/list.php?a=list`);
  const data = await res.json();

  const container = document.getElementById("areas-filters");
  container.innerHTML = "";

  const allBtn = createAreaButton("All Cuisines", "");
  setActiveArea(allBtn);
  container.appendChild(allBtn);

  data.meals.forEach((a) => {
    container.appendChild(createAreaButton(a.strArea, a.strArea));
  });
}

function createAreaButton(label, value) {
  const btn = document.createElement("button");

  btn.className =
    "area-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap transition hover:bg-gray-200";

  btn.textContent = label;

  btn.onclick = () => {
    selectedArea = value;
    setActiveArea(btn);
    applyFilters();
  };

  return btn;
}

function setActiveArea(active) {
  document.querySelectorAll(".area-btn").forEach((btn) => {
    btn.classList.remove("bg-emerald-600", "text-white");
    btn.classList.add("bg-gray-100", "text-gray-700");
  });

  active.classList.remove("bg-gray-100", "text-gray-700");
  active.classList.add("bg-emerald-600", "text-white");
}


/* ================= CATEGORIES ================= */
export async function loadCategoriesGrid() {
  const res = await fetch(`${API}/categories.php`);
  const data = await res.json();

  const grid = document.getElementById("categories-grid");
  grid.innerHTML = "";

  data.categories.slice(0, 12).forEach((c) => {
    const colors =
      CATEGORY_COLORS[c.strCategory] || "bg-gray-50 border-gray-200";

    const card = document.createElement("div");

    card.className = `
      category-card
      ${colors}
      border
      rounded-2xl
      h-[78px]
      px-5
      flex
      items-center
      cursor-pointer
      transition
      hover:shadow-md
      text-center
      py-2
    `;

    card.dataset.category = c.strCategory;
    card.innerHTML = `
      <span class="font-semibold text-sm text-gray-900">
        ${c.strCategory}
      </span>
    `;

    card.onclick = () => {
      selectedCategory = c.strCategory;
      selectedArea = "";

      const allAreaBtn = document.querySelector(".area-btn");
      if (allAreaBtn) setActiveArea(allAreaBtn);

      setActiveCategory(card);
      applyFilters();
    };

    grid.appendChild(card);
  });
}

function setActiveCategory(active) {
  document.querySelectorAll(".category-card").forEach((c) => {
    c.classList.remove("ring-2", "ring-emerald-500");
  });

  active.classList.add("ring-2", "ring-emerald-500");
}

/* ================= APPLY FILTER ================= */
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
