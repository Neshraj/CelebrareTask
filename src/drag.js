// src/drag.js
import { state } from "./state.js";
import { pushAction, isUndoRedoRunning } from "./undoRedo.js";

/** Make a textarea draggable inside container and track undo/redo, including resize */
export function makeTextAreaDraggable(textarea, container, swiperInstance) {
  let offsetX,
    offsetY,
    isDragging = false,
    startX,
    startY;
  let startLeft, startTop, startWidth, startHeight;
  let guide; // vertical guideline element

  const startDrag = (clientX, clientY) => {
    const rect = textarea.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    if (swiperInstance) swiperInstance.allowTouchMove = false;

    //Create vertical guideline at container center
    guide = document.createElement("div");
    guide.style.position = "absolute";
    guide.style.top = "0";
    guide.style.left = container.offsetWidth / 2 + "px";
    guide.style.height = container.offsetHeight - 6 + "px";
    guide.style.width = "2px";
    guide.style.backgroundColor = "transparent";
    guide.style.borderLeft = "2px dashed black"; // black dashed vertical guid line

    guide.style.pointerEvents = "none";
    container.appendChild(guide);
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

    // Keep guide centered
    if (guide) guide.style.left = container.offsetWidth / 2 + "px";
  };

  const endDragOrResize = () => {
    if (swiperInstance) swiperInstance.allowTouchMove = true;

    //Remove guide
    if (guide) {
      guide.remove();
      guide = null;
    }

    const computed = window.getComputedStyle(textarea);
    const currLeft = parseInt(computed.left);
    const currTop = parseInt(computed.top);
    const currWidth = parseInt(computed.width);
    const currHeight = parseInt(computed.height);

    if (
      isDragging &&
      !isUndoRedoRunning &&
      (startLeft !== currLeft ||
        startTop !== currTop ||
        startWidth !== currWidth ||
        startHeight !== currHeight)
    ) {
      pushAction({
        type: "dragResize",
        slideId: state.selectedPage,
        textareaId: textarea.id,
        prev: {
          left: startLeft + "px",
          top: startTop + "px",
          width: startWidth + "px",
          height: startHeight + "px",
        },
        next: {
          left: currLeft + "px",
          top: currTop + "px",
          width: currWidth + "px",
          height: currHeight + "px",
        },
      });
    }
    isDragging = false;
  };

  // -----------------
  // Mouse events
  // -----------------
  textarea.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    const rect = textarea.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    const computed = window.getComputedStyle(textarea);
    startLeft = parseInt(computed.left) || 0;
    startTop = parseInt(computed.top) || 0;
    startWidth = parseInt(computed.width) || textarea.offsetWidth;
    startHeight = parseInt(computed.height) || textarea.offsetHeight;
    isDragging = false;

    const onMouseMove = (ev) => {
      if (
        !isDragging &&
        (Math.abs(ev.clientX - startX) > 5 || Math.abs(ev.clientY - startY) > 5)
      ) {
        isDragging = true;
        startDrag(startX, startY);
      }
      if (isDragging) drag(ev.clientX, ev.clientY);
    };

    const onMouseUp = () => {
      endDragOrResize();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // -----------------
  // Touch events
  // -----------------
  textarea.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    const computed = window.getComputedStyle(textarea);
    startLeft = parseInt(computed.left) || 0;
    startTop = parseInt(computed.top) || 0;
    startWidth = parseInt(computed.width) || textarea.offsetWidth;
    startHeight = parseInt(computed.height) || textarea.offsetHeight;
    isDragging = false;
  });

  textarea.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (
      !isDragging &&
      (Math.abs(touch.clientX - startX) > 5 ||
        Math.abs(touch.clientY - startY) > 5)
    ) {
      isDragging = true;
      startDrag(startX, startY);
    }
    if (isDragging) drag(touch.clientX, touch.clientY);
  });

  textarea.addEventListener("touchend", endDragOrResize);
}

/** Allow only selected textarea to be resizable */
export function updateSelectedTextAreaResizable(selectedId) {
  document.querySelectorAll(".textareas").forEach((ta) => {
    ta.style.resize = ta.id === selectedId ? "both" : "none";
  });
}
