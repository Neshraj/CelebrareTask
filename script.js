/* =========================
   Swiper Initialization
========================= */

// Horizontal Swiper
var swiper1 = new Swiper(".mySwiperh", {
  spaceBetween: 60,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  on: {
    slideChange: function () {
      disableAllButtons();
      swiper2.slideTo(swiper1.activeIndex);

      // ✅ Keep selectedPage synced
      if (swiper1.slides[swiper1.activeIndex]) {
        selectedPage = swiper1.slides[swiper1.activeIndex].id;
        enableAllButtons();
      }
    },
  },
});

// Vertical Swiper
var swiper2 = new Swiper(".mySwiperv", {
  direction: "vertical",
  spaceBetween: 50,
  slidesPerView: 2,
  on: {
    slideChange: function () {
      disableAllButtons();
      swiper1.slideTo(swiper2.activeIndex);

      // ✅ Keep selectedPage synced
      if (swiper2.slides[swiper2.activeIndex]) {
        selectedPage = swiper2.slides[swiper2.activeIndex].id;
        enableAllButtons();
      }
    },
  },
});


/* =========================
   DOM Elements
========================= */
const fontsize = document.getElementById("fontsize");
const fontwidth = document.getElementById("fontwidth");
const width = document.getElementById("width");
const height = document.getElementById("height");

const fontStye = document.getElementById("font-family");
const fontFormate = document.getElementById("font-formate");
const textSize = document.getElementById("fontsize");
const textWidth = document.getElementById("fontwidth");
const textColor = document.getElementById("textcolor");
const textAlign = document.getElementById("text-position");
const textBoxWidth = document.getElementById("width");
const textBoxHeight = document.getElementById("height");
const newText = document.getElementById("addtext");
const newPage = document.getElementById("addimage");

let selectedPage = swiper1.slides.length > 0 ? swiper1.slides[0].id : null;

let selectedTextAre = null;

/* =========================
   Utility Functions
========================= */
//Temporarely this is disabled using false
function disableAllButtons() {
  document.querySelectorAll(".ftrbtn").forEach((btn) => (btn.disabled = false));
}

function enableAllButtons() {
  document.querySelectorAll(".ftrbtn").forEach((btn) => (btn.disabled = false));
}

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  return result
    ? "#" + result.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
    : rgb;
}

function updateControlsFromTextarea(textDom) {
  if (!textDom) return;
  const style = window.getComputedStyle(textDom);

  fontStye.value = style.fontFamily || "";
  fontFormate.value = style.textTransform || "";
  textSize.value = parseInt(style.fontSize) || 16;
  textWidth.value = parseInt(style.fontWeight) || 400;
  textColor.value = style.color.startsWith("rgb") ? rgbToHex(style.color) : style.color;
  textAlign.value = style.textAlign || "left";
  textBoxWidth.value = parseInt(style.width) || 150;
  textBoxHeight.value = parseInt(style.height) || 50;
}

/* =========================
   Slide Selection Helper
========================= */
function updateSlideSelection() {
  document.querySelectorAll(".swiper-slideh").forEach((slide) => {
    slide.addEventListener("click", () => {
      selectedPage = slide.id;
      enableAllButtons();
    });
  });
}

// Initialize slide selection
updateSlideSelection();

/* =========================
   Textarea Selection & Click
========================= */
document.querySelectorAll(".textareas").forEach((area) => {
  area.addEventListener("click", () => {
    const selectedPageDom = document.getElementById(selectedPage);
    makeTextAreaDraggable(area, selectedPageDom,swiper1);
    selectedTextAre = area.id;
    enableAllButtons();
    area.style.width = "150px";
    area.style.height = "30px";
    updateControlsFromTextarea(area);
  });
});

/* =========================
   Input Controls for Font/Size/Box
========================= */
function handleWheelInput(inputEl, styleProp, step = 1, unit = "px") {
  inputEl.addEventListener("wheel", (event) => {
    event.preventDefault();
    const current = parseFloat(inputEl.value) || 0;
    const min = parseFloat(inputEl.min) || -Infinity;
    const max = parseFloat(inputEl.max) || Infinity;
    const newValue = event.deltaY < 0 ? current + step : current - step;
    inputEl.value = Math.min(Math.max(newValue, min), max);

    if (selectedTextAre) {
      document.getElementById(selectedTextAre).style[styleProp] =
        styleProp === "fontWeight" ? newValue : `${newValue}${unit}`;
    }
  });
}

handleWheelInput(fontsize, "fontSize", parseFloat(fontsize.step) || 1);
handleWheelInput(fontwidth, "fontWeight", parseFloat(fontwidth.step) || 50, "");
handleWheelInput(width, "width", parseFloat(width.step) || 1);
handleWheelInput(height, "height", parseFloat(height.step) || 1);

