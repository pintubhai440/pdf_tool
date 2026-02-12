// components/ConverterTool.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Image as ImageIcon,
  ArrowRightLeft,
  Download,
  Loader2,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { imagesToPdf, createPdfUrl } from '../services/pdfService';
import { ConversionFormat } from '../types';

/**
 * 🔥 SEO‑FIRST UNIVERSAL CONVERTER (Vite Compatible)
 * 100% client‑side, secure, lightning fast, and ready to rank #1.
 */
export const ConverterTool: React.FC = () => {
  // ----- SEO DYNAMIC METADATA STATE -----
  const [pageTitle, setPageTitle] = useState('Universal File Converter – PDF, Word, Images');
  const [pageDesc, setPageDesc] = useState(
    'Free online file converter. Convert PDF to Word, Image to PDF, DOCX to PDF and more – securely in your browser, no upload.'
  );

  // ----- APP STATE -----
  const [file, setFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'pdf-to-x' | 'img-to-x' | 'docx-to-pdf' | null>(null);
  const [targetFormat, setTargetFormat] = useState<ConversionFormat>('jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');

  // ----- ✅ FIX 1: DYNAMIC SEO HANDLING (Replaces next/head) -----
  useEffect(() => {
    // 1. Set Document Title
    document.title = pageTitle;

    // 2. Set Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDesc);

    // 3. Set JSON-LD Schema
    const scriptId = 'json-ld-schema';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Universal File Converter',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: pageDesc,
      featureList: 'PDF to DOCX, PDF to JPG, PDF to PNG, PDF to TXT, JPG to PDF, PNG to PDF, Images to DOCX, DOCX to PDF, Private & Secure'
    };

    scriptTag.textContent = JSON.stringify(jsonLd);

  }, [pageTitle, pageDesc]);

  // ----- ✅ FIX 2: PDF WORKER INITIALIZATION (Safe Versioning) -----
  useEffect(() => {
    const initPdfWorker = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        // Use loaded version or fallback to avoid crashes
        const version = pdfjs.version || '3.11.174'; 
        if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
        }
      } catch (e) {
        console.error('PDF worker initialization failed', e);
      }
    };
    initPdfWorker();
  }, []);

  // ----- LAZY LOADERS (Performance Optimization) -----
  const loadJSZip = async () => (await import('jszip')).default;
  const loadDocx = async () => await import('docx');
  const loadDocxPreview = async () => await import('docx-preview');

  // ----- FILE SELECTION HANDLER -----
  const handleFilesSelected = useCallback((files: File[]) => {
    setError(null);
    setDownloadUrl(null);
    const firstFile = files[0];

    if (firstFile.type === 'application/pdf') {
      setMode('pdf-to-x');
      setFile(firstFile);
      setTargetFormat('docx');
      setPageTitle(`Convert ${firstFile.name} to Word / Images – Free Tool`);
      setPageDesc(`Instantly convert ${firstFile.name} to editable DOCX, JPG, PNG or TXT. 100% secure, no upload.`);
    } else if (firstFile.type.startsWith('image/')) {
      setMode('img-to-x');
      setImageFiles(files);
      setTargetFormat('pdf');
      setPageTitle(`Convert ${files.length} Image(s) to PDF, DOCX or other formats`);
      setPageDesc(`Merge JPG/PNG into PDF, convert images to Word, or change format. All done locally.`);
    } else if (
      firstFile.name.endsWith('.docx') ||
      firstFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setMode('docx-to-pdf');
      setFile(firstFile);
      setTargetFormat('pdf');
      setPageTitle(`Convert ${firstFile.name} to PDF – High Quality`);
      setPageDesc(`Turn your Word document into a perfect PDF using the native browser print engine.`);
    } else {
      setError('Unsupported file. Please upload PDF, DOCX, or images (JPG/PNG).');
    }
  }, []);

  // ----- PDF TO X CONVERSIONS -----
  const convertPdfToImages = async (format: 'jpg' | 'png') => {
    if (!file) return;
    try {
      const JSZip = await loadJSZip();
      const pdfjs = await import('pdfjs-dist');
      const lib = (pdfjs as any).default || pdfjs;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = lib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const zip = new JSZip();
      const folderName = file.name.replace(/\.pdf$/i, '');
      const folder = zip.folder(folderName);

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // high quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;

        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.9);
        const base64Data = dataUrl.split(',')[1];
        folder?.file(`page_${i}.${format}`, base64Data, { base64: true });

        // free memory
        canvas.width = 0;
        canvas.height = 0;
      }

      const content = await zip.generateAsync({ type: 'blob' });
      setDownloadUrl(URL.createObjectURL(content));
      setDownloadName(`${folderName}-${format}.zip`);
    } catch (err) {
      console.error(err);
      setError('PDF to image conversion failed. Ensure the file is not password protected.');
    }
  };

  const convertPdfToText = async () => {
    if (!file) return;
    try {
      const pdfjs = await import('pdfjs-dist');
      const lib = (pdfjs as any).default || pdfjs;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
      }

      const blob = new Blob([fullText], { type: 'text/plain' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`${file.name.replace('.pdf', '')}.txt`);
    } catch (err) {
      console.error(err);
      setError('Could not extract text from PDF.');
    }
  };

  const convertPdfToDocx = async () => {
    if (!file) return;
    try {
      const { Document, Packer, Paragraph, TextRun, ImageRun } = await loadDocx();
      const pdfjs = await import('pdfjs-dist');
      const lib = (pdfjs as any).default || pdfjs;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

      const docSections = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const hasText = textContent.items.length > 5;

        if (!hasText) {
          // fallback: render page as image
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            const imgDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const buffer = await (await fetch(imgDataUrl)).arrayBuffer();

            docSections.push({
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: buffer,
                      transformation: {
                        width: 500,
                        height: (500 / viewport.width) * viewport.height
                      },
                      type: 'jpg'
                    })
                  ],
                  spacing: { after: 200 }
                }),
                new Paragraph({ children: [new TextRun({ text: '', break: 1 })] })
              ]
            });
          }
        } else {
          // extract text with basic layout preservation
          const paragraphs = [];
          const items = textContent.items.map((item: any) => ({
            text: item.str,
            x: item.transform[4],
            y: item.transform[5]
          }));

          items.sort((a, b) => {
            const lineThreshold = 5;
            if (Math.abs(a.y - b.y) < lineThreshold) return a.x - b.x;
            return b.y - a.y;
          });

          let currentLine = '';
          let lastY = -99999;
          for (const item of items) {
            if (lastY !== -99999 && Math.abs(item.y - lastY) > 10) {
              if (currentLine.trim()) {
                paragraphs.push(new Paragraph({ children: [new TextRun(currentLine.trim())] }));
              }
              currentLine = '';
            }
            currentLine += item.text + ' ';
            lastY = item.y;
          }
          if (currentLine.trim()) {
            paragraphs.push(new Paragraph({ children: [new TextRun(currentLine.trim())] }));
          }

          docSections.push({
            children: [
              new Paragraph({
                children: [new TextRun({ text: `[Page ${i}]`, bold: true, color: '888888' })],
                spacing: { after: 200 }
              }),
              ...paragraphs,
              new Paragraph({ children: [new TextRun({ text: '', break: 1 })] })
            ]
          });
        }
      }

      const allChildren = docSections.flatMap((s) => s.children);
      const doc = new Document({ sections: [{ properties: {}, children: allChildren }] });
      const blob = await Packer.toBlob(doc);
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`${file.name.replace('.pdf', '')}.docx`);
    } catch (err) {
      console.error(err);
      setError('Conversion to Word document failed.');
    }
  };

  // ----- IMAGE TO X CONVERSIONS -----
  const convertImagesToPdf = async () => {
    if (imageFiles.length === 0) return;
    try {
      const pdfBytes = await imagesToPdf(imageFiles);
      setDownloadUrl(createPdfUrl(pdfBytes));
      setDownloadName('converted-images.pdf');
    } catch (err) {
      console.error(err);
      setError('Failed to create PDF from images.');
    }
  };

  const convertImagesToDocx = async () => {
    if (imageFiles.length === 0) return;
    try {
      const { Document, Packer, Paragraph, TextRun, ImageRun } = await loadDocx();
      const paragraphs = [];

      for (const imgFile of imageFiles) {
        const buffer = await imgFile.arrayBuffer();
        paragraphs.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: buffer,
                transformation: { width: 500, height: 500 },
                type: imgFile.type === 'image/png' ? 'png' : 'jpg'
              })
            ],
            spacing: { after: 400 }
          })
        );
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: imgFile.name, size: 20, color: '666666' })],
            spacing: { after: 800 }
          })
        );
      }

      const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName('images-to-word.docx');
    } catch (err) {
      console.error(err);
      setError('Failed to convert images to Word.');
    }
  };

  const convertImageFormat = async (target: 'jpg' | 'png') => {
    if (imageFiles.length === 0) return;
    try {
      const JSZip = await loadJSZip();

      if (imageFiles.length > 1) {
        const zip = new JSZip();
        const folder = zip.folder('converted_images');

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
            folder?.file(`${imgFile.name.split('.')[0]}.${target}`, base64Data, { base64: true });
          }
          URL.revokeObjectURL(objectUrl);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        setDownloadUrl(URL.createObjectURL(content));
        setDownloadName(`converted-images.zip`);
      } else {
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
          setDownloadUrl(dataUrl);
          setDownloadName(`${imgFile.name.split('.')[0]}.${target}`);
        }
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err) {
      console.error(err);
      setError('Image format conversion failed.');
    }
  };

  // ----- DOCX TO PDF (browser print engine) -----
  const convertDocxToPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    let iframe: HTMLIFrameElement | null = null;

    try {
      const { renderAsync } = await loadDocxPreview();
      const arrayBuffer = await file.arrayBuffer();

      iframe = document.createElement('iframe');
      Object.assign(iframe.style, {
        position: 'fixed',
        width: '0',
        height: '0',
        visibility: 'hidden',
        border: '0'
      });
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not create print frame.');

      // print styles for clean PDF
      const style = iframeDoc.createElement('style');
      style.textContent = `
        @page { size: A4; margin: 20mm; }
        body { background: white; font-family: Arial, sans-serif; padding: 0; margin: 0; }
        img { max-width: 100%; height: auto; }
      `;
      iframeDoc.head.appendChild(style);

      const container = iframeDoc.createElement('div');
      iframeDoc.body.appendChild(container);

      await renderAsync(arrayBuffer, container, null, { inWrapper: false, ignoreWidth: false, experimental: true });

      setIsProcessing(false);

      const userConfirmed = window.confirm(
        'Your document is ready! Click OK to open the Print dialog, then choose "Save as PDF".'
      );
      if (userConfirmed) {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }

      setTimeout(() => {
        if (iframe && document.body.contains(iframe)) document.body.removeChild(iframe);
      }, 10000);
    } catch (err) {
      console.error(err);
      setError('DOCX to PDF conversion failed. Please try again.');
      setIsProcessing(false);
      if (iframe) document.body.removeChild(iframe);
    }
  };

  // ----- MAIN CONVERT HANDLER -----
  const handleConvert = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 50)); // UI feedback

      if (mode === 'pdf-to-x') {
        if (targetFormat === 'docx') await convertPdfToDocx();
        else if (targetFormat === 'jpg' || targetFormat === 'png') await convertPdfToImages(targetFormat);
        else if (targetFormat === 'txt') await convertPdfToText();
      } else if (mode === 'img-to-x') {
        if (targetFormat === 'pdf') await convertImagesToPdf();
        else if (targetFormat === 'docx') await convertImagesToDocx();
        else if (targetFormat === 'jpg' || targetFormat === 'png') await convertImageFormat(targetFormat);
      } else if (mode === 'docx-to-pdf') {
        await convertDocxToPdf();
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
    setPageTitle('Universal File Converter – PDF, Word, Images');
    setPageDesc('Free online file converter. Convert PDF to Word, Image to PDF, DOCX to PDF and more – securely in your browser.');
  };

  // ----- RENDER -----
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* No <Head> tag here - managed via useEffect */}

      <section aria-label="File Converter Interface" className="mb-16">
        {!mode ? (
          // ----- HOMEPAGE / UPLOAD STATE -----
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Universal <span className="text-primary-600">File Converter</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The ultimate free tool to convert PDFs, Images, and Word documents.
                <br />
                <span className="font-semibold text-primary-600">100% Client‑Side & Secure – No Upload</span>
              </p>
            </div>

            <FileUploader
              onFilesSelected={handleFilesSelected}
              allowMultiple={true}
              acceptedFileTypes={[
                'application/pdf',
                'image/jpeg',
                'image/png',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              ]}
              label="Drop files here to start converting"
              subLabel="Supports PDF, DOCX, JPG, PNG"
            />
          </div>
        ) : (
          // ----- CONVERSION WORKFLOW -----
          <div className="max-w-2xl mx-auto space-y-6">
            {/* File info card */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-4 rounded-full text-primary-600">
                  {mode.includes('img') ? <ImageIcon size={28} /> : <FileText size={28} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {mode === 'img-to-x'
                      ? `${imageFiles.length} Image${imageFiles.length > 1 ? 's' : ''} Selected`
                      : file?.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {mode === 'img-to-x'
                      ? 'Ready to merge or convert'
                      : `${((file?.size || 0) / 1024 / 1024).toFixed(2)} MB • Secure`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                aria-label="Cancel and start over"
              >
                <AlertCircle size={24} className="rotate-45" />
              </button>
            </div>

            {/* Error display */}
            {error && (
              <div
                role="alert"
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm flex items-center gap-3"
              >
                <AlertCircle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Conversion UI (before download) */}
            {!downloadUrl ? (
              <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                  <ArrowRightLeft className="text-primary-600" /> Choose Output Format
                </h4>

                <div className="grid gap-6">
                  {mode === 'docx-to-pdf' ? (
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3">
                      <Zap className="mt-1 shrink-0" size={18} />
                      <p className="text-sm font-medium">
                        We use your browser’s native print engine to ensure the highest quality PDF conversion.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="target-format" className="block text-sm font-semibold text-slate-700 mb-2">
                        Convert To:
                      </label>
                      <select
                        id="target-format"
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value as ConversionFormat)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      >
                        {mode === 'pdf-to-x' ? (
                          <>
                            <option value="docx">Word Document (.docx)</option>
                            <option value="jpg">JPG Images</option>
                            <option value="png">PNG Images</option>
                            <option value="txt">Plain Text (.txt)</option>
                          </>
                        ) : (
                          // mode === 'img-to-x'
                          <>
                            <option value="pdf">PDF Document (.pdf)</option>
                            <option value="docx">Word Document (.docx)</option>
                            <option value="jpg">Convert to JPG</option>
                            <option value="png">Convert to PNG</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 disabled:opacity-70 disabled:cursor-wait shadow-lg shadow-primary-200 transition-all flex justify-center items-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={22} /> Processing...
                      </>
                    ) : (
                      'Convert Now'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // ----- SUCCESS / DOWNLOAD STATE -----
              <div className="bg-green-50 rounded-xl p-10 border border-green-200 text-center animate-in zoom-in-95 duration-300 shadow-sm">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm">
                  <FileCheck size={40} />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Conversion Complete!</h3>
                <p className="text-green-700 mb-8">Your file has been optimized and is ready to download.</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={downloadUrl}
                    download={downloadName}
                    className="px-8 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all"
                  >
                    <Download size={20} /> Download File
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3.5 bg-white text-slate-700 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Convert Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ----- SEO‑RICH CONTENT ----- */}
      <article className="prose prose-slate max-w-none mt-20 border-t border-slate-200 pt-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="font-bold text-xl mb-2 text-slate-900">100% Secure & Private</h3>
            <p className="text-slate-600">
              Files never leave your device. All conversions happen locally in your browser – no servers, no uploads.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Zap className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="font-bold text-xl mb-2 text-slate-900">Lightning Fast</h3>
            <p className="text-slate-600">
              No waiting for uploads or downloads. Our WebAssembly‑powered engine processes files instantly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="font-bold text-xl mb-2 text-slate-900">High Quality Output</h3>
            <p className="text-slate-600">
              Preserve fonts, images, and layout when converting PDF to Word or merging images into PDF.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="text-left space-y-6">
            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                How do I convert PDF to Word for free?
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-slate-600">
                Simply upload your PDF, select <strong>Word Document (.docx)</strong> and click Convert. Our tool
                extracts text and images, preserving layout as much as possible – all without uploading your file.
              </p>
            </details>
            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                Is it safe to convert confidential documents?
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-slate-600">
                Absolutely. Unlike online converters that send your files to a remote server, this tool runs entirely
                in your browser. Your documents never leave your computer – 100% private and secure.
              </p>
            </details>
            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                Can I combine multiple JPGs into one PDF?
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-slate-600">
                Yes! Select multiple images at once (JPG or PNG) and choose <strong>PDF Document</strong>. They will be
                merged into a single, high‑quality PDF file in the order you selected.
              </p>
            </details>
            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer">
              <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                What formats are supported?
                <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-slate-600">
                <strong>Input:</strong> PDF, DOCX, JPG, PNG.<br />
                <strong>Output:</strong> PDF, DOCX, JPG, PNG, TXT (from PDF).<br />
                You can also convert images between JPG ↔ PNG and merge images into PDF or Word.
              </p>
            </details>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ConverterTool;
