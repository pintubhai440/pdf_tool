import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
  Home as HomeIcon,
  Menu,
  X,
  ChevronRight,
  Lock // ✅ Protect Tool Icon
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

// ✅ LAZY LOAD TOOLS (Performance Optimization)
const SplitTool = lazy(() => import('./components/SplitTool'));
const ConverterTool = lazy(() => import('./components/ConverterTool'));
const CompressTool = lazy(() => import('./components/CompressTool'));
const ResizeTool = lazy(() => import('./components/ResizeTool'));
const ProtectTool = lazy(() => import('./components/ProtectTool')); // ✅ Protect Tool
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Policy = lazy(() => import('./components/Policy'));
const Terms = lazy(() => import('./components/Terms'));

// ==================== 🚀 SEO CONFIGURATION (THE BRAIN) ====================
const BASE_URL = "https://genzpdf.com";
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
    description: "All-in-one free online PDF tools: Merge PDF, Split PDF, Compress PDF, Convert to Word/JPG. 100% client-side, secure & private. No upload, no signup, unlimited usage.",
    keywords: "free pdf tools, client-side pdf editor, secure pdf merger, compress pdf 100kb, no upload pdf tools, genz pdf, unlimited pdf converter, best free pdf website india",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Genz PDF Tools",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": "Merge PDF, Split PDF, Compress PDF, Convert PDF, Resize PDF, Protect PDF",
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "2150" }
    },
    breadcrumb: [{ name: "Home", url: BASE_URL }]
  },
  merge: {
    title: "Merge PDF Free - Combine PDF Files Online Without Uploading | Genz PDF",
    description: "Combine multiple PDF files into one instantly. Client-side merge, no upload, secure and private. Arrange PDF pages online free. Best PDF Merger.",
    keywords: "merge pdf, combine pdf, join pdf files, pdf merger free, merge pdf online, combine pdf without uploading, arrange PDF pages online free",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Merge PDF Tool",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Merge PDF", url: `${BASE_URL}/merge` }
    ]
  },
  split: {
    title: "Split PDF Online - Extract or Remove Pages Free | Genz PDF",
    description: "Separate PDF pages, extract pages from PDF free, remove pages from PDF online. Split large PDF files instantly in your browser.",
    keywords: "split pdf, extract pdf pages, separate pdf, cut pdf, remove pdf pages, pdf page remover, extract pages from PDF free",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Split PDF Tool",
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
    title: "Compress PDF - Reduce PDF Size to 100kb Free | Genz PDF",
    description: "Reduce PDF file size for email or web. Compress PDF to 100kb, 200kb without losing quality. Optimize PDF for web, shrink PDF file size free.",
    keywords: "compress pdf, reduce pdf size, shrink pdf, optimize pdf, pdf compressor, compress PDF to 100kb, reduce PDF size for email",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Compress PDF Tool",
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
    description: "Convert PDF to Word editable, PDF to JPG high quality, convert images to PDF free. Secure DOCX to PDF converter. All client-side.",
    keywords: "pdf converter, pdf to word, pdf to jpg, convert pdf, pdf to png, pdf to excel, convert PDF to Word editable, PDF to JPG high quality",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF Converter Tool",
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
    title: "Resize PDF & Images - Change Dimensions & KB | Genz PDF",
    description: "Resize PDF pages to A4, letter, or custom dimensions. Resize image in kb, change photo dimensions online. Client-side free tool.",
    keywords: "resize pdf, change pdf page size, pdf dimensions, pdf page size editor, resize image in kb, change photo dimensions online",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Resize PDF Tool",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Resize PDF", url: `${BASE_URL}/resize` }
    ]
  },
  protect: {
    title: "Protect PDF - Encrypt & Lock PDF Online Free | Genz PDF",
    description: "Secure your PDF with a strong password. Encrypt PDF files online for free. 100% client-side military-grade security. No upload needed.",
    keywords: "protect pdf, encrypt pdf, password protect pdf, lock pdf, secure pdf online, pdf security free, add password to pdf",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Protect PDF Tool",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    breadcrumb: [
      { name: "Home", url: BASE_URL },
      { name: "Protect PDF", url: `${BASE_URL}/protect` }
    ]
  },
  about: {
    title: "About Us - Genz PDF Team",
    description: "Learn about the mission behind Genz PDF. We provide free, secure, client-side PDF tools for everyone.",
    keywords: "about genz pdf, pdf tools team, free pdf software",
    schema: { "@context": "https://schema.org", "@type": "AboutPage", "name": "About Genz PDF" },
    breadcrumb: [{ name: "Home", url: BASE_URL }, { name: "About", url: `${BASE_URL}/about` }]
  },
  contact: {
    title: "Contact Support - Genz PDF",
    description: "Get help with Genz PDF tools. Contact our support team for any questions or feedback.",
    keywords: "contact pdf support, help with pdf tools, pdf support",
    schema: { "@context": "https://schema.org", "@type": "ContactPage", "name": "Contact Genz PDF" },
    breadcrumb: [{ name: "Home", url: BASE_URL }, { name: "Contact", url: `${BASE_URL}/contact` }]
  },
  policy: {
    title: "Privacy Policy - Genz PDF",
    description: "We value your privacy. Read our policy to understand how we protect your data. No files are ever uploaded.",
    keywords: "privacy policy, pdf tool privacy",
    schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Privacy Policy" },
    breadcrumb: [{ name: "Home", url: BASE_URL }, { name: "Privacy Policy", url: `${BASE_URL}/policy` }]
  },
  terms: {
    title: "Terms of Service - Genz PDF",
    description: "Terms and conditions for using Genz PDF. Free usage, client-side processing, and user responsibilities.",
    keywords: "terms of service, pdf terms",
    schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Terms of Service" },
    breadcrumb: [{ name: "Home", url: BASE_URL }, { name: "Terms", url: `${BASE_URL}/terms` }]
  }
};

