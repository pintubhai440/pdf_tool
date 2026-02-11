import React, { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, Download, Scissors, FileCheck, AlertCircle } from 'lucide-react';
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

  // Initialize PDF.js worker
  useEffect(() => {
    const initPdfWorker = () => {
      const lib = (pdfjsLib as any).default || pdfjsLib;
      if (lib && lib.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    initPdfWorker();
  }, []);

  // Load PDF thumbnails
  useEffect(() => {
    if (!file) return;

    const loadPdfPages = async () => {
      setIsLoading(true);
      setPageImages([]);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const lib = (pdfjsLib as any).default || pdfjsLib;

        const loadingTask = lib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const numPages = pdf.numPages;
        const images: string[] = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
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
        console.error('PDF Load Error:', err);
        setError('Failed to load PDF pages. The file might be corrupted.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdfPages();
  }, [file]);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResultUrl(null);
      setError(null);
      setSelectedPages(new Set());
    }
  };

  // Stable toggle logic using useCallback
  const togglePageSelection = useCallback((pageNumber: number) => {
    setSelectedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber);
      } else {
        newSet.add(pageNumber);
      }
      return newSet;
    });
  }, []);

  // Updated handleSplit: sort pages to remove in descending order to prevent index shift
  const handleSplit = async () => {
    if (!file || selectedPages.size === 0) return;

    setIsProcessing(true);
    try {
      // 1. Saare pages ki list banayein (1-based index)
      const allPages = Array.from({ length: pageImages.length }, (_, i) => i + 1);
      
      // 2. Sirf wo pages nikaalein jo select NAHI kiye gaye hain
      // Inhe descending order mein sort karein (bade se chota) taaki index shift na ho
      const pagesToRemove = allPages
        .filter((p) => !selectedPages.has(p))
        .sort((a, b) => b - a);

      // 3. pdfService ko call karein
      const newPdfBytes = await removePagesFromPdf(file, pagesToRemove);
      const url = createPdfUrl(newPdfBytes);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError('Failed to process the PDF.');
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
          <p className="text-slate-500">Upload a document to extract pages.</p>
        </div>
        <FileUploader onFilesSelected={handleFileSelected} allowMultiple={false} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-6">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <h3 className="text-2xl font-bold text-slate-900">Split PDF</h3>
            <div className="text-slate-500 flex flex-wrap items-center gap-x-2">
              <span className="truncate max-w-[200px] md:max-w-md font-medium">{file.name}</span>
              <span>• {pageImages.length} Pages</span>
              <button
                onClick={handleReset}
                className="text-sm text-rose-600 hover:text-rose-700 font-semibold transition-colors ml-1"
              >
                Change
              </button>
            </div>
          </div>

          {resultUrl ? (
            <a
              href={resultUrl}
              download={`extracted-${file.name}`}
              className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              <Download size={20} />
              Download PDF
            </a>
          ) : (
            <button
              onClick={handleSplit}
              disabled={selectedPages.size === 0 || isProcessing}
              className="w-full md:w-auto px-8 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Scissors size={20} />}
              Extract {selectedPages.size} Page{selectedPages.size !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Scrollable Grid Container */}
        <div className="bg-slate-100 rounded-2xl p-4 md:p-8 min-h-[400px] max-h-[75vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-rose-500" />
              <p>Rendering pages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {pageImages.map((image, index) => {
                const pageNumber = index + 1;
                const isSelected = selectedPages.has(pageNumber);
                return (
                  <div
                    key={`split-page-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!resultUrl) togglePageSelection(pageNumber);
                    }}
                    className={clsx(
                      'relative cursor-pointer group transition-all duration-300',
                      isSelected ? 'scale-95' : 'hover:scale-105',
                      resultUrl && 'cursor-default opacity-50'
                    )}
                  >
                    <div
                      className={clsx(
                        'aspect-[1/1.414] rounded-lg overflow-hidden border-4 transition-all shadow-sm bg-white',
                        isSelected
                          ? 'border-rose-500 shadow-rose-200 shadow-xl'
                          : 'border-transparent group-hover:border-rose-200'
                      )}
                    >
                      <img
                        src={image}
                        alt={`Page ${pageNumber}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />

                      <div
                        className={clsx(
                          'absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors',
                          isSelected ? 'bg-rose-500 text-white' : 'bg-white text-slate-900'
                        )}
                      >
                        {pageNumber}
                      </div>

                      {isSelected && !resultUrl && (
                        <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center">
                          <div className="bg-rose-500 text-white p-1 rounded-full animate-in zoom-in-50 duration-200">
                            <FileCheck size={20} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
