import { state, setSelectedPage } from "./state.js";
import {
  disableAllButtons,
  enableAllButtons,
  syncSelectedPage,
} from "./utils.js";
import { pushAction, isUndoRedoRunning } from "./undoRedo.js";

export function initSwipers() {
  state.swiper1 = new Swiper(".mySwiperh", {
    spaceBetween: 60,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    on: {
      slideChange: () => {
        if (!isUndoRedoRunning && state.swiper1) {
          pushAction({
            type: "slideChange",
            prev: { activeIndex: state.swiper1.previousIndex },
            next: { activeIndex: state.swiper1.activeIndex },
          });
        }
        disableAllButtons();
        if (state.swiper2) state.swiper2.slideTo(state.swiper1.activeIndex);
        syncSelectedPage(state.swiper1);
        enableAllButtons();
      },
    },
  });

  state.swiper2 = new Swiper(".mySwiperv", {
    direction: "vertical",
    spaceBetween: 50,
    slidesPerView: 2,
    on: {
      slideChange: () => {
        if (!isUndoRedoRunning && state.swiper2) {
          pushAction({
            type: "slideChange",
            prev: { activeIndex: state.swiper2.previousIndex },
            next: { activeIndex: state.swiper2.activeIndex },
          });
        }
        disableAllButtons();
        if (state.swiper1) state.swiper1.slideTo(state.swiper2.activeIndex);
        syncSelectedPage(state.swiper2);
        enableAllButtons();
      },
    },
  });

  if (state.swiper1 && state.swiper1.slides.length > 0) {
    setSelectedPage(state.swiper1.slides[0].id);
  }
}

export function updateNewSlideSelection() {
  document.querySelectorAll(".swiper-slideh").forEach((slide) => {
    slide.addEventListener("click", (e) => {
      if (e.target !== slide) return;
      setSelectedPage(slide.id);
      // Disable textareas inside slide
      const textareas = slide.querySelectorAll("textarea");
      textareas.forEach((ta) => {
        ta.style.border = "none";
        ta.style.resize = "none";
      });
    });
  });
}
