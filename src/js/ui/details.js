import { addMealToFoodLog } from "./foodLog.js";

const API = "https://nutriplan-api.vercel.app/api";

let currentMeal;
let base;
let servings = 1;

export async function openMealDetails(id) {
  document.getElementById("meal-details").style.display = "block";

  const res = await fetch(`${API}/meals/${id}`);
  const data = await res.json();
  currentMeal = data.result;

  fillDetails(currentMeal);
}

export function hideDetails() {
  document.getElementById("meal-details").style.display = "none";
}

//! DETAILS
function fillDetails(meal) {
  document.querySelector("#meal-details img").src = meal.thumbnail;
  document.querySelector("#meal-details h1").textContent = meal.name;

  document.querySelector("#meal-details .bg-emerald-500").textContent =
    meal.category || "Meal";

  document.querySelector("#meal-details .bg-blue-500").textContent =
    meal.area || "Global";

  const calories = Math.floor(Math.random() * 200) + 350;
  base = {
    calories,
    protein: Math.floor(calories / 10),
    carbs: Math.floor(calories / 6),
    fat: Math.floor(calories / 20),
  };

  document.getElementById(
    "hero-calories"
  ).textContent = `${calories} cal/serving`;

  renderIngredients(meal.ingredients || []);
  renderInstructions(meal.instructions || []);
  renderVideo(meal.youtube);
  renderNutrition();

  document.getElementById("log-meal-btn").onclick = openModal;
}

function renderIngredients(ingredients) {
  const container = document.querySelector(
    "#meal-details .grid.grid-cols-1.md\\:grid-cols-2"
  );
  container.innerHTML = "";

  ingredients.forEach((item) => {
    container.innerHTML += `
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <input type="checkbox"
          class="w-5 h-5 text-emerald-600 rounded"/>
        <span class="text-gray-700">
          <span class="font-medium">${item.measure}</span>
          ${item.ingredient}
        </span>
      </div>
    `;
  });
}

function renderInstructions(steps) {
  const container = document.querySelector("#meal-details .space-y-4");
  container.innerHTML = "";

  steps.forEach((step, i) => {
    container.innerHTML += `
      <div class="flex gap-4 p-4 rounded-xl">
        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
          ${i + 1}
        </div>
        <p class="text-gray-700 pt-2">${step}</p>
      </div>
    `;
  });
}

//! VIDEO 
function renderVideo(url) {
  const iframe = document.querySelector("#meal-details iframe");

  if (!url) {
    iframe.parentElement.innerHTML = `
      <div class="flex items-center justify-center h-full text-gray-400">
        No video available
      </div>
    `;
    return;
  }

  const videoId = url.includes("v=") ? url.split("v=")[1] : "";
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
}

function renderNutrition() {
  const box = document.querySelector("#nutrition-facts-container");

  box.querySelector(".text-4xl").textContent = base.calories;
  box.querySelector(".text-xs").textContent =
    `Total: ${base.calories * 4} cal`;

  const values = box.querySelectorAll(".font-bold.text-gray-900");
  values[0].textContent = `${base.protein}g`;
  values[1].textContent = `${base.carbs}g`;
  values[2].textContent = `${base.fat}g`;
}

//! PARAGRAPH 
function openModal() {
  const modal = document.getElementById("log-meal-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  document.getElementById("modal-meal-name").textContent = currentMeal.name;
  document.getElementById("modal-meal-image").src = currentMeal.thumbnail;

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
    base.protein * servings + "g";
  document.getElementById("modal-carbs").textContent =
    base.carbs * servings + "g";
  document.getElementById("modal-fat").textContent =
    base.fat * servings + "g";
}

//! SAVE FOOD LOG 
function save() {
  addMealToFoodLog({
    name: currentMeal.name,
    image: currentMeal.thumbnail,
    servings,
    calories: base.calories * servings,
    protein: base.protein * servings,
    carbs: base.carbs * servings,
    fat: base.fat * servings,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: "Recipe",
  });

  close();

  Swal.fire({
    icon: "success",
    title: "Done",
    text: "Meal added to Food Log",
    timer: 1200,
    showConfirmButton: false,
  }).then(() => window.goToFoodLog());
}

function close() {
  document.getElementById("log-meal-modal").classList.add("hidden");
}
