import { addMealToFoodLog } from "./foodLog.js";

const API = "https://www.themealdb.com/api/json/v1/1";

let currentMeal;
let base;
let servings = 1;

/* =======================
   OPEN DETAILS
======================= */
export async function openMealDetails(id) {
  const section = document.getElementById("meal-details");
  section.style.display = "block";

  const res = await fetch(`${API}/lookup.php?i=${id}`);
  currentMeal = (await res.json()).meals[0];

  fillDetails(currentMeal);
}

/* =======================
   HIDE DETAILS
======================= */
export function hideDetails() {
  document.getElementById("meal-details").style.display = "none";
}

/* =======================
   FILL PAGE CONTENT
======================= */
function fillDetails(meal) {
  /* IMAGE */
  document.querySelector("#meal-details img").src = meal.strMealThumb;

  /* TITLE */
  document.querySelector("#meal-details h1").textContent = meal.strMeal;

  /* VIDEO */
  const iframe = document.querySelector("#meal-details iframe");
  iframe.src = meal.strYoutube
    ? "https://www.youtube.com/embed/" + meal.strYoutube.split("v=")[1]
    : "";

  /* INGREDIENTS */
  const grid = document.querySelector(
    "#meal-details .grid.grid-cols-1.md\\:grid-cols-2"
  );
  grid.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const mea = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      grid.innerHTML += `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <input type="checkbox" class="w-5 h-5">
          <span><strong>${mea}</strong> ${ing}</span>
        </div>
      `;
    }
  }

  /* INSTRUCTIONS */
  const steps = document.querySelector("#meal-details .space-y-4");
  steps.innerHTML = "";

  meal.strInstructions
    .split(".")
    .filter(s => s.trim())
    .forEach((step, i) => {
      steps.innerHTML += `
        <div class="flex gap-4 p-4">
          <div class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
            ${i + 1}
          </div>
          <p class="pt-2">${step}.</p>
        </div>
      `;
    });

  /* MOCK NUTRITION */
  const calories = Math.floor(Math.random() * 200) + 350;
  base = {
    calories,
    protein: Math.floor(calories / 10),
    carbs: Math.floor(calories / 6),
    fat: Math.floor(calories / 20),
  };

  document.getElementById("hero-calories").textContent =
    `${calories} cal/serving`;

  updateNutritionUI(base);

  /* LOG BUTTON */
  document.getElementById("log-meal-btn").onclick = openModal;
}

/* =======================
   UPDATE NUTRITION BOX
======================= */
function updateNutritionUI(nutrition) {
  const box = document.getElementById("nutrition-facts-container");
  if (!box) return;

  box.querySelector(".text-4xl").textContent = nutrition.calories;
  box.querySelectorAll(".font-bold")[1].textContent =
    `${nutrition.protein}g`;
  box.querySelectorAll(".font-bold")[2].textContent =
    `${nutrition.carbs}g`;
  box.querySelectorAll(".font-bold")[3].textContent =
    `${nutrition.fat}g`;
}

/* =======================
   MODAL
======================= */
function openModal() {
  const modal = document.getElementById("log-meal-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  servings = 1;
  updateModal();

  document.getElementById("serving-plus").onclick = () => change(1);
  document.getElementById("serving-minus").onclick = () => change(-1);
  document.getElementById("cancel-log").onclick = close;
  document.getElementById("confirm-log").onclick = save;
}

function change(d) {
  servings = Math.max(1, servings + d);
  updateModal();
}

function updateModal() {
  document.getElementById("servings-count").textContent = servings;
  document.getElementById("modal-calories").textContent =
    base.calories * servings;
  document.getElementById("modal-protein").textContent =
    base.protein * servings;
  document.getElementById("modal-carbs").textContent =
    base.carbs * servings;
  document.getElementById("modal-fat").textContent =
    base.fat * servings;
}

/* =======================
   SAVE
======================= */
function save() {
  addMealToFoodLog({
    name: currentMeal.strMeal,
    servings,
    calories: base.calories * servings,
    protein: base.protein * servings,
    carbs: base.carbs * servings,
    fat: base.fat * servings,
  });

  close();

  Swal.fire({
    icon: "success",
    title: "Done",
    text: "Meal added to Food Log",
    timer: 2000,
    showConfirmButton: false,
  });
}

function close() {
  document.getElementById("log-meal-modal").classList.add("hidden");
}
