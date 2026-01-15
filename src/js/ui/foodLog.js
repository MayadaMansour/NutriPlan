// function todayKey() {
//   return "foodlog_" + new Date().toISOString().split("T")[0];
// }

// export function addMealToFoodLog(meal) {
//   const key = todayKey();

//   const data =
//     JSON.parse(localStorage.getItem(key)) || {
//       items: [],
//       totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
//     };

//   data.items.push(meal);

//   data.totals.calories += meal.calories;
//   data.totals.protein += meal.protein;
//   data.totals.carbs += meal.carbs;
//   data.totals.fat += meal.fat;

//   localStorage.setItem(key, JSON.stringify(data));
// }

// export function renderFoodLog() {
//   const key = todayKey();
//   const data = JSON.parse(localStorage.getItem(key));

//   if (!data) return;

//   document.querySelector("#logged-items-list").innerHTML = "";

//   data.items.forEach(item => {
//     document.querySelector("#logged-items-list").innerHTML += `
//       <div class="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
//         <div>
//           <p class="font-semibold">${item.name}</p>
//           <p class="text-xs text-gray-500">${item.servings} serving</p>
//         </div>
//         <div class="text-right text-sm">
//           <p class="font-bold text-emerald-600">${item.calories} kcal</p>
//           <p class="text-gray-500">${item.protein}P ${item.carbs}C ${item.fat}F</p>
//         </div>
//       </div>
//     `;
//   });
// }


function todayKey() {
  return "foodlog_" + new Date().toISOString().split("T")[0];
}

export function addMealToFoodLog(meal) {
  const key = todayKey();
  const data = JSON.parse(localStorage.getItem(key)) || [];
  data.push(meal);
  localStorage.setItem(key, JSON.stringify(data));
}

export function renderFoodLog() {
  const key = todayKey();
  const data = JSON.parse(localStorage.getItem(key)) || [];

  const list = document.getElementById("logged-items-list");
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = `<p class="text-gray-500">No meals logged</p>`;
    return;
  }

  data.forEach(item => {
    list.innerHTML += `
      <div class="bg-gray-50 p-3 rounded-xl flex justify-between">
        <div>
          <p class="font-semibold">${item.name}</p>
          <p class="text-xs">${item.servings} serving</p>
        </div>
        <p class="font-bold">${item.calories} kcal</p>
      </div>
    `;
  });
}
