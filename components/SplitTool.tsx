import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, Download, Trash2, X, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { FileUploader } from './FileUploader';
import { removePagesFromPdf, createPdfUrl } from '../services/pdfService';

interface SplitToolProps {}

export const SplitTool: React.FC<SplitToolProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize PDF.js worker safely
  useEffect(() => {
    const initPdfWorker = () => {
      // Handle potential default export structure from esm.sh/bundlers
      const lib = (pdfjsLib as any).default || pdfjsLib;
      
      if (lib && lib.GlobalWorkerOptions) {
        // Use cdnjs which generally has better CORS support for workers and stable uptime
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    initPdfWorker();
  }, []);

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
        const arrayBuffer = await file.arrayBuffer();
        
        // Access library safely for getDocument
        const lib = (pdfjsLib as any).default || pdfjsLib;
        
        // Ensure worker is set before loading
        if (!lib.GlobalWorkerOptions.workerSrc) {
            lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const loadingTask = lib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        const numPages = pdf.numPages;
        const images: string[] = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 }); // Scale down for thumbnails
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          images.push(canvas.toDataURL());
        }
        setPageImages(images);
      } catch (err: any) {
        console.error("PDF Load Error:", err);
        let errorMessage = "Failed to load PDF pages. The file might be corrupted or password protected.";
        if (err.name === 'MissingPDFException') {
            errorMessage = "Missing or invalid PDF file.";
        } else if (err.name === 'InvalidPDFException') {
            errorMessage = "Invalid PDF structure.";
        } else if (err.name === 'PasswordException') {
            errorMessage = "Password protected PDF.";
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdfPages();
  }, [file]);

  const togglePageSelection = (index: number) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRemovePages = async () => {
    if (!file || selectedPages.size === 0) return;
    
    setIsProcessing(true);
    try {
      const pagesToRemove = Array.from(selectedPages);
      const newPdfBytes = await removePagesFromPdf(file, pagesToRemove);
      const url = createPdfUrl(newPdfBytes);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to process the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageImages([]);
    setSelectedPages(new Set());
    setResultUrl(null);
    setError(null);
  };

  if (!file) {
    return (
      <div className="w-full">
         <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Split & Edit PDF</h3>
            <p className="text-slate-500">Upload a document to remove unwanted pages.</p>
         </div>
        <FileUploader onFilesSelected={handleFileSelected} allowMultiple={false} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Header / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-semibold text-slate-900">{file.name}</h3>
          <p className="text-sm text-slate-500">{pageImages.length} Pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
             onClick={handleReset}
             className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
          >
            Change File
          </button>
          
          {resultUrl ? (
             <a
               href={resultUrl}
               download={`edited-${file.name}`}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
             >
               <Download size={16} />
               Download
             </a>
          ) : (
            <button
                onClick={handleRemovePages}
                disabled={selectedPages.size === 0 || isProcessing}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
                {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={16} />}
                Remove {selectedPages.size} Page{selectedPages.size !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Grid View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
           <p>Rendering pages...</p>
        </div>
      ) : (
        <div className="bg-slate-100 rounded-xl p-6 min-h-[400px]">
           <p className="text-center text-slate-500 mb-6 text-sm">
             Select the pages you want to <strong className="text-red-500">remove</strong>.
           </p>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {pageImages.map((img, idx) => {
               const isSelected = selectedPages.has(idx);
               return (
                 <div 
                   key={idx}
                   onClick={() => !resultUrl && togglePageSelection(idx)}
                   className={clsx(
                     "relative aspect-[3/4] bg-white rounded-lg shadow-sm cursor-pointer transition-all overflow-hidden group",
                     isSelected ? "ring-2 ring-red-500 opacity-75" : "hover:shadow-md hover:scale-[1.02]",
                     resultUrl && "opacity-50 cursor-default"
                   )}
                 >
                   <img src={img} alt={`Page ${idx + 1}`} className="w-full h-full object-contain p-2" />
                   
                   {/* Page Number */}
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-800/70 text-white text-xs px-2 py-0.5 rounded-full">
                      Page {idx + 1}
                   </div>

                   {/* Selection Overlay */}
                   {isSelected && (
                     <div className="absolute inset-0 bg-red-50/30 flex items-center justify-center">
                        <div className="bg-red-500 text-white p-3 rounded-full shadow-lg">
                           <Trash2 size={24} />
                        </div>
                     </div>
                   )}
                 </div>
               );
             })}
           </div>
        </div>
      )}
    </div>
  );
};
