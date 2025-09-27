// src/utils.js
import { state, setSelectedPage } from "./state.js";

export function disableAllButtons() {
  document.querySelectorAll(".ftrbtn").forEach((btn) => (btn.disabled = true));
}
export function enableAllButtons() {
  document.querySelectorAll(".ftrbtn").forEach((btn) => (btn.disabled = false));
}

export function rgbToHex(rgb) {
  const result = rgb?.match(/\d+/g);
  return result
    ? "#" +
        result.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
    : rgb;
}

/** Keep selectedPage in state in sync with a swiper instance */
export function syncSelectedPage(swiperInstance) {
  if (
    swiperInstance &&
    swiperInstance.slides &&
    swiperInstance.slides[swiperInstance.activeIndex]
  ) {
    setSelectedPage(swiperInstance.slides[swiperInstance.activeIndex].id);
  }
}

/** Fill controls from a textarea DOM node (uses state.dom) */
export function updateControlsFromTextarea(textDom) {
  if (!textDom || !state.dom) return;
  const style = window.getComputedStyle(textDom);
  state.dom.fontStyle.value = style.fontFamily || "";
  state.dom.fontFormat.value = style.textTransform || "";
  // store numbers in the select which uses numeric values
  state.dom.textSize.value = parseInt(style.fontSize) || 16;
  state.dom.textWidth.value = parseInt(style.fontWeight) || 400;
  state.dom.textColor.value = style.color?.startsWith("rgb")
    ? rgbToHex(style.color)
    : style.color;
  state.dom.textAlign.value = style.textAlign || "left";
}
