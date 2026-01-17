
window.goToMeals = function () {
  if (typeof hideDetails === "function") hideDetails();
  if (typeof showMealsPage === "function") showMealsPage();
};
window.goToScanner = function () {
  if (typeof hideMealsPage === "function") hideMealsPage();
  if (typeof hideDetails === "function") hideDetails();

  const scannerSection = document.getElementById("products-section");
  if (scannerSection) scannerSection.style.display = "block";

  if (typeof initProductScanner === "function") {
    initProductScanner();
  }
};
document.addEventListener("click", (e) => {
  if (e.target.closest("#go-to-meals")) {
    window.goToMeals();
  }

  if (e.target.closest("#go-to-scanner")) {
    window.goToScanner();
  }
});

function todayKey() {
  const d = new Date();
  return `foodlog_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function emptyDay() {
  return {
    items: [],
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
}

function getDayData() {
  return JSON.parse(localStorage.getItem(todayKey())) || emptyDay();
}

function saveDayData(data) {
  localStorage.setItem(todayKey(), JSON.stringify(data));
}

//!  TODAY DATE

function renderTodayDate() {
  const el = document.getElementById("foodlog-date");
  if (!el) return;

  el.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

//! ADD MEAL


export function addMealToFoodLog(meal) {
  const data = getDayData();

  data.items.push(meal);
  data.totals.calories += meal.calories;
  data.totals.protein += meal.protein;
  data.totals.carbs += meal.carbs;
  data.totals.fat += meal.fat;

  saveDayData(data);
  renderFoodLog();

  if (window.showDoneMessage) {
    window.showDoneMessage("Added to Food Log");
  }
}


//! DELETE MEAL

window.deleteFoodLogItem = function (index) {
  const data = getDayData();
  const item = data.items[index];

  data.totals.calories -= item.calories;
  data.totals.protein -= item.protein;
  data.totals.carbs -= item.carbs;
  data.totals.fat -= item.fat;

  data.items.splice(index, 1);

  data.items.length === 0
    ? localStorage.removeItem(todayKey())
    : saveDayData(data);

  renderFoodLog();
};

//! CLEAR ALL

export function initClearAll() {
  const btn = document.getElementById("clear-foodlog");
  if (!btn) return;
  btn.onclick = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("foodlog_")) {
        localStorage.removeItem(key);
      }
    });

    renderFoodLog();
  };
}


//! RENDER FOOD LOG

export function renderFoodLog() {
  const data = getDayData();
  const list = document.getElementById("logged-items-list");
  const title = document.querySelector("#foodlog-today-section h4");
  const clearBtn = document.getElementById("clear-foodlog");

  if (!list) return;
  list.innerHTML = "";

  if (!data.items.length) {
    title.textContent = "Logged Items (0)";
    clearBtn.style.display = "none";

    resetProgress();
    renderWeeklyOverview();
    updateWeeklyStats();

    list.innerHTML = emptyStateHTML();
    return;
  }

  title.textContent = `Logged Items (${data.items.length})`;
  clearBtn.style.display = "inline-block";

  updateAllProgress(data.totals);

  data.items.forEach((item, i) => {
    list.innerHTML += itemHTML(item, i);
  });

  renderWeeklyOverview();
  updateWeeklyStats();
}


function itemHTML(item, index) {
  return `
 <div class="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover" />
          <div>
            <p class="font-bold">${item.name}</p>
            <p class="text-sm text-gray-500">
              ${item.servings} serving • 
              <span class="text-emerald-600">${item.type}</span>
            </p>
            <p class="text-xs text-gray-400">${item.time}</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-lg font-bold text-emerald-600">${item.calories}</p>
            <p class="text-xs text-gray-500">kcal</p>
          </div>

          <div class="flex gap-2 text-xs">
            <span class="bg-blue-50 px-2 py-1 rounded">${item.protein}g P</span>
            <span class="bg-amber-50 px-2 py-1 rounded">${item.carbs}g C</span>
            <span class="bg-purple-50 px-2 py-1 rounded">${item.fat}g F</span>
          </div>

          <button
            onclick="deleteFoodLogItem(${index})"
            class="text-gray-400 hover:text-red-500"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
  `;
}

function emptyStateHTML() {
  return `
        <div class="text-center py-10 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-4 text-gray-300"></i>

        <p class="font-medium text-base mb-1">
          No meals logged today
        </p>

        <p class="text-sm mb-6">
          Add meals from the Meals page or scan products
        </p>

        <div class="flex justify-center gap-4">
          <button
            id="go-to-meals"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <i class="fa-solid fa-plus"></i>
            Browse Recipes
          </button>

          <button
            id="go-to-scanner"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <i class="fa-solid fa-barcode"></i>
            Scan Product
          </button>
        </div>
      </div>
  `;
}


function updateAllProgress(t) {
  updateProgress(t.calories, 2000, ".bg-emerald-500", "Calories");
  updateProgress(t.protein, 50, ".bg-blue-500", "Protein");
  updateProgress(t.carbs, 250, ".bg-amber-500", "Carbs");
  updateProgress(t.fat, 65, ".bg-purple-500", "Fat");
}

function resetProgress() {
  updateAllProgress({ calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function updateProgress(value, max, barClass, label) {
  document
    .querySelectorAll("#foodlog-today-section .rounded-xl")
    .forEach((box) => {
      const title = box.querySelector("span.font-semibold");
      if (!title || title.textContent !== label) return;

      const text = box.querySelector(".text-gray-500");
      const bar = box.querySelector(barClass);

      const percent = Math.min((value / max) * 100, 100);
      text.textContent = `${value} / ${max} ${
        label === "Calories" ? "kcal" : "g"
      }`;
      bar.style.width = percent + "%";
    });
}

//! WEEKLY

function getWeeklyData() {
  const today = new Date();
  const week = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const key = `foodlog_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;

    const data = JSON.parse(localStorage.getItem(key));

    week.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      calories: data?.totals.calories || 0,
      items: data?.items.length || 0,
      isToday: i === 0,
    });
  }

  return week;
}

function renderWeeklyOverview() {
  const container = document.getElementById("weekly-chart");
  if (!container) return;

  const week = getWeeklyData();

  container.innerHTML = `
    <div class="grid grid-cols-7 gap-3 w-full">
      ${week
        .map(
          (d) => `
        <div class="text-center p-3 rounded-xl ${
          d.isToday ? "bg-indigo-100" : ""
        }">
          <p class="text-xs text-gray-500">${d.day}</p>
          <p class="font-semibold">${d.date}</p>
          <p class="mt-2 font-bold ${
            d.calories ? "text-emerald-600" : "text-gray-300"
          }">
            ${d.calories}
          </p>
          <p class="text-xs text-gray-400">kcal</p>
          ${
            d.items
              ? `<p class="text-xs text-gray-500">${d.items} items</p>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function updateWeeklyStats() {
  const week = getWeeklyData();
  const totalCalories = week.reduce((s, d) => s + d.calories, 0);
  const totalItems = week.reduce((s, d) => s + d.items, 0);

  const avg = document.querySelector(".weekly-average");
  const items = document.querySelector(".weekly-items");

  if (avg) avg.textContent = `${Math.round(totalCalories / 7)} kcal`;
  if (items) items.textContent = `${totalItems} items`;
}

document.addEventListener("DOMContentLoaded", () => {
  initClearAll();
  renderTodayDate();
  renderFoodLog();
});
