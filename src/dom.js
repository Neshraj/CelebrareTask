// src/dom.js
import { state } from "./state.js";

/** Collect DOM refs and attach to state.dom */
export function initDom() {
  const dom = {
    fontStyle: document.getElementById("font-family"),
    fontFormat: document.getElementById("font-formate"),
    textSize: document.getElementById("fontsize"),
    textWidth: document.getElementById("fontwidth"),
    textColor: document.getElementById("textcolor"),
    textAlign: document.getElementById("text-position"),
    textBoxWidth: document.getElementById("width"),
    textBoxHeight: document.getElementById("height"),
    newTextBtn: document.getElementById("addtext"),
    newPageBtn: document.getElementById("addimage"),
    removeTextBtn: document.getElementById("removetext"),
    removeSlideBtn: document.getElementById("removeimage"),
    customizeBtn: document.getElementById("customizebtn"),
    custSaveBtn: document.getElementById("custsave"),
    custCancelBtn: document.getElementById("custcancel"),
    controllerText: document.getElementById("controller-text"),
    mobileBtn: document.getElementById("customizebtn-mobile"),
    mobileCloseBtn: document.getElementById("closebtn-mobile"),
    part1: document.getElementById("part1"),
  };

  state.dom = dom;
  return dom;
}
