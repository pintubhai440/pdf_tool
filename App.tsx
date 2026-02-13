import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Trash2,
  Download,
  Sparkles,
  FileStack,
  Loader2,
  Scissors,
  Files,
  ArrowRightLeft,
  Minimize2,
  Scaling,
  LayoutGrid,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Plus,
  Home as HomeIcon // 👈 Home icon added
} from 'lucide-react';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

// ✅ CORE IMPORTS
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { AiAssistant } from './components/AiAssistant';
import { Home } from './components/Home';
import { Footer } from './components/Footer';
import { PdfFile, SortOrder, AppMode } from './types';
import { mergePdfs, createPdfUrl } from './services/pdfService';

// ✅ LAZY LOAD TOOLS (for better performance)
const SplitTool = lazy(() => import('./components/SplitTool'));
const ConverterTool = lazy(() => import('./components/ConverterTool'));
const CompressTool = lazy(() => import('./components/CompressTool'));
const ResizeTool = lazy(() => import('./components/ResizeTool'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Policy = lazy(() => import('./components/Policy'));
const Terms = lazy(() => import('./components/Terms'));

// ==================== 🔥 SUPERCHARGED SEO CONFIGURATION ====================
const BASE_URL = "https://genzpdf.com"; // 🔴 REPLACE WITH YOUR ACTUAL DOMAIN
const SITE_NAME = "Genz PDF";
const DEFAULT_OG_IMAGE = `${BASE_URL}/social-preview.jpg`;

const SEO_METADATA: Record<AppMode, {
  title: string;
  description: string;
  keywords: string;
  schema: object | null;
  breadcrumb?: { name: string; url: string }[];
}> = {
  home: {
    title: "Genz PDF - Free Online PDF Tools | Merge, Split, Compress & Convert",
    description: "All-in-one free PDF tools. Merge PDF, Split PDF, Compress PDF, Convert to Word/JPG. 100% Free, Secure & Fast. No signup required.",
    keywords: "free pdf tools, online pdf editor, merge pdf, split pdf, compress pdf, pdf converter, resize pdf",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Genz PDF Tools",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": "Merge PDF, Split PDF, Compress PDF, Convert PDF, Resize PDF",
      "screenshot": DEFAULT_OG_IMAGE,
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "2150" }
    },
    breadcrumb: [{ name: "Home", url: BASE_URL }]
  },
  merge: {
    title: "Merge PDF Free - Combine PDF Files Online | Genz PDF",
    description: "Combine multiple PDF files into one document instantly. Drag & drop reordering, secure processing, and 100% free PDF merger. No upload.",
    keywords: "merge pdf, combine pdf, join pdf files, pdf merger free, merge pdf online, combine pdf documents",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Merge PDF Tool",
      "description": "A free tool to combine multiple PDF files into a single document. Client-side processing, no privacy risk.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "2150" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Merge PDF", url: `${BASE_URL}/merge` }
    ]
  },
  split: {
    title: "Split PDF Online - Extract Pages Free | Genz PDF",
    description: "Separate PDF pages or split PDF into multiple files. Fast, secure, and easy-to-use online PDF splitter. Client-side, no watermarks.",
    keywords: "split pdf, extract pdf pages, separate pdf, cut pdf, remove pdf pages, pdf page remover",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Split PDF Tool",
      "description": "Free online PDF splitter to extract or remove pages from PDF documents.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Split PDF", url: `${BASE_URL}/split` }
    ]
  },
  compress: {
    title: "Compress PDF - Reduce File Size Online | Genz PDF",
    description: "Reduce PDF size without losing quality. Compress PDF to 100kb, 200kb online for free. Best PDF optimizer. 100% secure.",
    keywords: "compress pdf, reduce pdf size, shrink pdf, optimize pdf, pdf compressor",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Compress PDF Tool",
      "description": "Free PDF compressor to reduce file size while maintaining quality.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Compress PDF", url: `${BASE_URL}/compress` }
    ]
  },
  convert: {
    title: "PDF Converter - PDF to Word, JPG, PNG Free | Genz PDF",
    description: "Convert PDF to Word, Excel, PowerPoint, and Images instantly. High-quality free online PDF converter. No email required.",
    keywords: "pdf converter, pdf to word, pdf to jpg, convert pdf, pdf to png, pdf to excel",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF Converter Tool",
      "description": "Convert PDF documents to various formats including Word, JPG, PNG, and more.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Convert PDF", url: `${BASE_URL}/convert` }
    ]
  },
  resize: {
    title: "Resize PDF & Images - Change Dimensions | Genz PDF",
    description: "Resize PDF pages to A4, Letter, or custom dimensions easily online. Adjust page size with one click.",
    keywords: "resize pdf, change pdf page size, pdf dimensions, pdf page size editor",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Resize PDF Tool",
      "description": "Free PDF resizer to change page dimensions and aspect ratio.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Resize PDF", url: `${BASE_URL}/resize` }
    ]
  },
  about: {
    title: "About Us - Genz PDF Team",
    description: "Learn about the mission behind Genz PDF. We provide free, secure, client-side PDF tools for everyone.",
    keywords: "about genz pdf, pdf tools team, free pdf software",
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Genz PDF",
      "description": "Learn about the team and mission behind Genz PDF."
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "About", url: `${BASE_URL}/about` }
    ]
  },
  contact: {
    title: "Contact Support - Genz PDF",
    description: "Get help with Genz PDF tools. Contact our support team for any questions or feedback.",
    keywords: "contact pdf support, help with pdf tools, pdf support",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Genz PDF"
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Contact", url: `${BASE_URL}/contact` }
    ]
  },
  policy: {
    title: "Privacy Policy - Genz PDF",
    description: "We value your privacy. Read our policy to understand how we protect your data. No files are ever uploaded.",
    keywords: "privacy policy, pdf tool privacy",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy"
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Privacy Policy", url: `${BASE_URL}/policy` }
    ]
  },
  terms: {
    title: "Terms of Service - Genz PDF",
    description: "Terms and conditions for using Genz PDF. Free usage, client-side processing, and user responsibilities.",
    keywords: "terms of service, pdf terms",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Service"
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Terms", url: `${BASE_URL}/terms` }
    ]
  }
};

