import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';
import {
  FileText,
  Image as ImageIcon,
  ArrowRightLeft,
  Download,
  Loader2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { imagesToPdf, createPdfUrl } from '../services/pdfService';
import { ConversionFormat } from '../types';
import { clsx } from 'clsx';

interface ConverterToolProps {}

export const ConverterTool: React.FC<ConverterToolProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [mode, setMode] = useState<'pdf-to-x' | 'img-to-x' | null>(null);
  const [targetFormat, setTargetFormat] = useState<ConversionFormat>('jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');

  // Initialize PDF.js worker
  useEffect(() => {
    const initPdfWorker = () => {
      const lib = (pdfjsLib as any).default || pdfjsLib;
      if (lib && lib.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    initPdfWorker();
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    setDownloadUrl(null);

    const firstFile = files[0];
    if (firstFile.type === 'application/pdf') {
      setMode('pdf-to-x');
      setFile(firstFile);
      setTargetFormat('docx'); // Default to Word
    } else if (firstFile.type.startsWith('image/')) {
      setMode('img-to-x');
      setImageFiles(files);
      setTargetFormat('pdf');   // Default to PDF
    } else {
      setError("Unsupported file type.");
    }
  };

  const convertPdfToImages = async (format: 'jpg' | 'png') => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const lib = (pdfjsLib as any).default || pdfjsLib;

      if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const loadingTask = lib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const zip = new JSZip();
      const folderName = file.name.replace(/\.pdf$/i, '');
      const folder = zip.folder(folderName);

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.9);
        const base64Data = dataUrl.split(',')[1];

        folder?.file(`page_${i}.${format}`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      setDownloadUrl(url);
      setDownloadName(`${folderName}-converted.zip`);
    } catch (err) {
      console.error(err);
      setError("Failed to convert PDF to images.");
    }
  };

  const convertPdfToText = async () => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const lib = (pdfjsLib as any).default || pdfjsLib;

      if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const loadingTask = lib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
      }

      const blob = new Blob([fullText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`${file.name.replace('.pdf', '')}.txt`);
    } catch (err) {
      console.error(err);
      setError("Failed to extract text.");
    }
  };

  const convertPdfToDocx = async () => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const lib = (pdfjsLib as any).default || pdfjsLib;

      if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const loadingTask = lib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const docSections = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items;

        const paragraphs = [];

        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: `[Page ${i}]`, bold: true, color: "888888" })],
          spacing: { after: 200 }
        }));

        let currentLine = "";
        let lastY = -1;

        for (const item of items as any[]) {
          if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 10) {
            paragraphs.push(new Paragraph({ children: [new TextRun(currentLine)] }));
            currentLine = "";
          }
          currentLine += item.str + " ";
          lastY = item.transform[5];
        }
        if (currentLine) {
          paragraphs.push(new Paragraph({ children: [new TextRun(currentLine)] }));
        }

        if (i < pdf.numPages) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: "", break: 1 })]
          }));
        }

        docSections.push({
          children: paragraphs
        });
      }

      const allChildren = docSections.flatMap(s => s.children);

      const doc = new Document({
        sections: [{
          properties: {},
          children: allChildren
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`${file.name.replace('.pdf', '')}.docx`);
    } catch (err) {
      console.error(err);
      setError("Failed to convert to Word document.");
    }
  };

  const convertImagesToPdf = async () => {
    if (imageFiles.length === 0) return;
    try {
      const pdfBytes = await imagesToPdf(imageFiles);
      const url = createPdfUrl(pdfBytes);
      setDownloadUrl(url);
      setDownloadName(`converted-images.pdf`);
    } catch (err) {
      console.error(err);
      setError("Failed to convert images to PDF.");
    }
  };

  const convertImagesToDocx = async () => {
    if (imageFiles.length === 0) return;
    try {
      const paragraphs = [];

      for (const imgFile of imageFiles) {
        const buffer = await imgFile.arrayBuffer();
        paragraphs.push(new Paragraph({
          children: [
            new ImageRun({
              data: buffer,
              transformation: { width: 500, height: 500 },
              type: imgFile.type === 'image/png' ? "png" : "jpg"
            })
          ],
          spacing: { after: 400 }
        }));

        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: imgFile.name, size: 20, color: "666666" })],
          spacing: { after: 800 }
        }));
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`converted-images.docx`);
    } catch (err) {
      console.error(err);
      setError("Failed to convert images to Word.");
    }
  };

  // ====== UPDATED: Image Format Conversion (single direct download / multiple ZIP) ======
  const convertImageFormat = async (target: 'jpg' | 'png') => {
    if (imageFiles.length === 0) return;

    try {
      // Multiple files → bundle into ZIP (better UX)
      if (imageFiles.length > 1) {
        const zip = new JSZip();
        const folder = zip.folder("converted_images");

        for (const imgFile of imageFiles) {
          const img = new Image();
          const objectUrl = URL.createObjectURL(imgFile);
          img.src = objectUrl;
          await new Promise((resolve) => { img.onload = resolve; });

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const mimeType = target === 'jpg' ? 'image/jpeg' : 'image/png';
            const dataUrl = canvas.toDataURL(mimeType, 0.9);
            const base64Data = dataUrl.split(',')[1];
            folder?.file(imgFile.name.split('.')[0] + `.${target}`, base64Data, { base64: true });
          }
          URL.revokeObjectURL(objectUrl);
        }

        const content = await zip.generateAsync({ type: "blob" });
        setDownloadUrl(URL.createObjectURL(content));
        setDownloadName(`converted-images.zip`);
      }
      // Single file → direct image download (no ZIP)
      else {
        const imgFile = imageFiles[0];
        const img = new Image();
        const objectUrl = URL.createObjectURL(imgFile);
        img.src = objectUrl;
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const mimeType = target === 'jpg' ? 'image/jpeg' : 'image/png';
          const dataUrl = canvas.toDataURL(mimeType, 0.9);

          // Direct download via data URL
          setDownloadUrl(dataUrl);
          setDownloadName(imgFile.name.split('.')[0] + `.${target}`);
        }
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err) {
      console.error(err);
      setError("Image conversion failed.");
    }
  };
  // =====================================================================================

  const handleConvert = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (mode === 'pdf-to-x') {
        if (targetFormat === 'jpg' || targetFormat === 'png') {
          await convertPdfToImages(targetFormat);
        } else if (targetFormat === 'txt') {
          await convertPdfToText();
        } else if (targetFormat === 'docx') {
          await convertPdfToDocx();
        }
      } else if (mode === 'img-to-x') {
        if (targetFormat === 'pdf') {
          await convertImagesToPdf();
        } else if (targetFormat === 'docx') {
          await convertImagesToDocx();
        } else if (targetFormat === 'jpg' || targetFormat === 'png') {
          await convertImageFormat(targetFormat);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImageFiles([]);
    setMode(null);
    setDownloadUrl(null);
    setError(null);
  };

  if (!mode) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Universal Converter</h3>
          <p className="text-slate-500">Upload any file to see available conversion options (PDF, JPG, PNG).</p>
        </div>
        <FileUploader
          onFilesSelected={handleFilesSelected}
          allowMultiple={true}
          acceptedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
          label="Click or Drag PDF or Images here"
          subLabel="Support for: PDF, JPG, PNG"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* File Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-50 p-3 rounded-full text-primary-600">
            {mode === 'pdf-to-x' ? <FileText size={24} /> : <ImageIcon size={24} />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {mode === 'pdf-to-x' ? file?.name : `${imageFiles.length} Image(s)`}
            </h3>
            <p className="text-sm text-slate-500">
              {mode === 'pdf-to-x'
                ? `PDF Document • ${(file!.size / 1024 / 1024).toFixed(2)} MB`
                : 'Ready to convert'
              }
            </p>
          </div>
        </div>
        <button onClick={handleReset} className="text-slate-400 hover:text-red-500 p-2">
          <AlertCircle size={20} className="rotate-45" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Options Card */}
      {!downloadUrl ? (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h4 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
            <ArrowRightLeft size={18} />
            Conversion Options
          </h4>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-slate-500 mb-1">Convert To:</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as ConversionFormat)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {mode === 'pdf-to-x' ? (
                  <>
                    <option value="docx">Word Document (DOCX)</option>
                    <option value="jpg">JPG Images</option>
                    <option value="png">PNG Images</option>
                    <option value="txt">Text (TXT)</option>
                  </>
                ) : (
                  <>
                    <option value="pdf">PDF Document</option>
                    <option value="docx">Word Document (DOCX)</option>
                    <option value="jpg">Convert to JPG</option>
                    <option value="png">Convert to PNG</option>
                  </>
                )}
              </select>
            </div>

            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Converting...
                </>
              ) : (
                'Convert Now'
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Success State */
        <div className="bg-green-50 rounded-xl p-8 border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <FileCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Conversion Successful!</h3>
          <p className="text-green-700 mb-6">Your file is ready for download.</p>

          <div className="flex items-center justify-center gap-4">
            <a
              href={downloadUrl}
              download={downloadName}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Download size={20} />
              Download File
            </a>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
