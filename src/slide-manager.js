// src/slide-manager.js
import { state, setSelectedPage } from "./state.js";
import { enableAllButtons } from "./utils.js";
import { updateNewSlideSelection } from "./swiper-init.js";

// Call it to attach listeners
updateSlideSelection();

/** Reorder logic (called from customize save) */
export function reorderSlides() {
  const newOrder = Array.from(
    document.querySelectorAll("#custdiv1 .custitem")
  ).map((el) => el.dataset.index);
  const reorderWrapper = (wrapperSelector) => {
    const wrapper = document.querySelector(wrapperSelector);
    const reordered = newOrder.map((index) =>
      wrapper.querySelector(`[data-index="${index}"]`)
    );
    reordered.forEach((slide) => slide && wrapper.appendChild(slide));
  };
  reorderWrapper(".swiper-wrapperh");
  reorderWrapper(".swiper-wrapperv");
  if (state.swiper1) state.swiper1.update();
  if (state.swiper2) state.swiper2.update();
}

/** Attach click selection behavior for slides */
export function updateSlideSelection() {
  document.querySelectorAll(".swiper-slideh").forEach((slide) => {
    slide.addEventListener("click", () => {
      setSelectedPage(slide.id);
      enableAllButtons();
    });
  });
}

/** Add / Remove slides (file-based add) */
export function initSlideManager() {
  const imageInput = document.getElementById("imageInput");
  const addImageBtn = document.getElementById("addimage");

  addImageBtn.addEventListener("click", () => imageInput.click());

  imageInput.onchange = () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const swiperWrapperh = document.querySelector(".swiper-wrapperh");
      const swiperWrapperv = document.querySelector(".swiper-wrapperv");
      const custDiv = document.getElementById("custdiv1");

      const newIndex = swiperWrapperh.children.length + 1;

      // Horizontal
      const hSlide = document.createElement("div");
      hSlide.className = "swiper-slide swiper-slideh";
      hSlide.id = `swiper-slideh${newIndex}`;
      hSlide.dataset.index = newIndex;
      hSlide.style.backgroundImage = `url(${reader.result})`;
      hSlide.style.backgroundPosition = "center";
      hSlide.style.backgroundSize = "cover";
      hSlide.style.backgroundRepeat = "no-repeat";
      hSlide.style.width = "300px";
      hSlide.style.height = "calc(300px * 16 / 9)";
      hSlide.style.border = "5px solid rgb(41, 41, 41)";
      swiperWrapperh.appendChild(hSlide);
      updateNewSlideSelection();

      // Vertical
      const vSlide = document.createElement("div");
      vSlide.className = "swiper-slide swiper-slidev";
      vSlide.id = `swiper-slidev${newIndex}`;
      vSlide.dataset.index = newIndex;
      vSlide.style.backgroundImage = `url(${reader.result})`;
      vSlide.style.backgroundPosition = "center";
      vSlide.style.backgroundSize = "cover";
      vSlide.style.backgroundRepeat = "no-repeat";
      vSlide.style.width = "100px";
      vSlide.style.height = "calc(150px * 16 / 9)";
      vSlide.style.border = "4px solid rgb(41, 41, 41)";
      swiperWrapperv.appendChild(vSlide);

      // customize panel
      const custItem = document.createElement("div");
      custItem.className = "custitem";
      custItem.dataset.index = newIndex;
      custItem.style.background = `url(${reader.result}) center/contain no-repeat`;
      custDiv.appendChild(custItem);

      custItem.addEventListener("click", () => {
        setSelectedPage(hSlide.id);
        if (state.swiper1) state.swiper1.slideTo(newIndex - 1);
        if (state.swiper2) state.swiper2.slideTo(newIndex - 1);
        enableAllButtons();
      });

      if (state.swiper1) state.swiper1.update();
      if (state.swiper2) state.swiper2.update();

      setSelectedPage(hSlide.id);
      enableAllButtons();

      if (state.swiper1) state.swiper1.slideTo(newIndex - 1);
      if (state.swiper2) state.swiper2.slideTo(newIndex - 1);

      updateSlideSelection();
    };
    reader.readAsDataURL(file);
  };

  // remove slide button
  document.getElementById("removeimage").addEventListener("click", () => {
    const selectedPage = state.selectedPage;
    if (!selectedPage) return alert("No slide selected to remove.");
    const horizontalSlide = document.getElementById(selectedPage);
    const verticalSlide = document.getElementById(
      selectedPage.replace("h", "v")
    );
    const slideIndex = selectedPage.replace("swiper-slideh", "");
    const custItem = document.querySelector(
      `#custdiv1 .custitem[data-index='${slideIndex}']`
    );
    horizontalSlide?.remove();
    verticalSlide?.remove();
    custItem?.remove();
    state.swiper1?.update();
    state.swiper2?.update();

    // Choose new active
    if (state.swiper1 && state.swiper1.slides.length > 0) {
      state.selectedPage = state.swiper1.slides[state.swiper1.activeIndex].id;
      enableAllButtons();
    } else {
      state.selectedPage = null;
      disableAllButtons();
    }
  });
}

