// ✅ 1. Imports
import React, { useState, useEffect, useRef } from 'react';
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
  LayoutGrid
} from 'lucide-react';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { AiAssistant } from './components/AiAssistant';
import { SplitTool } from './components/SplitTool';
import { ConverterTool } from './components/ConverterTool';
import { CompressTool } from './components/CompressTool';
import { ResizeTool } from './components/ResizeTool';
import { Home } from './components/Home';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Policy } from './components/Policy';
import { Terms } from './components/Terms';
import { Footer } from './components/Footer';
import { PdfFile, SortOrder, AppMode } from './types';
import { mergePdfs, createPdfUrl } from './services/pdfService';

// ✅ SEO METADATA – Unique title & description for every route
const SEO_METADATA: Record<AppMode, { title: string; description: string }> = {
  home: {
    title: "Genz PDF - 100% Free & Unlimited PDF Tools | Merge, Split & Compress",
    description: "The best free online PDF tools. Merge, Split, Convert, Compress, and Resize PDFs instantly. No limits, no signup, secure and made in India."
  },
  merge: {
    title: "Merge PDF Free - Combine PDF Files Online | Genz PDF",
    description: "Combine multiple PDFs into one document for free. Drag and drop to reorder. Fast, secure, and unlimited PDF merger tool."
  },
  split: {
    title: "Split PDF Online - Extract Pages for Free | Genz PDF",
    description: "Separate PDF pages or split PDF into multiple files. 100% free and secure PDF splitter."
  },
  compress: {
    title: "Compress PDF - Reduce File Size Online | Genz PDF",
    description: "Reduce PDF file size without losing quality. Compress PDF to 100kb, 200kb online for free."
  },
  convert: {
    title: "PDF Converter - PDF to Word, JPG, PNG Free | Genz PDF",
    description: "Convert PDF to Word, Excel, PowerPoint, and Images instantly. Best free PDF converter tool."
  },
  resize: {
    title: "Resize PDF & Images - Change Dimensions Online | Genz PDF",
    description: "Resize your PDF pages or images to specific dimensions (A4, Letter, Custom) easily and for free."
  },
  about: {
    title: "About Genz PDF - Our Mission & Team",
    description: "Learn about Genz PDF, the free and unlimited PDF tool developed in India by Pintu & Raushan."
  },
  contact: {
    title: "Contact Us - Genz PDF Support",
    description: "Get in touch with the Genz PDF team for support, feedback, or inquiries."
  },
  policy: {
    title: "Privacy Policy - Genz PDF",
    description: "Your data is safe with us. Read our strict zero-storage privacy policy."
  },
  terms: {
    title: "Terms & Conditions - Genz PDF",
    description: "Read the terms of use for Genz PDF services."
  }
};

