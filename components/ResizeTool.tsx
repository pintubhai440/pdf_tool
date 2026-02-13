import React, { useState, useEffect } from 'react';
import {
  Scaling,
  Download,
  Loader2,
  RefreshCcw,
  Image as ImageIcon,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Maximize2,
  ArrowRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { FileUploader } from './FileUploader';

export const ResizeTool: React.FC = () => {
  // ---------- SEO CONFIGURATION ----------
  const PAGE_TITLE = "Resize Image Online - Change Dimensions (JPG, PNG, WebP) | Genz PDF";
  const PAGE_DESC = "Free online image resizer. Change dimensions of JPG, PNG, and WebP images by pixels or percentage without losing quality. 100% secure & client-side.";
  const CANONICAL_URL = "https://genzpdf.com/resize-image";

  // ---------- STATE ----------
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // ---------- ✅ DYNAMIC SEO & SCHEMA INJECTION ----------
  useEffect(() => {
    // 1. Title & description
    document.title = PAGE_TITLE;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', PAGE_DESC);

    // 2. Open Graph & Twitter Cards
    const setMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) ||
                 document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property.startsWith('twitter') ? 'name' : 'property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('og:title', PAGE_TITLE);
    setMeta('og:description', PAGE_DESC);
    setMeta('og:url', CANONICAL_URL);
    setMeta('og:type', 'website');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', PAGE_TITLE);

    // 3. JSON-LD Structured Data (Rich Snippets)
    const scriptId = 'json-ld-resize';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Genz Free Image Resizer",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "description": PAGE_DESC,
          "featureList": "Resize JPG/PNG, Maintain Aspect Ratio, Client-side Processing"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I resize an image without losing quality?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Upload your image to Genz PDF Resizer, enter your desired width or height, and our smart algorithm will adjust the dimensions while preserving the highest possible visual quality."
              }
            },
            {
              "@type": "Question",
              "name": "Is my image uploaded to a server?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. All resizing happens locally in your browser. Your photos never leave your device."
              }
            }
          ]
        }
      ]
    };
    script.textContent = JSON.stringify(schema);
  }, []);

  // ---------- HANDLERS ----------
  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setDownloadUrl(null);

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setWidth(newWidth);
    if (maintainRatio && originalDimensions) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setHeight(newHeight);
    if (maintainRatio && originalDimensions) {
      const ratio = originalDimensions.w / originalDimensions.h;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = async () => {
    if (!file || width <= 0 || height <= 0) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setDownloadUrl(url);
            }
            setIsProcessing(false);
          },
          file.type,
          0.95 // high quality output
        );
      }
    } catch (error) {
      console.error('Resize failed', error);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setOriginalDimensions(null);
  };

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-slate-50 w-full font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ---------- HERO SECTION ---------- */}
        <header className="text-center mb-8 sm:mb-14 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 hover:shadow-md transition-all">
            <Zap size={14} className="fill-indigo-600" />
            v2.0 • Super Fast Processing
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
            Resize Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Online</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Pixel-perfect resizing for your photos. Change dimensions of JPG, PNG, WebP
            while keeping quality – all inside your browser.
          </p>
        </header>

        {/* ---------- MAIN TOOL CARD ---------- */}
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-20" />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-300">
            {!file ? (
              <div className="p-6 sm:p-10 md:p-14 text-center">
                <FileUploader
                  onFilesSelected={handleFileSelected}
                  allowMultiple={false}
                  acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                  label="Upload Image to Resize"
                  subLabel="Drag & Drop or Click to Browse"
                />

                {/* Trust badges */}
                <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                  {[
                    { icon: ShieldCheck, text: '100% Secure' },
                    { icon: Maximize2, text: 'HD Quality' },
                    { icon: Zap, text: 'Instant' }
                  ].map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 rounded-full border border-slate-200 text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wide"
                    >
                      <feat.icon size={12} /> {feat.text}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                {/* File Header */}
                <div className="bg-gradient-to-b from-slate-50 to-white px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="bg-indigo-50 p-2 sm:p-3.5 rounded-2xl text-indigo-600 ring-4 ring-indigo-50/50">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[200px]">
                        {file.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
                        Original:{' '}
                        <span className="bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded text-slate-700">
                          {originalDimensions?.w} x {originalDimensions?.h}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="group p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                    title="Reset"
                  >
                    <RefreshCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                  </button>
                </div>

                {/* Editor Area */}
                <div className="p-6 sm:p-8 md:p-10">
                  {!downloadUrl ? (
                    <div className="space-y-6 sm:space-y-8">
                      {/* Dimensions Inputs */}
                      <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/60 shadow-inner">
                        <h4 className="font-bold text-slate-700 mb-4 sm:mb-5 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                          <Scaling size={16} className="text-indigo-500" /> Target Dimensions
                        </h4>

                        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-5">
                          <div className="group">
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide group-focus-within:text-indigo-500 transition-colors">
                              Width
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={width}
                                onChange={handleWidthChange}
                                className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-base sm:text-lg text-slate-800 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                              />
                              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm font-medium">
                                px
                              </span>
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide group-focus-within:text-indigo-500 transition-colors">
                              Height
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={height}
                                onChange={handleHeightChange}
                                className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-base sm:text-lg text-slate-800 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                              />
                              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm font-medium">
                                px
                              </span>
                            </div>
                          </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              maintainRatio
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'bg-white border-slate-300'
                            }`}
                          >
                            {maintainRatio && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={maintainRatio}
                            onChange={(e) => setMaintainRatio(e.target.checked)}
                            className="hidden"
                          />
                          <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                            Maintain Aspect Ratio
                          </span>
                        </label>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={handleResize}
                        disabled={isProcessing || width <= 0 || height <= 0}
                        className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white rounded-xl font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-[0.98] duration-300"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin w-5 h-5" /> Processing...
                          </>
                        ) : (
                          <>
                            Resize Now <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Success State */
                    <div className="text-center py-4 animate-in zoom-in-95 duration-500">
                      <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse" />
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-emerald-50 text-green-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                          <CheckCircle2 size={36} />
                        </div>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Success!</h3>
                      <p className="text-slate-500 mb-8 text-base sm:text-lg">
                        Your image has been resized to <br />
                        <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg mt-2 inline-block">
                          {width} x {height} px
                        </span>
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                          href={downloadUrl}
                          download={`resized-${file.name}`}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg shadow-green-200 flex justify-center items-center gap-2 transition-transform hover:-translate-y-1"
                        >
                          <Download size={18} /> Download
                        </a>
                        <button
                          onClick={handleReset}
                          className="flex-1 bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-700 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all hover:bg-slate-50"
                        >
                          Resize Another
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ---------- FEATURES GRID (SEO ENRICHED) - horizontally scrollable on mobile ---------- */}
        <section className="max-w-6xl mx-auto mt-12 sm:mt-24">
          <div className="flex md:grid overflow-x-auto md:overflow-visible gap-6 md:grid-cols-3 md:gap-8 px-4 md:px-0 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300">
            {[
              {
                icon: <ShieldCheck size={24} />,
                title: '100% Secure',
                desc: 'Processing happens in your browser. No photos are uploaded to any server.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-50'
              },
              {
                icon: <Zap size={24} />,
                title: 'Lightning Fast',
                desc: 'Instant resizing powered by your device. No queue, no waiting.',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: <Maximize2 size={24} />,
                title: 'Pixel Perfect',
                desc: 'High-quality resampling ensures your images stay crisp and clear.',
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              }
            ].map((f, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] md:w-auto snap-start bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
              >
                <div
                  className={`w-12 h-12 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          {/* Optional scroll hint (visible only on mobile) */}
          <p className="text-xs text-slate-400 text-center mt-3 md:hidden">← Swipe to see more features →</p>
        </section>

        {/* ---------- FAQ SECTION (SEO & RICH SNIPPETS) ---------- */}
        <section className="max-w-3xl mx-auto mt-12 sm:mt-24 border-t border-slate-200 pt-8 sm:pt-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-slate-500">Learn more about our free image resizer tool.</p>
          </div>

          <div className="space-y-4 px-2 sm:px-0">
            {[
              {
                q: 'How do I resize an image for free?',
                a: 'Simply upload your photo, enter the new width or height in pixels, and click "Resize Image". It is completely free and works instantly.'
              },
              {
                q: 'Does it support transparent PNGs?',
                a: 'Yes! Our tool preserves transparency in PNG and WebP files during the resizing process.'
              },
              {
                q: 'Is my data safe?',
                a: 'Absolutely. We use client-side technology, meaning your images never leave your computer. They are processed locally in your browser.'
              },
              {
                q: 'What formats are supported?',
                a: 'We currently support JPG, JPEG, PNG, and WebP formats.'
              }
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer transition-all hover:border-indigo-200"
              >
                <summary className="flex justify-between items-center p-4 sm:p-6 font-semibold text-slate-800 list-none text-sm sm:text-base">
                  {item.q}
                  <span className="transform group-open:rotate-180 transition-transform text-indigo-500 text-xs sm:text-sm">▼</span>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-600 bg-slate-50/30 pt-2 leading-relaxed text-sm sm:text-base">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- ADDITIONAL TRUST FOOTER ---------- */}
        <div className="mt-8 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 opacity-70 hover:opacity-100 transition-opacity duration-500">
          <div className="text-center p-4">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Client-Side</h4>
            <p className="text-xs sm:text-sm text-slate-500">Photos never leave your device</p>
          </div>
          <div className="text-center p-4 border-t sm:border-t-0 sm:border-l sm:border-r border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">High Quality</h4>
            <p className="text-xs sm:text-sm text-slate-500">Smart resampling algorithm</p>
          </div>
          <div className="text-center p-4">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Free Forever</h4>
            <p className="text-xs sm:text-sm text-slate-500">No hidden costs or limits</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResizeTool;
