import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  PenTool, Download, Loader2, Type, Image as ImageIcon, Calendar,
  Trash2, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, RefreshCcw
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
      const viewport = page.getViewport({ scale: 1.5 });
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
    const newEl: SignatureElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      x: 10, // default position 10% from left
      y: 10, // default position 10% from top
      color: textColor,
      font: textFont,
      fontSize: type === 'text' || type === 'date' ? 16 : undefined,
    };

    setElements(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newEl]
    }));
    setTextContent(''); // reset input
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

  // Process the final PDF with pdf-lib
  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // Load fonts
      const fontHelvetica = await pdf.embedFont(StandardFonts.Helvetica);
      const fontTimes = await pdf.embedFont(StandardFonts.TimesRoman);
      const fontCourier = await pdf.embedFont(StandardFonts.Courier);

      const getFont = (name?: string) => {
        if (name === 'Times-Roman') return fontTimes;
        if (name === 'Courier') return fontCourier;
        return fontHelvetica;
      };

      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
      };

      const pages = pdf.getPages();

      // Apply elements to each page
      for (const [pageNum, pageElements] of Object.entries(elements)) {
        const pageIndex = parseInt(pageNum) - 1;
        if (pageIndex >= pages.length) continue;
        
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        for (const el of pageElements) {
          // Convert percentage to actual PDF points
          const x = (el.x / 100) * width;
          // PDF coordinates start from bottom-left, screen starts from top-left
          const y = height - ((el.y / 100) * height); 

          if (el.type === 'text' || el.type === 'date') {
            const pdfFont = getFont(el.font);
            const size = (el.fontSize || 16) * 1.5; // Scale factor for better visibility
            page.drawText(el.content, {
              x,
              y: y - size, // Adjust baseline
              size,
              font: pdfFont,
              color: el.color ? hexToRgb(el.color) : rgb(0,0,0)
            });
          } else if (el.type === 'image') {
            const isPng = el.content.startsWith('data:image/png');
            const imgBytes = await fetch(el.content).then(res => res.arrayBuffer());
            const image = isPng ? await pdf.embedPng(imgBytes) : await pdf.embedJpg(imgBytes);
            
            // Fixed size for signature image (e.g., 150px wide)
            const imgDims = image.scaleToFit(150, 150);
            page.drawImage(image, {
              x,
              y: y - imgDims.height, // Adjust baseline
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
    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      let newX = ((e.clientX - rect.left) / rect.width) * 100;
      let newY = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Constrain inside boundaries
      newX = Math.max(0, Math.min(90, newX));
      newY = Math.max(0, Math.min(95, newY));

      updateElementPosition(el.id, newX, newY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    return (
      <div
        style={{ left: `${el.x}%`, top: `${el.y}%`, position: 'absolute' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="cursor-move absolute z-50 p-1 md:p-2 border-2 border-dashed border-transparent hover:border-indigo-500 group select-none touch-none"
      >
        <button 
          onClick={() => deleteElement(el.id)}
          className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-50"
        >
          <Trash2 size={12} />
        </button>

        {el.type === 'text' || el.type === 'date' ? (
          <span style={{ color: el.color, fontFamily: el.font, fontSize: `${el.fontSize || 16}px` }} className="whitespace-nowrap font-medium pointer-events-none">
            {el.content}
          </span>
        ) : (
          <img src={el.content} alt="Signature" className="max-w-[100px] md:max-w-[150px] object-contain pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 rounded-3xl p-4 md:p-8 shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">PDF Document</span>
        </h1>
        <p className="text-slate-500 font-medium">Add text, dates, or upload your signature image securely.</p>
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
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl text-center shadow-lg border border-slate-200 animate-in zoom-in-95">
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
        <div className="grid lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Type size={18} className="text-teal-600"/> Add Text / Name</h3>
              <input 
                type="text" 
                placeholder="Type your name..." 
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg mb-3 focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <div className="flex gap-2 mb-4">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 p-1 bg-slate-50 rounded cursor-pointer" title="Color" />
                <select value={textFont} onChange={(e) => setTextFont(e.target.value)} className="flex-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
                  <option value="Helvetica">Helvetica (Clean)</option>
                  <option value="Times-Roman">Times Roman (Formal)</option>
                  <option value="Courier">Courier (Typewriter)</option>
                </select>
              </div>
              <button 
                onClick={() => textContent.trim() && addElement('text', textContent)}
                className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-teal-600 transition-colors"
              >
                Add Text
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-teal-600"/> Upload Signature</h3>
               <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
               <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 border-2 border-dashed border-teal-300 text-teal-700 bg-teal-50 rounded-lg font-bold hover:bg-teal-100 transition-colors">
                 Upload Image (PNG/JPG)
               </button>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar size={18} className="text-teal-600"/> Add Date</h3>
               <button 
                 onClick={() => addElement('date', new Date().toLocaleDateString())} 
                 className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold transition-colors"
               >
                 Insert Today's Date
               </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl font-black shadow-lg flex justify-center items-center gap-2 transition-transform hover:-translate-y-1"
            >
              {isProcessing ? <><Loader2 className="animate-spin" /> Processing...</> : <><Download size={20} /> Save PDF</>}
            </button>
            
            {error && <p className="text-red-500 text-sm font-medium flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
          </div>

          {/* PDF Viewer & Editor Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 p-3 rounded-t-2xl flex items-center justify-between text-white">
              <span className="font-medium text-sm truncate max-w-[200px]">{file.name}</span>
              <div className="flex items-center gap-4">
                <button onClick={() => changePage(-1)} disabled={currentPage === 1} className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"><ChevronLeft size={20}/></button>
                <span className="text-sm font-bold">Page {currentPage} of {numPages}</span>
                <button onClick={() => changePage(1)} disabled={currentPage === numPages} className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"><ChevronRight size={20}/></button>
              </div>
              <button onClick={handleReset} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"><RefreshCcw size={14}/> Reset</button>
            </div>
            
            <div className="bg-slate-200 p-4 md:p-8 rounded-b-2xl min-h-[500px] flex justify-center overflow-auto shadow-inner">
              {pageImage ? (
                <div ref={containerRef} className="relative shadow-2xl bg-white select-none max-w-full" style={{ width: 'fit-content' }}>
                  <img src={pageImage} alt={`Page ${currentPage}`} className="max-w-full h-auto pointer-events-none" />
                  
                  {/* Render elements for current page */}
                  {(elements[currentPage] || []).map(el => (
                    <DraggableElement key={el.id} el={el} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
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
