// src/main.js
import { initDom } from "./dom.js";
import { initSwipers } from "./swiper-init.js";
import {
  initSlideManager,
  updateSlideSelection,
  reorderSlides,
} from "./slide-manager.js";
import { initTextControls } from "./text-controls.js";
import { initPDF } from "./pdf.js";
import { updateSelectedTextAreaResizable } from "./drag.js";
import { state } from "./state.js";
import { disableAllButtons, enableAllButtons } from "./utils.js";
import { undo, redo } from "./undoRedo.js";

// 1) collect DOM refs
initDom();

// 2) create swipers
initSwipers();

// 3) initialize slide manager (adds add/remove slide handlers)
initSlideManager();

// 4) set up slide selection for existing slides
updateSlideSelection();

// 5) initialize text controls (controller textarea, font controls, add/remove text)
initTextControls();

// 6) PDF
initPDF();

// 7) Mobile customize controls and modal wiring (these depend on state.dom existing)
if (state.dom) {
  state.dom.customizeBtn?.addEventListener("click", () => {
    document.querySelector(".mySwiperv").style.display = "none";
    document.querySelector("#customize").style.display = "block";
  });
  state.dom.custSaveBtn?.addEventListener("click", () => {
    document.querySelector(".mySwiperv").style.display = "block";
    document.querySelector("#customize").style.display = "none";
    reorderSlides();
  });
  state.dom.custCancelBtn?.addEventListener("click", () => {
    document.querySelector(".mySwiperv").style.display = "block";
    document.querySelector("#customize").style.display = "none";
  });

  // mobile
  state.dom.mobileBtn?.addEventListener("click", () => {
    document.getElementById("part3").style.display = "none";
    document.getElementById("part2").style.display = "none";
    state.dom.part1.style.display = "flex";
  });
  state.dom.mobileCloseBtn?.addEventListener("click", () => {
    state.dom.part1.style.display = "none";
    document.getElementById("part2").style.display = "block";
    document.getElementById("part3").style.display = "block";
  });
  window.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 900 &&
      state.dom.part1.style.display === "flex" &&
      !state.dom.part1.contains(e.target) &&
      e.target !== state.dom.mobileBtn
    ) {
      state.dom.part1.style.display = "none";
    }
  });
}

// Call this function to bind click on all horizontal slides
function disableTextareasOnSlideClick() {
  document.querySelectorAll(".swiper-slideh").forEach((slide) => {
    slide.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event from bubbling up

      // Only run if click is NOT on a textarea
      if (!e.target.classList.contains("textareas")) {
        slide.querySelectorAll(".textareas").forEach((ta) => {
          ta.style.resize = "none"; // make non-resizable
          ta.style.border = "none"; // remove border
        });

        // Optional: clear selected textarea
        selectedTextAre = null;
      }
    });
  });
}

// Initialize
disableTextareasOnSlideClick();


// Desktop buttons
state.dom.undoBtn = document.getElementById("undoBtn");
state.dom.redoBtn = document.getElementById("redoBtn");

// Mobile buttons
const undoBtnMbl = document.getElementById("undoBtnmbl");
const redoBtnMbl = document.getElementById("redoBtnmbl");

// Attach event listeners
[state.dom.undoBtn, undoBtnMbl].forEach(btn => btn?.addEventListener("click", undo));
[state.dom.redoBtn, redoBtnMbl].forEach(btn => btn?.addEventListener("click", redo));


// initial disable
// disableAllButtons();


// Keyboard shortcuts for undo/redo
window.addEventListener("keydown", (e) => {
  const tag = e.target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  const ctrl = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();

  if (ctrl && !e.shiftKey && key === "z") {
    e.preventDefault();
    undo();
  } 
  else if ((ctrl && key === "y") || (ctrl && e.shiftKey && key === "z")) {
    e.preventDefault();
    redo();
  }
});

