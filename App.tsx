import React, { useState } from 'react';
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
  LayoutGrid  // Added for Home icon
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
import { Home } from './components/Home';  // New Home component
import { PdfFile, SortOrder, AppMode } from './types';
import { mergePdfs, createPdfUrl } from './services/pdfService';

function App() {
  const [mode, setMode] = useState<AppMode>('home');  // Changed default to 'home'
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles: PdfFile[] = newFiles.map((file) => ({
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...pdfFiles]);
    setMergedPdfUrl(null); // Reset previous merge
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

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={() => setMode('home')} 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <FileStack size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
              PDF Fusion AI
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
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="bg-slate-100 p-1 rounded-xl inline-flex shadow-inner whitespace-nowrap">
             {/* Home Button */}
             <button
               onClick={() => setMode('home')}
               className={clsx(
                 "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                 mode === 'home' 
                    ? "bg-white text-primary-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
               )}
             >
                <LayoutGrid size={18} />
                Home
             </button>
             
             <button
               onClick={() => setMode('merge')}
               className={clsx(
                 "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                 mode === 'merge' 
                    ? "bg-white text-primary-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
               )}
             >
                <Files size={18} />
                Merge
             </button>
             <button
               onClick={() => setMode('split')}
               className={clsx(
                 "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                 mode === 'split' 
                    ? "bg-white text-primary-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
               )}
             >
                <Scissors size={18} />
                Split
             </button>
             <button
               onClick={() => setMode('convert')}
               className={clsx(
                 "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                 mode === 'convert' 
                    ? "bg-white text-primary-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
               )}
             >
                <ArrowRightLeft size={18} />
                Convert
             </button>
             <button
               onClick={() => setMode('compress')}
               className={clsx(
                 "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                 mode === 'compress' 
                    ? "bg-white text-primary-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
               )}
             >
                <Minimize2 size={18} />
                Compress
             </button>
             <button
               onClick={() => setMode('resize')}
               className={clsx(
                 "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                 mode === 'resize' 
                    ? "bg-white text-primary-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
               )}
             >
                <Scaling size={18} />
                Resize
             </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {mode === 'home' ? (
          <Home setMode={setMode} />
        ) : mode === 'split' ? (
           <SplitTool />
        ) : mode === 'convert' ? (
           <ConverterTool />
        ) : mode === 'compress' ? (
           <CompressTool />
        ) : mode === 'resize' ? (
           <ResizeTool />
        ) : (
          /* MERGE TOOL VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            
            {/* Left: Uploader & List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-2">
                 <h2 className="text-2xl font-bold text-slate-900">Merge PDF Files</h2>
                 <p className="text-slate-500">Combine multiple documents into a single PDF file.</p>
              </div>

              <FileUploader onFilesSelected={handleFilesSelected} label="Click or Drag PDF files here" />
              
              {files.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm">
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
              )}
            </div>

            {/* Right: Actions & Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                
                {/* Merge Action Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Ready to Merge?</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Verify your file order on the left before merging. The first file in the list will be the start of your new PDF.
                  </p>
                  
                  <button
                    onClick={handleMerge}
                    disabled={files.length < 2 || isMerging}
                    className={clsx(
                      "w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white shadow-lg transition-all",
                      files.length < 2 || isMerging
                        ? "bg-slate-300 cursor-not-allowed shadow-none"
                        : "bg-primary-600 hover:bg-primary-700 hover:shadow-primary-200 active:scale-95"
                    )}
                  >
                    {isMerging ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Merging...
                      </>
                    ) : (
                      <>
                        Merge {files.length} Files
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>

                {/* Success / Download Card */}
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
                          download={`merged-document-${new Date().toISOString().slice(0,10)}.pdf`}
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                        >
                          <Download size={16} />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Promo Card (Small) if list is empty */}
                {files.length === 0 && (
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-xl border border-indigo-100 p-5">
                      <div className="flex items-start gap-3">
                          <Sparkles className="text-indigo-500 w-5 h-5 mt-0.5" />
                          <div>
                              <h4 className="font-medium text-slate-900 text-sm">Need help organizing?</h4>
                              <p className="text-xs text-slate-500 mt-1">
                                  Ask our AI assistant to help you structure documents or analyze images of your files.
                              </p>
                              <button 
                                  onClick={() => setIsAiOpen(true)}
                                  className="text-xs text-indigo-600 font-medium mt-2 hover:underline"
                              >
                                  Open Assistant
                              </button>
                          </div>
                      </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}
      </main>

      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

export default App;
