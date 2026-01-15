/* =======================
   HELPERS
======================= */
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `foodlog_${y}-${m}-${day}`;
}

function getEmptyDay() {
  return {
    items: [],
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
}

/* =======================
   TODAY DATE
======================= */
function renderTodayDate() {
  const el = document.getElementById("foodlog-date");
  if (!el) return;

  const today = new Date();
  el.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/* =======================
   ADD MEAL
======================= */
export function addMealToFoodLog(meal) {
  const key = todayKey();
  const data = JSON.parse(localStorage.getItem(key)) || getEmptyDay();

  data.items.push(meal);

  data.totals.calories += meal.calories;
  data.totals.protein += meal.protein;
  data.totals.carbs += meal.carbs;
  data.totals.fat += meal.fat;

  localStorage.setItem(key, JSON.stringify(data));
  renderFoodLog();
}

/* =======================
   DELETE SINGLE ITEM
======================= */
window.deleteFoodLogItem = function (index) {
  const key = todayKey();
  const data = JSON.parse(localStorage.getItem(key));
  if (!data) return;

  const item = data.items[index];

  data.totals.calories -= item.calories;
  data.totals.protein -= item.protein;
  data.totals.carbs -= item.carbs;
  data.totals.fat -= item.fat;

  data.items.splice(index, 1);

  data.items.length === 0
    ? localStorage.removeItem(key)
    : localStorage.setItem(key, JSON.stringify(data));

  renderFoodLog();
};

/* =======================
   CLEAR ALL (FULL RESET)
======================= */
export function initClearAll() {
 
  const btn = document.getElementById("clear-foodlog");
  if (!btn) return;

  btn.onclick = () => {
    Swal.fire({
      title: "Clear all data?",
      text: "This will delete ALL saved food log data",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear all",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("foodlog_")) {
            localStorage.removeItem(key);
          }
        });

        renderFoodLog(); 
      }
    });
  };
}


/* =======================
   RENDER FOOD LOG
======================= */
export function renderFoodLog() {
  const key = todayKey();
  const data = JSON.parse(localStorage.getItem(key));

  const list = document.getElementById("logged-items-list");
  const title = document.querySelector("#foodlog-today-section h4");
  const clearBtn = document.getElementById("clear-foodlog");

  if (!list) return;
  list.innerHTML = "";

  if (!data || data.items.length === 0) {
    title.textContent = "Logged Items (0)";
    clearBtn.style.display = "none";

    list.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page</p>
      </div>
    `;

    updateProgress(0, 2000, ".bg-emerald-500", "Calories");
    updateProgress(0, 50, ".bg-blue-500", "Protein");
    updateProgress(0, 250, ".bg-amber-500", "Carbs");
    updateProgress(0, 65, ".bg-purple-500", "Fat");

    updateWeeklyStats();
    renderWeeklyOverview();
    return;
  }

  title.textContent = `Logged Items (${data.items.length})`;
  clearBtn.style.display = "inline-block";

  updateProgress(data.totals.calories, 2000, ".bg-emerald-500", "Calories");
  updateProgress(data.totals.protein, 50, ".bg-blue-500", "Protein");
  updateProgress(data.totals.carbs, 250, ".bg-amber-500", "Carbs");
  updateProgress(data.totals.fat, 65, ".bg-purple-500", "Fat");

  data.items.forEach((item, index) => {
    list.innerHTML += `
      <div class="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover" />
          <div>
            <p class="font-bold">${item.name}</p>
            <p class="text-sm text-gray-500">
              ${item.servings} serving • <span class="text-emerald-600">${item.type}</span>
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

          <button onclick="deleteFoodLogItem(${index})" class="text-gray-400 hover:text-red-500">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  updateWeeklyStats();
  renderWeeklyOverview();
}

/* =======================
   PROGRESS BARS
======================= */
function updateProgress(value, max, barClass, label) {
  document.querySelectorAll("#foodlog-today-section .rounded-xl").forEach((box) => {
    const title = box.querySelector("span.font-semibold");
    if (!title || title.textContent !== label) return;

    const text = box.querySelector(".text-gray-500");
    const bar = box.querySelector(barClass);
    const percent = Math.min((value / max) * 100, 100);

    text.textContent = `${value} / ${max} ${label === "Calories" ? "kcal" : "g"}`;
    bar.style.width = percent + "%";
  });
}

/* =======================
   WEEKLY DATA
======================= */
function getWeeklyData() {
  const today = new Date();
  const week = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const key = `foodlog_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

/* =======================
   WEEKLY OVERVIEW
======================= */
function renderWeeklyOverview() {
  const container = document.getElementById("weekly-chart");
  if (!container) return;

  const week = getWeeklyData();

  container.innerHTML = `
    <div class="grid grid-cols-7 gap-3 w-full">
      ${week.map(d => `
        <div class="text-center p-3 rounded-xl ${d.isToday ? "bg-indigo-100" : ""}">
          <p class="text-xs text-gray-500">${d.day}</p>
          <p class="font-semibold">${d.date}</p>
          <p class="mt-2 font-bold ${d.calories ? "text-emerald-600" : "text-gray-300"}">
            ${d.calories}
          </p>
          <p class="text-xs text-gray-400">kcal</p>
          ${d.items ? `<p class="text-xs text-gray-500">${d.items} items</p>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

/* =======================
   WEEKLY STATS
======================= */
function updateWeeklyStats() {
  const week = getWeeklyData();
  const totalCalories = week.reduce((s, d) => s + d.calories, 0);
  const totalItems = week.reduce((s, d) => s + d.items, 0);

  const avg = document.querySelector(".weekly-average");
  const items = document.querySelector(".weekly-items");

  if (avg) avg.textContent = `${Math.round(totalCalories / 7)} kcal`;
  if (items) items.textContent = `${totalItems} items`;
}

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {
  initClearAll();
  renderTodayDate();
  renderFoodLog();
});
