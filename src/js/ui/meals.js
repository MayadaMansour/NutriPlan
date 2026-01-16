const API = "https://nutriplan-api.vercel.app/api";


const sections = [
  document.getElementById("search-filters-section"),
  document.getElementById("meal-categories-section"),
  document.getElementById("all-recipes-section"),
];

const grid = document.getElementById("recipes-grid");
const count = document.getElementById("recipes-count");
const search = document.getElementById("search-input");

let onOpenDetails;


export function showMealsPage() {
  sections.forEach((s) => s && (s.style.display = "block"));
}

export function hideMealsPage() {
  sections.forEach((s) => s && (s.style.display = "none"));
}

export function initMeals(openDetails) {
  onOpenDetails = openDetails;
  fetchMeals();

  grid.onclick = (e) => {
    const card = e.target.closest(".recipe-card");
    if (!card) return;

    hideMealsPage();
    onOpenDetails(card.dataset.mealId);
  };

  //! SEARCH
  search.oninput = async (e) => {
    const q = e.target.value.trim();

    if (!q) {
      fetchMeals();
      return;
    }

    const res = await fetch(
      `${API}/meals/search?q=${encodeURIComponent(q)}&page=1&limit=25`
    );

    const data = await res.json();
    renderMeals(data.results || []);
  };
}

//! FETCH 
export async function fetchMeals() {
  const res = await fetch(
    `${API}/meals/search?q=&page=1&limit=25`
  );
  const data = await res.json();
  renderMeals(data.results || []);
}

//! FILTER
export async function fetchMealsByFilter(params) {
  const res = await fetch(
    `${API}/meals/filter?${params}&page=1&limit=25`
  );
  const data = await res.json();
  renderMeals(data.results || []);
}

export function renderMeals(meals) {
  grid.innerHTML = "";
  count.textContent = `Showing ${meals.length} recipes`;

  if (!meals.length) {
    grid.innerHTML = `
      <p class="col-span-full text-center text-gray-400">
        No meals found
      </p>
    `;
    return;
  }

  meals.forEach((meal) => {
    grid.innerHTML += `
      <div
        class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        data-meal-id="${meal.id}"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            src="${meal.thumbnail}"
            alt="${meal.name}"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <div class="absolute bottom-3 left-3 flex gap-2">
            <span class="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full">
              ${meal.category}
            </span>
            <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
              ${meal.area}
            </span>
          </div>
        </div>

        <div class="p-4">
          <h3 class="font-bold text-gray-900 mb-1 group-hover:text-emerald-600">
            ${meal.name}
          </h3>
          <p class="text-xs text-gray-600 mb-3">
            Delicious recipe to try!
          </p>
        </div>
      </div>
    `;
  });
}
