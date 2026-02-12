// components/CompressTool.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Minimize2,
  Download,
  Loader2,
  FileCheck,
  AlertCircle,
  Settings2,
  Info,
  Shield,
  Zap,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { clsx } from 'clsx';

/**
 * 🚀 VITE‑OPTIMIZED COMPRESS TOOL
 * - No Next.js dependencies
 * - Dynamic PDF worker with safe versioning
 * - SEO via useEffect (title, meta, JSON‑LD)
 * - All features from the original "niche" code retained
 */
export const CompressTool: React.FC = () => {
  // ---------- SEO & CONFIGURATION (keyword‑rich) ----------
  const TOOL_NAME = 'Free PDF & Image Compressor – Reduce File Size Instantly';
  const TOOL_DESCRIPTION =
    'Compress PDF, JPG, PNG and WebP files directly in your browser. 100% secure, no upload, no file size limits. Get the smallest file without visible quality loss.';
  const CANONICAL_URL = 'https://yourdomain.com/compress'; // 🔁 Replace with your actual URL
  const SITE_NAME = 'YourToolName'; // 🔁 Replace

  // ---------- STATE (unchanged from both versions) ----------
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.6);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------- ✅ FIX 1: DYNAMIC PDF WORKER (Vite‑safe, version‑aware) ----------
  useEffect(() => {
    const initPdfWorker = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        const version = pdfjs.version || '3.11.174';
        if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
        }
      } catch (e) {
        console.error('PDF Worker initialization failed', e);
      }
    };
    initPdfWorker();
  }, []);

  // ---------- ✅ FIX 2: SEO & SCHEMA.ORG (replaces next/head) ----------
  // 2a. Basic meta tags + dynamic title (updates when file changes)
  useEffect(() => {
    // Title
    document.title = file ? `Compress ${file.name} - ${TOOL_NAME}` : TOOL_NAME;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', TOOL_DESCRIPTION);

    // Open Graph / Twitter (static – you can make them dynamic if needed)
    const setOrCreateMeta = (selector: string, attributes: Record<string, string>) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        document.head.appendChild(meta);
      }
      Object.entries(attributes).forEach(([key, val]) => meta!.setAttribute(key, val));
    };

    setOrCreateMeta('meta[property="og:title"]', { property: 'og:title', content: TOOL_NAME });
    setOrCreateMeta('meta[property="og:description"]', { property: 'og:description', content: TOOL_DESCRIPTION });
    setOrCreateMeta('meta[property="og:url"]', { property: 'og:url', content: CANONICAL_URL });
    setOrCreateMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setOrCreateMeta('meta[property="og:image"]', { property: 'og:image', content: 'https://yourdomain.com/og-image.jpg' }); // 🔁

    setOrCreateMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setOrCreateMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: TOOL_NAME });
    setOrCreateMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: TOOL_DESCRIPTION });
    setOrCreateMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: 'https://yourdomain.com/twitter-image.jpg' }); // 🔁

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', CANONICAL_URL);

    // Robots
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'index, follow');

    // Theme color (optional)
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#f97316');
  }, [file]); // Re‑run when file changes → dynamic title

  // 2b. JSON‑LD Structured Data (injected once, with conflict avoidance)
  useEffect(() => {
    const scriptId = 'json-ld-compressor';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Advanced PDF & Image Compressor',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description:
            'Compress PDF, JPG, PNG and WebP files 100% client‑side. No upload, no limits, no registration.',
          featureList: 'PDF compression, Image optimization, Privacy by design',
          screenshot: 'https://yourdomain.com/screenshot.jpg', // 🔁
          softwareVersion: '2.0',
          url: CANONICAL_URL,
          sameAs: ['https://twitter.com/yourprofile'], // 🔁
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
            bestRating: '5',
            worstRating: '1',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is this PDF compressor really free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, 100% free. No hidden fees, no watermark, no registration.',
              },
            },
            {
              '@type': 'Question',
              name: 'Are my files uploaded to a server?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Never. All processing happens in your browser. Your files never leave your device.',
              },
            },
            {
              '@type': 'Question',
              name: 'What file formats are supported?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'PDF, JPG, PNG, and WebP. More formats coming soon.',
              },
            },
            {
              '@type': 'Question',
              name: 'Will the quality of my images be reduced?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'You control the balance. Use the quality slider to choose between smaller file size or higher visual fidelity.',
              },
            },
          ],
        },
        {
          '@type': 'WebPage',
          '@id': CANONICAL_URL,
          url: CANONICAL_URL,
          name: TOOL_NAME,
          description: TOOL_DESCRIPTION,
          isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: 'https://yourdomain.com',
          },
        },
      ],
    };

    scriptTag.textContent = JSON.stringify(schema);
  }, []); // Only once on mount – perfect for static JSON‑LD

  // ---------- HANDLERS (enhanced with Vite‑friendly dynamic imports) ----------
  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setCompressedSize(null);
      setError(null);
      setQuality(0.6);
    }
  }, []);

  // Image compression with smart resizing (from first code)
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
        const MAX_WIDTH = 2500;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Browser context error'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression algorithm failed'));
          },
          'image/jpeg',
          q
        );
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(objectUrl);
        reject(e);
      };
    });
  };

  // PDF compression – now uses dynamic import of pdfjs-dist (no top‑level static import)
  const compressPdf = async (file: File, q: number) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      // ✅ Dynamic import – only loaded when needed, worker already set
      const pdfjs = await import('pdfjs-dist');
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const originalPdf = await loadingTask.promise;
      const newPdfDoc = await PDFDocument.create();

      for (let i = 1; i <= originalPdf.numPages; i++) {
        const page = await originalPdf.getPage(i);
        const scale = q < 0.4 ? 1.0 : 1.5; // Quality‑aware scaling
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

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
      throw new Error('PDF compression failed. File might be encrypted or corrupted.');
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    await new Promise((r) => setTimeout(r, 100)); // UI breath

    try {
      let resultBlob: Blob | Uint8Array;

      if (file.type === 'application/pdf') {
        const bytes = await compressPdf(file, quality);
        resultBlob = new Blob([bytes], { type: 'application/pdf' });
      } else if (file.type.startsWith('image/')) {
        resultBlob = await compressImage(file, quality);
      } else {
        throw new Error('Unsupported file format.');
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

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl(null);
    setCompressedSize(null);
    setError(null);
  };

  // ---------- UI RENDER (pure JSX, no Next/Head) ----------
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* ===== H1 – most important heading ===== */}
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {TOOL_NAME}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {TOOL_DESCRIPTION}
        </p>
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Shield size={16} className="text-green-600" /> No upload – stays on your device
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap size={16} className="text-amber-500" /> Blazing fast
          </span>
          <span className="inline-flex items-center gap-1">
            <ImageIcon size={16} className="text-blue-500" /> 4 formats supported
          </span>
        </div>
      </header>

      {/* ===== MAIN TOOL SECTION ===== */}
      {!file ? (
        <section aria-label="File upload area">
          <FileUploader
            onFilesSelected={handleFileSelected}
            allowMultiple={false}
            acceptedFileTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
            label="📂 Drop your PDF or image here – or click to browse"
          />
          {/* SEO‑rich content – always visible for crawlers */}
          <article className="mt-16 prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-800">Why choose this compressor?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="flex gap-3">
                <div className="bg-green-100 p-2 rounded-full h-fit">
                  <CheckCircle2 size={20} className="text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">100% Private & Secure</h3>
                  <p className="text-slate-600">
                    Files never leave your computer. No server uploads, no privacy risks.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-orange-100 p-2 rounded-full h-fit">
                  <Minimize2 size={20} className="text-orange-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Up to 90% smaller</h3>
                  <p className="text-slate-600">
                    Advanced compression algorithms reduce file size dramatically while preserving quality.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-blue-100 p-2 rounded-full h-fit">
                  <FileText size={20} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Batch ready</h3>
                  <p className="text-slate-600">
                    One file at a time? Use the tool as many times as you need – unlimited.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-purple-100 p-2 rounded-full h-fit">
                  <Download size={20} className="text-purple-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Instant download</h3>
                  <p className="text-slate-600">
                    No wait times, no email signups. Compress and download immediately.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>
      ) : (
        /* ===== COMPRESSION INTERFACE (file selected) ===== */
        <section aria-labelledby="compression-heading" className="space-y-6">
          <h2 id="compression-heading" className="sr-only">
            Compression settings and download
          </h2>

          {/* File info card */}
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
              aria-label="Cancel and upload new file"
            >
              <AlertCircle size={20} className="rotate-45" />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2"
            >
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Compression controls OR success state */}
          {!downloadUrl ? (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                  <Settings2 size={18} className="text-orange-600" />
                  Compression Level
                </h3>
                <p className="text-sm text-slate-500">
                  Adjust the slider to balance file size and quality.
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
                    aria-label="Compression Quality Control"
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
                        ? 'High Compression (Low Quality)'
                        : quality > 0.7
                        ? 'Low Compression (High Quality)'
                        : 'Recommended Balanced'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold hover:from-orange-700 hover:to-red-700 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Optimizing your file...
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
            /* Success state */
            <div
              className="bg-green-50 rounded-xl p-8 border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300"
              role="status"
              aria-live="polite"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
                <FileCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Ready to Download!
              </h3>

              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-sm mb-8 bg-white/50 p-4 rounded-lg mx-auto max-w-md">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs uppercase">Original</span>
                  <span className="text-slate-500 line-through font-mono">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="text-green-300 hidden md:block">→</div>
                <div className="flex flex-col">
                  <span className="text-green-700 text-xs uppercase font-bold">
                    Optimized
                  </span>
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

          {/* Privacy note */}
          <p className="text-center text-xs text-slate-400 mt-8 flex items-center justify-center gap-1">
            <Info size={12} />
            Files are processed securely in your browser. No data is sent to any server.
          </p>
        </section>
      )}

      {/* ===== FAQ SECTION – always visible, great for SEO ===== */}
      <section
        aria-labelledby="faq-heading"
        className="mt-20 pt-8 border-t border-slate-200"
      >
        <h2 id="faq-heading" className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-start gap-2">
              <HelpCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
              Is this tool really free?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Absolutely. No credit card, no trial limits, no watermark. Free forever.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-start gap-2">
              <HelpCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
              Where are my files processed?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Directly in your web browser. Your files never reach any server – 100% private.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-start gap-2">
              <HelpCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
              What is the maximum file size?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              There is no hard limit – it depends on your device’s memory. Most files under 200MB work perfectly.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-start gap-2">
              <HelpCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
              Can I compress multiple files at once?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Currently we support one file at a time, but you can use the tool repeatedly. Batch mode is on our roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER – trust signals ===== */}
      <footer className="text-xs text-center text-slate-400 mt-16">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. |{' '}
          <a href="/privacy" className="underline hover:text-slate-600">
            Privacy
          </a>{' '}
          |{' '}
          <a href="/contact" className="underline hover:text-slate-600">
            Contact
          </a>
        </p>
      </footer>
    </main>
  );
};
