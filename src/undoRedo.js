// src/undoRedo.js
import { state, setSelectedPage, setSelectedTextArea } from "./state.js";
import {
  makeTextAreaDraggable,
  updateSelectedTextAreaResizable,
} from "./drag.js";

// Undo/Redo stacks
export const undoStack = [];
export const redoStack = [];
export let isUndoRedoRunning = false;

// Push a new action to undo stack
export function pushAction(action) {
  undoStack.push(action);
  redoStack.length = 0; // clear redo stack on new action
}

/** Rebind all necessary events for a textarea */
function bindTextareaEvents(textarea, slideId) {
  makeTextAreaDraggable(
    textarea,
    document.getElementById(slideId),
    state.swiper1
  );
  textarea.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    setSelectedTextArea(textarea.id);
    updateSelectedTextAreaResizable(textarea.id);
  });
  textarea.addEventListener("input", () => {
    if (state.selectedTextArea === textarea.id) {
      state.controllerText.value = textarea.value;
    }
  });
}

// ===================
// Undo function
// ===================
export function undo() {
  if (!undoStack.length) return;
  const action = undoStack.pop();
  isUndoRedoRunning = true;

  redoStack.push(action); // push current action to redo stack

  switch (action.type) {
    case "slideChange":
      if (state.swiper1 && state.swiper1.slides.length > 0) {
        state.swiper1.slideTo(action.prev.activeIndex);
      }
      break;

    case "addText":
      // Remove the textarea that was added
      document.getElementById(action.textareaId)?.remove();
      if (state.selectedTextArea === action.textareaId)
        setSelectedTextArea(null);
      break;

    case "removeText":
      // Recreate the removed textarea
      const slide = document.getElementById(action.slideId);
      if (!slide) break;

      const ta = document.createElement("textarea");
      ta.id = action.textareaId;
      ta.className = "textareas";
      Object.assign(ta, action.prev.domProps);
      Object.assign(ta.style, action.prev.style);
      slide.appendChild(ta);

      // Rebind events
      if (action.prev.eventBindings) action.prev.eventBindings(ta);

      break;

    case "textChange":
      const textTa = document.getElementById(action.textareaId);
      if (textTa) textTa.value = action.prev.value;
      break;

    case "styleChange":
      const styleTa = document.getElementById(action.textareaId);
      if (styleTa) Object.assign(styleTa.style, action.prev.style);
      break;

    case "dragResize":
      const drTa = document.getElementById(action.textareaId);
      if (drTa) Object.assign(drTa.style, action.prev);
      break;
  }

  isUndoRedoRunning = false;
}

// ===================
// Redo function
// ===================
export function redo() {
  if (!redoStack.length) return;
  const action = redoStack.pop();
  isUndoRedoRunning = true;

  undoStack.push(action); // push current action back to undo stack

  switch (action.type) {
    case "slideChange":
      if (state.swiper1 && state.swiper1.slides.length > 0) {
        state.swiper1.slideTo(action.next.activeIndex);
      }
      break;

    case "addText":
      // Recreate the textarea that was added
      const slide = document.getElementById(action.slideId);
      if (!slide) break;

      const newTa = document.createElement("textarea");
      newTa.id = action.textareaId;
      newTa.className = "textareas";
      Object.assign(newTa, action.next.domProps);
      Object.assign(newTa.style, action.next.style);
      slide.appendChild(newTa);

      // Rebind events
      if (action.next.eventBindings) action.next.eventBindings(newTa);

      // Restore selection
      setSelectedTextArea(action.textareaId);
      break;

    case "removeText":
      // Remove the textarea again
      document.getElementById(action.textareaId)?.remove();
      if (state.selectedTextArea === action.textareaId)
        setSelectedTextArea(null);
      break;

    case "textChange":
      const textTa = document.getElementById(action.textareaId);
      if (textTa) textTa.value = action.next.value;
      break;

    case "styleChange":
      const styleTa = document.getElementById(action.textareaId);
      if (styleTa) Object.assign(styleTa.style, action.next.style);
      break;

    case "dragResize":
      const drTa = document.getElementById(action.textareaId);
      if (drTa) Object.assign(drTa.style, action.next);
      break;
  }

  isUndoRedoRunning = false;
}