/* =========================
   Input Event Listeners
========================= */
fontStye.addEventListener("change", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.fontFamily = fontStye.value;
});
fontFormate.addEventListener("change", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.textTransform = fontFormate.value;
});
textSize.addEventListener("input", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.fontSize = textSize.value + "px";
});
textWidth.addEventListener("input", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.fontWeight = textWidth.value;
});
textColor.addEventListener("input", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.color = textColor.value;
});
textAlign.addEventListener("change", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.textAlign = textAlign.value;
});
textBoxWidth.addEventListener("input", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.width = textBoxWidth.value + "px";
});
textBoxHeight.addEventListener("input", () => {
  if (selectedTextAre) document.getElementById(selectedTextAre).style.height = textBoxHeight.value + "px";
});

/* =========================
   Customize Modal Controls
========================= */
document.getElementById("customizebtn").addEventListener("click", (event) => {
  event.stopPropagation();
  document.querySelector(".mySwiperv").style.display = "none";
  document.querySelector("#customize").style.display = "block";
});

document.getElementById("custsave").addEventListener("click", () => {
  document.querySelector(".mySwiperv").style.display = "block";
  document.querySelector("#customize").style.display = "none";
  reorderSlides();
});

document.getElementById("custcancel").addEventListener("click", () => {
  document.querySelector(".mySwiperv").style.display = "block";
  document.querySelector("#customize").style.display = "none";
});

/* =========================
   Reorder Slides Function
========================= */
const sortable = new Sortable(document.getElementById("custdiv1"), { animation: 150 });
function reorderSlides() {
  const newOrder = Array.from(document.querySelectorAll("#custdiv1 .custitem")).map((el) => el.dataset.index);

  const reorderWrapper = (wrapperSelector) => {
    const wrapper = document.querySelector(wrapperSelector);
    const reordered = newOrder.map((index) => wrapper.querySelector(`[data-index="${index}"]`));
    reordered.forEach((slide) => wrapper.appendChild(slide));
  };

  reorderWrapper(".swiper-wrapperh");
  reorderWrapper(".swiper-wrapperv");

  swiper1.update();
  swiper2.update();
}

/* =========================
   Add Textarea Functionality
========================= */
newText.addEventListener("click", () => {
  const selectedPageDom = document.getElementById(selectedPage);
  if (!selectedPageDom) return;

  selectedPageDom.style.position = "relative";
  const textAreas = selectedPageDom.querySelectorAll(".textareas");
  const nextIndex = textAreas.length + 1;

  const newTextArea = document.createElement("textarea");
  newTextArea.className = "textareas";
  newTextArea.id = `${selectedPageDom.id}-txt${nextIndex}`;
  newTextArea.innerText = `Text ${nextIndex}`;
  newTextArea.style.position = "absolute";
  newTextArea.style.left = "10px";
  newTextArea.style.top = "10px";
  newTextArea.style.width = "150px";
  newTextArea.style.height = "30px";
  newTextArea.style.border = "1px solid #000";

  selectedPageDom.appendChild(newTextArea);
  makeTextAreaDraggable(newTextArea, selectedPageDom,swiper1);

  newTextArea.addEventListener("click", () => {
    selectedTextAre = newTextArea.id;
    enableAllButtons();
    updateControlsFromTextarea(newTextArea);
  });
});

/* =========================
   Make Textarea Draggable
========================= */
function makeTextAreaDraggable(textarea, container, swiperInstance) {
  let offsetX, offsetY;
  let guide;

  const startDrag = (clientX, clientY) => {
    const containerRect = container.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();

    offsetX = clientX - textareaRect.left;
    offsetY = clientY - textareaRect.top;

    textarea.style.border = "2px dashed black";

    guide = document.createElement("div");
    guide.className = "vertical-guide";
    container.appendChild(guide);

    swiperInstance.allowTouchMove = false;
  };

  const drag = (clientX, clientY) => {
    const containerRect = container.getBoundingClientRect();
    let newLeft = clientX - containerRect.left - offsetX;
    let newTop = clientY - containerRect.top - offsetY;

    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - textarea.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, containerRect.height - textarea.offsetHeight));

    textarea.style.left = newLeft + "px";
    textarea.style.top = newTop + "px";
  };

  const endDrag = () => {
    textarea.style.border = "none";
    guide.remove();
    swiperInstance.allowTouchMove = true;
  };

  // -----------------
  // Mouse Events
  // -----------------
  textarea.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);

    const onMouseMove = (e) => { e.stopPropagation(); drag(e.clientX, e.clientY); };
    const onMouseUp = (e) => { e.stopPropagation(); endDrag(); document.removeEventListener("mousemove", onMouseMove); document.removeEventListener("mouseup", onMouseUp); };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // -----------------
  // Touch Events
  // -----------------
  textarea.addEventListener("touchstart", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  });

  textarea.addEventListener("touchmove", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    drag(touch.clientX, touch.clientY);
  });

  textarea.addEventListener("touchend", (e) => {
    e.preventDefault();
    e.stopPropagation();
    endDrag();
  });
}






