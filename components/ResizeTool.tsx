// components/ResizeTool.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Scaling, 
  Download, 
  Loader2, 
  RefreshCcw, 
  Image as ImageIcon, 
  AlertCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Move,
  Lock,
  Unlock,
  AspectRatio
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { clsx } from 'clsx';

/**
 * 🎨 PROFESSIONAL IMAGE RESIZER
 * SEO-Optimized, Client-Side, High Performance
 */
export const ResizeTool: React.FC = () => {
  // ---------- SEO & CONFIGURATION ----------
  const TOOL_NAME = 'Free Image Resizer – Change Dimensions Online';
  const TOOL_DESCRIPTION = 'Resize JPG, PNG, and WebP images by pixel or percentage. Maintain aspect ratio, preserve quality, and process files securely in your browser.';
  
  // ---------- STATE ----------
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number, h: number } | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------- ✅ FIX 1: DYNAMIC SEO & SCHEMA ----------
  useEffect(() => {
    // 1. Set Title
    document.title = file ? `Resize ${file.name} - ${TOOL_NAME}` : TOOL_NAME;

    // 2. Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', TOOL_DESCRIPTION);

    // 3. JSON-LD Schema
    const scriptId = 'json-ld-resizer';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Advanced Image Resizer',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: TOOL_DESCRIPTION,
      featureList: 'Resize by Pixel, Maintain Aspect Ratio, Client-side Privacy'
    };

    scriptTag.textContent = JSON.stringify(schema);
  }, [file]);

  // ---------- LOGIC ----------
  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setDownloadUrl(null);
      setError(null);
      
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.onerror = () => setError("Failed to load image. Please try another file.");
      img.src = URL.createObjectURL(selectedFile);
    }
  }, []);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newWidth = val === '' ? 0 : parseInt(val);
    setWidth(newWidth);
    if (maintainRatio && originalDimensions && newWidth > 0) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newHeight = val === '' ? 0 : parseInt(val);
    setHeight(newHeight);
    if (maintainRatio && originalDimensions && newHeight > 0) {
      const ratio = originalDimensions.w / originalDimensions.h;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = async () => {
    if (!file || width <= 0 || height <= 0) return;
    setIsProcessing(true);
    // Smooth UI transition
    await new Promise(r => setTimeout(r, 300));

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
          } else {
            setError("Resizing process failed.");
          }
          setIsProcessing(false);
        }, file.type, 0.95); // High quality output
      }
    } catch (error) {
      console.error("Resize failed", error);
      setError("An error occurred while resizing.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null); setDownloadUrl(null); setOriginalDimensions(null); setError(null);
  };

  // ---------- UI RENDER ----------
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      
      {/* 1. HERO HEADER */}
      <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-6">
           <Scaling size={14} className="fill-emerald-700" />
           v2.0 • Pixel Perfect Resizing
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
           Resize Images <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Instantly</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
           Change image dimensions by pixel or percentage. 
           <span className="font-semibold text-emerald-600"> 100% Client-Side & Secure.</span>
        </p>
      </header>

      {/* 2. MAIN TOOL CARD */}
      <section className="relative z-10 max-w-3xl mx-auto mb-20">
         {/* Background Glow */}
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 transform -rotate-1 rounded-3xl opacity-10 blur-xl"></div>
         
         <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {!file ? (
               // UPLOAD STATE
               <div className="p-8 md:p-12 bg-slate-50/50">
                  <FileUploader 
                     onFilesSelected={handleFileSelected} 
                     allowMultiple={false}
                     acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                     label="Drop Image to Resize"
                     subLabel="Supports JPG, PNG, WebP"
                  />
                  <div className="mt-8 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <ShieldCheck size={16}/> Private
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <Move size={16}/> Scalable
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <ImageIcon size={16}/> HD Quality
                     </div>
                  </div>
               </div>
            ) : (
               // RESIZE CONTROLS
               <div className="p-0">
                  {/* Card Header */}
                  <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                           <ImageIcon size={24} />
                        </div>
                        <div className="min-w-0">
                           <h3 className="font-bold text-slate-800 text-lg truncate max-w-[200px]">{file.name}</h3>
                           <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Original: {originalDimensions?.w} x {originalDimensions?.h} px
                           </p>
                        </div>
                     </div>
                     <button onClick={handleReset} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-red-500">
                        <RefreshCcw size={20} />
                     </button>
                  </div>

                  <div className="p-8 space-y-8">
                     {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                           <AlertCircle size={20} /> <span className="font-medium">{error}</span>
                        </div>
                     )}

                     {!downloadUrl ? (
                        /* INPUTS */
                        <div className="animate-in fade-in duration-500">
                           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">
                                 <Scaling size={16} className="text-emerald-500"/> Dimensions
                              </div>

                              <div className="flex items-end gap-4">
                                 {/* Width Input */}
                                 <div className="flex-1 relative group">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Width (px)</label>
                                    <input 
                                      type="number" value={width || ''} onChange={handleWidthChange}
                                      className="w-full bg-white border border-slate-200 text-slate-900 text-lg font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm group-hover:border-emerald-200"
                                      placeholder="0"
                                    />
                                 </div>

                                 {/* Link Icon */}
                                 <div className="pb-4 text-slate-300">
                                    {maintainRatio ? <Lock size={20} className="text-emerald-400" /> : <Unlock size={20} />}
                                 </div>

                                 {/* Height Input */}
                                 <div className="flex-1 relative group">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Height (px)</label>
                                    <input 
                                      type="number" value={height || ''} onChange={handleHeightChange}
                                      className="w-full bg-white border border-slate-200 text-slate-900 text-lg font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm group-hover:border-emerald-200"
                                      placeholder="0"
                                    />
                                 </div>
                              </div>

                              {/* Ratio Toggle */}
                              <div className="mt-6 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => setMaintainRatio(!maintainRatio)}
                                      className={clsx(
                                         "w-11 h-6 rounded-full transition-colors flex items-center px-1",
                                         maintainRatio ? "bg-emerald-500" : "bg-slate-300"
                                      )}
                                    >
                                       <div className={clsx(
                                          "w-4 h-4 bg-white rounded-full shadow-md transform transition-transform",
                                          maintainRatio ? "translate-x-5" : "translate-x-0"
                                       )} />
                                    </button>
                                    <span className="text-sm font-medium text-slate-600 cursor-pointer" onClick={() => setMaintainRatio(!maintainRatio)}>
                                       Maintain Aspect Ratio
                                    </span>
                                 </div>
                                 
                                 {/* Quick Presets (Optional Polish) */}
                                 <div className="flex gap-2">
                                    {[0.5, 0.75].map(ratio => (
                                       <button 
                                          key={ratio}
                                          onClick={() => {
                                             if(originalDimensions) {
                                                setWidth(Math.round(originalDimensions.w * ratio));
                                                setHeight(Math.round(originalDimensions.h * ratio));
                                             }
                                          }}
                                          className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md hover:bg-emerald-100 transition-colors"
                                       >
                                          {ratio * 100}%
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <button
                             onClick={handleResize}
                             disabled={isProcessing || width <= 0 || height <= 0}
                             className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transform transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                           >
                              {isProcessing ? (
                                 <><Loader2 className="animate-spin" /> Processing...</>
                              ) : (
                                 <>Resize Image <Scaling size={20} /></>
                              )}
                           </button>
                        </div>
                     ) : (
                        /* SUCCESS STATE */
                        <div className="text-center animate-in zoom-in-95 duration-300">
                           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-emerald-50">
                              <CheckCircle2 size={40} />
                           </div>
                           <h2 className="text-2xl font-bold text-slate-900 mb-2">Image Resized!</h2>
                           <p className="text-slate-500 mb-8">Your image is ready for download.</p>
                           
                           {/* Stats Bar */}
                           <div className="flex justify-center items-center gap-3 md:gap-6 text-sm mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-flex mx-auto w-full max-w-sm">
                              <div className="text-slate-400">
                                 {originalDimensions?.w} x {originalDimensions?.h}
                              </div>
                              <div className="text-slate-300">→</div>
                              <div className="text-emerald-600 font-bold text-lg">
                                 {width} x {height}
                              </div>
                              <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">
                                 PX
                              </div>
                           </div>

                           <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <a 
                                href={downloadUrl} 
                                download={`resized-${file.name}`}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 transition-transform hover:-translate-y-0.5"
                              >
                                 <Download size={20} /> Download
                              </a>
                              <button 
                                onClick={handleReset}
                                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-6 rounded-xl transition-colors"
                              >
                                 Resize Another
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
         {[
            {
               icon: <ShieldCheck size={32}/>, title: "100% Secure", desc: "Your photos process directly in your browser. We never upload them.",
               color: "text-emerald-600", bg: "bg-emerald-50"
            },
            {
               icon: <Zap size={32}/>, title: "Instant Result", desc: "No queue, no loading bars. Resize happens in milliseconds.",
               color: "text-teal-600", bg: "bg-teal-50"
            },
            {
               icon: <AspectRatio size={32}/>, title: "Best Quality", desc: "We use high-quality resampling to keep your images sharp.",
               color: "text-blue-600", bg: "bg-blue-50"
            }
         ].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
               <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
               <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
         ))}
      </section>

      {/* 4. FAQ SECTION */}
      <section className="max-w-3xl mx-auto border-t border-slate-200 pt-16">
         <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <p className="text-slate-500">Learn more about our resizing technology.</p>
         </div>
         
         <div className="space-y-4">
            {[
               { q: "Does resizing reduce image quality?", a: "Scaling down (making smaller) maintains high quality. Scaling up (making bigger) may cause pixelation, but our tool uses smoothing to minimize this." },
               { q: "Can I change dimensions separately?", a: "Yes! Simply uncheck the 'Maintain Aspect Ratio' toggle to define Width and Height independently." },
               { q: "What formats are supported?", a: "We support the most popular web formats: JPEG, PNG, and WebP." }
            ].map((item, i) => (
               <details key={i} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer transition-all hover:border-emerald-200">
                  <summary className="flex justify-between items-center p-6 font-semibold text-slate-800 list-none">
                     {item.q}
                     <span className="transform group-open:rotate-180 transition-transform text-emerald-500">▼</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 bg-slate-50/30 pt-2 leading-relaxed">
                     {item.a}
                  </div>
               </details>
            ))}
         </div>
      </section>

      <footer className="text-center text-xs text-slate-400 mt-20 pb-8">
         <p>© {new Date().getFullYear()} {TOOL_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
};
