"use client";
import type { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Exporta a PÁGINA INTEIRA (todo o conteúdo, incluindo rolagem) em PDF
export async function exportToPdf(containerRef: RefObject<HTMLDivElement>): Promise<void> {
  try {
    const element = containerRef?.current;
    if (!element) {
      alert("Elemento não encontrado para exportar.");
      return;
    }

    // Salva posição de rolagem atual
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Força fundo branco durante a captura
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    if (wasDark) html.classList.remove("dark");

    // Rola para o topo para capturar tudo
    window.scrollTo(0, 0);

    // Aguarda um frame para garantir que o scroll foi aplicado
    await new Promise<void>(resolve => setTimeout(resolve, 100));

    // Calcula dimensões reais do elemento (incluindo conteúdo rolável)
    const elementWidth = element.scrollWidth || element.offsetWidth;
    const elementHeight = element.scrollHeight || element.offsetHeight;
    
    const scale = 2; // Alta resolução
    const rect = element.getBoundingClientRect();

    // Captura o elemento COMPLETO, sem clipping
    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      width: elementWidth,
      height: elementHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: elementWidth,
      windowHeight: elementHeight,
      logging: false,
    });

    // Restaura posição de rolagem e tema
    window.scrollTo(scrollLeft, scrollTop);
    if (wasDark) html.classList.add("dark");

    const imgData = canvas.toDataURL("image/png", 1.0);
    
    // Cria PDF em formato A4
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calcula dimensões da imagem no PDF (mantendo proporção)
    const imgWidth = pageWidth - 10; // Margem de 5mm de cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 5; // Margem superior de 5mm
    let remainingHeight = imgHeight;

    // Adiciona primeira página
    pdf.addImage(imgData, "PNG", 5, yPosition, imgWidth, imgHeight, undefined, "FAST");
    remainingHeight -= (pageHeight - 10); // Desconta margens (5mm topo + 5mm base)

    // Adiciona páginas adicionais se necessário
    while (remainingHeight > 0) {
      pdf.addPage();
      yPosition = 5 - (imgHeight - remainingHeight); // Posiciona para continuar a imagem
      pdf.addImage(imgData, "PNG", 5, yPosition, imgWidth, imgHeight, undefined, "FAST");
      remainingHeight -= (pageHeight - 10);
    }

    pdf.save("ficha-tormenta20.pdf");

  } catch (err: any) {
    console.error("Erro ao exportar PDF:", err);
    alert("Não foi possível gerar o PDF. Erro: " + (err?.message || "Desconhecido"));
    // Garante restauração mesmo em caso de erro
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
  }
}

