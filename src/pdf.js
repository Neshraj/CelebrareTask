// src/pdf.js
import { state } from "./state.js";

/** generate PDF*/
export async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const slides = document.querySelectorAll(".swiper-slideh");
  if (!slides.length) return;

  const widthScale = 0.6,
    heightScale = 0.65;
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
    Object.assign(tempDiv.style, {
      position: "absolute",
      left: "0",
      top: "0",
      transform: "none",
      margin: "0",
      padding: "0",
      border: "none",
      width: slide.offsetWidth + "px",
      height: slide.offsetHeight + "px",
      overflow: "visible",
    });
    document.body.appendChild(tempDiv);

    tempDiv.querySelectorAll(".textareas").forEach((ta) => {
      const div = document.createElement("div");
      div.innerText = ta.value;
      const style = window.getComputedStyle(ta);
      Object.assign(div.style, {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        textAlign: style.textAlign,
        textTransform: style.textTransform,
        width: ta.offsetWidth + "px",
        position: "absolute",
        left: ta.style.left,
        top: ta.style.top,
        lineHeight: style.lineHeight,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      });
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
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(5);
    pdf.roundedRect(0, 0, pdfWidth, pdfHeight, 7, 7, "S");
    tempDiv.remove();
  }

  pdf.save("invitation.pdf");
}

/** Attach download button handler */
export function initPDF() {
  const btn = document.getElementById("downloadPDF");
  if (btn) btn.addEventListener("click", generatePDF);
}
