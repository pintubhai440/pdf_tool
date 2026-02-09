// components/CompressTool.tsx

import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { 
  Minimize2, 
  Download, 
  Loader2, 
  FileCheck, 
  AlertCircle,
  Settings2
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { createPdfUrl } from '../services/pdfService';
import { clsx } from 'clsx';

export const CompressTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<number>(0.6); // 0.1 to 1.0
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize PDF.js worker
  useEffect(() => {
    const initPdfWorker = () => {
      const lib = (pdfjsLib as any).default || pdfjsLib;
      if (lib && lib.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    initPdfWorker();
  }, []);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setCompressedSize(null);
      setError(null);
    }
  };

  const compressImage = async (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Optional: Resize if huge
        let width = img.width;
        let height = img.height;
        const maxWidth = 2000; // Limit width for extra size saving
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        }, file.type === 'image/png' ? 'image/jpeg' : file.type, quality); // Force JPEG for better compression if needed
      };
      img.onerror = reject;
    });
  };

  const compressPdf = async (file: File, quality: number) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const lib = (pdfjsLib as any).default || pdfjsLib;
      
      const loadingTask = lib.getDocument({ data: arrayBuffer });
      const originalPdf = await loadingTask.promise;
      
      const newPdfDoc = await PDFDocument.create();

      // Render each page to image then add back to PDF (Rasterization)
      for (let i = 1; i <= originalPdf.numPages; i++) {
        const page = await originalPdf.getPage(i);
        // Scale 1.5 is a good balance for readability vs size. 
        // Lower scale = smaller size but blurry text.
        const viewport = page.getViewport({ scale: 1.5 }); 
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
        const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());
        
        const embeddedImage = await newPdfDoc.embedJpg(imgBytes);
        const newPage = newPdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await newPdfDoc.save();
      return pdfBytes;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to compress PDF");
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      let resultBlob: Blob | Uint8Array;
      let extension = file.name.split('.').pop()?.toLowerCase();

      if (file.type === 'application/pdf') {
        const bytes = await compressPdf(file, compressionLevel);
        resultBlob = new Blob([bytes], { type: 'application/pdf' });
      } else if (file.type.startsWith('image/')) {
        resultBlob = await compressImage(file, compressionLevel);
      } else {
        throw new Error("Format not supported for compression yet.");
      }

      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setCompressedSize(resultBlob.size);
      setDownloadName(`compressed-${file.name}`);
      
    } catch (err: any) {
      setError(err.message || "Compression failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setCompressedSize(null);
  };

  if (!file) {
    return (
      <div className="w-full">
         <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Compress PDF & Images</h3>
            <p className="text-slate-500">Reduce file size while maintaining good quality.</p>
         </div>
        <FileUploader 
            onFilesSelected={handleFileSelected} 
            allowMultiple={false}
            acceptedFileTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
            label="Drop PDF or Image to Compress"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       
       {/* File Info Card */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-full text-orange-600">
               <Minimize2 size={24} />
            </div>
            <div>
               <h3 className="font-semibold text-slate-900">{file.name}</h3>
               <p className="text-sm text-slate-500">
                 Original Size: {(file.size / 1024 / 1024).toFixed(2)} MB
               </p>
            </div>
          </div>
          <button onClick={handleReset} className="text-slate-400 hover:text-red-500 p-2">
             <AlertCircle size={20} className="rotate-45" />
          </button>
       </div>

       {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
        </div>
      )}

       {/* Controls */}
       {!downloadUrl ? (
         <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
               <Settings2 size={18} />
               Compression Level
            </h4>
            
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Better Quality</span>
                    <span className="font-medium text-orange-600">
                        {compressionLevel >= 0.8 ? 'Low Compression' : 
                         compressionLevel >= 0.5 ? 'Medium Compression' : 'High Compression'}
                    </span>
                    <span className="text-slate-500">Smaller Size</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="0.9" 
                    step="0.1"
                    value={1 - compressionLevel} // Invert visual logic so right is "More Compression"
                    onChange={(e) => setCompressionLevel(1 - parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Note: High compression may reduce text readability in PDFs.
                  </p>
               </div>
               
               <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200"
               >
                  {isProcessing ? (
                     <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Compressing...
                     </>
                  ) : (
                     <>
                        <Minimize2 size={20} />
                        Compress Now
                     </>
                  )}
               </button>
            </div>
         </div>
       ) : (
         /* Success State */
         <div className="bg-green-50 rounded-xl p-8 border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
               <FileCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Compression Complete!</h3>
            
            <div className="flex items-center justify-center gap-4 text-sm mb-6">
                <span className="text-slate-500 line-through">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span className="font-bold text-green-600 text-lg">
                    {compressedSize ? (compressedSize / 1024 / 1024).toFixed(2) : '?'} MB
                </span>
                <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-bold">
                    -{Math.round(((file.size - (compressedSize || 0)) / file.size) * 100)}%
                </span>
            </div>
            
            <div className="flex items-center justify-center gap-4">
               <a 
                  href={downloadUrl} 
                  download={downloadName}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2 transition-all hover:scale-105"
               >
                  <Download size={20} />
                  Download
               </a>
               <button 
                  onClick={handleReset}
                  className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
               >
                  Try Another
               </button>
            </div>
         </div>
       )}
    </div>
  );
};
