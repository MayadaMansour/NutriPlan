// // import { MealDetails } from "./details.js";

// // const API = "https://www.themealdb.com/api/json/v1/1";

// // export class Meals {
// //   constructor(details) {
// //     this.details = details;

// //     this.recipesGrid = document.getElementById("recipes-grid");
// //     this.recipesCount = document.getElementById("recipes-count");
// //     this.searchInput = document.getElementById("search-input");

// //     this.homeSections = [
// //       document.getElementById("search-filters-section"),
// //       document.getElementById("meal-categories-section"),
// //       document.getElementById("all-recipes-section"),
// //     ];
// //   }

// //   /* =======================
// //      INIT
// //   ======================= */
// //   init() {
// //     this.showHome();
// //     this.details.hide();
// //     this.fetchInitialMeals();
// //     this.initSearch();
// //     this.initCategoryFilters();
// //   }

// //   /* =======================
// //      HOME VISIBILITY
// //   ======================= */
// //   hideHome() {
// //     this.homeSections.forEach((sec) => (sec.style.display = "none"));
// //   }

// //   showHome() {
// //     this.homeSections.forEach((sec) => (sec.style.display = "block"));
// //   }

// //   /* =======================
// //      LOADING
// //   ======================= */
// //   showLoading() {
// //     this.recipesGrid.innerHTML = `
// //       <div class="flex items-center justify-center py-12 col-span-full">
// //         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
// //       </div>
// //     `;
// //   }

// //   /* =======================
// //      FETCH
// //   ======================= */
// //   async fetchInitialMeals() {
// //     this.showLoading();
// //     const res = await fetch(`${API}/search.php?s=`);
// //     const data = await res.json();
// //     this.renderMeals(data.meals?.slice(0, 25) || []);
// //   }

// //   /* ======================= RENDER ======================= */
// //   renderMeals(meals) {
// //     this.recipesGrid.innerHTML = "";
// //     this.recipesCount.textContent = `Showing ${meals.length} recipes`;

// //     meals.forEach((meal) => {
// //       this.recipesGrid.innerHTML += `
// //       <div
// //         class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
// //         data-meal-id="${meal.idMeal}"
// //       >
// //        <div class="relative h-48 overflow-hidden"> <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> <div class="absolute bottom-3 left-3 flex gap-2"> <span class="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full"> ${meal.strCategory} </span> <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"> ${meal.strArea} </span> </div> </div> <div class="p-4"> <h3 class="font-bold text-gray-900 mb-1 group-hover:text-emerald-600"> ${meal.strMeal} </h3> <p class="text-xs text-gray-600 mb-3">Delicious recipe to try!</p> </div> </div>
// //     `;
// //     });

// //     this.recipesGrid.querySelectorAll(".recipe-card").forEach((card) => {
// //       card.onclick = () => {
// //         this.hideHome();
// //         this.details.open(card.dataset.mealId);
// //       };
// //     });
// //   }

// //   /* =======================SEARCH======================= */
// //   initSearch() {
// //     this.searchInput.addEventListener("input", async (e) => {
// //       const value = e.target.value.trim();
// //       if (!value) return this.fetchInitialMeals();

// //       this.showLoading();
// //       const res = await fetch(`${API}/search.php?s=${value}`);
// //       const data = await res.json();
// //       this.renderMeals(data.meals || []);
// //     });
// //   }

// //   /* =======================CATEGORY ======================= */
// //   initCategoryFilters() {
// //     document.querySelectorAll(".category-card").forEach((card) => {
// //       card.onclick = async () => {
// //         this.showLoading();

// //         const res = await fetch(`${API}/filter.php?c=${card.dataset.category}`);
// //         const data = await res.json();

// //         if (!data.meals) return this.renderMeals([]);

// //         const meals = await Promise.all(
// //           data.meals.slice(0, 25).map((m) =>
// //             fetch(`${API}/lookup.php?i=${m.idMeal}`)
// //               .then((r) => r.json())
// //               .then((d) => d.meals[0])
// //           )
// //         );

// //         this.renderMeals(meals);
// //       };
// //     });
// //   }
// // }

// const API = "https://www.themealdb.com/api/json/v1/1";

// const sections = [
//   document.getElementById("search-filters-section"),
//   document.getElementById("meal-categories-section"),
//   document.getElementById("all-recipes-section"),
// ];

// const grid = document.getElementById("recipes-grid");
// const count = document.getElementById("recipes-count");
// const search = document.getElementById("search-input");

// export function showMealsPage() {
//   sections.forEach((s) => (s.style.display = "block"));
// }

// export function hideMealsPage() {
//   sections.forEach((s) => (s.style.display = "none"));
// }

// export function initMeals(onOpenDetails) {
//   fetchMeals();

//   grid.onclick = (e) => {
//     const card = e.target.closest(".recipe-card");
//     if (!card) return;

//     hideMealsPage();
//     onOpenDetails(card.dataset.mealId);
//   };

//   search.oninput = async (e) => {
//     const q = e.target.value.trim();
//     if (!q) return fetchMeals();

//     const res = await fetch(`${API}/search.php?s=${q}`);
//     const data = await res.json();
//     renderMeals(data.meals || []);
//   };
// }

// async function fetchMeals() {
//   const res = await fetch(`${API}/search.php?s=`);
//   const data = await res.json();
//   renderMeals(data.meals.slice(0, 25));
// }

// function renderMeals(meals) {
//   grid.innerHTML = "";
//   count.textContent = `Showing ${meals.length} recipes`;

//   meals.forEach((meal) => {
//     grid.innerHTML += `
//        <div
//          class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
//          data-meal-id="${meal.idMeal}"
//       >
//         <div class="relative h-48 overflow-hidden"> <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> <div class="absolute bottom-3 left-3 flex gap-2"> <span class="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full"> ${meal.strCategory} </span> <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"> ${meal.strArea} </span> </div> </div> <div class="p-4"> <h3 class="font-bold text-gray-900 mb-1 group-hover:text-emerald-600"> ${meal.strMeal} </h3> <p class="text-xs text-gray-600 mb-3">Delicious recipe to try!</p> </div> </div>

//     `;
//   });
// }
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
