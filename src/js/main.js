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
    scannerSection.style.display = "none";
    foodLogSection.style.display = "none";
  }

  window.goToMeals = () => {
    hideAll();
    showMealsPage();
  };

  window.goToScanner = () => {
    hideAll();
    scannerSection.style.display = "block";
    initProductScanner();
  };

  window.goToFoodLog = () => {
    hideAll();
    foodLogSection.style.display = "block";
    renderFoodLog();
    initClearAll();
  };

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      if (link.dataset.page === "meals") goToMeals();
      if (link.dataset.page === "scanner") goToScanner();
      if (link.dataset.page === "foodlog") goToFoodLog();
    };
  });

  hideAll();
  showMealsPage();
  initMeals(openMealDetails);
  loadAreasFilters();
  loadCategoriesGrid();
});
