import { addMealToFoodLog } from "./foodLog.js";

const API = "https://www.themealdb.com/api/json/v1/1";

let currentMeal;
let base;
let servings = 1;

/* =======================
   OPEN DETAILS
======================= */
export async function openMealDetails(id) {
  document.getElementById("meal-details").style.display = "block";

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
   FILL CONTENT
======================= */
function fillDetails(meal) {
  document.querySelector("#meal-details img").src = meal.strMealThumb;
  document.querySelector("#meal-details h1").textContent = meal.strMeal;

  const calories = Math.floor(Math.random() * 200) + 350;
  base = {
    calories,
    protein: Math.floor(calories / 10),
    carbs: Math.floor(calories / 6),
    fat: Math.floor(calories / 20),
  };

  document.getElementById("hero-calories").textContent =
    `${calories} cal/serving`;

  document.getElementById("log-meal-btn").onclick = openModal;
}

/* =======================
   MODAL
======================= */
function openModal() {
  const modal = document.getElementById("log-meal-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  document.getElementById("modal-meal-name").textContent =
    currentMeal.strMeal;
  document.getElementById("modal-meal-image").src =
    currentMeal.strMealThumb;

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
    image: currentMeal.strMealThumb,
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
  }).then(() => {
    window.goToFoodLog(); 
  });
}

function close() {
  document.getElementById("log-meal-modal").classList.add("hidden");
}
