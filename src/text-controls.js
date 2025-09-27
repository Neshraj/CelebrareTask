import { state, setSelectedTextArea } from "./state.js";
import { updateControlsFromTextarea } from "./utils.js";
import {
  makeTextAreaDraggable,
  updateSelectedTextAreaResizable,
} from "./drag.js";
import {
  pushAction,
  undoStack,
  redoStack,
  isUndoRedoRunning,
} from "./undoRedo.js";

/** autoResize helper */
export function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

/** debounce helper */
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

/** Binds input events from a slide textarea to the controller textarea */
export function bindSlideTextareaInput(textareaDom) {
  const debouncedInput = debounce(() => {
    if (isUndoRedoRunning) return;
    pushAction({
      type: "textChange",
      slideId: state.selectedPage,
      textareaId: textareaDom.id,
      prev: { value: textareaDom.dataset.prevValue || "" },
      next: { value: textareaDom.value },
    });
    textareaDom.dataset.prevValue = textareaDom.value;
  }, 500);

  textareaDom.addEventListener("input", () => {
    if (state.selectedTextArea === textareaDom.id)
      state.dom.controllerText.value = textareaDom.value;
    debouncedInput();
    autoResize(textareaDom);
  });
  autoResize(textareaDom);
  textareaDom.dataset.prevValue = textareaDom.value;
}

/** Add a new textarea to selected page */
export function addNewTextArea() {
  const pageDom = document.getElementById(state.selectedPage);
  if (!pageDom) return;

  pageDom.style.position = "relative";
  const index = pageDom.querySelectorAll(".textareas").length + 1;
  const ta = document.createElement("textarea");
  ta.className = "textareas";
  ta.id = `${pageDom.id}-txt${index}`;
  ta.value = `Text ${index}`;
  Object.assign(ta.style, {
    position: "absolute",
    left: "10px",
    top: "10px",
    width: "150px",
    height: "30px",
    fontFamily: "Arial",
    fontSize: "16px",
    overflow: "hidden",
    textAlign: "center",
  });

  pageDom.appendChild(ta);
  bindSlideTextareaInput(ta);
  autoResize(ta);
  makeTextAreaDraggable(ta, pageDom, state.swiper1);

  const eventBindings = (taElement) => {
    taElement.addEventListener("click", () => {
      setSelectedTextArea(taElement.id);
      updateSelectedTextAreaResizable(taElement.id);
      updateControlsFromTextarea(taElement);
      state.dom.controllerText.value = taElement.value;
    });
  };
  eventBindings(ta);

  pushAction({
    type: "addText",
    slideId: state.selectedPage,
    textareaId: ta.id,
    next: { domProps: { ...ta }, eventBindings },
  });

  ta.click(); // select new textarea
}

/** Remove selected text area */
export function removeSelectedTextArea() {
  if (!state.selectedTextArea) return;
  const ta = document.getElementById(state.selectedTextArea);
  const slideId = state.selectedPage;
  const textareaId = state.selectedTextArea;

  const prevState = {
    domProps: { ...ta },
    eventBindings: (taElement) => {
      taElement.addEventListener("click", () => {
        setSelectedTextArea(taElement.id);
        updateSelectedTextAreaResizable(taElement.id);
        updateControlsFromTextarea(taElement);
        state.dom.controllerText.value = taElement.value;
      });
    },
  };

  pushAction({ type: "removeText", slideId, textareaId, prev: prevState });
  ta.remove();
  setSelectedTextArea(null);
}

/** Wire font controls and controller textarea */
export function initTextControls() {
  const controller = state.dom.controllerText;
  controller.addEventListener("input", () => {
    if (!state.selectedTextArea) return;
    const ta = document.getElementById(state.selectedTextArea);
    if (!ta) return;
    if (!isUndoRedoRunning) {
      pushAction({
        type: "textChange",
        slideId: state.selectedPage,
        textareaId: ta.id,
        prev: { value: ta.value },
        next: { value: controller.value },
      });
    }
    ta.value = controller.value;
    autoResize(ta);
  });

  document.querySelectorAll(".textareas").forEach(bindSlideTextareaInput);

  // click selection
  document.querySelectorAll(".textareas").forEach((area) => {
    area.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      setSelectedTextArea(area.id);
      updateSelectedTextAreaResizable(area.id);
      area.focus();
      updateControlsFromTextarea(area);
      state.dom.controllerText.value = area.value;
    });
  });

  // font controls
  // font controls
  [
    "textSize",
    "textWidth",
    "fontStyle",
    "fontFormat",
    "textColor",
    "textAlign",
  ].forEach((prop) => {
    state.dom[prop].addEventListener("change", () => {
      if (!state.selectedTextArea) return;
      const ta = document.getElementById(state.selectedTextArea);
      const prevStyle = {
        fontSize: ta.style.fontSize,
        fontWeight: ta.style.fontWeight,
        fontFamily: ta.style.fontFamily,
        textTransform: ta.style.textTransform,
        color: ta.style.color,
        textAlign: ta.style.textAlign,
      };

      const styleMap = {
        textSize: "fontSize",
        textWidth: "fontWeight",
        fontStyle: "fontFamily",
        fontFormat: "textTransform",
        textColor: "color",
        textAlign: "textAlign",
      };
      const key = styleMap[prop];
      if (!key) return;

      let value = state.dom[prop].value;
      if (key === "fontSize") value += "px"; // only font size needs px

      if (!isUndoRedoRunning) {
        pushAction({
          type: "styleChange",
          slideId: state.selectedPage,
          textareaId: ta.id,
          prev: { style: prevStyle },
          next: { style: { ...prevStyle, [key]: value } },
        });
      }

      ta.style[key] = value;
    });
  });

  state.dom.newTextBtn.addEventListener("click", addNewTextArea);
  state.dom.removeTextBtn.addEventListener("click", removeSelectedTextArea);
}
