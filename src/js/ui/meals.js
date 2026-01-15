const API = "https://www.themealdb.com/api/json/v1/1";

const sections = [
  document.getElementById("search-filters-section"),
  document.getElementById("meal-categories-section"),
  document.getElementById("all-recipes-section"),
];

const grid = document.getElementById("recipes-grid");
const count = document.getElementById("recipes-count");
const search = document.getElementById("search-input");

export function showMealsPage() {
  sections.forEach((s) => (s.style.display = "block"));
}

export function hideMealsPage() {
  sections.forEach((s) => (s.style.display = "none"));
}

export function initMeals(onOpenDetails) {
  fetchAllMeals();

  grid.onclick = (e) => {
    const card = e.target.closest(".recipe-card");
    if (!card) return;
    hideMealsPage();
    onOpenDetails(card.dataset.mealId);
  };

  search.oninput = async (e) => {
    const q = e.target.value.trim();
    if (!q) return fetchAllMeals();

    const res = await fetch(`${API}/search.php?s=${q}`);
    const data = await res.json();
    renderMeals(data.meals || []);
  };
}

export async function fetchAllMeals() {
  const res = await fetch(`${API}/search.php?s=`);
  const data = await res.json();
  renderMeals(data.meals.slice(0, 25));
}

export function renderMeals(meals) {
  grid.innerHTML = "";
  count.textContent = `Showing ${meals.length} recipes`;

  meals.forEach((meal) => {
    grid.innerHTML += `
     <div
        class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group          data-meal-id="${meal.idMeal}"
      >
        <div class="relative h-48 overflow-hidden"> <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> <div class="absolute bottom-3 left-3 flex gap-2"> <span class="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full"> ${meal.strCategory} </span> <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"> ${meal.strArea} </span> </div> </div> <div class="p-4"> <h3 class="font-bold text-gray-900 mb-1 group-hover:text-emerald-600"> ${meal.strMeal} </h3> <p class="text-xs text-gray-600 mb-3">Delicious recipe to try!</p> </div> </div>
    `;
  });
}
