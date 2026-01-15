import { initMeals, showMealsPage, hideMealsPage } from "./ui/meals.js";
import { openMealDetails, hideDetails } from "./ui/details.js";
import { renderFoodLog } from "./ui/foodLog.js";

document.addEventListener("DOMContentLoaded", () => {
  const scannerSection = document.getElementById("products-section");
  const foodLogSection = document.getElementById("foodlog-section");

  function hideAll() {
    hideMealsPage();
    hideDetails();
    scannerSection.style.display = "none";
    foodLogSection.style.display = "none";
  }

  /* =======================
     GLOBAL NAVIGATION
  ======================= */
  window.goToFoodLog = () => {
    hideAll();
    foodLogSection.style.display = "block";
    renderFoodLog();
  };

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      hideAll();

      const page = link.dataset.page;

      if (page === "meals") showMealsPage();
      if (page === "scanner") scannerSection.style.display = "block";
      if (page === "foodlog") window.goToFoodLog();
    });
  });

  /* =======================
     BACK FROM DETAILS
  ======================= */
  document.getElementById("back-to-meals-btn").onclick = () => {
    hideDetails();
    showMealsPage();
  };

  hideAll();
  showMealsPage();

  initMeals(openMealDetails);
});
