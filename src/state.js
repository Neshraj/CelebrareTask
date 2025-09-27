// src/state.js
export const state = {
  swiper1: null,
  swiper2: null,
  dom: null,
  selectedPage: null,
  selectedTextArea: null,
};
export const setSelectedPage = (id) => (state.selectedPage = id);
export const setSelectedTextArea = (id) => (state.selectedTextArea = id);
export const getSelectedPage = () => state.selectedPage;
export const getSelectedTextArea = () => state.selectedTextArea;
