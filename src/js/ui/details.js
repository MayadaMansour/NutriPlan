import { addMealToFoodLog } from "./foodLog.js";

const API = "https://nutriplan-api.vercel.app/api";

let meal = null;
let nutrition = null;
let servings = 1;

//! CLOSE DETAILS

export async function openMealDetails(id) {
  document.getElementById("meal-details").style.display = "block";

  const res = await fetch(`${API}/meals/${id}`);
  const data = await res.json();

  meal = data.result;
  renderMealDetails();
}

export function hideDetails() {
  document.getElementById("meal-details").style.display = "none";
}

//! RENDER MEAL

function renderMealDetails() {
  document.querySelector("#meal-details img").src = meal.thumbnail;
  document.querySelector("#meal-details h1").textContent = meal.name;

  document.querySelector(".bg-emerald-500").textContent =
    meal.category || "Meal";
  document.querySelector(".bg-blue-500").textContent = meal.area || "Global";

  const calories = Math.floor(Math.random() * 200) + 350;
  nutrition = {
    calories,
    protein: Math.floor(calories / 10),
    carbs: Math.floor(calories / 6),
    fat: Math.floor(calories / 20),
  };

  document.getElementById("hero-calories").textContent =
    calories + " cal / serving";

  renderIngredients();
  renderInstructions();
  renderVideo();

  document.getElementById("log-meal-btn").onclick = openModal;

  const backBtn = document.getElementById("meal-back-btn");
  if (backBtn) {
    backBtn.onclick = function () {
      hideDetails();
      window.goToMeals();
    };
  }
}

function renderIngredients() {
  const box = document.querySelector(
    "#meal-details .grid.grid-cols-1.md\\:grid-cols-2"
  );

  box.innerHTML = "";

  (meal.ingredients || []).forEach((item) => {
    box.innerHTML += `
      <div class="flex gap-2 p-2 bg-gray-50 rounded">
        <input type="checkbox">
        <span>${item.measure} ${item.ingredient}</span>
      </div>
    `;
  });
}

function renderInstructions() {
  const box = document.querySelector("#meal-details .space-y-4");
  box.innerHTML = "";

  (meal.instructions || []).forEach((step, i) => {
    box.innerHTML += `
      <div class="flex gap-3">
        <div class="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center">
          ${i + 1}
        </div>
        <p>${step}</p>
      </div>
    `;
  });
}

function renderVideo() {
  const iframe = document.querySelector("#meal-details iframe");

  if (!meal.youtube) {
    iframe.parentElement.innerHTML =
      "<div class='text-gray-400 text-center'>No video available</div>";
    return;
  }

  let videoId = "";

  if (meal.youtube.includes("v=")) {
    videoId = meal.youtube.split("v=")[1].split("&")[0];
  } else if (meal.youtube.includes("youtu.be")) {
    videoId = meal.youtube.split("youtu.be/")[1];
  }

  iframe.src = `https://www.youtube.com/embed/${videoId}`;
}

function openModal() {
  const modal = document.getElementById("log-meal-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  document.getElementById("modal-meal-name").textContent = meal.name;
  document.getElementById("modal-meal-image").src = meal.thumbnail;

  servings = 1;
  updateModal();

  document.getElementById("serving-plus").onclick = () => changeServing(1);
  document.getElementById("serving-minus").onclick = () => changeServing(-1);
  document.getElementById("cancel-log").onclick = closeModal;
  document.getElementById("confirm-log").onclick = saveMeal;
}

function changeServing(num) {
  servings = Math.max(1, servings + num);
  updateModal();
}

function updateModal() {
  document.getElementById("servings-count").textContent = servings;
  document.getElementById("modal-calories").textContent =
    nutrition.calories * servings;
  document.getElementById("modal-protein").textContent =
    nutrition.protein * servings + "g";
  document.getElementById("modal-carbs").textContent =
    nutrition.carbs * servings + "g";
  document.getElementById("modal-fat").textContent =
    nutrition.fat * servings + "g";
}

function closeModal() {
  document.getElementById("log-meal-modal").classList.add("hidden");
}

//! SAVE
function saveMeal() {
  addMealToFoodLog({
    name: meal.name,
    image: meal.thumbnail,
    servings,
    calories: nutrition.calories * servings,
    protein: nutrition.protein * servings,
    carbs: nutrition.carbs * servings,
    fat: nutrition.fat * servings,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: "Recipe",
  });

  closeModal();
}