function App() {
  // --- ROUTING LOGIC ---
  const getInitialMode = (): AppMode => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/merge')) return 'merge';
      if (path.includes('/split')) return 'split';
      if (path.includes('/convert')) return 'convert';
      if (path.includes('/compress')) return 'compress';
      if (path.includes('/resize')) return 'resize';
      if (path.includes('/protect')) return 'protect'; // ✅ Added Route
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HYBRID NAVIGATION (SPA + SEO) ---
  // This allows Google to see href links, but users get instant SPA navigation
  const navigateTo = (targetMode: AppMode, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // Update URL without reload
    const path = targetMode === 'home' ? '/' : `/${targetMode}`;
    window.history.pushState({}, '', path);
    
    // Update State
    setMode(targetMode);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Back/Forward Browser Buttons
  useEffect(() => {
    const handlePopState = () => setMode(getInitialMode());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- DYNAMIC SEO INJECTION ---
  useEffect(() => {
    const meta = SEO_METADATA[mode] || SEO_METADATA.home;
    const url = mode === 'home' ? BASE_URL : `${BASE_URL}/${mode}`;

    document.documentElement.lang = 'en';
    document.title = meta.title;

    const upsertMeta = (attr: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${attr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    upsertMeta('description', meta.description);
    upsertMeta('keywords', meta.keywords);
    upsertMeta('robots', 'index, follow');
    upsertMeta('viewport', 'width=device-width, initial-scale=1');
    upsertMeta('author', 'Genz PDF Team');

    // Open Graph
    upsertMeta('og:title', meta.title, 'property');
    upsertMeta('og:description', meta.description, 'property');
    upsertMeta('og:url', url, 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:site_name', SITE_NAME, 'property');
    upsertMeta('og:image', DEFAULT_OG_IMAGE, 'property');

    // Twitter
    upsertMeta('twitter:card', 'summary_large_image', 'name');
    upsertMeta('twitter:title', meta.title, 'name');
    upsertMeta('twitter:description', meta.description, 'name');
    upsertMeta('twitter:image', DEFAULT_OG_IMAGE, 'name');

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', url);

    // JSON-LD Schema
    const scriptsToRemove = ['json-ld-global', 'json-ld-page', 'json-ld-breadcrumb'];
    scriptsToRemove.forEach(id => {
      const oldScript = document.getElementById(id);
      if (oldScript) oldScript.remove();
    });

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
        "sameAs": ["https://twitter.com/genzpdf"]
      }
    ]);
    document.head.appendChild(globalScript);

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

    if (meta.breadcrumb) {
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

  // --- MERGE LOGIC ---
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

  // --- NAVIGATION COMPONENT ---
  const NavButton = ({ targetMode, icon: Icon, label, mobile = false }: { targetMode: AppMode, icon: any, label: string, mobile?: boolean }) => {
    const isActive = (mode === targetMode) || (targetMode === 'home' && mode === 'home');

    return (
      <a
        href={targetMode === 'home' ? '/' : `/${targetMode}`}
        onClick={(e) => navigateTo(targetMode, e)}
        className={clsx(
          "flex items-center gap-3 transition-all duration-300 font-medium rounded-xl group",
          mobile 
            ? "w-full p-4 text-base border border-slate-100 hover:bg-slate-50"
            : "px-4 py-2 text-sm hover:bg-white/50",
          isActive
            ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        <div className={clsx("p-2 rounded-lg transition-colors", isActive ? "bg-indigo-50" : "bg-slate-100 group-hover:bg-white")}>
          <Icon size={mobile ? 20 : 18} className={isActive ? "text-indigo-600" : "text-slate-500"} />
        </div>
        {label}
        {mobile && <ChevronRight size={16} className="ml-auto text-slate-300" />}
      </a>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          
          <a href="/" onClick={(e) => navigateTo('home', e)} className="flex items-center gap-3 group z-50 relative">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:rotate-6 transition-transform duration-300">
              <img src="/logo.png" alt="Genz PDF Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain brightness-0 invert" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Genz<span className="text-indigo-600">PDF</span>
            </span>
          </a>

          <div className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
            <NavButton targetMode="home" icon={HomeIcon} label="Home" />
            <NavButton targetMode="merge" icon={Files} label="Merge" />
            <NavButton targetMode="split" icon={Scissors} label="Split" />
            <NavButton targetMode="convert" icon={ArrowRightLeft} label="Convert" />
            <NavButton targetMode="compress" icon={Minimize2} label="Compress" />
            <NavButton targetMode="resize" icon={Scaling} label="Resize" />
            <NavButton targetMode="protect" icon={Lock} label="Protect" />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAiOpen(true)}
              className="hidden md:flex group items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 font-bold text-sm"
            >
              <Sparkles size={16} className="group-hover:animate-pulse" />
              <span>AI Assistant</span>
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors z-50 relative"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header> 

      {/* --- MOBILE MENU --- */}
      <div className={clsx(
        "fixed inset-0 bg-white/95 backdrop-blur-2xl z-40 md:hidden transition-all duration-500 ease-in-out flex flex-col pt-24 px-6 pb-8",
        isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-120px)] pb-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Menu</p>
          <NavButton targetMode="home" icon={HomeIcon} label="Home" mobile />
          <NavButton targetMode="merge" icon={Files} label="Merge PDF" mobile />
          <NavButton targetMode="split" icon={Scissors} label="Split PDF" mobile />
          <NavButton targetMode="convert" icon={ArrowRightLeft} label="Convert PDF" mobile />
          <NavButton targetMode="compress" icon={Minimize2} label="Compress PDF" mobile />
          <NavButton targetMode="resize" icon={Scaling} label="Resize Image" mobile />
          <NavButton targetMode="protect" icon={Lock} label="Protect PDF" mobile />
          
          <div className="my-2 border-t border-slate-100"></div>
          
          <button 
            onClick={() => { setIsAiOpen(true); setIsMobileMenuOpen(false); }}
            className="w-full p-4 flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-lg shadow-slate-200"
          >
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles size={20} />
            </div>
            <span className="font-bold">Open AI Assistant</span>
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-slate-500 font-medium mt-6 animate-pulse">Loading Genz Tools...</p>
          </div>
        }>
          {mode === 'home' ? (
            <Home setMode={(m) => navigateTo(m)} />
          ) : mode === 'merge' ? (
            
            /* --- MERGE TOOL UI --- */
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
                <div className="text-center max-w-4xl mx-auto py-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100">
                    <Zap size={14} /> Secure & Private
                  </div>
                  <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 mb-6 tracking-tight leading-[1.1]">
                    Merge PDF Files <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Instantly</span>
                  </h1>
                  <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Combine multiple PDFs into one document securely without uploading. Drag & drop, reorder, and merge offline in your browser.
                  </p>
                  
                  <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                    <FileUploader 
                      onFilesSelected={handleFilesSelected} 
                      allowMultiple={true} 
                      acceptedFileTypes={['application/pdf']} 
                      label="Drop PDFs here to Merge" 
                    />
                  </div>

                  {/* Feature Grid */}
                  <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: ShieldCheck, title: "Privacy First", desc: "Files never leave your browser. Client-side processing." },
                      { icon: Scaling, title: "High Quality", desc: "Maintains original document resolution without losing quality." },
                      { icon: LayoutGrid, title: "Easy Ordering", desc: "Drag and drop to reorder pages before merging." }
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
                  
                  {/* Left: File List */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                      <div>
                        <h1 className="text-2xl font-black text-slate-900">Merge Queue</h1>
                        <p className="text-sm text-slate-400 font-medium">Reorder your files for the final output</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSort(SortOrder.ASC)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100" title="Sort A-Z"><ArrowDownAZ size={20}/></button>
                        <button onClick={() => handleSort(SortOrder.DESC)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100" title="Sort Z-A"><ArrowUpAZ size={20}/></button>
                        <button onClick={handleClearAll} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100" title="Clear All"><Trash2 size={20}/></button>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                      <FileList files={files} setFiles={setFiles} onRemove={handleRemoveFile} />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all font-bold"
                      >
                        <Plus size={20} /> Add More Documents
                      </button>
                    </div>
                  </div>

                  {/* Right: Actions Card */}
                  <div className="lg:sticky lg:top-24 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200">
                      <h3 className="text-xl font-black mb-6">Summary</h3>
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm border-b border-slate-700 pb-3">
                          <span className="text-slate-400">Total Files</span>
                          <span className="font-bold">{files.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Status</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck size={14}/> Ready
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={handleMerge} 
                        disabled={files.length < 2 || isMerging}
                        className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3"
                      >
                        {isMerging ? <Loader2 className="animate-spin" /> : <FileStack />}
                        {isMerging ? "Merging..." : "Merge Files"}
                      </button>
                    </div>

                    {mergedPdfUrl && (
                      <div className="bg-emerald-500 p-6 rounded-[2rem] text-white animate-bounce-in shadow-xl shadow-emerald-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white/20 rounded-full"><CheckCircle2 /></div>
                          <span className="font-bold text-lg">Merge Success!</span>
                        </div>
                        <a 
                          href={mergedPdfUrl} 
                          download="merged-genzpdf.pdf" 
                          className="w-full py-3.5 bg-white text-emerald-600 rounded-xl font-black text-center block hover:bg-emerald-50 transition-colors shadow-sm"
                        >
                          <Download className="inline mr-2" size={18}/> Download PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          ) : (
            /* --- OTHER TOOLS --- */
            <div className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[500px]">
              {mode === 'split' && <SplitTool />}
              {mode === 'convert' && <ConverterTool />}
              {mode === 'compress' && <CompressTool />}
              {mode === 'resize' && <ResizeTool />}
              {mode === 'protect' && <ProtectTool />}
              {mode === 'about' && <About />}
              {mode === 'contact' && <Contact />}
              {mode === 'policy' && <Policy />}
              {mode === 'terms' && <Terms />}
            </div>
          )}
        </Suspense>
      </main>

      <Footer setMode={(m) => navigateTo(m)} />
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      <Analytics />
      <SpeedInsights />

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
