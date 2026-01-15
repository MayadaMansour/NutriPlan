import { initMeals, showMealsPage, hideMealsPage } from "./ui/meals.js";
import { openMealDetails, hideDetails } from "./ui/details.js";
import { renderFoodLog, initClearAll } from "./ui/foodLog.js";
import { loadAreasFilters, loadCategoriesGrid } from "./ui/filter.js";

document.addEventListener("DOMContentLoaded", () => {
  const scannerSection = document.getElementById("products-section");
  const foodLogSection = document.getElementById("foodlog-section");

  /* =======================
     HIDE ALL SECTIONS
  ======================= */
  function hideAll() {
    hideMealsPage();
    hideDetails();
    scannerSection.style.display = "none";
    foodLogSection.style.display = "none";
  }

  /* =======================
     FOOD LOG NAVIGATION
  ======================= */
  window.goToFoodLog = () => {
    hideAll();
    foodLogSection.style.display = "block";

    // 👇 مهم جدًا
    renderFoodLog();
    initClearAll();
  };

  /* =======================
     SIDEBAR NAVIGATION
  ======================= */
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      hideAll();

      const page = link.dataset.page;

      if (page === "meals") {
        showMealsPage();
      }

      if (page === "scanner") {
        scannerSection.style.display = "block";
      }

      if (page === "foodlog") {
        window.goToFoodLog();
      }
    });
  });

  /* =======================
     BACK FROM DETAILS
  ======================= */
  const backBtn = document.getElementById("back-to-meals-btn");
  if (backBtn) {
    backBtn.onclick = () => {
      hideDetails();
      showMealsPage();
    };
  }

  /* =======================
     INITIAL LOAD
  ======================= */
  hideAll();
  showMealsPage();

  initMeals(openMealDetails);
  loadAreasFilters();
  loadCategoriesGrid();
});
