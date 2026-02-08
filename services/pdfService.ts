import { PDFDocument } from 'pdf-lib';

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const savedPdf = await mergedPdf.save();
  return savedPdf;
};

export const removePagesFromPdf = async (file: File, pagesToRemove: number[]): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();
  
  // Create a new PDF
  const newPdf = await PDFDocument.create();
  
  // Calculate indices to keep
  const indicesToKeep = [];
  for (let i = 0; i < totalPages; i++) {
    if (!pagesToRemove.includes(i)) {
      indicesToKeep.push(i);
    }
  }
  
  const copiedPages = await newPdf.copyPages(pdfDoc, indicesToKeep);
  copiedPages.forEach((page) => newPdf.addPage(page));
  
  return await newPdf.save();
};

export const imagesToPdf = async (files: File[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;
    
    // Embed based on type
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue; // Skip unsupported
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return await pdfDoc.save();
};

export const createPdfUrl = (pdfBytes: Uint8Array): string => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};