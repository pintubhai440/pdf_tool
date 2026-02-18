// services/pdfService.ts
import { PDFDocument } from 'pdf-lib';

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // सुधार: यहाँ से { ignoreEncryption: true } हटा दिया है।
      // अब अगर PDF लॉक होगी, तो pdf-lib तुरंत एरर फेंक देगा।
      const pdf = await PDFDocument.load(arrayBuffer); 
      
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));

    } catch (error: any) {
      console.error(`Error processing file ${file.name}:`, error);

      // अगर फाइल पासवर्ड प्रोटेक्टेड है, तो यह खास एरर पकड़ लेगा
      if (error.message && error.message.toLowerCase().includes('encrypted')) {
         throw new Error(`File "${file.name}" password protected hai. Kripya pehle password hatayein.`);
      }
      
      // अगर फाइल करप्ट है
      throw new Error(`File "${file.name}" merge nahi ho payi. Ye file corrupted ho sakti hai.`);
    }
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
