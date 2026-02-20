import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  PenTool, Download, Loader2, Type, Image as ImageIcon, Calendar,
  Trash2, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw,
  Bold, CopyCheck, Plus, Minus
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
  
  const [textColor, setTextColor] = useState('#0f172a');
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
      // FIXED: Mobile PDF rendering scale reduced by ~30% for better layout fit
      const viewport = page.getViewport({ scale: window.innerWidth < 768 ? 1.4 : 2.5 });
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

  // MAGIC FIX: Convert Handwriting Text to High-Res Image for PDF embedding
  const createTextImageForPDF = async (text: string, font: string, isBold: boolean, colorHex: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const resMultiplier = 4; // High resolution
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
              // MAGIC FIX: Use Canvas to draw custom font and embed as PNG perfectly
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
              // Standard Font Logic
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
    <div className="min-h-[80vh] bg-slate-50 rounded-lg md:rounded-3xl p-1.5 sm:p-3 md:p-8 shadow-xl border border-slate-100 w-full overflow-hidden">
      <div className="text-center mb-3 md:mb-8">
        <h1 className="text-xl md:text-5xl font-black text-slate-900 tracking-tight mb-1 md:mb-3">
          Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">PDF Document</span>
        </h1>
        <p className="text-slate-500 font-medium text-[10px] md:text-base">Add text, dates, or upload your signature image securely.</p>
      </div>

      {!file ? (
        <div className="max-w-2xl mx-auto bg-white p-4 md:p-12 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-200">
          <FileUploader 
            onFilesSelected={handleFileSelected} 
            allowMultiple={false} 
            acceptedFileTypes={['application/pdf']} 
            label="Drop PDF to Sign" 
          />
        </div>
      ) : downloadUrl ? (
        <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl text-center shadow-lg border border-slate-200 animate-in zoom-in-95">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <CheckCircle2 size={32} className="md:w-10 md:h-10" />
          </div>
          <h2 className="text-lg md:text-2xl font-bold mb-2">Document Signed!</h2>
          <p className="text-slate-500 text-xs md:text-base mb-6 md:mb-8">Your signature has been applied successfully.</p>
          <div className="flex flex-col gap-3">
            <a href={downloadUrl} download={`signed-${file.name}`} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 md:py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm md:text-base">
              <Download size={18} /> Download PDF
            </a>
            <button onClick={handleReset} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 md:py-3 px-6 rounded-xl transition-all text-sm md:text-base">
              Sign Another File
            </button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-2 md:gap-8 w-full mx-auto">
          
          <div className="lg:col-span-1 flex flex-col gap-2 md:gap-6 order-2 lg:order-1">
            <div className="bg-white p-2.5 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-[11px] md:text-base"><Type size={14} className="text-teal-600"/> Add Text / Name</h3>
              <input 
                type="text" 
                placeholder="Type your name..." 
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-2 py-1.5 md:py-2 bg-slate-50 border border-slate-200 rounded-lg mb-2 focus:ring-2 focus:ring-teal-500 outline-none text-[11px] md:text-sm"
              />
              
              <div className="flex flex-wrap items-center gap-1.5 mb-2 md:mb-4">
                <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-slate-300 shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0" title="Choose Color" />
                </div>
                
                <select 
                  value={textFont} 
                  onChange={(e) => setTextFont(e.target.value)} 
                  className="flex-1 px-1 md:px-2 py-1 md:py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] md:text-sm outline-none min-w-[100px]"
                  style={{ fontFamily: FONT_OPTIONS.Handwriting.find(f => f.value === textFont) ? textFont : 'sans-serif' }}
                >
                  <optgroup label="📝 Signatures">
                    {FONT_OPTIONS.Handwriting.map(font => (
                      <option key={font.value} value={font.value} style={{ fontFamily: font.value, fontSize: '14px' }}>
                        {font.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📄 Standard">
                    {FONT_OPTIONS.Standard.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <button 
                  onClick={() => setIsBoldText(!isBoldText)} 
                  className={`w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center rounded-lg border transition-colors ${isBoldText ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  title="Bold Text"
                >
                  <Bold size={12} className="md:w-4 md:h-4" />
                </button>
              </div>

              <button 
                onClick={() => textContent.trim() && addElement('text', textContent)}
                className="w-full py-1.5 md:py-2 bg-slate-900 text-white rounded-lg font-bold text-[11px] md:text-sm hover:bg-teal-600 transition-colors"
              >
                Add Text
              </button>
            </div>

            <div className="flex flex-row md:flex-col gap-2 md:gap-6">
              <div className="bg-white flex-1 p-2.5 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-[11px] md:text-base"><ImageIcon size={14} className="text-teal-600"/> Upload Image</h3>
                 <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                 <button onClick={() => fileInputRef.current?.click()} className="w-full py-1.5 md:py-3 border-2 border-dashed border-teal-300 text-teal-700 bg-teal-50 rounded-lg font-bold text-[11px] md:text-sm hover:bg-teal-100 transition-colors">
                   Upload
                 </button>
              </div>

              <div className="bg-white flex-1 p-2.5 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-[11px] md:text-base"><Calendar size={14} className="text-teal-600"/> Add Date</h3>
                 <div className="flex gap-2 mb-2">
                   <input 
                     type="date" 
                     value={selectedDate}
                     onChange={(e) => setSelectedDate(e.target.value)}
                     className="w-full px-1 py-1 md:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] md:text-sm outline-none"
                   />
                 </div>
                 <button 
                   onClick={() => addElement('date', selectedDate)} 
                   className="w-full py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-[11px] md:text-sm transition-colors"
                 >
                   Add Date
                 </button>
              </div>
            </div>
            
            <div className="sticky bottom-2 z-10 pt-1">
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="w-full py-2.5 md:py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl md:rounded-2xl font-black text-[13px] md:text-lg shadow-xl shadow-teal-500/20 flex justify-center items-center gap-2 transition-transform hover:-translate-y-1"
              >
                {isProcessing ? <><Loader2 className="animate-spin" size={16} /> Processing...</> : <><Download size={16} /> Save PDF</>}
              </button>
              {error && <p className="text-red-500 text-[10px] md:text-sm font-medium mt-1 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
            </div>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col w-full min-h-[50vh] max-w-full">
            <div className="bg-slate-800 p-1.5 md:p-3 rounded-t-lg md:rounded-t-2xl flex flex-wrap items-center justify-between text-white gap-2">
              <span className="font-medium text-[9px] md:text-sm truncate max-w-[120px] md:max-w-[200px]">{file.name}</span>
              <div className="flex items-center gap-1 md:gap-4 bg-slate-700/50 rounded-md md:rounded-lg px-1 md:px-2 py-0.5 md:py-1">
                <button onClick={() => changePage(-1)} disabled={currentPage === 1} className="p-0.5 md:p-1.5 hover:bg-slate-600 rounded disabled:opacity-50"><ChevronLeft size={14}/></button>
                <span className="text-[9px] md:text-sm font-bold whitespace-nowrap">Pg {currentPage} / {numPages}</span>
                <button onClick={() => changePage(1)} disabled={currentPage === numPages} className="p-0.5 md:p-1.5 hover:bg-slate-600 rounded disabled:opacity-50"><ChevronRight size={14}/></button>
              </div>
              <button onClick={handleReset} className="text-red-400 hover:text-red-300 text-[9px] md:text-sm font-bold flex items-center gap-1"><RefreshCcw size={10} className="md:w-3.5 md:h-3.5"/> Reset</button>
            </div>
            
            {(elements[currentPage]?.length > 0 && numPages > 1) && (
              <div className="bg-indigo-50 border-b border-indigo-100 p-1.5 flex justify-center">
                 <button 
                   onClick={applyToAllPages}
                   className="flex items-center gap-1 text-indigo-700 font-bold text-[10px] md:text-sm bg-white px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-sm hover:bg-indigo-600 hover:text-white transition-all border border-indigo-200"
                 >
                   <CopyCheck size={12} className="md:w-4 md:h-4"/> Apply to All Pages
                 </button>
              </div>
            )}
            
            <div 
              className="bg-slate-200 p-0 sm:p-2 md:p-6 rounded-b-lg md:rounded-b-2xl flex-1 flex justify-center overflow-x-auto shadow-inner relative touch-none"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerDown={handleBackgroundClick} 
            >
              {pageImage ? (
                <div 
                  ref={containerRef} 
                  // FIXED: Added max-w-[75vw] for mobile so the PDF looks 30% smaller, leaving space for tools!
                  className="relative shadow-2xl bg-white select-none origin-top transition-transform max-w-[75vw] md:max-w-full m-auto" 
                  style={{ width: 'fit-content' }}
                >
                  <img src={pageImage} alt={`Page ${currentPage}`} className="max-w-full h-auto pointer-events-none block" />
                  
                  {elements[currentPage]?.map(el => (
                    <div
                      key={el.id}
                      style={{ left: `${el.x}%`, top: `${el.y}%`, position: 'absolute' }}
                      onPointerDown={(e) => handlePointerDown(e, el)}
                      className={`cursor-move absolute z-50 p-1 md:p-2 border border-dashed rounded transition-colors bg-transparent mix-blend-multiply ${activeElementId === el.id ? 'border-indigo-500 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                    >
                      {activeElementId === el.id && (
                        <div className="absolute -top-10 -right-2 flex items-center bg-slate-800 text-white rounded-md shadow-xl z-[60]">
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); updateScale(el.id, -0.1); }} 
                            className="p-2 hover:bg-slate-700 rounded-l-md" 
                            title="Decrease Size"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="w-px h-4 bg-slate-600"></div>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); updateScale(el.id, 0.1); }} 
                            className="p-2 hover:bg-slate-700" 
                            title="Increase Size"
                          >
                            <Plus size={14} />
                          </button>
                          <div className="w-px h-4 bg-slate-600"></div>
                          <button 
                            onPointerDown={(e) => { e.stopPropagation(); deleteElement(el.id); }} 
                            className="p-2 hover:bg-red-500 text-red-300 hover:text-white rounded-r-md" 
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
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
                          className="whitespace-nowrap pointer-events-none opacity-90 leading-none block"
                        >
                          {el.content}
                        </span>
                      ) : (
                        <img 
                          src={el.content} 
                          draggable="false" 
                          alt="Signature" 
                          style={{ width: `${(window.innerWidth < 768 ? 100 : 150) * el.scale}px` }}
                          className="object-contain pointer-events-none opacity-90 block" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-teal-600" />
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default SignatureTool;
