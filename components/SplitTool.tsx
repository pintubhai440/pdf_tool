import React, { useState, useEffect, useRef, useCallback } from 'react';
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
      if (lib && lib.GlobalWorkerOptions) {
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

        if (!lib.GlobalWorkerOptions.workerSrc) {
          lib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

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
        let errorMessage = 'Failed to load PDF pages. The file might be corrupted or password protected.';
        if (err.name === 'MissingPDFException') errorMessage = 'Missing or invalid PDF file.';
        if (err.name === 'InvalidPDFException') errorMessage = 'Invalid PDF structure.';
        if (err.name === 'PasswordException') errorMessage = 'Password protected PDF.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdfPages();
  }, [file]);

  // Handle file upload
  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResultUrl(null);
      setError(null);
      setSelectedPages(new Set());
    }
  };

  // Stable toggle function – uses callback form to avoid stale closures
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

  // Extract selected pages → remove all others
  const handleSplit = async () => {
    if (!file || selectedPages.size === 0) return;

    setIsProcessing(true);
    try {
      // Pages to remove = all pages NOT selected
      const allPages = Array.from({ length: pageImages.length }, (_, i) => i + 1);
      const pagesToRemove = allPages.filter((p) => !selectedPages.has(p));

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

  // Reset everything (back to file upload)
  const handleReset = () => {
    setFile(null);
    setPageImages([]);
    setSelectedPages(new Set());
    setResultUrl(null);
    setError(null);
  };

  // Initial state – no file uploaded
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

  // Main UI – file loaded
  return (
    <div className="w-full space-y-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Split PDF</h3>
            <p className="text-slate-500 flex flex-wrap items-center gap-x-2">
              <span>{file.name} • {pageImages.length} Pages</span>
              <button
                onClick={handleReset}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium transition-colors"
              >
                Change file
              </button>
            </p>
          </div>

          {/* Action Button – Extract or Download */}
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
              {isProcessing ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Scissors size={20} />
              )}
              Extract {selectedPages.size} Page{selectedPages.size !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Pages Grid – Scrollable */}
        <div className="bg-slate-100 rounded-2xl p-4 md:p-8 min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar">
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
                    key={`page-${index}`} // unique and stable key
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
                        className="w-full h-full object-cover"
                      />

                      {/* Page Number Badge */}
                      <div
                        className={clsx(
                          'absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors',
                          isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-white text-slate-900'
                        )}
                      >
                        {pageNumber}
                      </div>

                      {/* Selection Overlay (only when not already processed) */}
                      {isSelected && !resultUrl && (
                        <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center">
                          <div className="bg-rose-500 text-white p-1 rounded-full">
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
