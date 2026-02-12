import React, { useState, useRef } from 'react';
import { 
  Scaling, 
  Download, 
  Loader2, 
  RefreshCcw, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { clsx } from 'clsx';

export const ResizeTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number, h: number } | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setDownloadUrl(null);
      
      // Image load karke original dimensions nikalo
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setWidth(newWidth);
    if (maintainRatio && originalDimensions) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setHeight(newHeight);
    if (maintainRatio && originalDimensions) {
      const ratio = originalDimensions.w / originalDimensions.h;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = async () => {
    if (!file || width <= 0 || height <= 0) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // High Quality Settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
          }
          setIsProcessing(false);
        }, file.type, 1.0); // 1.0 matlab max quality
      }
    } catch (error) {
      console.error("Resize failed", error);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setOriginalDimensions(null);
  };

  if (!file) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Resize Image</h3>
          <p className="text-slate-500">Change image dimensions while maintaining quality.</p>
        </div>
        <FileUploader 
          onFilesSelected={handleFileSelected} 
          allowMultiple={false}
          acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
          label="Drop Image to Resize"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       {/* File Info */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
               <ImageIcon size={24} />
            </div>
            <div>
               <h3 className="font-semibold text-slate-900">{file.name}</h3>
               <p className="text-sm text-slate-500">
                 Original: {originalDimensions?.w} x {originalDimensions?.h} px
               </p>
            </div>
          </div>
          <button onClick={handleReset} className="text-slate-400 hover:text-red-500 p-2">
             <RefreshCcw size={20} />
          </button>
       </div>

       {/* Controls */}
       {!downloadUrl ? (
         <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
               <Scaling size={18} />
               New Dimensions
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Width (px)</label>
                <input 
                  type="number" 
                  value={width} 
                  onChange={handleWidthChange}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Height (px)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={handleHeightChange}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input 
                type="checkbox" 
                id="ratio" 
                checked={maintainRatio} 
                onChange={(e) => setMaintainRatio(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="ratio" className="text-sm text-slate-600 cursor-pointer">Maintain Aspect Ratio</label>
            </div>
               
            <button
               onClick={handleResize}
               disabled={isProcessing || width <= 0 || height <= 0}
               className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
            >
               {isProcessing ? (
                  <>
                     <Loader2 className="animate-spin w-5 h-5" />
                     Resizing...
                  </>
               ) : (
                  'Resize Image'
               )}
            </button>
         </div>
       ) : (
         /* Success State */
         <div className="bg-green-50 rounded-xl p-8 border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
               <Scaling size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Resized Successfully!</h3>
            <p className="text-green-700 mb-6">New size: {width} x {height} px</p>
            
            <div className="flex items-center justify-center gap-4">
               <a 
                  href={downloadUrl} 
                  download={`resized-${file.name}`}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2 transition-all hover:scale-105"
               >
                  <Download size={20} />
                  Download
               </a>
               <button 
                  onClick={handleReset}
                  className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
               >
                  Resize Another
               </button>
            </div>
         </div>
       )}
    </div>
  );
};