/** A small helper to create a slide programmatically (keeps original API) */
export function createSlide(imageSrc) {
  const swiperWrapperh = document.querySelector(".swiper-wrapperh");
  const swiperWrapperv = document.querySelector(".swiper-wrapperv");
  const custDiv = document.getElementById("custdiv1");

  const newIndex = swiperWrapperh.children.length + 1;
  const createSlideElement = (className, imgSrc, id) => {
    const slide = document.createElement("div");
    slide.className = className;
    slide.id = id;
    const img = document.createElement("img");
    img.src = imgSrc;
    img.style.width = "100%";
    img.style.height = "100%";
    slide.appendChild(img);
    return slide;
  };

  const hSlide = createSlideElement(
    "swiper-slideh",
    imageSrc,
    `swiper-slideh${newIndex}`
  );
  const vSlide = createSlideElement(
    "swiper-slidev",
    imageSrc,
    `swiper-slidev${newIndex}`
  );
  swiperWrapperh.appendChild(hSlide);
  swiperWrapperv.appendChild(vSlide);

  const custItem = document.createElement("div");
  custItem.className = "custitem";
  custItem.dataset.index = newIndex;
  custItem.innerText = `Slide ${newIndex}`;
  custDiv.appendChild(custItem);

  state.swiper1?.update();
  state.swiper2?.update();
  state.selectedPage = hSlide.id;
  enableAllButtons();
  return { hSlide, vSlide, custItem };
}

/* =========================
   Sortable + Customize Logic
========================= */

let originalOrder = []; // store order before editing

// Make custdiv1 sortable
var sortable = new Sortable(document.getElementById("custdiv1"), {
  animation: 150,
  ghostClass: "dragging",
});

// Buttons
const saveBtn = document.getElementById("custsave");
const cancelBtn = document.getElementById("custcancel");
const custContainer = document.getElementById("customize");
const customizeBtn = document.getElementById("customizebtn");

// When Customize opens → save current order
customizeBtn.addEventListener("click", () => {
  originalOrder = Array.from(
    document.querySelectorAll("#custdiv1 .custitem")
  ).map((item) => item.dataset.index);
  custContainer.style.display = "block";
});

// Save → reorder both Swipers
saveBtn.addEventListener("click", () => {
  const newOrder = Array.from(
    document.querySelectorAll("#custdiv1 .custitem")
  ).map((item) => item.dataset.index);

  // Reorder vertical swiper slides
  const vWrapper = document.querySelector(".swiper-wrapperv");
  const vSlides = Array.from(vWrapper.children);
  newOrder.forEach((id) => {
    const slide = vSlides.find((s) => s.dataset.index === id);
    if (slide) vWrapper.appendChild(slide);
  });

  // Reorder horizontal swiper slides
  const hWrapper = document.querySelector(".swiper-wrapperh");
  const hSlides = Array.from(hWrapper.children);
  newOrder.forEach((id) => {
    const slide = hSlides.find((s) => s.dataset.index === id);
    if (slide) hWrapper.appendChild(slide);
  });

  // Update swipers
  state.swiper1?.update();
  state.swiper2?.update();

  custContainer.style.display = "none"; // close customize menu
});

// Cancel → restore original order
cancelBtn.addEventListener("click", () => {
  if (originalOrder.length > 0) {
    const custDiv = document.getElementById("custdiv1");
    const items = Array.from(custDiv.children);
    originalOrder.forEach((id) => {
      const item = items.find((el) => el.dataset.index === id);
      if (item) custDiv.appendChild(item);
    });
  }
  custContainer.style.display = "none";
});
