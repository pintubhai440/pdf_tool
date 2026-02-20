import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  PenTool, Download, Loader2, Type, Image as ImageIcon, Calendar,
  Trash2, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw,
  Bold, CopyCheck, Plus, Minus, FileSignature, Settings2, ShieldCheck, Zap, Layers,
  Palette
} from 'lucide-react';
import { FileUploader } from './FileUploader';

const FONT_OPTIONS = {
  Standard: [
    { label: 'Arial / Helvetica (Clean)', value: 'Helvetica', isStandard: true },
    { label: 'Times New Roman (Formal)', value: 'Times-Roman', isStandard: true },
    { label: 'Courier (Typewriter)', value: 'Courier', isStandard: true },
  ],
  Handwriting: [
    { label: 'Pacifico (Thick Brush)', value: 'Pacifico' },
    { label: 'Indie Flower (Casual)', value: 'Indie Flower' },
    { label: 'Satisfy (Smooth Pen)', value: 'Satisfy' },
    { label: 'Great Vibes (Elegant)', value: 'Great Vibes' },
    { label: 'Homemade Apple (Real Ink)', value: 'Homemade Apple' }
  ]
};

type ElementType = 'text' | 'image' | 'date';

interface SignatureElement {
  id: string;
  type: ElementType;
  content: string; 
  x: number; 
  y: number; 
  color?: string;
  font?: string;
  fontSize?: number;
  isBold?: boolean;
  scale: number;
}

