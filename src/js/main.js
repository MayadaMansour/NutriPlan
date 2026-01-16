import { initMeals, showMealsPage, hideMealsPage } from "./ui/meals.js";
import { openMealDetails, hideDetails } from "./ui/details.js";
import { renderFoodLog, initClearAll } from "./ui/foodLog.js";
import { loadAreasFilters, loadCategoriesGrid } from "./ui/filter.js";
import {
  loadProductsByCategory,
  initProductScanner,
} from "./ui/products.js";

document.addEventListener("DOMContentLoaded", () => {
  const scannerSection = document.getElementById("products-section");
  const foodLogSection = document.getElementById("foodlog-section");

  function hideAll() {
    hideMealsPage();
    hideDetails();
    scannerSection.style.display = "none";
    foodLogSection.style.display = "none";
  }

  window.goToFoodLog = () => {
    hideAll();
    foodLogSection.style.display = "block";
    renderFoodLog();
    initClearAll();
  };

  function initScanner() {
    hideAll();
    scannerSection.style.display = "block";
    initProductScanner();
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      hideAll();

      if (link.dataset.page === "meals") showMealsPage();
      if (link.dataset.page === "scanner") initScanner();
      if (link.dataset.page === "foodlog") window.goToFoodLog();
    };
  });

  document.getElementById("back-to-meals-btn").onclick = () => {
    hideDetails();
    showMealsPage();
  };

  hideAll();
  showMealsPage();
  initMeals(openMealDetails);
  loadAreasFilters();
  loadCategoriesGrid();
});
