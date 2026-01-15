import { initMeals, showMealsPage, hideMealsPage } from "./ui/meals.js";
import { openMealDetails, hideDetails } from "./ui/details.js";
import { renderFoodLog } from "./ui/foodLog.js";

document.addEventListener("DOMContentLoaded", () => {
  const mealsSections = document.querySelectorAll(
    "#search-filters-section, #meal-categories-section, #all-recipes-section"
  );

  const scannerSection = document.getElementById("products-section");
  const foodLogSection = document.getElementById("foodlog-section");

  function hideAll() {
    hideMealsPage();
    hideDetails();
    scannerSection.style.display = "none";
    foodLogSection.style.display = "none";
  }

  // Sidebar
  document.querySelectorAll(".nav-link").forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      hideAll();

      const page = link.dataset.page;

      if (page === "meals") showMealsPage();
      if (page === "scanner") scannerSection.style.display = "block";
      if (page === "foodlog") {
        foodLogSection.style.display = "block";
        renderFoodLog();
      }
    };
  });

  // Back button
  document.getElementById("back-to-meals-btn").onclick = () => {
    hideDetails();
    showMealsPage();
  };

  // Default
  hideAll();
  showMealsPage();
  initMeals(openMealDetails);
});
