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
// const width = document.getElementById("width");
// const height = document.getElementById("height");

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
    ? "#" +
        result.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
    : rgb;
}

function updateControlsFromTextarea(textDom) {
  if (!textDom) return;
  const style = window.getComputedStyle(textDom);

  fontStye.value = style.fontFamily || "";
  fontFormate.value = style.textTransform || "";
  textSize.value = style.fontSize || "16px";
  textWidth.value = parseInt(style.fontWeight) || 400;
  textColor.value = style.color.startsWith("rgb")
    ? rgbToHex(style.color)
    : style.color;
  textAlign.value = style.textAlign || "left";
  // textBoxWidth.value = parseInt(style.width) || 150;
  // textBoxHeight.value = parseInt(style.height) || 50;
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
  area.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    selectedTextAre = area.id;
    updateSelectedTextAreaResizable(area.id);
    enableAllButtons();
    area.focus(); // allow typing
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

// handleWheelInput(fontsize, "fontSize", parseFloat(fontsize.step) || 1);
// handleWheelInput(fontwidth, "fontWeight", parseFloat(fontwidth.step) || 50, "");
// handleWheelInput(width, "width", parseFloat(width.step) || 1);
// handleWheelInput(height, "height", parseFloat(height.step) || 1);

// =========================
// Dropdown Event Listeners
// =========================
const fontSizeDropdown = document.getElementById("fontsize");
const fontWeightDropdown = document.getElementById("fontwidth");

fontSizeDropdown.addEventListener("change", () => {
  if (selectedTextAre) {
    document.getElementById(selectedTextAre).style.fontSize =
      fontSizeDropdown.value;
  }
});

fontWeightDropdown.addEventListener("change", () => {
  if (selectedTextAre) {
    document.getElementById(selectedTextAre).style.fontWeight =
      fontWeightDropdown.value;
  }
});

/* =========================
   Input Event Listeners
========================= */
fontStye.addEventListener("change", () => {
  if (selectedTextAre)
    document.getElementById(selectedTextAre).style.fontFamily = fontStye.value;
});
fontFormate.addEventListener("change", () => {
  if (selectedTextAre)
    document.getElementById(selectedTextAre).style.textTransform =
      fontFormate.value;
});
textSize.addEventListener("input", () => {
  if (selectedTextAre)
    document.getElementById(selectedTextAre).style.fontSize =
      textSize.value + "px";
});
textWidth.addEventListener("input", () => {
  if (selectedTextAre)
    document.getElementById(selectedTextAre).style.fontWeight = textWidth.value;
});
textColor.addEventListener("input", () => {
  if (selectedTextAre)
    document.getElementById(selectedTextAre).style.color = textColor.value;
});
textAlign.addEventListener("change", () => {
  if (selectedTextAre)
    document.getElementById(selectedTextAre).style.textAlign = textAlign.value;
});
// textBoxWidth.addEventListener("input", () => {
//   if (selectedTextAre) document.getElementById(selectedTextAre).style.width = textBoxWidth.value + "px";
// });
// textBoxHeight.addEventListener("input", () => {
//   if (selectedTextAre) document.getElementById(selectedTextAre).style.height = textBoxHeight.value + "px";
// });

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
const sortable = new Sortable(document.getElementById("custdiv1"), {
  animation: 150,
});
function reorderSlides() {
  const newOrder = Array.from(
    document.querySelectorAll("#custdiv1 .custitem")
  ).map((el) => el.dataset.index);

  const reorderWrapper = (wrapperSelector) => {
    const wrapper = document.querySelector(wrapperSelector);
    const reordered = newOrder.map((index) =>
      wrapper.querySelector(`[data-index="${index}"]`)
    );
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
  newTextArea.value = `Text ${nextIndex}`;
  newTextArea.style.position = "absolute";
  newTextArea.style.left = "10px";
  newTextArea.style.top = "10px";
  newTextArea.style.width = "150px";
  newTextArea.style.height = "30px";
  newTextArea.style.fontFamily = "Arial";
  newTextArea.style.fontSize = "16px";

  // newTextArea.style.border = "1px solid #000";
  // newTextArea.style.backgroundColor = "transparent";
  newTextArea.style.overflow = "hidden";
  newTextArea.style.textAlign = "center";

  selectedPageDom.appendChild(newTextArea);
  // Bind new textarea input to controller
  bindSlideTextareaInput(newTextArea);
  autoResize(newTextArea);

  makeTextAreaDraggable(newTextArea, selectedPageDom, swiper1);

  newTextArea.addEventListener("click", () => {
    selectedTextAre = newTextArea.id;
    updateSelectedTextAreaResizable(newTextArea.id);
    enableAllButtons();
    updateControlsFromTextarea(newTextArea);
    updateControllerText(newTextArea);
  });
});

/* =========================
   Make Textarea Draggable
========================= */
function makeTextAreaDraggable(textarea, container, swiperInstance) {
  let offsetX, offsetY;
  let guide;
  let isDragging = false;
  let startX, startY;

  const startDrag = (clientX, clientY) => {
    const containerRect = container.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();

    offsetX = clientX - textareaRect.left;
    offsetY = clientY - textareaRect.top;

    guide = document.createElement("div");
    guide.className = "vertical-guide";
    container.appendChild(guide);

    swiperInstance.allowTouchMove = false;
  };

  const drag = (clientX, clientY) => {
    const containerRect = container.getBoundingClientRect();
    let newLeft = clientX - containerRect.left - offsetX;
    let newTop = clientY - containerRect.top - offsetY;

    newLeft = Math.max(
      0,
      Math.min(newLeft, containerRect.width - textarea.offsetWidth)
    );
    newTop = Math.max(
      0,
      Math.min(newTop, containerRect.height - textarea.offsetHeight)
    );

    textarea.style.left = newLeft + "px";
    textarea.style.top = newTop + "px";
  };

  const endDrag = () => {
    if (guide) guide.remove();
    swiperInstance.allowTouchMove = true;
    isDragging = false;
  };

  // -----------------
  // Mouse Events
  // -----------------
  textarea.addEventListener("mousedown", (e) => {
    e.stopPropagation();

    // Prevent dragging if user clicked on resize handle
    const rect = textarea.getBoundingClientRect();
    const resizeMargin = 10; // px
    if (
      e.clientX > rect.right - resizeMargin &&
      e.clientY > rect.bottom - resizeMargin
    ) {
      // This is likely the resize handle, so do not start drag
      return;
    }

    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;

    const onMouseMove = (e) => {
      if (!isDragging) {
        if (
          Math.abs(e.clientX - startX) > 5 ||
          Math.abs(e.clientY - startY) > 5
        ) {
          isDragging = true;
          startDrag(startX, startY);
        }
      }
      if (isDragging) drag(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      endDrag();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // -----------------
  // Touch Events
  // -----------------
  textarea.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDragging = false;
  });

  textarea.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (!isDragging) {
      if (
        Math.abs(touch.clientX - startX) > 5 ||
        Math.abs(touch.clientY - startY) > 5
      ) {
        isDragging = true;
        startDrag(startX, startY);
      }
    }
    if (isDragging) drag(touch.clientX, touch.clientY);
  });

  textarea.addEventListener("touchend", () => {
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

      /* =========================
   Slide Click to Make All Textareas Resizable
========================= */
      document.querySelectorAll(".swiper-slideh").forEach((slide) => {
        slide.addEventListener("click", (e) => {
          // Only trigger if click is not on a textarea
          if (!e.target.classList.contains("textareas")) {
            slide.querySelectorAll(".textareas").forEach((ta) => {
              ta.style.resize = "none"; // make all textareas resizable
              ta.style.border = "none";
            });
            selectedTextAre = null; // no specific textarea selected
            enableAllButtons();
          }
        });
      });

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

function updateSelectedTextAreaResizable(selectedId) {
  document.querySelectorAll(".textareas").forEach((ta) => {
    if (ta.id === selectedId) {
      ta.style.resize = "both"; // only selected textarea is resizable
    } else {
      ta.style.resize = "none"; // all others not resizable
    }
  });
}

/* =========================
   Slide Click to Make All Textareas Resizable
========================= */
document.querySelectorAll(".swiper-slideh").forEach((slide) => {
  slide.addEventListener("click", (e) => {
    // Only trigger if click is not on a textarea
    if (!e.target.classList.contains("textareas")) {
      slide.querySelectorAll(".textareas").forEach((ta) => {
        ta.style.resize = "none"; // make all textareas resizable
        ta.style.border = "none";
      });
      selectedTextAre = null; // no specific textarea selected
      enableAllButtons();
    }
  });
});

// =========================
// Controller Textarea Two-Way Binding
// =========================
const controllerText = document.getElementById("controller-text");

// Whenever a slide textarea is clicked, update controller textarea
function updateControllerText(textareaDom) {
  if (!textareaDom) return;
  controllerText.value = textareaDom.value;
}

// Whenever controller textarea changes, update selected slide textarea
controllerText.addEventListener("input", () => {
  if (selectedTextAre) {
    const slideTextarea = document.getElementById(selectedTextAre);
    if (slideTextarea) slideTextarea.value = controllerText.value;
    autoResize(slideTextarea); // ✅ keep slide textarea height updated
  }
});

function autoResize(textarea) {
  textarea.style.height = "auto"; // reset first
  textarea.style.height = textarea.scrollHeight + "px"; // set based on content
}

// Update controller text when a slide textarea is edited
function bindSlideTextareaInput(textareaDom) {
  textareaDom.addEventListener("input", () => {
    if (selectedTextAre === textareaDom.id) {
      controllerText.value = textareaDom.value;
    }
    autoResize(textareaDom); // ✅ keep height updated
  });
  // Initial resize
  autoResize(textareaDom);
}

// When adding new textareas, bind them automatically
document
  .querySelectorAll(".textareas")
  .forEach((ta) => bindSlideTextareaInput(ta));

// Update selection logic to include controller text
document.querySelectorAll(".textareas").forEach((area) => {
  area.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    selectedTextAre = area.id;
    updateSelectedTextAreaResizable(area.id);
    enableAllButtons();
    updateControlsFromTextarea(area);
    updateControllerText(area);
  });
});

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const slides = document.querySelectorAll(".swiper-slideh");
  if (!slides.length) return;

  const widthScale = 0.6;
  const heightScale = 0.65;

  const firstSlide = slides[0];
  const pdfWidth = firstSlide.offsetWidth * widthScale;
  const pdfHeight = firstSlide.offsetHeight * heightScale;

  const pdf = new jsPDF({
    unit: "px",
    format: [pdfWidth, pdfHeight],
    orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
  });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    const tempDiv = slide.cloneNode(true);
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "0";
    tempDiv.style.top = "0";
    tempDiv.style.transform = "none";
    tempDiv.style.margin = "0";
    tempDiv.style.padding = "0";
    tempDiv.style.border = "none";
    tempDiv.style.width = slide.offsetWidth + "px";
    tempDiv.style.height = slide.offsetHeight + "px";
    tempDiv.style.overflow = "visible";
    document.body.appendChild(tempDiv);

    // Replace all textareas with divs for full text capture
    tempDiv.querySelectorAll(".textareas").forEach((ta) => {
      const div = document.createElement("div");
      div.innerText = ta.value;

      // Copy styles
      const style = window.getComputedStyle(ta);
      div.style.fontFamily = style.fontFamily;
      div.style.fontSize = style.fontSize;
      div.style.fontWeight = style.fontWeight;
      div.style.color = style.color;
      div.style.textAlign = style.textAlign;
      div.style.textTransform = style.textTransform;
      div.style.width = ta.offsetWidth + "px";
      div.style.position = "absolute";
      div.style.left = ta.style.left;
      div.style.top = ta.style.top;
      div.style.lineHeight = style.lineHeight;
      div.style.whiteSpace = "pre-wrap";
      div.style.wordBreak = "break-word";

      ta.replaceWith(div);
    });

    const canvas = await html2canvas(tempDiv, {
      useCORS: true,
      scale: 3,
      allowTaint: true,
      backgroundColor: null,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    tempDiv.remove();
  }

  pdf.save("invitation.pdf");
}

document.getElementById("downloadPDF").addEventListener("click", generatePDF);

/* =========================
   Disable All Buttons Initially
========================= */
disableAllButtons();
