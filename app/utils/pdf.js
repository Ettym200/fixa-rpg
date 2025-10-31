"use client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Exporta um "print da tela" (apenas o que está visível no momento)
export async function exportToPdf(containerRef) {
  try {
    const target = containerRef?.current || document.body;
  // Força fundo claro e alta resolução para parecer um "print"
  const html = document.documentElement;
  const wasDark = html.classList.contains("dark");
  if (wasDark) html.classList.remove("dark");
  const scale = Math.min(2, window.devicePixelRatio ? window.devicePixelRatio * 1.5 : 2);

  // Garante que o width usado seja o real do container (sem compressão por scroll)
    // Captura SOMENTE a área visível (viewport), como um print
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    const rect = target.getBoundingClientRect();
    // recorta do alvo a parte visível (interseção com viewport)
    const clipX = Math.max(rect.left, 0);
    const clipY = Math.max(rect.top, 0);
    const clipWidth = Math.min(rect.right, vpWidth) - clipX;
    const clipHeight = Math.min(rect.bottom, vpHeight) - clipY;

    const canvas = await html2canvas(document.body, {
      scale,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      x: clipX,
      y: clipY,
      width: clipWidth,
      height: clipHeight,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      logging: false,
    });

  // Restaura o tema escuro (se estava ativo)
  if (wasDark) html.classList.add("dark");

    const imgData = canvas.toDataURL("image/png");
    // Encaixa a imagem inteira em UMA página A4, mantendo proporção
    const landscape = canvas.width > canvas.height;
    const pdf = new jsPDF(landscape ? "l" : "p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }
    const marginX = (pageWidth - imgWidth) / 2;
    const marginY = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight, undefined, "FAST");

    pdf.save("ficha-tormenta20.pdf");
  } catch (err) {
    console.error("Erro ao exportar PDF:", err);
    alert("Não foi possível gerar o PDF. Tente novamente ou avise-me para ajustar.");
  }
}


