import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  PenTool, Download, Loader2, Type, Image as ImageIcon, Calendar,
  Trash2, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw,
  Bold, CopyCheck
} from 'lucide-react';
import { FileUploader } from './FileUploader';

// Types for our signature elements
type ElementType = 'text' | 'image' | 'date';

interface SignatureElement {
  id: string;
  type: ElementType;
  content: string; 
  x: number; // percentage
  y: number; // percentage
  color?: string;
  font?: string;
  fontSize?: number;
  isBold?: boolean; // New bold property
}

export const SignatureTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImage, setPageImage] = useState<string>('');
  
  const [elements, setElements] = useState<Record<number, SignatureElement[]>>({});
  
  // Toolbar states
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

  // Initialize PDF.js worker
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
      const viewport = page.getViewport({ scale: window.innerWidth < 768 ? 1.0 : 1.5 });
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
    }
  };

  const addElement = (type: ElementType, content: string) => {
    let displayContent = content;
    if (type === 'date') {
      // Format the selected date nicely (e.g., DD/MM/YYYY)
      const d = new Date(content);
      displayContent = d.toLocaleDateString('en-GB'); 
    }

    const newEl: SignatureElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: displayContent,
      x: 10, // default position
      y: 10, 
      color: textColor,
      font: textFont,
      fontSize: type === 'text' || type === 'date' ? 16 : undefined,
      isBold: isBoldText
    };

    setElements(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newEl]
    }));
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

  const updateElementPosition = (id: string, x: number, y: number) => {
    setElements(prev => {
      const pageElements = prev[currentPage] || [];
      return {
        ...prev,
        [currentPage]: pageElements.map(el => el.id === id ? { ...el, x, y } : el)
      };
    });
  };

  const deleteElement = (id: string) => {
    setElements(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).filter(el => el.id !== id)
    }));
  };

  // Magic Feature: Apply signature to all pages
  const applyToAllPages = () => {
    const currentElements = elements[currentPage] || [];
    if (currentElements.length === 0) {
      alert("Please add a signature or text to the current page first!");
      return;
    }

    const newElements = { ...elements };
    for (let i = 1; i <= numPages; i++) {
      if (i !== currentPage) {
        // Clone elements with new unique IDs for other pages
        newElements[i] = currentElements.map(el => ({ 
          ...el, 
          id: Math.random().toString(36).substr(2, 9) 
        }));
      }
    }
    setElements(newElements);
    alert("Success! Applied to all pages.");
  };

  // Process final PDF
  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      const getFont = async (name: string, isBold?: boolean) => {
        if (name === 'Times-Roman') return await pdf.embedFont(isBold ? StandardFonts.TimesRomanBold : StandardFonts.TimesRoman);
        if (name === 'Courier') return await pdf.embedFont(isBold ? StandardFonts.CourierBold : StandardFonts.Courier);
        return await pdf.embedFont(isBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
      };

      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
      };

      const pages = pdf.getPages();

      for (const [pageNum, pageElements] of Object.entries(elements)) {
        const pageIndex = parseInt(pageNum) - 1;
        if (pageIndex >= pages.length) continue;
        
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        for (const el of pageElements) {
          const x = (el.x / 100) * width;
          const y = height - ((el.y / 100) * height); 

          if (el.type === 'text' || el.type === 'date') {
            const pdfFont = await getFont(el.font || 'Helvetica', el.isBold);
            const size = (el.fontSize || 16) * 1.5; 
            page.drawText(el.content, {
              x,
              y: y - size, 
              size,
              font: pdfFont,
              color: el.color ? hexToRgb(el.color) : rgb(0,0,0)
            });
          } else if (el.type === 'image') {
            const isPng = el.content.startsWith('data:image/png');
            const imgBytes = await fetch(el.content).then(res => res.arrayBuffer());
            const image = isPng ? await pdf.embedPng(imgBytes) : await pdf.embedJpg(imgBytes);
            
            const imgDims = image.scaleToFit(150, 150);
            page.drawImage(image, {
              x,
              y: y - imgDims.height,
              width: imgDims.width,
              height: imgDims.height
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
    setDownloadUrl(null);
    setPageImage('');
  };

  // Draggable Component
  const DraggableElement = ({ el }: { el: SignatureElement }) => {
    const handlePointerDown = (e: React.PointerEvent) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const startY = e.clientY;
      const initialX = el.x;
      const initialY = el.y;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const deltaX = ((moveEvent.clientX - startX) / rect.width) * 100;
        const deltaY = ((moveEvent.clientY - startY) / rect.height) * 100;
        
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;
        
        // Boundaries
        newX = Math.max(0, Math.min(90, newX));
        newY = Math.max(0, Math.min(95, newY));

        updateElementPosition(el.id, newX, newY);
      };

      const handlePointerUp = () => {
        target.releasePointerCapture(e.pointerId);
        target.removeEventListener('pointermove', handlePointerMove);
        target.removeEventListener('pointerup', handlePointerUp);
      };

      target.addEventListener('pointermove', handlePointerMove);
      target.addEventListener('pointerup', handlePointerUp);
    };

    return (
      <div
        style={{ left: `${el.x}%`, top: `${el.y}%`, position: 'absolute' }}
        onPointerDown={handlePointerDown}
        className="cursor-move absolute z-50 p-1 md:p-2 border-2 border-dashed border-transparent hover:border-indigo-500 group touch-none select-none shadow-sm hover:shadow-md bg-white/10 rounded"
      >
        <button 
          onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
          className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>

        {el.type === 'text' || el.type === 'date' ? (
          <span 
            style={{ 
              color: el.color, 
              fontFamily: el.font === 'Times-Roman' ? 'Times New Roman' : el.font === 'Courier' ? 'Courier New' : 'Arial', 
              fontSize: `${el.fontSize || 16}px`,
              fontWeight: el.isBold ? 'bold' : 'normal'
            }} 
            className="whitespace-nowrap pointer-events-none drop-shadow-sm"
          >
            {el.content}
          </span>
        ) : (
          <img src={el.content} draggable="false" alt="Signature" className="max-w-[100px] md:max-w-[150px] object-contain pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-slate-100 w-full overflow-hidden">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">PDF Document</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">Add text, dates, or upload your signature image securely.</p>
      </div>

      {!file ? (
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-12 rounded-[2rem] shadow-sm border border-slate-200">
          <FileUploader 
            onFilesSelected={handleFileSelected} 
            allowMultiple={false} 
            acceptedFileTypes={['application/pdf']} 
            label="Drop PDF to Sign" 
          />
        </div>
      ) : downloadUrl ? (
        <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-3xl text-center shadow-lg border border-slate-200 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Document Signed!</h2>
          <p className="text-slate-500 mb-8">Your signature has been applied successfully.</p>
          <div className="flex flex-col gap-3">
            <a href={downloadUrl} download={`signed-${file.name}`} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Download size={20} /> Download PDF
            </a>
            <button onClick={handleReset} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all">
              Sign Another File
            </button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
          
          {/* Sidebar Controls - Mobile Responsive */}
          <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6 order-2 lg:order-1">
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm md:text-base"><Type size={18} className="text-teal-600"/> Add Text / Name</h3>
              <input 
                type="text" 
                placeholder="Type your name..." 
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg mb-3 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
              
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                {/* Circle Color Picker */}
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 shadow-sm cursor-pointer">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0" title="Choose Color" />
                </div>
                
                {/* Font Selector */}
                <select value={textFont} onChange={(e) => setTextFont(e.target.value)} className="flex-1 px-2 py-1.5 md:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm outline-none">
                  <option value="Helvetica">Arial / Helvetica</option>
                  <option value="Times-Roman">Times New Roman</option>
                  <option value="Courier">Courier</option>
                </select>

                {/* Bold Toggle */}
                <button 
                  onClick={() => setIsBoldText(!isBoldText)} 
                  className={`p-2 rounded-lg border transition-colors ${isBoldText ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  title="Bold Text"
                >
                  <Bold size={16} />
                </button>
              </div>

              <button 
                onClick={() => textContent.trim() && addElement('text', textContent)}
                className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-teal-600 transition-colors"
              >
                Add Text
              </button>
            </div>

            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm md:text-base"><ImageIcon size={18} className="text-teal-600"/> Upload Signature</h3>
               <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
               <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 md:py-3 border-2 border-dashed border-teal-300 text-teal-700 bg-teal-50 rounded-lg font-bold text-sm hover:bg-teal-100 transition-colors">
                 Upload Image
               </button>
            </div>

            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm md:text-base"><Calendar size={18} className="text-teal-600"/> Add Date</h3>
               <div className="flex gap-2 mb-3">
                 <input 
                   type="date" 
                   value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}
                   className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                 />
               </div>
               <button 
                 onClick={() => addElement('date', selectedDate)} 
                 className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-sm transition-colors"
               >
                 Insert Date
               </button>
            </div>
            
            {/* Save Button */}
            <div className="sticky bottom-4 z-10 pt-2">
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="w-full py-3 md:py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-teal-500/20 flex justify-center items-center gap-2 transition-transform hover:-translate-y-1"
              >
                {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : <><Download size={20} /> Save PDF</>}
              </button>
              {error && <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
            </div>
          </div>

          {/* PDF Viewer & Editor Area */}
          <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col min-h-[50vh]">
            <div className="bg-slate-800 p-3 rounded-t-2xl flex flex-wrap items-center justify-between text-white gap-2">
              <span className="font-medium text-xs md:text-sm truncate max-w-[120px] md:max-w-[200px]">{file.name}</span>
              <div className="flex items-center gap-2 md:gap-4 bg-slate-700/50 rounded-lg px-2 py-1">
                <button onClick={() => changePage(-1)} disabled={currentPage === 1} className="p-1 hover:bg-slate-600 rounded disabled:opacity-50"><ChevronLeft size={18}/></button>
                <span className="text-xs md:text-sm font-bold whitespace-nowrap">Page {currentPage} / {numPages}</span>
                <button onClick={() => changePage(1)} disabled={currentPage === numPages} className="p-1 hover:bg-slate-600 rounded disabled:opacity-50"><ChevronRight size={18}/></button>
              </div>
              <button onClick={handleReset} className="text-red-400 hover:text-red-300 text-xs md:text-sm font-bold flex items-center gap-1"><RefreshCcw size={14}/> Reset</button>
            </div>
            
            {/* The Magic Button - Only visible if there are elements on current page */}
            {(elements[currentPage]?.length > 0 && numPages > 1) && (
              <div className="bg-indigo-50 border-b border-indigo-100 p-2 flex justify-center">
                 <button 
                   onClick={applyToAllPages}
                   className="flex items-center gap-2 text-indigo-700 font-bold text-xs md:text-sm bg-white px-4 py-1.5 rounded-full shadow-sm hover:bg-indigo-600 hover:text-white transition-all border border-indigo-200"
                 >
                   <CopyCheck size={16} /> Apply to All Pages
                 </button>
              </div>
            )}
            
            <div className="bg-slate-200 p-2 md:p-6 rounded-b-2xl flex-1 flex justify-center overflow-x-auto shadow-inner relative">
              {pageImage ? (
                <div 
                  ref={containerRef} 
                  className="relative shadow-2xl bg-white select-none origin-top transition-transform" 
                  style={{ width: 'fit-content', touchAction: 'none' }}
                >
                  <img src={pageImage} alt={`Page ${currentPage}`} className="max-w-[95vw] md:max-w-full h-auto pointer-events-none block" />
                  
                  {/* Render elements for current page */}
                  {(elements[currentPage] || []).map(el => (
                    <DraggableElement key={el.id} el={el} />
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
