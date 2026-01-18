import { addMealToFoodLog } from "./foodLog.js";

const API = "https://nutriplan-api.vercel.app/api";
const USDA_API_KEY = "xRGnhxcXrKuX8hJpeeQE5Rac9b7dyQDpaMs5fWFL";

let meal = null;
let nutrition = null;
let servings = 1;

export async function openMealDetails(id) {
  showDetails();

  const res = await fetch(`${API}/meals/${id}`);
  const data = await res.json();

  meal = data.result;
  await renderMealDetails();
}

export function hideDetails() {
  document.getElementById("meal-details").style.display = "none";
}

function showDetails() {
  document.getElementById("meal-details").style.display = "block";
}

async function renderMealDetails() {
  renderHeader();
  await loadNutrition();
  renderNutritionFacts();

  renderIngredients();
  renderInstructions();
  renderVideo();

  setupButtons();
}

function renderHeader() {
  document.querySelector("#meal-details img").src = meal.thumbnail;
  document.querySelector("#meal-details h1").textContent = meal.name;

  document.querySelector(".bg-emerald-500").textContent =
    meal.category || "Meal";

  document.querySelector(".bg-blue-500").textContent = meal.area || "Global";
}

//! NUTRITION
async function loadNutrition() {
  const res = await fetch(`${API}/nutrition/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": USDA_API_KEY,
    },
    body: JSON.stringify({
      recipeName: meal.name,
      ingredients: (meal.ingredients || []).map(
        (i) => `${i.measure} ${i.ingredient}`,
      ),
    }),
  });

  const json = await res.json();
  const per = json.data.perServing;

  nutrition = {
    calories: per.calories || 0,
    protein: per.protein || 0,
    carbs: per.carbs || 0,
    fat: per.fat || 0,
    fiber: per.fiber || 0,
    sugar: per.sugar || 0,
  };

  document.getElementById("hero-calories").textContent =
    nutrition.calories + " cal / serving";
}

function renderNutritionFacts() {
  setText("nf-calories", nutrition.calories);
  setText("nf-total-calories", `Total: ${nutrition.calories * servings} cal`);
  setText("nf-protein", nutrition.protein + "g");
  setText("nf-carbs", nutrition.carbs + "g");
  setText("nf-fat", nutrition.fat + "g");
  setText("nf-fiber", nutrition.fiber + "g");
  setText("nf-sugar", nutrition.sugar + "g");

  setBar("nf-protein-bar", nutrition.protein);
  setBar("nf-carbs-bar", nutrition.carbs);
  setBar("nf-fat-bar", nutrition.fat);
  setBar("nf-fiber-bar", nutrition.fiber);
  setBar("nf-sugar-bar", nutrition.sugar);
}

function renderIngredients() {
  const box = document.querySelector(
    "#meal-details .grid.grid-cols-1.md\\:grid-cols-2",
  );

  box.innerHTML = "";

  (meal.ingredients || []).forEach((item) => {
    box.innerHTML += `
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <input type="checkbox" class="w-5 h-5 text-emerald-600">
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
      <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50">
        <div class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
          ${i + 1}
        </div>
        <p>${step}</p>
      </div>
    `;
  });
}

//! VIDEO

function renderVideo() {
  const wrapper = document.querySelector(
    "#meal-details .relative.aspect-video",
  );

  if (!meal.youtube) {
    wrapper.innerHTML =
      "<div class='flex items-center justify-center h-full text-gray-400'>No video available</div>";
    return;
  }

  const videoId = meal.youtube.includes("v=")
    ? meal.youtube.split("v=")[1].split("&")[0]
    : meal.youtube.split("youtu.be/")[1];

  wrapper.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}"
      class="absolute inset-0 w-full h-full rounded-xl"
      allowfullscreen
    ></iframe>
  `;
}

function setupButtons() {
  document.getElementById("log-meal-btn").onclick = openModal;

  document.getElementById("meal-back-btn").onclick = () => {
    hideDetails();
    window.goToMeals();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

//! PARAGRAPH

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

function changeServing(value) {
  servings = Math.max(1, servings + value);
  updateModal();
}

function updateModal() {
  setText("servings-count", servings);
  setText("modal-calories", nutrition.calories * servings);
  setText("modal-protein", nutrition.protein * servings + "g");
  setText("modal-carbs", nutrition.carbs * servings + "g");
  setText("modal-fat", nutrition.fat * servings + "g");
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

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setBar(id, value) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.min(value * 2, 100) + "%";
}