export const SignatureTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImage, setPageImage] = useState<string>('');
  
  const [elements, setElements] = useState<Record<number, SignatureElement[]>>({});
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  
  const [textColor, setTextColor] = useState('#4c1d95'); 
  const [textFont, setTextFont] = useState('Helvetica');
  const [textContent, setTextContent] = useState('');
  const [isBoldText, setIsBoldText] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dragState = useRef<{ id: string | null; startX: number; startY: number; initialElX: number; initialElY: number }>({
    id: null, startX: 0, startY: 0, initialElX: 0, initialElY: 0
  });

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Homemade+Apple&family=Indie+Flower&family=Pacifico&family=Satisfy&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const lib = (pdfjsLib as any).default || pdfjsLib;
    if (lib?.GlobalWorkerOptions) {
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }, []);

  const handleFileSelected = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setElements({});
      setCurrentPage(1);
      setActiveElementId(null);
      setDownloadUrl(null);
      setError(null);
      
      try {
        const buff = await files[0].arrayBuffer();
        const lib = (pdfjsLib as any).default || pdfjsLib;
        const loadedPdf = await lib.getDocument({ data: buff }).promise;
        setPdfDoc(loadedPdf);
        setNumPages(loadedPdf.numPages);
        renderPage(loadedPdf, 1);
      } catch (err) {
        setError("Failed to load PDF. It might be password protected.");
      }
    }
  };

  const renderPage = async (doc: any, pageNum: number) => {
    try {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: window.innerWidth < 768 ? 0.8 : 1.8 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport }).promise;
      setPageImage(canvas.toDataURL());
    } catch (err) {
      console.error(err);
    }
  };

  const changePage = (offset: number) => {
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
      renderPage(pdfDoc, newPage);
      setActiveElementId(null);
    }
  };

  const addElement = (type: ElementType, content: string) => {
    let displayContent = content;
    if (type === 'date') {
      const d = new Date(content);
      displayContent = d.toLocaleDateString('en-GB'); 
    }

    const newEl: SignatureElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: displayContent,
      x: 20, 
      y: 20, 
      color: textColor,
      font: textFont,
      fontSize: type === 'text' || type === 'date' ? (window.innerWidth < 768 ? 16 : 22) : undefined,
      isBold: isBoldText,
      scale: 1 
    };

    setElements(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newEl]
    }));
    setActiveElementId(newEl.id);
    if (type === 'text') setTextContent(''); 
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addElement('image', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteElement = (id: string) => {
    setElements(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).filter(el => el.id !== id)
    }));
    setActiveElementId(null);
  };

  const updateScale = (id: string, delta: number) => {
    setElements(prev => {
      const pageElements = prev[currentPage] || [];
      return {
        ...prev,
        [currentPage]: pageElements.map(el => {
          if (el.id === id) {
            const newScale = Math.max(0.3, el.scale + delta);
            return { ...el, scale: newScale };
          }
          return el;
        })
      };
    });
  };

  const applyToAllPages = () => {
    const currentElements = elements[currentPage] || [];
    if (currentElements.length === 0) {
      alert("Please add a signature or text to the current page first!");
      return;
    }

    const newElements = { ...elements };
    for (let i = 1; i <= numPages; i++) {
      if (i !== currentPage) {
        newElements[i] = currentElements.map(el => ({ 
          ...el, 
          id: Math.random().toString(36).substr(2, 9) 
        }));
      }
    }
    setElements(newElements);
    alert("Success! Applied to all pages.");
  };

  const handlePointerDown = (e: React.PointerEvent, el: SignatureElement) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveElementId(el.id);
    dragState.current = {
      id: el.id,
      startX: e.clientX,
      startY: e.clientY,
      initialElX: el.x,
      initialElY: el.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.id || !containerRef.current) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const { startX, startY, initialElX, initialElY, id } = dragState.current;
    
    const deltaX = ((e.clientX - startX) / rect.width) * 100;
    const deltaY = ((e.clientY - startY) / rect.height) * 100;

    let newX = initialElX + deltaX;
    let newY = initialElY + deltaY;

    newX = Math.max(0, Math.min(95, newX));
    newY = Math.max(0, Math.min(98, newY));

    setElements(prev => {
      const pageElements = prev[currentPage] || [];
      return {
        ...prev,
        [currentPage]: pageElements.map(el => el.id === id ? { ...el, x: newX, y: newY } : el)
      };
    });
  };

  const handlePointerUp = () => {
    dragState.current.id = null;
  };

  const handleBackgroundClick = () => {
    setActiveElementId(null);
  };

  const createTextImageForPDF = async (text: string, font: string, isBold: boolean, colorHex: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    await document.fonts.ready;

    const resMultiplier = 4; 
    const baseSize = 30; 
    const fontSize = baseSize * resMultiplier;

    const fontFamily = font === 'Times-Roman' ? 'Times New Roman' : font === 'Courier' ? 'Courier New' : font;
    ctx.font = `${isBold ? 'bold' : 'normal'} ${fontSize}px "${fontFamily}", sans-serif`;
    
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.5;

    canvas.width = textWidth + (20 * resMultiplier);
    canvas.height = textHeight;

    ctx.font = `${isBold ? 'bold' : 'normal'} ${fontSize}px "${fontFamily}", sans-serif`;
    ctx.fillStyle = colorHex || '#000000';
    ctx.textBaseline = 'top';
    ctx.fillText(text, 5 * resMultiplier, fontSize * 0.2);

    return {
      dataUrl: canvas.toDataURL('image/png'),
      width: canvas.width / resMultiplier,
      height: canvas.height / resMultiplier,
      baseSize
    };
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    setActiveElementId(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      const getStandardPdfFont = async (fontValue: string, isBold?: boolean) => {
        if (fontValue === 'Times-Roman') return await pdf.embedFont(isBold ? StandardFonts.TimesRomanBold : StandardFonts.TimesRoman);
        if (fontValue === 'Courier') return await pdf.embedFont(isBold ? StandardFonts.CourierBold : StandardFonts.Courier);
        return await pdf.embedFont(isBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
      };

      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
      };

      const pages = pdf.getPages();
      const baseImgWidth = window.innerWidth < 768 ? 100 : 150;

      for (const [pageNum, pageElements] of Object.entries(elements)) {
        const pageIndex = parseInt(pageNum) - 1;
        if (pageIndex >= pages.length) continue;
        
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        for (const el of pageElements) {
          const x = (el.x / 100) * width;
          
          if (el.type === 'text' || el.type === 'date') {
            const isHandwriting = FONT_OPTIONS.Handwriting.some(f => f.value === el.font);
            
            if (isHandwriting) {
              const textImg = await createTextImageForPDF(el.content, el.font || 'Helvetica', !!el.isBold, el.color || '#000000');
              if (textImg) {
                const imgBytes = await fetch(textImg.dataUrl).then(res => res.arrayBuffer());
                const image = await pdf.embedPng(imgBytes);
                
                const uiFontSize = (el.fontSize || 16) * 1.5 * el.scale;
                const scaleRatio = uiFontSize / textImg.baseSize;
                
                const finalWidth = textImg.width * scaleRatio;
                const finalHeight = textImg.height * scaleRatio;
                const y = height - ((el.y / 100) * height) - (finalHeight * 0.8);
                
                page.drawImage(image, { x, y, width: finalWidth, height: finalHeight, opacity: 0.85 });
              }
            } else {
              const pdfFont = await getStandardPdfFont(el.font || 'Helvetica', el.isBold);
              const size = (el.fontSize || 16) * 1.5 * el.scale; 
              const y = height - ((el.y / 100) * height) - (size * 0.75); 
              page.drawText(el.content, {
                x, y, size, font: pdfFont, color: el.color ? hexToRgb(el.color) : rgb(0,0,0), opacity: 0.85
              });
            }

          } else if (el.type === 'image') {
            const isPng = el.content.startsWith('data:image/png');
            const imgBytes = await fetch(el.content).then(res => res.arrayBuffer());
            const image = isPng ? await pdf.embedPng(imgBytes) : await pdf.embedJpg(imgBytes);
            
            const imgDims = image.scaleToFit(baseImgWidth * el.scale, baseImgWidth * el.scale);
            const y = height - ((el.y / 100) * height) - imgDims.height;
            
            page.drawImage(image, {
              x, y, width: imgDims.width, height: imgDims.height, opacity: 0.85 
            });
          }
        }
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      
    } catch (err) {
      console.error(err);
      setError("Failed to generate the signed document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfDoc(null);
    setElements({});
    setActiveElementId(null);
    setDownloadUrl(null);
    setPageImage('');
  };

  return (
    <div className="relative min-h-[85vh] bg-white/60 rounded-2xl md:rounded-[2rem] p-3 sm:p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-white/80 w-full overflow-hidden backdrop-blur-xl">
      
      {/* DECORATIVE COLORFUL BLOBS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-400/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-400/20 blur-[100px]"></div>
        <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-sky-400/20 blur-[100px]"></div>
      </div>

      {/* --- PREMIUM HEADER --- */}
      <div className="text-center mb-8 md:mb-12 relative z-10">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl shadow-inner border border-white mb-4">
          <Palette className="w-8 h-8 md:w-10 md:h-10 text-fuchsia-600" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
          eSign PDF <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500">Securely Online</span>
        </h1>
        <p className="text-slate-600 font-medium text-sm md:text-lg max-w-2xl mx-auto">
          Add beautiful custom signatures, text, and dates to your documents instantly. All processing happens locally in your browser.
        </p>
      </div>

      {/* --- UPLOADER STATE --- */}
      {!file ? (
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-6 md:p-14 rounded-3xl shadow-2xl shadow-violet-500/10 border-2 border-dashed border-violet-200 hover:border-fuchsia-400 hover:bg-white transition-all duration-300 relative z-10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          <FileUploader 
            onFilesSelected={handleFileSelected} 
            allowMultiple={false} 
            acceptedFileTypes={['application/pdf']} 
            label="Drop your PDF here to Sign" 
          />
        </div>
      ) : downloadUrl ? (
        
        /* --- SUCCESS STATE --- */
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl text-center shadow-2xl shadow-emerald-500/20 border border-white relative z-10 animate-in zoom-in-95 fade-in duration-300">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 ring-8 ring-emerald-50">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Document Signed!</h2>
          <p className="text-slate-500 text-sm md:text-base mb-8">Your signature has been securely applied to the PDF.</p>
          <div className="flex flex-col gap-4">
            <a href={downloadUrl} download={`signed-${file.name}`} className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-bold py-3.5 md:py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-fuchsia-500/30 hover:-translate-y-1 hover:scale-[1.02] text-base">
              <Download size={20} /> Download Signed PDF
            </a>
            <button onClick={handleReset} className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 md:py-4 px-6 rounded-2xl transition-all text-base border border-slate-200 hover:border-violet-200 shadow-sm">
              Sign Another Document
            </button>
          </div>
        </div>
      ) : (

        /* --- MAIN WORKSPACE --- */
        <div className="flex flex-col lg:flex-row gap-6 w-full mx-auto relative z-10 items-start">
          
          {/* --- LEFT SIDEBAR (TOOLS) --- */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 order-2 lg:order-1 lg:sticky lg:top-4">
            
            <div className="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-xl shadow-violet-500/5 border border-white flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 size={20} className="text-violet-600" />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Design Tools</h3>
              </div>

              {/* Text Tool - Violet Theme */}
              <div className="space-y-3 p-4 bg-violet-50/60 rounded-2xl border border-violet-100 hover:border-violet-300 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-violet-200 text-violet-700 rounded-lg"><Type size={16}/></div>
                  <h4 className="font-bold text-violet-900 text-sm">Add Text / Name</h4>
                </div>
                <input 
                  type="text" 
                  placeholder="Type your name..." 
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-violet-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all shadow-sm text-violet-950 font-medium"
                />
                
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 cursor-pointer hover:scale-110 transition-transform ring-2 ring-violet-200">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0" title="Choose Color" />
                  </div>
                  
                  <select 
                    value={textFont} 
                    onChange={(e) => setTextFont(e.target.value)} 
                    className="flex-1 px-3 py-2 bg-white border border-violet-200 rounded-xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-violet-500 text-violet-900 font-medium"
                    style={{ fontFamily: FONT_OPTIONS.Handwriting.find(f => f.value === textFont) ? textFont : 'sans-serif' }}
                  >
                    <optgroup label="📝 Signatures">
                      {FONT_OPTIONS.Handwriting.map(font => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value, fontSize: '14px' }}>{font.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📄 Standard">
                      {FONT_OPTIONS.Standard.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </optgroup>
                  </select>

                  <button 
                    onClick={() => setIsBoldText(!isBoldText)} 
                    className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border transition-all ${isBoldText ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-white text-violet-600 border-violet-200 hover:bg-violet-100 shadow-sm'}`}
                    title="Toggle Bold"
                  >
                    <Bold size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => textContent.trim() && addElement('text', textContent)}
                  className="w-full py-2.5 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30 transition-all active:scale-95"
                >
                  Insert Text
                </button>
              </div>

              {/* Image Tool - Fuchsia Theme */}
              <div className="space-y-3 p-4 bg-fuchsia-50/60 rounded-2xl border border-fuchsia-100 hover:border-fuchsia-300 transition-colors">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="p-1.5 bg-fuchsia-200 text-fuchsia-700 rounded-lg"><ImageIcon size={16}/></div>
                   <h4 className="font-bold text-fuchsia-900 text-sm">Upload Signature</h4>
                 </div>
                 <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                 <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 border-2 border-dashed border-fuchsia-300 text-fuchsia-700 bg-white/50 rounded-xl font-bold text-sm hover:bg-fuchsia-100 hover:border-fuchsia-400 transition-all shadow-sm">
                   Browse Image...
                 </button>
              </div>

              {/* Date Tool - Sky Blue Theme */}
              <div className="space-y-3 p-4 bg-sky-50/60 rounded-2xl border border-sky-100 hover:border-sky-300 transition-colors">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="p-1.5 bg-sky-200 text-sky-700 rounded-lg"><Calendar size={16}/></div>
                   <h4 className="font-bold text-sky-900 text-sm">Insert Date</h4>
                 </div>
                 <div className="flex gap-2">
                   <input 
                     type="date" 
                     value={selectedDate}
                     onChange={(e) => setSelectedDate(e.target.value)}
                     className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-sky-500 text-sky-900 font-medium"
                   />
                 </div>
                 <button 
                   onClick={() => addElement('date', selectedDate)} 
                   className="w-full py-2.5 bg-sky-500 text-white hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/30 rounded-xl font-bold text-sm transition-all active:scale-95"
                 >
                   Insert Date
                 </button>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="sticky bottom-4 z-10 pt-2">
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white rounded-2xl font-black text-base md:text-lg shadow-[0_10px_40px_rgba(217,70,239,0.4)] flex justify-center items-center gap-2 transition-all hover:-translate-y-1 hover:scale-[1.02] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100 border border-white/20"
              >
                {isProcessing ? <><Loader2 className="animate-spin" size={22} /> Processing PDF...</> : <><Download size={22} /> Save & Download</>}
              </button>
              {error && <p className="text-red-500 bg-red-50 px-3 py-2 rounded-xl text-xs font-bold mt-3 flex items-center justify-center gap-1.5 border border-red-100 shadow-sm"><AlertCircle size={16}/> {error}</p>}
            </div>
          </div>

          {/* --- RIGHT SIDEBAR (PDF WORKSPACE) --- */}
          <div className="flex-1 w-full bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden min-h-[60vh] order-1 lg:order-2 ring-1 ring-slate-100">
            
            {/* Colorful Toolbar Top */}
            <div className="bg-gradient-to-r from-violet-900 via-fuchsia-900 to-slate-900 px-4 py-3.5 flex flex-wrap items-center justify-between text-white gap-3 border-b border-white/10 shadow-md">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm truncate max-w-[150px] md:max-w-[250px] tracking-wide">{file.name}</span>
                {elements[currentPage]?.length > 0 && numPages > 1 && (
                 <button 
                   onClick={applyToAllPages}
                   className="hidden md:flex items-center gap-1.5 text-fuchsia-100 font-bold text-xs bg-fuchsia-500/20 hover:bg-fuchsia-500/40 px-3 py-1.5 rounded-full transition-all border border-fuchsia-400/30 shadow-inner"
                 >
                   <CopyCheck size={14}/> Apply to All
                 </button>
                )}
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-1 border border-white/10 backdrop-blur-sm">
                <button onClick={() => changePage(-1)} disabled={currentPage === 1} className="p-1.5 hover:bg-white/20 rounded-lg disabled:opacity-30 transition-colors"><ChevronLeft size={16}/></button>
                <span className="text-sm font-bold whitespace-nowrap px-3 tracking-wide">Pg {currentPage} / {numPages}</span>
                <button onClick={() => changePage(1)} disabled={currentPage === numPages} className="p-1.5 hover:bg-white/20 rounded-lg disabled:opacity-30 transition-colors"><ChevronRight size={16}/></button>
              </div>

              <button onClick={handleReset} className="text-slate-300 hover:text-red-400 text-sm font-bold flex items-center gap-1.5 transition-colors bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10">
                <RefreshCcw size={14} /> Start Over
              </button>
            </div>

            {/* Mobile apply to all */}
            {elements[currentPage]?.length > 0 && numPages > 1 && (
              <div className="md:hidden bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-fuchsia-100 p-2.5 flex justify-center">
                 <button onClick={applyToAllPages} className="flex items-center gap-1.5 text-fuchsia-700 font-bold text-xs bg-white px-5 py-2 rounded-full shadow-md border border-fuchsia-200">
                   <CopyCheck size={14}/> Apply to All Pages
                 </button>
              </div>
            )}
            
            {/* PDF Canvas Area */}
            <div 
              className="bg-slate-50/50 p-4 md:p-8 flex-1 flex justify-center overflow-auto relative touch-none shadow-inner"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerDown={handleBackgroundClick} 
            >
              {pageImage ? (
                <div 
                  ref={containerRef} 
                  className="relative bg-white select-none origin-top max-w-[85vw] md:max-w-full m-auto shadow-[0_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-slate-200/50 rounded-sm" 
                  style={{ width: 'fit-content' }}
                >
                  <img src={pageImage} alt={`Page ${currentPage}`} className="max-w-full h-auto pointer-events-none block" />
                  
                  {elements[currentPage]?.map(el => (
                    <div
                      key={el.id}
                      style={{ left: `${el.x}%`, top: `${el.y}%`, position: 'absolute' }}
                      onPointerDown={(e) => handlePointerDown(e, el)}
                      className={`cursor-move absolute z-50 p-2 rounded transition-colors bg-transparent mix-blend-multiply ${activeElementId === el.id ? 'border-2 border-fuchsia-500 border-dashed shadow-sm bg-fuchsia-50/30' : 'border-2 border-transparent hover:border-violet-300 hover:border-dashed'}`}
                    >
                      {activeElementId === el.id && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] z-[60] border border-slate-700 overflow-hidden px-1 py-1">
                          <button onPointerDown={(e) => { e.stopPropagation(); updateScale(el.id, -0.1); }} className="p-2.5 hover:bg-white/10 rounded-lg transition-colors" title="Decrease Size"><Minus size={16} /></button>
                          <div className="w-px h-6 bg-slate-600 mx-1"></div>
                          <button onPointerDown={(e) => { e.stopPropagation(); updateScale(el.id, 0.1); }} className="p-2.5 hover:bg-white/10 rounded-lg transition-colors" title="Increase Size"><Plus size={16} /></button>
                          <div className="w-px h-6 bg-slate-600 mx-1"></div>
                          <button onPointerDown={(e) => { e.stopPropagation(); deleteElement(el.id); }} className="p-2.5 hover:bg-red-500/80 text-red-300 hover:text-white rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      )}

                      {el.type === 'text' || el.type === 'date' ? (
                        <span 
                          style={{ 
                            color: el.color, 
                            fontFamily: el.font === 'Times-Roman' ? 'Times New Roman' : el.font === 'Courier' ? 'Courier New' : el.font, 
                            fontSize: `${(el.fontSize || 16) * el.scale}px`,
                            fontWeight: el.isBold ? 'bold' : 'normal'
                          }} 
                          className="whitespace-nowrap pointer-events-none opacity-95 leading-none block drop-shadow-sm"
                        >
                          {el.content}
                        </span>
                      ) : (
                        <img 
                          src={el.content} 
                          draggable="false" 
                          alt="Signature" 
                          style={{ width: `${(window.innerWidth < 768 ? 100 : 150) * el.scale}px` }}
                          className="object-contain pointer-events-none opacity-95 block drop-shadow-sm" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-violet-400 gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-lg shadow-violet-500/10">
                    <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" />
                  </div>
                  <p className="font-bold text-sm animate-pulse tracking-wide uppercase">Preparing Workspace...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* --- PREMIUM SEO & INFO SECTION (merged) --- */}
      <div className="max-w-6xl mx-auto mt-24 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Pro-Level Features, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Zero Cost.</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Experience the smoothest document signing interface right in your browser. No downloads, no subscriptions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-[2rem] border border-violet-100/50 shadow-xl shadow-violet-500/5 hover:shadow-violet-500/10 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30"><ShieldCheck size={28}/></div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Military-Grade Privacy</h3>
            <p className="text-slate-600 font-medium leading-relaxed">Your files never touch our servers. All document rendering and signing happens right on your device locally.</p>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-50 to-white p-8 rounded-[2rem] border border-fuchsia-100/50 shadow-xl shadow-fuchsia-500/5 hover:shadow-fuchsia-500/10 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/30"><Zap size={28}/></div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Lightning Fast UX</h3>
            <p className="text-slate-600 font-medium leading-relaxed">No account creation or credit card required. Just drag and drop your PDF, add your signature, and download.</p>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-[2rem] border border-sky-100/50 shadow-xl shadow-sky-500/5 hover:shadow-sky-500/10 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/30"><Layers size={28}/></div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Bulk Page Apply</h3>
            <p className="text-slate-600 font-medium leading-relaxed">Signing a 50-page document? Drop your signature on page one and use our bulk apply feature to stamp it everywhere.</p>
          </div>
        </div>

        {/* How-to & FAQ Section (from second code) */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-white text-slate-700">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">How to Sign a PDF Document Online?</h2>
            <p className="text-lg max-w-2xl mx-auto">Adding an electronic signature to your PDF is fast and easy with Genz PDF. Follow these simple steps:</p>
          </div>

          <ol className="list-decimal list-inside space-y-3 mb-12 ml-2 text-slate-700 font-medium">
            <li><strong className="text-slate-900">Upload your PDF:</strong> Click on the upload box or drag and drop your document.</li>
            <li><strong className="text-slate-900">Create your Signature:</strong> Use the text tool to type your name in cursive fonts, or upload an image of your actual signature.</li>
            <li><strong className="text-slate-900">Position & Resize:</strong> Drag the signature to the correct spot on the page and adjust the size.</li>
            <li><strong className="text-slate-900">Add Date:</strong> Quickly insert the current date using the calendar tool.</li>
            <li><strong className="text-slate-900">Download:</strong> Click 'Save PDF' to download your securely signed document instantly.</li>
          </ol>

          <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors">
              <h3 className="font-bold text-slate-900 mb-2">Is this legally binding?</h3>
              <p className="text-sm text-slate-600">In most countries, electronic signatures are legally binding for most business and personal transactions. Our tool helps you visually append your mark, acting as a standard e-signature.</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors">
              <h3 className="font-bold text-slate-900 mb-2">Is it really safe to sign my PDF online here?</h3>
              <p className="text-sm text-slate-600">Yes, absolutely. We never upload your PDF to our servers. All the processing happens directly inside your web browser. This means your sensitive contracts and documents stay completely private and secure on your own device.</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors">
              <h3 className="font-bold text-slate-900 mb-2">Is this PDF signature tool truly free?</h3>
              <p className="text-sm text-slate-600">Yes, it is 100% free to use. There are no hidden fees, we do not add any annoying watermarks to your signed documents, and you don't even need to create an account to get started.</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors">
              <h3 className="font-bold text-slate-900 mb-2">Can I sign a PDF from my mobile phone?</h3>
              <p className="text-sm text-slate-600">Yes. Genz PDF is fully optimized for mobile browsers. You can easily upload, add your signature, place dates, and download the signed file right from your smartphone or tablet without installing any app.</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors md:col-span-2">
              <h3 className="font-bold text-slate-900 mb-2">How do I add my actual handwritten signature?</h3>
              <p className="text-sm text-slate-600">You can take a clear photo of your signature on a white piece of paper, crop it, and then use the "Upload Image" feature to place it anywhere on your PDF document.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SignatureTool;
