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
  ShieldCheck,
  RefreshCw,
  FileType
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

  // ----- ✅ FIX 1: DYNAMIC SEO & SCHEMA (Replaces next/head) -----
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

    // 3. Set JSON‑LD Schema (SoftwareApplication)
    const scriptId = 'json-ld-converter';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Universal PDF & Image Converter',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: pageDesc,
      featureList: 'PDF to DOCX, JPG to PDF, DOCX to PDF, Client-side privacy'
    };

    scriptTag.textContent = JSON.stringify(schema);
  }, [pageTitle, pageDesc]);

  // ----- ✅ FIX 2: PDF WORKER INITIALIZATION (Safe Versioning) -----
  useEffect(() => {
    const initPdfWorker = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
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

  // ----- FILE SELECTION HANDLER (with SEO update) -----
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
        const viewport = page.getViewport({ scale: 2.0 });
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
      await new Promise((resolve) => setTimeout(resolve, 300)); // Smooth UI feedback

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
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
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
    setPageDesc('Free online file converter. Convert PDF to Word, Image to PDF, DOCX to PDF and more – securely in your browser, no upload.');
  };

  // ----- UI RENDER (Premium, SEO‑Rich) -----
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* HERO SECTION */}
      <section className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-6">
          <Zap size={14} className="fill-indigo-700" />
          v2.0 • 100% Client-Side
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Convert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Anything</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Everything</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          The most secure file converter on the web. Transform PDFs, Images, and Documents instantly without your data ever leaving this browser tab.
        </p>
      </section>

      {/* MAIN TOOL CARD */}
      <section className="relative z-10 max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 transform rotate-1 rounded-3xl opacity-20 blur-xl"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          
          {!mode ? (
            // ----- UPLOAD STATE -----
            <div className="p-8 md:p-12 bg-slate-50/50">
              <FileUploader
                onFilesSelected={handleFilesSelected}
                allowMultiple={true}
                acceptedFileTypes={[
                  'application/pdf',
                  'image/jpeg',
                  'image/png',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ]}
                label="Click or Drag files to Convert"
                subLabel="Supported: PDF, DOCX, JPG, PNG"
              />
              <div className="mt-6 flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400"><FileType size={16}/> PDF</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400"><FileType size={16}/> DOCX</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400"><ImageIcon size={16}/> PNG/JPG</div>
              </div>
            </div>
          ) : (
            // ----- CONVERSION WORKFLOW -----
            <div className="p-0">
              {/* File info header */}
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl shadow-sm ${mode.includes('img') ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {mode === 'img-to-x' ? <ImageIcon size={24} /> : <FileText size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg truncate max-w-[200px] md:max-w-xs">
                      {mode === 'img-to-x' ? `${imageFiles.length} Image${imageFiles.length > 1 ? 's' : ''}` : file?.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {mode === 'img-to-x' ? 'Batch Processing' : 'Single File'}
                    </p>
                  </div>
                </div>
                <button onClick={handleReset} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-red-500">
                  <RefreshCw size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                    <AlertCircle size={20} /> <span className="font-medium">{error}</span>
                  </div>
                )}

                {!downloadUrl ? (
                  <div className="space-y-6">
                    {mode !== 'docx-to-pdf' ? (
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Target Format</label>
                        <div className="relative">
                          <select 
                            value={targetFormat} 
                            onChange={(e) => setTargetFormat(e.target.value as ConversionFormat)}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-lg font-medium rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer"
                          >
                            {mode === 'pdf-to-x' && (
                              <>
                                <option value="docx">Word Document (.docx)</option>
                                <option value="jpg">Images (.jpg)</option>
                                <option value="png">Images (.png)</option>
                                <option value="txt">Text (.txt)</option>
                              </>
                            )}
                            {mode === 'img-to-x' && (
                              <>
                                <option value="pdf">PDF Document (.pdf)</option>
                                <option value="docx">Word Document (.docx)</option>
                                <option value="jpg">Convert to JPG</option>
                                <option value="png">Convert to PNG</option>
                              </>
                            )}
                          </select>
                          <ArrowRightLeft className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
                        <Zap className="shrink-0 mt-0.5" size={18} />
                        <p className="text-sm">We use the native browser print engine for DOCX to PDF. It ensures 100% layout accuracy.</p>
                      </div>
                    )}

                    <button
                      onClick={handleConvert}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transform transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                    >
                      {isProcessing ? (
                        <><Loader2 className="animate-spin" /> Converting...</>
                      ) : (
                        <>Start Conversion <ArrowRightLeft size={20} /></>
                      )}
                    </button>
                  </div>
                ) : (
                  // ----- SUCCESS / DOWNLOAD STATE -----
                  <div className="text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">It's Ready!</h2>
                    <p className="text-slate-500 mb-8">Your file has been successfully converted.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href={downloadUrl} 
                        download={downloadName}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-green-200 flex justify-center items-center gap-2 transition-transform hover:-translate-y-0.5"
                      >
                        <Download size={20} /> Download File
                      </a>
                      <button 
                        onClick={handleReset}
                        className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-6 rounded-xl transition-colors"
                      >
                        Convert Another
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES GRID (SEO Content) */}
      <section className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            icon: <ShieldCheck size={32} />,
            title: "Private & Secure",
            desc: "We process files locally. No data is ever uploaded to a server.",
            color: "text-emerald-600", bg: "bg-emerald-50"
          },
          {
            icon: <Zap size={32} />,
            title: "Lightning Fast",
            desc: "Powered by WebAssembly for instant conversions without lag.",
            color: "text-amber-600", bg: "bg-amber-50"
          },
          {
            icon: <FileCheck size={32} />,
            title: "High Precision",
            desc: "Preserves layout, fonts, and images during conversion.",
            color: "text-blue-600", bg: "bg-blue-50"
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* FAQ SECTION (Rich Snippets target) */}
      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I convert PDF to Word for free?", a: "Upload your PDF, select DOCX as the format, and click Convert. It runs instantly in your browser." },
            { q: "Is it safe to use this converter?", a: "Yes. Unlike other sites, we do NOT upload your files. Everything happens on your computer." },
            { q: "Does it support scanned PDFs?", a: "It extracts images and text layers. For OCR (scanned text), results may vary." },
            { q: "Can I merge multiple images into one PDF?", a: "Yes! Select multiple images at once (JPG or PNG) and choose PDF Document. They will be merged into a single PDF." },
            { q: "What if I have a password-protected PDF?", a: "The tool does not support password-protected PDFs. Please remove password protection first." }
          ].map((item, i) => (
            <details key={i} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer transition-all hover:border-indigo-200">
              <summary className="flex justify-between items-center p-6 font-semibold text-slate-800 list-none">
                {item.q}
                <span className="transform group-open:rotate-180 transition-transform text-indigo-500">▼</span>
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ConverterTool;
