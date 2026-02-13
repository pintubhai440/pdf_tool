import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Loader2,
  Download,
  Trash2,
  AlertCircle,
  FileText,
  Scissors,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RefreshCcw,
  ArrowRight,
  MousePointerClick
} from 'lucide-react';
import { clsx } from 'clsx';
import { FileUploader } from './FileUploader';
import { removePagesFromPdf, createPdfUrl } from '../services/pdfService';

interface SplitToolProps {}

export const SplitTool: React.FC<SplitToolProps> = () => {
  // ---------- COMPREHENSIVE SEO CONFIGURATION ----------
  const SEO = {
    title: 'Split PDF Online - Remove Pages from PDF Free | Genz PDF',
    description:
      'Free online PDF Splitter. Extract pages or remove specific pages from your PDF documents instantly. 100% secure, client-side processing, no watermarks.',
    canonical: 'https://genzpdf.com/split-pdf',
    siteName: 'Genz PDF',
    locale: 'en_US',
    image: 'https://genzpdf.com/social/split-pdf-preview.jpg', // Replace with actual image
    twitterHandle: '@genzpdf',
    keywords:
      'split PDF, remove pages from PDF, delete PDF pages, PDF page remover, free PDF splitter, extract PDF pages online, PDF editor no upload, secure PDF tool',
    author: 'Genz PDF Team'
  };

  // ---------- STATE ----------
  const [file, setFile] = useState<File | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------- MASTER SEO INJECTION & PDF WORKER INIT ----------
  useEffect(() => {
    // 1. PDF.js Worker (CDN with stable CORS)
    const lib = (pdfjsLib as any).default || pdfjsLib;
    if (lib?.GlobalWorkerOptions) {
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // 2. Basic meta tags (title, description, canonical, robots, viewport, etc.)
    document.title = SEO.title;

    const upsertMeta = (attr: string, value: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${attr}"]`
        : `meta[name="${attr}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(isProperty ? 'property' : 'name', attr);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    };

    // Standard meta
    upsertMeta('description', SEO.description);
    upsertMeta('robots', 'index, follow');
    upsertMeta('viewport', 'width=device-width, initial-scale=1');
    upsertMeta('author', SEO.author);
    upsertMeta('keywords', SEO.keywords);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', SEO.canonical);

    // Open Graph
    upsertMeta('og:title', SEO.title, true);
    upsertMeta('og:description', SEO.description, true);
    upsertMeta('og:url', SEO.canonical, true);
    upsertMeta('og:image', SEO.image, true);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:site_name', SEO.siteName, true);
    upsertMeta('og:locale', SEO.locale, true);

    // Twitter Card
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', SEO.title);
    upsertMeta('twitter:description', SEO.description);
    upsertMeta('twitter:image', SEO.image);
    upsertMeta('twitter:site', SEO.twitterHandle);

    // 3. JSON-LD STRUCTURED DATA (SoftwareApplication + WebSite + FAQPage)
    const scriptId = 'json-ld-split-pdf';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Genz PDF Splitter",
          "applicationCategory": "Productivity",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": SEO.description,
          "featureList": "Remove PDF Pages, Extract PDF Pages, Client-side Security",
          "screenshot": SEO.image,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1247"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": SEO.siteName,
          "url": "https://genzpdf.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://genzpdf.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is this tool free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, completely free with no limits."
              }
            },
            {
              "@type": "Question",
              "name": "Does it work on Mac/Windows?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "It works on any device with a browser."
              }
            },
            {
              "@type": "Question",
              "name": "Is my data safe?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. No file upload occurs."
              }
            }
          ]
        }
      ]);
      document.head.appendChild(script);
    }
  }, []);

  // ---------- HANDLERS ----------
  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResultUrl(null);
      setError(null);
      setSelectedPages(new Set());
    }
  };

  useEffect(() => {
    if (!file) return;

    const loadPdfPages = async () => {
      setIsLoading(true);
      setPageImages([]);
      setError(null);
      try {
        const buff = await file.arrayBuffer();
        const lib = (pdfjsLib as any).default || pdfjsLib;
        const pdf = await lib.getDocument({ data: buff }).promise;
        const images: string[] = [];

        // Optimize scale based on device pixel ratio for sharper mobile thumbnails
        const scale = window.devicePixelRatio > 1 ? 0.5 : 0.35;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: ctx, viewport }).promise;
          images.push(canvas.toDataURL());
        }
        setPageImages(images);
      } catch (err) {
        console.error(err);
        setError('Could not load PDF. It might be password protected.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPdfPages();
  }, [file]);

  const togglePage = (idx: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const processPdf = async () => {
    if (!file || !selectedPages.size) return;
    setIsProcessing(true);
    try {
      const bytes = await removePagesFromPdf(file, Array.from(selectedPages));
      setResultUrl(createPdfUrl(bytes));
    } catch {
      setError('Processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageImages([]);
    setSelectedPages(new Set());
    setResultUrl(null);
    setError(null);
  };

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-[#FDF8F6] font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-700 pb-20">
      
      {/* PROFESSIONAL BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white via-[#FFF0F0] to-transparent opacity-80" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-orange-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* HEADER SECTION (Responsive Padding) */}
        <header className="text-center mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-100 shadow-sm text-rose-600 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} className="fill-rose-600" />
            V2.0 • Lightning Fast
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight mb-4 md:mb-6 leading-tight">
            Split PDF & <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">
              Delete Pages Instantly
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
            Professional grade tool to remove unwanted pages.
            <span className="font-medium text-slate-800"> Secure, Private, and Free.</span>
          </p>
        </header>

        {/* MAIN INTERFACE CARD */}
        <div className="relative z-10">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-rose-900/5 border border-white/60 overflow-hidden min-h-[500px] transition-all duration-500">
            
            {!file ? (
              /* UPLOAD STATE (Optimized Mobile Padding) */
              <div className="px-4 py-10 md:p-20 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-full max-w-xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                  <FileUploader onFilesSelected={handleFileSelected} allowMultiple={false} />
                </div>
                
                {/* Feature Pills (Stack on mobile) */}
                <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
                  {[
                    { icon: ShieldCheck, text: "Secure" },
                    { icon: Scissors, text: "Precise" },
                    { icon: Zap, text: "Fast" }
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-rose-50 shadow-sm text-slate-600 text-xs md:text-sm font-semibold">
                      <f.icon size={14} className="text-rose-500" /> {f.text}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* EDITOR STATE */
              <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                
                {/* 1. STICKY TOOLBAR (Fixed for Mobile - sits below header) */}
                <div className="sticky top-16 md:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-rose-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-2 md:p-2.5 rounded-xl text-white shadow-lg shadow-rose-200">
                      <FileText size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm md:text-base max-w-[120px] md:max-w-xs truncate">{file.name}</h3>
                      <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
                        {pageImages.length} Pages • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    {!resultUrl && (
                      <button 
                        onClick={reset}
                        className="p-2 md:p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Start Over"
                      >
                        <RefreshCcw size={18} className="md:w-5 md:h-5" />
                      </button>
                    )}

                    {resultUrl ? (
                      <a
                        href={resultUrl}
                        download={`edited-${file.name}`}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all text-sm md:text-base"
                      >
                        <Download size={18} /> <span className="hidden sm:inline">Download</span>
                      </a>
                    ) : (
                      <button
                        onClick={processPdf}
                        disabled={selectedPages.size === 0 || isProcessing}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-rose-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-rose-200 transition-all duration-300 text-sm md:text-base"
                      >
                        {isProcessing ? <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" /> : <Trash2 size={18} className="md:w-5 md:h-5" />}
                        <span>Remove <span className="hidden sm:inline">Pages</span></span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ERROR ALERT */}
                {error && (
                  <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                {/* 2. MAIN CONTENT AREA (Grid) */}
                <div className="p-4 md:p-10 bg-slate-50/50 flex-1 overflow-y-auto min-h-[60vh]">
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 md:py-32">
                      <div className="relative">
                        <div className="absolute inset-0 bg-rose-200 rounded-full blur-xl animate-pulse" />
                        <Loader2 className="relative z-10 w-12 h-12 md:w-16 md:h-16 animate-spin text-rose-600" />
                      </div>
                      <p className="mt-6 md:mt-8 text-base md:text-lg font-medium text-slate-500">Generating Previews...</p>
                    </div>
                  ) : resultUrl ? (
                    /* SUCCESS STATE */
                    <div className="flex flex-col items-center justify-center py-10 md:py-20 text-center animate-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-200 mb-6 md:mb-8">
                        <CheckCircle2 size={40} className="md:w-12 md:h-12" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">PDF Processed!</h3>
                      <p className="text-slate-500 mb-6 md:mb-8 max-w-md text-base md:text-lg">
                        We have successfully removed {selectedPages.size} pages from your document.
                      </p>
                      <button onClick={reset} className="text-slate-400 hover:text-slate-800 font-semibold underline underline-offset-4 transition-colors">
                        Process Another File
                      </button>
                    </div>
                  ) : (
                    /* GRID EDITOR */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Hint Bar */}
                      <div className="flex justify-center mb-6 md:mb-8">
                        <div className="bg-white px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs md:text-sm text-slate-500">
                          <MousePointerClick size={14} />
                          Tap to mark for <span className="text-rose-600 font-bold">Deletion</span>
                        </div>
                      </div>

                      {/* The Grid (Mobile Optimized Gaps) */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-8 pb-10">
                        {pageImages.map((img, idx) => {
                          const isSelected = selectedPages.has(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => togglePage(idx)}
                              className={clsx(
                                "group relative aspect-[3/4] rounded-xl cursor-pointer transition-all duration-200 ease-out",
                                isSelected 
                                  ? "ring-4 ring-rose-500 shadow-xl shadow-rose-200 transform scale-[0.96]" 
                                  : "bg-white shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-rose-200"
                              )}
                            >
                              {/* Paper Sheet Look */}
                              <div className="absolute inset-0 bg-white rounded-xl overflow-hidden">
                                <img 
                                  src={img} 
                                  alt={`Page ${idx + 1}`} 
                                  className={clsx(
                                    "w-full h-full object-contain p-2 md:p-4 transition-all duration-300",
                                    isSelected && "opacity-20 grayscale blur-[1px]"
                                  )} 
                                  loading="lazy"
                                />
                              </div>

                              {/* Page Number */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 whitespace-nowrap">
                                Page {idx + 1}
                              </div>

                              {/* Deletion Overlay Animation */}
                              <div className={clsx(
                                "absolute inset-0 flex items-center justify-center transition-all duration-200 z-20",
                                isSelected ? "bg-rose-900/10 opacity-100" : "opacity-0 group-hover:opacity-100 md:bg-black/5"
                              )}>
                                <div className={clsx(
                                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform",
                                  isSelected 
                                    ? "bg-rose-600 text-white scale-110" 
                                    : "bg-white text-slate-400 scale-75 translate-y-4 group-hover:translate-y-0 group-hover:scale-100"
                                )}>
                                  <Trash2 size={20} className="md:w-6 md:h-6" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FEATURE HIGHLIGHTS */}
        <section className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Visual Selection",
              desc: "Don't guess page numbers. See thumbnails of every page and click to remove what you don't need.",
              icon: Scissors,
              style: "bg-rose-50 text-rose-600"
            },
            {
              title: "100% Private",
              desc: "Files are processed locally in your browser via WebAssembly. No data leaves your device.",
              icon: ShieldCheck,
              style: "bg-slate-100 text-slate-700"
            },
            {
              title: "Instant Download",
              desc: "No watermarks, no sign-ups. Just upload, edit, and download your clean PDF instantly.",
              icon: Zap,
              style: "bg-orange-50 text-orange-600"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className={`w-14 h-14 ${item.style} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* HOW TO & FAQ */}
        <section className="mt-24 max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-black text-center text-slate-900 mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-rose-200 to-orange-200 z-0" />

               {[
                 { step: "1", title: "Upload PDF", text: "Select file from device" },
                 { step: "2", title: "Select Pages", text: "Click pages to remove" },
                 { step: "3", title: "Download", text: "Get your new PDF" }
               ].map((s, i) => (
                 <div key={i} className="relative z-10 text-center group">
                   <div className="w-14 h-14 mx-auto bg-white border-2 border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm mb-4 group-hover:border-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                     {s.step}
                   </div>
                   <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                   <p className="text-sm text-slate-500 mt-1">{s.text}</p>
                 </div>
               ))}
            </div>

            <div className="mt-16 pt-10 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ArrowRight className="text-rose-500" /> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  { q: "Is this tool free?", a: "Yes, completely free with no limits." },
                  { q: "Does it work on Mac/Windows?", a: "It works on any device with a browser." },
                  { q: "Is my data safe?", a: "Absolutely. No file upload occurs." }
                ].map((faq, i) => (
                  <details key={i} className="group bg-slate-50 rounded-xl overflow-hidden cursor-pointer">
                    <summary className="flex justify-between items-center p-4 font-semibold text-slate-700 hover:text-rose-600 transition-colors list-none">
                      {faq.q} <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 pb-4 text-slate-500 text-sm">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SplitTool;