function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ DYNAMIC SEO UPDATE + SCROLL TO TOP
  useEffect(() => {
    // 1. Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Update document title
    const metadata = SEO_METADATA[mode] || SEO_METADATA.home;
    document.title = metadata.title;

    // 3. Update meta description (Google uses this)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', metadata.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', metadata.description);
      document.head.appendChild(metaDesc);
    }
  }, [mode]);

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
    if (window.confirm("Are you sure you want to remove all files?")) {
      setFiles([]);
      setMergedPdfUrl(null);
    }
  };

  const handleSort = (order: SortOrder) => {
    const sorted = [...files].sort((a, b) => {
      return order === SortOrder.ASC
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
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
      console.error("Merge failed", error);
      alert("Failed to merge PDFs. Please try again.");
    } finally {
      setIsMerging(false);
    }
  };

  // ✅ NavButton with accessibility (aria-label) for better SEO / UX
  const NavButton = ({ targetMode, icon: Icon, label }: { targetMode: AppMode, icon: any, label: string }) => (
    <button
      onClick={() => setMode(targetMode)}
      aria-label={`Go to ${label} tool`}
      className={clsx(
        "flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 min-w-[100px]",
        mode === targetMode
          ? "bg-white text-primary-700 shadow-sm ring-1 ring-slate-200 sm:ring-0"
          : "bg-white sm:bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 sm:hover:bg-slate-200/50 border sm:border-0 border-slate-100"
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">

      {/* ✅ Semantic <header> with landmark role */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo – uses <div>, not <h1>, to avoid duplicate H1 issues */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setMode('home')}
            title="Genz PDF Home"
          >
            <img
              src="/logo.png"
              alt="Genz PDF - Free Online PDF Tools" // ✅ Descriptive alt for SEO
              className="w-10 h-10 object-contain rounded-lg"
            />
            {/* Brand name – not an H1, just a visual heading */}
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 hidden xs:block">
              Genz PDF
            </div>
            <div className="text-xl font-bold text-primary-600 xs:hidden">
              Genz PDF
            </div>
          </div>

          <button
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm font-medium"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>
        </div>
      </header>

      {/* ✅ Semantic <main> – primary content landmark */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ✅ Navigation – wrapped in <nav> with aria-label */}
        {!['about', 'contact', 'policy', 'terms'].includes(mode) && (
          <nav className="flex justify-center mb-8" aria-label="PDF Tools Navigation">
            <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap gap-2 sm:gap-0 sm:bg-slate-100 sm:p-1 sm:rounded-xl sm:shadow-inner">
              <button
                onClick={() => setMode('home')}
                className={clsx(
                  "flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 min-w-[100px]",
                  mode === 'home'
                    ? "bg-white text-primary-700 shadow-sm ring-1 ring-slate-200 sm:ring-0"
                    : "bg-white sm:bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 sm:hover:bg-slate-200/50 border sm:border-0 border-slate-100"
                )}
              >
                <LayoutGrid size={18} />
                Home
              </button>

              <NavButton targetMode="merge" icon={Files} label="Merge" />
              <NavButton targetMode="split" icon={Scissors} label="Split" />
              <NavButton targetMode="convert" icon={ArrowRightLeft} label="Convert" />
              <NavButton targetMode="compress" icon={Minimize2} label="Compress" />
              <NavButton targetMode="resize" icon={Scaling} label="Resize" />
            </div>
          </nav>
        )}

        {/* ✅ Dynamic page rendering */}
        {mode === 'home' ? (
          <Home setMode={setMode} />
        ) : mode === 'about' ? (
          <About />
        ) : mode === 'contact' ? (
          <Contact />
        ) : mode === 'policy' ? (
          <Policy />
        ) : mode === 'terms' ? (
          <Terms />
        ) : mode === 'split' ? (
          <SplitTool />
        ) : mode === 'convert' ? (
          <ConverterTool />
        ) : mode === 'compress' ? (
          <CompressTool />
        ) : mode === 'resize' ? (
          <ResizeTool />
        ) : (
          /* ---------- MERGE TOOL – FULLY SEO OPTIMIZED ---------- */
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  handleFilesSelected(Array.from(e.target.files));
                }
              }}
              multiple
              accept=".pdf"
              className="hidden"
            />

            {files.length === 0 ? (
              /* ----- No files: Show uploader with H1 ----- */
              <div className="w-full">
                <div className="mb-6 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Merge PDF Documents for Free
                  </h1>
                  <p className="text-slate-500">
                    Combine multiple PDFs into one file securely. No limits, watermarks, or sign-up required.
                  </p>
                </div>
                <FileUploader 
                  onFilesSelected={handleFilesSelected} 
                  allowMultiple={true}
                  acceptedFileTypes={['application/pdf']}
                  label="Drop PDFs here to Merge"
                />
              </div>
            ) : (
              /* ----- Files present: Show list and merge controls with H1 ----- */
              <>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Merge PDF Documents</h1>
                    <p className="text-slate-500">Combine multiple PDFs into one. Drag to reorder.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Files size={18} />
                      Add More Files
                    </button>
                    <button
                      onClick={handleMerge}
                      disabled={files.length < 2 || isMerging}
                      className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
                    >
                      {isMerging ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <FileStack size={20} />
                      )}
                      Merge Files
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">
                        {files.length}
                      </span>
                      Files to Merge
                    </h2>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSort(SortOrder.ASC)}
                        className="p-1.5 text-slate-500 hover:bg-white hover:text-primary-600 rounded transition-colors"
                        title="Sort A-Z"
                      >
                        <ArrowDownAZ size={18} />
                      </button>
                      <button
                        onClick={() => handleSort(SortOrder.DESC)}
                        className="p-1.5 text-slate-500 hover:bg-white hover:text-primary-600 rounded transition-colors"
                        title="Sort Z-A"
                      >
                        <ArrowUpAZ size={18} />
                      </button>
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <button
                        onClick={handleClearAll}
                        className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                        title="Clear All"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <FileList
                    files={files}
                    setFiles={setFiles}
                    onRemove={handleRemoveFile}
                  />
                </div>

                <div className="space-y-4">
                  {mergedPdfUrl && (
                    <div className="bg-green-50 rounded-xl border border-green-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                          <FileStack size={20} />
                        </div>
                        <div>
                          <h2 className="font-semibold text-green-900">Merge Complete!</h2>
                          <p className="text-sm text-green-700 mt-1 mb-4">
                            Your consolidated document is ready.
                          </p>
                          <a
                            href={mergedPdfUrl}
                            download={`genz-merged-${new Date().toISOString().slice(0, 10)}.pdf`}
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            <Download size={16} />
                            Download Merged PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ✅ SEO RICH CONTENT – Helps ranking & user trust */}
            <div className="mt-12 pt-8 border-t border-slate-200 text-slate-600 text-sm leading-relaxed">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Why Use Genz PDF Merger?</h2>
              <p>
                Genz PDF offers the <strong>best free PDF merge tool</strong> in India. 
                Whether you need to combine reports, bank statements, or study materials, 
                our tool lets you <strong>merge unlimited PDF files</strong> instantly. 
                Your data is 100% secure as all processing happens locally or on temporary secure sessions.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer setMode={setMode} />
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

export default App;
