import { initMeals, showMealsPage, hideMealsPage } from "./ui/meals.js";
import { openMealDetails, hideDetails } from "./ui/details.js";
import { renderFoodLog, initClearAll } from "./ui/foodLog.js";
import { loadAreasFilters, loadCategoriesGrid } from "./ui/filter.js";
import { initProductScanner } from "./ui/products.js";

document.addEventListener("DOMContentLoaded", () => {

  const scannerSection = document.getElementById("products-section");
  const foodLogSection = document.getElementById("foodlog-section");

  function hideAll() {
    hideMealsPage();
    hideDetails();

    if (scannerSection) scannerSection.style.display = "none";
    if (foodLogSection) foodLogSection.style.display = "none";
  }
  window.goToFoodLog = () => {
    hideAll();
    foodLogSection.style.display = "block";

    renderFoodLog();
    initClearAll();
  };

  function goToScanner() {
    hideAll();
    scannerSection.style.display = "block";

    initProductScanner();
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      hideAll();

      const page = link.dataset.page;

      switch (page) {
        case "meals":
          showMealsPage();
          break;

        case "scanner":
          goToScanner();
          break;

        case "foodlog":
          window.goToFoodLog();
          break;
      }
    });
  });
  document
    .getElementById("back-to-meals-btn")
    ?.addEventListener("click", () => {
      hideDetails();
      showMealsPage();
    });
  hideAll();
  showMealsPage();
  initMeals(openMealDetails);
  loadAreasFilters();
  loadCategoriesGrid();
});
