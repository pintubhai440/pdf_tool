// ✅ 1. 'useEffect' aur 'useRef' ko import kiya gaya hai
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Trash2,
  Download,
  Sparkles,
  FileStack,
  ChevronRight,
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
import { Terms } from './components/Terms'; // ✅ Import Terms component
import { Footer } from './components/Footer';
import { PdfFile, SortOrder, AppMode } from './types';
import { mergePdfs, createPdfUrl } from './services/pdfService';

function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // ✅ 2. Jab bhi mode change ho, page top par scroll kare
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mode]);

  // ✅ Ref for hidden file input (used by "Add More Files" button)
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Helper function for clickable nav buttons to keep code clean
  const NavButton = ({ targetMode, icon: Icon, label }: { targetMode: AppMode, icon: any, label: string }) => (
    <button
      onClick={() => setMode(targetMode)}
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

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo ko clickable banaya hai - Acts as Home Button */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setMode('home')}
            title="Go to Home"
          >
            {/* Custom Logo Image */}
            <img
              src="/logo.png"
              alt="Genz PDF Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 hidden xs:block">
              Genz PDF
            </h1>
            {/* Mobile Title (Short) */}
            <h1 className="text-xl font-bold text-primary-600 xs:hidden">
              Genz PDF
            </h1>
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Navigation Tabs - Hide on About, Contact, Policy, Terms pages */}
        {!['about', 'contact', 'policy', 'terms'].includes(mode) && (
          <div className="flex justify-center mb-8">
            <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap gap-2 sm:gap-0 sm:bg-slate-100 sm:p-1 sm:rounded-xl sm:shadow-inner">
              {/* Home Button */}
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
          </div>
        )}

        {/* Dynamic Content Switching */}
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
          /* ---------- MERGE TOOL (Responsive Version) ---------- */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* Hidden Input (Isko rehne dein) */}
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

            {/* ✅ NEW: Agar koi file nahi hai, toh FileUploader dikhao */}
            {files.length === 0 ? (
              <div className="w-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Merge PDF Documents</h3>
                  <p className="text-slate-500">Combine multiple PDFs into one. Drag to reorder.</p>
                </div>
                <FileUploader 
                  onFilesSelected={handleFilesSelected} 
                  allowMultiple={true}
                  acceptedFileTypes={['application/pdf']}
                  label="Drop PDFs here to Merge"
                />
              </div>
            ) : (
              /* ✅ EXISTING CODE: Agar files hain, toh List aur Buttons dikhao */
              <>
                {/* Header row with title and action buttons */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Merge PDF Documents</h3>
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

                {/* File list container */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">
                        {files.length}
                      </span>
                      Files to Merge
                    </h3>
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

                {/* Download card */}
                <div className="space-y-4">
                  {mergedPdfUrl && (
                    <div className="bg-green-50 rounded-xl border border-green-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                          <FileStack size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-900">Merge Complete!</h4>
                          <p className="text-sm text-green-700 mt-1 mb-4">
                            Your consolidated document is ready.
                          </p>
                          <a
                            href={mergedPdfUrl}
                            download={`merged-document-${new Date().toISOString().slice(0, 10)}.pdf`}
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            <Download size={16} />
                            Download PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer - All pages ke niche dikhega */}
      <Footer setMode={setMode} />

      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

export default App;
