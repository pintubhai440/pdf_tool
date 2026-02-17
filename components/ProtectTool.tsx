import React, { useState, useEffect } from 'react';
// import { PDFDocument } from 'pdf-lib'; // इसकी अब ज़रूरत नहीं है अगर हम सिर्फ पासवर्ड लगा रहे हैं
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite'; // 👈 नई लाइब्रेरी इम्पोर्ट की
import {
  Lock,
  Download,
  Loader2,
  ShieldCheck,
  FileKey,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FileUploader } from './FileUploader';

export const ProtectTool: React.FC = () => {
  // SEO Config
  useEffect(() => {
    document.title = "Protect PDF - Add Password to PDF Online Free | Genz PDF";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Encrypt and password protect your PDF files online. Secure your documents with strong encryption instantly. 100% client-side & free.');
    }
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('');

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
    }
  };

  const handleProtect = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      // 1. फाइल को बाइट्स (ArrayBuffer) में बदलें
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);

      // 2. नई लाइब्रेरी से एन्क्रिप्ट करें (पासवर्ड लगाएं)
      // encryptPDF(fileBytes, userPassword, ownerPassword, permissions)
      const encryptedBytes = await encryptPDF(
        pdfBytes,
        password, // खोलने के लिए पासवर्ड
        password  // एडिट करने के लिए पासवर्ड (फिलहाल सेम रखते हैं)
      );

      // 3. डाउनलोड के लिए फाइल तैयार करें
      const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(`protected-${file.name}`);
    } catch (error) {
      console.error("Error protecting PDF:", error);
      alert("Failed to protect PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
    setDownloadUrl(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-6">
          <ShieldCheck size={14} /> 256-Bit Encryption
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
          Protect PDF with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Password</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Secure your sensitive documents instantly. Add a password to your PDF files directly in your browser.
        </p>
      </header>

      {/* Main Card */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        {!file ? (
          <div className="p-8">
            <FileUploader 
              onFilesSelected={handleFileSelected}
              acceptedFileTypes={['application/pdf']}
              allowMultiple={false}
              label="Drop PDF to Protect"
              subLabel="Only PDF files are supported"
            />
            {/* Note about other formats */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> To protect Word or PPT files, please use our 
                <a href="/convert" className="underline font-bold ml-1">Convert Tool</a> first to save them as PDF, then upload here.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-0">
            {/* File Info */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                  <FileKey size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 truncate max-w-[200px]">{file.name}</h3>
                  <p className="text-xs text-slate-500">Ready to encrypt</p>
                </div>
              </div>
              <button onClick={handleReset} className="text-sm text-slate-400 hover:text-red-500 font-medium transition-colors">
                Change File
              </button>
            </div>

            <div className="p-8 space-y-6">
              {!downloadUrl ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Set Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a strong password"
                        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">Make sure to remember this password. It cannot be recovered.</p>
                  </div>

                  <button
                    onClick={handleProtect}
                    disabled={!password || isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                    {isProcessing ? "Encrypting..." : "Protect PDF"}
                  </button>
                </>
              ) : (
                <div className="text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Secured!</h2>
                  <p className="text-slate-500 mb-8">Your PDF is now password protected.</p>
                  
                  <div className="flex flex-col gap-3">
                    <a 
                      href={downloadUrl} 
                      download={downloadName}
                      className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-transform hover:-translate-y-1"
                    >
                      <Download size={20} /> Download Protected PDF
                    </a>
                    <button 
                      onClick={handleReset}
                      className="w-full py-3.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                    >
                      Protect Another File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
        {[
          { icon: ShieldCheck, title: "100% Secure", desc: "Encryption happens in your browser. Files are never uploaded." },
          { icon: Unlock, title: "Instant Access", desc: "No registration required. Just upload, lock, and download." },
          { icon: Lock, title: "Strong Encryption", desc: "Uses standard PDF encryption compatible with all PDF readers." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="inline-flex p-3 bg-slate-50 text-indigo-600 rounded-xl mb-4">
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtectTool;
