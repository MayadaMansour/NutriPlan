/* =======================
   HELPERS
======================= */
function todayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `foodlog_${year}-${month}-${day}`;
}

/* =======================
   ADD MEAL
======================= */
export function addMealToFoodLog(meal) {
  const key = todayKey();

  const data = JSON.parse(localStorage.getItem(key)) || {
    items: [],
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };

  data.items.push(meal);

  data.totals.calories += meal.calories;
  data.totals.protein += meal.protein;
  data.totals.carbs += meal.carbs;
  data.totals.fat += meal.fat;

  localStorage.setItem(key, JSON.stringify(data));
}

/* =======================
   RENDER FOOD LOG
======================= */
export function renderFoodLog() {
  const key = todayKey();
  const data = JSON.parse(localStorage.getItem(key));

  const list = document.getElementById("logged-items-list");
  if (!list) return;

  list.innerHTML = "";

  if (!data || !data.items || data.items.length === 0) {
    list.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page</p>
      </div>
    `;
    updateProgress("Calories", 0, 2000, ".bg-emerald-500");
    updateProgress("Protein", 0, 50, ".bg-blue-500");
    updateProgress("Carbs", 0, 250, ".bg-amber-500");
    updateProgress("Fat", 0, 65, ".bg-purple-500");
    return;
  }

  updateProgress("Calories", data.totals.calories, 2000, ".bg-emerald-500");
  updateProgress("Protein", data.totals.protein, 50, ".bg-blue-500");
  updateProgress("Carbs", data.totals.carbs, 250, ".bg-amber-500");
  updateProgress("Fat", data.totals.fat, 65, ".bg-purple-500");

  data.items.forEach((item) => {
    list.innerHTML += `
      <div class="flex items-center justify-between py-3 border-b last:border-0">
        <div class="flex items-center gap-3">
        <img
  src="${item.image}"
  class="w-12 h-12 rounded-lg object-cover bg-gray-100"
  loading="lazy"
  onerror="this.onerror=null;this.src='./src/images/meal-placeholder.png';"
/>
          <div>
            <p class="font-semibold">${item.name}</p>
            <p class="text-xs text-gray-500">
              ${item.servings} serving • ${item.type}
            </p>
            <p class="text-xs text-gray-400">${item.time}</p>
          </div>
        </div>

        <div class="text-right text-sm">
          <p class="font-bold text-emerald-600">${item.calories} kcal</p>
          <p class="text-xs text-gray-500">
            ${item.protein}g P · ${item.carbs}g C · ${item.fat}g F
          </p>
        </div>
      </div>
    `;
  });
}

/* =======================
   UPDATE PROGRESS
======================= */
function updateProgress(label, value, max, barClass) {
  const boxes = document.querySelectorAll("#foodlog-today-section > div > div");

  boxes.forEach((box) => {
    const title = box.querySelector("span.font-semibold");
    if (!title || title.textContent !== label) return;

    const text = box.querySelector(".text-gray-500");
    const bar = box.querySelector(barClass);

    if (!text || !bar) return;

    const percent = Math.min((value / max) * 100, 100);

    text.textContent = `${value} / ${max} ${
      label === "Calories" ? "kcal" : "g"
    }`;
    bar.style.width = percent + "%";
  });
}