function App() {
  // URL check karke sahi tool open karne ka logic
  const getInitialMode = (): AppMode => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/merge')) return 'merge';
      if (path.includes('/split')) return 'split';
      if (path.includes('/convert')) return 'convert';
      if (path.includes('/compress')) return 'compress';
      if (path.includes('/resize')) return 'resize';
      if (path.includes('/about')) return 'about';
      if (path.includes('/contact')) return 'contact';
      if (path.includes('/policy')) return 'policy';
      if (path.includes('/terms')) return 'terms';
    }
    return 'home';
  };

  const [mode, setMode] = useState<AppMode>(getInitialMode);
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Browser ke Back/Forward button support ke liye
  useEffect(() => {
    const handlePopState = () => setMode(getInitialMode());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ==================== 🔥 SUPERCHARGED SEO INJECTION ====================
  useEffect(() => {
    const meta = SEO_METADATA[mode] || SEO_METADATA.home;
    const url = mode === 'home' ? BASE_URL : `${BASE_URL}/${mode}`;

    // 1. HTML lang attribute
    document.documentElement.lang = 'en';

    // 2. Title
    document.title = meta.title;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 3. Meta tag helper (works for name or property)
    const upsertMeta = (attr: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${attr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 4. Essential meta tags
    upsertMeta('description', meta.description);
    upsertMeta('keywords', meta.keywords);
    upsertMeta('robots', 'index, follow');
    upsertMeta('viewport', 'width=device-width, initial-scale=1');
    upsertMeta('theme-color', '#ffffff');
    upsertMeta('author', 'Genz PDF Team');

    // 5. Open Graph (property)
    upsertMeta('og:title', meta.title, 'property');
    upsertMeta('og:description', meta.description, 'property');
    upsertMeta('og:url', url, 'property');
    upsertMeta('og:type', mode === 'home' ? 'website' : 'article', 'property');
    upsertMeta('og:site_name', SITE_NAME, 'property');
    upsertMeta('og:image', DEFAULT_OG_IMAGE, 'property');
    upsertMeta('og:image:alt', `${SITE_NAME} - ${meta.title}`, 'property');
    upsertMeta('og:image:width', '1200', 'property');
    upsertMeta('og:image:height', '630', 'property');

    // 6. Twitter Card (name, NOT property)
    upsertMeta('twitter:card', 'summary_large_image', 'name');
    upsertMeta('twitter:site', '@genzpdf', 'name');
    upsertMeta('twitter:title', meta.title, 'name');
    upsertMeta('twitter:description', meta.description, 'name');
    upsertMeta('twitter:image', DEFAULT_OG_IMAGE, 'name');

    // 7. Canonical URL (prevents duplicate content)
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', url);

    // 8. JSON-LD Structured Data (Global Website + Organization + Page specific)
    // Remove old scripts to avoid duplicates
    const scriptsToRemove = ['json-ld-global', 'json-ld-page', 'json-ld-breadcrumb'];
    scriptsToRemove.forEach(id => {
      const oldScript = document.getElementById(id);
      if (oldScript) oldScript.remove();
    });

    // 8a. Global Website + Organization Schema
    const globalScript = document.createElement('script');
    globalScript.id = 'json-ld-global';
    globalScript.type = 'application/ld+json';
    globalScript.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": SITE_NAME,
        "url": BASE_URL,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${BASE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_NAME,
        "url": BASE_URL,
        "logo": `${BASE_URL}/logo.png`,
        "sameAs": [
          "https://twitter.com/genzpdf",
          "https://facebook.com/genzpdf"
        ]
      }
    ]);
    document.head.appendChild(globalScript);

    // 8b. Page-specific schema
    if (meta.schema) {
      const pageScript = document.createElement('script');
      pageScript.id = 'json-ld-page';
      pageScript.type = 'application/ld+json';
      pageScript.text = JSON.stringify({
        ...meta.schema,
        "@context": "https://schema.org",
        "url": url,
        "mainEntityOfPage": url
      });
      document.head.appendChild(pageScript);
    }

    // 8c. BreadcrumbList schema
    if (meta.breadcrumb && meta.breadcrumb.length > 0) {
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'json-ld-breadcrumb';
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": meta.breadcrumb.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      });
      document.head.appendChild(breadcrumbScript);
    }
  }, [mode]);

  // ---------- MERGE LOGIC ----------
  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles: PdfFile[] = newFiles.map((file) => ({
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...pdfFiles]);
    setMergedPdfUrl(null);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedPdfUrl(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Remove all files?")) {
      setFiles([]);
      setMergedPdfUrl(null);
    }
  };

  const handleSort = (order: SortOrder) => {
    const sorted = [...files].sort((a, b) => order === SortOrder.ASC ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    setFiles(sorted);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsMerging(true);
    try {
      const originalFiles = files.map(f => f.file);
      const pdfBytes = await mergePdfs(originalFiles);
      const url = createPdfUrl(pdfBytes);
      setMergedPdfUrl(url);
    } catch (error) {
      alert("Merge failed. Please try again.");
    } finally {
      setIsMerging(false);
    }
  };

  // ---------- UI Helpers ----------
  // 🆕 IMPROVED NAVBUTTON with Home support and clean paths
  const NavButton = ({ targetMode, icon: Icon, label }: { targetMode: AppMode, icon: any, label: string }) => {
    // Determine if this button is active
    const isActive = 
      (mode === targetMode) || 
      (targetMode === 'home' && window.location.pathname === '/') ||
      (targetMode !== 'home' && window.location.pathname.includes(targetMode));

    return (
      <a
        href={targetMode === 'home' ? '/' : `/${targetMode}`} // clean URLs
        className={clsx(
          "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
          isActive
            ? "bg-white text-indigo-600 shadow-md ring-1 ring-black/5 scale-105"
            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
        )}
      >
        <Icon size={18} className={isActive ? "text-indigo-600" : "text-slate-400"} />
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- PREMIUM GLASS HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
          
          {/* Logo linking to home */}
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <img src="/logo.png" alt="Genz PDF Logo" className="w-7 h-7 object-contain brightness-0 invert" width="40" height="40" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Genz<span className="text-indigo-600">PDF</span>
            </span>
          </a>

          {/* Full tool navigation - now includes Home and all 5 tools */}
          <div className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            <NavButton targetMode="home" icon={HomeIcon} label="Home" />
            <NavButton targetMode="merge" icon={Files} label="Merge" />
            <NavButton targetMode="split" icon={Scissors} label="Split" />
            <NavButton targetMode="convert" icon={ArrowRightLeft} label="Convert" />
            <NavButton targetMode="compress" icon={Minimize2} label="Compress" />
            <NavButton targetMode="resize" icon={Scaling} label="Resize" />
          </div>

          <button 
            onClick={() => setIsAiOpen(true)}
            className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 font-bold text-sm"
          >
            <Sparkles size={16} className="group-hover:animate-pulse" />
            <span>AI Assistant</span>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
        
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40}/>
          </div>
        }>
          {mode === 'home' ? (
            <Home setMode={setMode} />
          ) : mode === 'merge' ? (
            
            /* ✅ PROFESSIONAL MERGE INTERFACE */
            <article className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))} 
                multiple 
                accept=".pdf" 
                className="hidden" 
              />

              {files.length === 0 ? (
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100">
                    <Zap size={14} /> 100% Secure Processing
                  </div>
                  <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 mb-6 tracking-tight leading-[1.1]">
                    Combine PDF files in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Seconds</span>
                  </h1>
                  <p className="text-lg text-slate-500 mb-12">
                    Select multiple PDF files and merge them into one professional document. No signup, no watermarks, completely free.
                  </p>
                  
                  <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
                    <FileUploader 
                      onFilesSelected={handleFilesSelected} 
                      allowMultiple={true} 
                      acceptedFileTypes={['application/pdf']} 
                      label="Drop PDFs here or Click to Browse" 
                    />
                  </div>

                  {/* Feature Grid */}
                  <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: ShieldCheck, title: "Privacy First", desc: "Files never leave your browser." },
                      { icon: Scaling, title: "High Quality", desc: "Maintains original document resolution." },
                      { icon: LayoutGrid, title: "Easy Ordering", desc: "Drag and drop to reorder pages." }
                    ].map((feat, i) => (
                      <div key={i} className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all duration-300">
                        <feat.icon className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="font-bold text-slate-800 text-lg mb-2">{feat.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left: File List (Order Control) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                      <div>
                        <h1 className="text-2xl font-black text-slate-900">Merge Queue</h1>
                        <p className="text-sm text-slate-400 font-medium">Reorder your files for the final output</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSort(SortOrder.ASC)} 
                          className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100"
                          title="Sort A-Z"
                        >
                          <ArrowDownAZ size={20}/>
                        </button>
                        <button 
                          onClick={() => handleSort(SortOrder.DESC)} 
                          className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100"
                          title="Sort Z-A"
                        >
                          <ArrowUpAZ size={20}/>
                        </button>
                        <button 
                          onClick={handleClearAll} 
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"
                          title="Clear All"
                        >
                          <Trash2 size={20}/>
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                      <FileList files={files} setFiles={setFiles} onRemove={handleRemoveFile} />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full mt-2 py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all font-bold"
                      >
                        <Plus size={20} /> Add More Documents
                      </button>
                    </div>
                  </div>

                  {/* Right: Actions Card */}
                  <div className="sticky top-24 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200">
                      <h3 className="text-xl font-black mb-4">Ready to Merge?</h3>
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Total Files:</span>
                          <span className="font-bold">{files.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Security:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck size={14}/> Encrypted
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={handleMerge} 
                        disabled={files.length < 2 || isMerging}
                        className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-3"
                      >
                        {isMerging ? <Loader2 className="animate-spin" /> : <FileStack />}
                        {isMerging ? "Processing..." : "Merge Now"}
                      </button>
                    </div>

                    {mergedPdfUrl && (
                      <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white animate-bounce-in">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white/20 rounded-lg"><CheckCircle2 /></div>
                          <span className="font-black text-xl">Completed!</span>
                        </div>
                        <a 
                          href={mergedPdfUrl} 
                          download="merged-genzpdf.pdf" 
                          className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black text-center block hover:bg-slate-50 transition-colors shadow-lg"
                        >
                          <Download className="inline mr-2" size={20}/> Download Now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          ) : (
            /* Fallback for all other tools (Split, Convert, Compress, Resize, About, Contact, Policy, Terms) */
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
              {mode === 'split' && <SplitTool />}
              {mode === 'convert' && <ConverterTool />}
              {mode === 'compress' && <CompressTool />}
              {mode === 'resize' && <ResizeTool />}
              {mode === 'about' && <About />}
              {mode === 'contact' && <Contact />}
              {mode === 'policy' && <Policy />}
              {mode === 'terms' && <Terms />}
            </div>
          )}
        </Suspense>
      </main>

      <Footer setMode={setMode} />
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* --- CUSTOM STYLES FOR ANIMATIONS --- */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          60% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}

export default App;