/* =========================
   Add / Remove Slide Functionality
========================= */
document.getElementById("addimage").addEventListener("click", () => {
  const imageInput = document.getElementById("imageInput");
  imageInput.click();

  imageInput.onchange = () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
  const swiperWrapperh = document.querySelector(".swiper-wrapperh");
  const swiperWrapperv = document.querySelector(".swiper-wrapperv");
  const custDiv = document.getElementById("custdiv1");

  // Horizontal Slide
  const hCount = swiperWrapperh.children.length + 1;
  const newSlideh = document.createElement("div");
  newSlideh.className = "swiper-slide swiper-slideh";
  newSlideh.id = `swiper-slideh${hCount}`;
  newSlideh.dataset.index = hCount;
  newSlideh.style.background = `url(${reader.result}) center/cover no-repeat`;
  newSlideh.style.width = "300px";
  newSlideh.style.height = "calc(300px * 16 / 9)";
  newSlideh.style.border = "5px solid rgb(41, 41, 41)";
  swiperWrapperh.appendChild(newSlideh);

  // Vertical Slide
  const vCount = swiperWrapperv.children.length + 1;
  const newSlidev = document.createElement("div");
  newSlidev.className = "swiper-slide swiper-slidev";
  newSlidev.id = `swiper-slidev${vCount}`;
  newSlidev.dataset.index = vCount;
  newSlidev.style.background = `url(${reader.result}) center/cover no-repeat`;
  newSlidev.style.width = "100px";
  newSlidev.style.height = "calc(150px * 16 / 9)";
  newSlidev.style.border = "4px solid rgb(41, 41, 41)";
  swiperWrapperv.appendChild(newSlidev);

  // Customize div
  const newCustItem = document.createElement("div");
  newCustItem.className = "custitem";
  newCustItem.id = `cust${custDiv.children.length + 1}`;
  newCustItem.dataset.index = custDiv.children.length + 1;
  newCustItem.style.background = `url(${reader.result}) center/contain no-repeat`;
  custDiv.appendChild(newCustItem);

  swiper1.update();
  swiper2.update();

  // ✅ Update selectedPage to the new slide
  selectedPage = newSlideh.id;

  // Update slide selection
  updateSlideSelection();

  // Optional: move swiper to the new slide
  swiper1.slideTo(hCount - 1);
  swiper2.slideTo(vCount - 1);
};

    reader.readAsDataURL(file);
  };
});

document.getElementById("removetext").addEventListener("click", () => {
  if (selectedTextAre) {
    document.getElementById(selectedTextAre)?.remove();
    selectedTextAre = null;
    disableAllButtons();
  }
});

document.getElementById("removeimage").addEventListener("click", () => {
  if (!selectedPage) return alert("No slide selected to remove.");

  // Remove from horizontal and vertical Swipers
  const horizontalSlide = document.getElementById(selectedPage);
  const verticalSlide = document.getElementById(selectedPage.replace("h", "v"));

  if (horizontalSlide) horizontalSlide.remove();
  if (verticalSlide) verticalSlide.remove();

  // Remove corresponding custitem
  const slideIndex = selectedPage.replace("swiper-slideh", "");
  const custItem = document.getElementById(`cust${slideIndex}`);
  if (custItem) custItem.remove();

  // Update Swipers
  swiper1.update();
  swiper2.update();

  // ✅ Set selectedPage to the new active slide, if any
  if (swiper1.slides.length > 0) {
    selectedPage = swiper1.slides[swiper1.activeIndex].id;
    enableAllButtons();
  } else {
    selectedPage = null;
    disableAllButtons();
  }
});



/* =========================
   Mobile Customize Modal
========================= */
const mobileBtn = document.getElementById("customizebtn-mobile");
const mobileCloseBtn = document.getElementById("closebtn-mobile");
const part1 = document.getElementById("part1");

mobileBtn.addEventListener("click", () => {
  document.getElementById("part3").style.display = "none";
  document.getElementById("part2").style.display = "none";
  part1.style.display = "flex";
});

mobileCloseBtn.addEventListener("click", () => {
  part1.style.display = "none";
  document.getElementById("part2").style.display = "block";
  document.getElementById("part3").style.display = "block";
});

window.addEventListener("click", (e) => {
  if (
    window.innerWidth <= 900 &&
    part1.style.display === "flex" &&
    !part1.contains(e.target) &&
    e.target !== mobileBtn
  ) {
    part1.style.display = "none";
  }
});

/* =========================
   Disable All Buttons Initially
========================= */
disableAllButtons();
