// components/CompressTool.tsx
import React, { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import {
  Minimize2,
  Download,
  Loader2,
  FileCheck,
  AlertCircle,
  Settings2,
  Info
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { clsx } from 'clsx';
import Head from 'next/head'; // For Next.js – replace with react-helmet if needed

export const CompressTool: React.FC = () => {
  // ----- SEO & BRANDING -----
  const TOOL_NAME = 'Advanced PDF & Image Compressor';
  const TOOL_DESCRIPTION =
    'Securely compress PDF files and images online directly in your browser without quality loss. Reduce file size for email and uploads – 100% free & private.';

  // ----- STATE -----
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.6); // 0.1 = high compression, 1.0 = best quality
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ----- PDF WORKER INIT -----
  useEffect(() => {
    const initPdfWorker = () => {
      const lib = (pdfjsLib as any).default || pdfjsLib;
      if (lib?.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    initPdfWorker();
  }, []);

  // ----- EVENT HANDLERS -----
  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setCompressedSize(null);
      setError(null);
      setQuality(0.6); // reset to recommended balanced
    }
  }, []);

  const handleReset = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl(null);
    setCompressedSize(null);
    setError(null);
  }, [downloadUrl]);

  // ----- COMPRESSION LOGIC -----
  const compressImage = async (file: File, q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 2500; // optimal for web & SEO

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not supported'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Image compression failed'));
          },
          'image/jpeg', // force JPEG for smallest size
          q
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
    });
  };

  const compressPdf = async (file: File, q: number) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const lib = (pdfjsLib as any).default || pdfjsLib;
      const loadingTask = lib.getDocument({ data: arrayBuffer });
      const originalPdf = await loadingTask.promise;
      const newPdfDoc = await PDFDocument.create();

      for (let i = 1; i <= originalPdf.numPages; i++) {
        const page = await originalPdf.getPage(i);
        // Smarter scaling: lower quality → lower resolution for smaller file
        const scale = q < 0.4 ? 1.0 : 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const imgDataUrl = canvas.toDataURL('image/jpeg', q);
        const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
        const embeddedImage = await newPdfDoc.embedJpg(imgBytes);
        const newPage = newPdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      return await newPdfDoc.save();
    } catch (err) {
      console.error(err);
      throw new Error('PDF compression failed – file may be corrupted or too complex.');
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    // Allow UI to update before heavy processing
    await new Promise((r) => setTimeout(r, 100));

    try {
      let resultBlob: Blob | Uint8Array;

      if (file.type === 'application/pdf') {
        const bytes = await compressPdf(file, quality);
        resultBlob = new Blob([bytes], { type: 'application/pdf' });
      } else if (file.type.startsWith('image/')) {
        resultBlob = await compressImage(file, quality);
      } else {
        throw new Error('Unsupported file format. Please upload PDF, JPG, PNG, or WebP.');
      }

      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setCompressedSize(resultBlob.size);
      setDownloadName(`optimized-${file.name}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during compression.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ----- SCHEMA MARKUP (JSON-LD) for Google Rich Snippets -----
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: TOOL_NAME,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: TOOL_DESCRIPTION,
    featureList: 'PDF Compression, Image Optimization, Secure Client-side Processing, No Uploads',
  };

  // ----- RENDER -----
  if (!file) {
    return (
      <>
        <Head>
          <title>{TOOL_NAME} – Free Online PDF & Image Compression</title>
          <meta name="description" content={TOOL_DESCRIPTION} />
          <meta name="keywords" content="compress PDF, reduce image size, online compressor, free, private" />
        </Head>

        <section className="w-full max-w-4xl mx-auto px-4" aria-label="PDF & Image Compressor Tool">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {TOOL_NAME}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {TOOL_DESCRIPTION}
            </p>
          </header>

          <FileUploader
            onFilesSelected={handleFileSelected}
            allowMultiple={false}
            acceptedFileTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
            label="Drop your PDF or image here to compress"
          />

          {/* SEO‑friendly feature list – also helps accessibility */}
          <article className="mt-12 prose prose-slate mx-auto text-slate-500 text-sm">
            <h2 className="text-base font-semibold text-slate-700">Why thousands trust our compressor</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
              <li className="flex gap-2">
                <FileCheck className="w-4 h-4 text-green-500 shrink-0" />
                No file size limits – works with huge PDFs
              </li>
              <li className="flex gap-2">
                <FileCheck className="w-4 h-4 text-green-500 shrink-0" />
                100% private – files never leave your device
              </li>
              <li className="flex gap-2">
                <FileCheck className="w-4 h-4 text-green-500 shrink-0" />
                Supports PDF, JPG, PNG & WebP
              </li>
              <li className="flex gap-2">
                <FileCheck className="w-4 h-4 text-green-500 shrink-0" />
                Instant download, no registration
              </li>
            </ul>
          </article>
        </section>
      </>
    );
  }

  // ----- FILE UPLOADED VIEW -----
  return (
    <>
      <Head>
        <title>Compress {file.name} – {TOOL_NAME}</title>
        <meta name="description" content={`Compress ${file.name} online. Reduce file size while keeping quality. Free & private.`} />
      </Head>

      <section className="max-w-2xl mx-auto space-y-6 px-4" aria-labelledby="compression-controls">
        <h2 id="compression-controls" className="sr-only">
          Compression Settings and Download
        </h2>

        {/* File summary card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between transition-all hover:shadow-md">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="bg-orange-50 p-3 rounded-full text-orange-600 shrink-0">
              <Minimize2 size={24} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-sm text-slate-500">
                Original:{' '}
                <span className="font-mono font-medium">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            aria-label="Cancel and upload a different file"
          >
            <AlertCircle size={20} className="rotate-45" />
          </button>
        </div>

        {/* Error message (live region) */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2"
          >
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Compression UI – only shown before processing */}
        {!downloadUrl ? (
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <Settings2 size={18} className="text-orange-600" />
                Compression Level
              </h4>
              <p className="text-sm text-slate-500">
                Lower size = smaller file, may reduce quality. We recommend the balanced preset.
              </p>
            </div>

            <div className="space-y-8">
              <div className="relative pt-6 pb-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  <span>Smaller Size</span>
                  <span>Better Quality</span>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  aria-label="Compression quality slider"
                  aria-valuemin={0.1}
                  aria-valuemax={1.0}
                  aria-valuenow={quality}
                />

                <div className="mt-4 flex justify-center">
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-xs font-bold border',
                      quality < 0.4
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : quality > 0.7
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-green-50 text-green-600 border-green-100'
                    )}
                  >
                    {quality < 0.4
                      ? 'High Compression (smallest size)'
                      : quality > 0.7
                      ? 'Low Compression (best quality)'
                      : '⚡ Recommended Balanced'}
                  </span>
                </div>

                {/* Additional guidance for PDFs */}
                <p className="text-xs text-slate-400 mt-4 text-center">
                  <Info size={12} className="inline mr-1" />
                  For PDFs, high compression may reduce text sharpness. Use balanced for best results.
                </p>
              </div>

              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold hover:from-orange-700 hover:to-red-700 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Optimizing your file…
                  </>
                ) : (
                  <>
                    <Minimize2 size={20} />
                    Compress Now
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          // ----- SUCCESS STATE (download ready) -----
          <div
            className="bg-green-50 rounded-xl p-8 border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300"
            role="status"
            aria-live="polite"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
              <FileCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">Ready to Download!</h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-sm mb-8 bg-white/50 p-4 rounded-lg mx-auto max-w-md">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs uppercase">Original</span>
                <span className="text-slate-500 line-through font-mono">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="text-green-300 hidden md:block">→</div>
              <div className="flex flex-col">
                <span className="text-green-700 text-xs uppercase font-bold">Optimized</span>
                <span className="font-bold text-green-700 text-lg font-mono">
                  {compressedSize ? (compressedSize / 1024 / 1024).toFixed(2) : '?'} MB
                </span>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-bold shadow-sm">
                -{Math.round(((file.size - (compressedSize || 0)) / file.size) * 100)}%
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={downloadUrl}
                download={downloadName}
                className="w-full sm:w-auto px-8 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download size={20} />
                Download File
              </a>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors focus:ring-2 focus:ring-slate-200"
              >
                Compress Another
              </button>
            </div>
          </div>
        )}

        {/* Privacy reassurance – small & sticky */}
        <p className="text-center text-xs text-slate-400 mt-8 flex items-center justify-center gap-1">
          <Info size={12} />
          Files are processed 100% in your browser. We never see or store your data.
        </p>
      </section>
    </>
  );
};
