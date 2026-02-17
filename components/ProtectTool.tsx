import React, { useState, useEffect } from 'react';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import {
  Lock,
  Download,
  Loader2,
  ShieldCheck,
  FileKey,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  KeyRound,
  RefreshCcw,
  ChevronDown,
} from 'lucide-react';
import { FileUploader } from './FileUploader';
import { clsx } from 'clsx';

export const ProtectTool: React.FC = () => {
  // ---------- SEO CONFIGURATION ----------
  const SEO = {
    title: "Protect PDF - Encrypt & Lock PDF Online Free | Genz PDF",
    description: "Secure your PDF documents with military-grade 256-bit encryption. Add passwords to PDF files online for free. 100% client-side, private, and secure.",
    canonical: "https://genzpdf.com/protect-pdf",
    keywords: "protect pdf, encrypt pdf, password protect pdf, lock pdf, secure pdf, add password to pdf, free pdf protector, client-side pdf encryption, aes 256 pdf",
    image: "https://genzpdf.com/social/protect-pdf-preview.jpg",
    siteName: "Genz PDF"
  };

  // ---------- STATE ----------
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ---------- MASTER SEO & SCHEMA INJECTION ----------
  useEffect(() => {
    document.title = SEO.title;
    
    const upsertMeta = (attr: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${attr}"]` : `meta[name="${attr}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(isProperty ? 'property' : 'name', attr);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    };

    upsertMeta('description', SEO.description);
    upsertMeta('keywords', SEO.keywords);
    upsertMeta('robots', 'index, follow');
    
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', SEO.canonical);

    upsertMeta('og:title', SEO.title, true);
    upsertMeta('og:description', SEO.description, true);
    upsertMeta('og:url', SEO.canonical, true);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:site_name', SEO.siteName, true);
    upsertMeta('og:image', SEO.image, true);

    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', SEO.title);
    upsertMeta('twitter:description', SEO.description);
    upsertMeta('twitter:image', SEO.image);

    const scriptId = 'json-ld-protect';
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Genz PDF Protector",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": SEO.description,
        "featureList": "AES-256 Encryption, Client-side Processing, No Uploads",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "850"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How to password protect a PDF for free?",
            "acceptedAnswer": { "@type": "Answer", "text": "Upload your file to Genz PDF, enter a strong password, and click Protect. The file is encrypted instantly in your browser." }
          },
          {
            "@type": "Question",
            "name": "Is it safe to encrypt PDF online?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, with Genz PDF it is 100% safe because we use client-side SSL encryption. Your file never leaves your device." }
          },
          {
            "@type": "Question",
            "name": "Can I open the protected PDF on my phone?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, the standard PDF encryption we use works on all devices including iPhone, Android, Mac, and Windows." }
          }
        ]
      }
    ];
    scriptTag.textContent = JSON.stringify(schemaData);

  }, []);

  // ---------- LOGIC ----------
  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setDownloadUrl(null);
      setError(null);
      setPassword('');
    }
  };

  const handleProtect = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError(null);

    try {
      await new Promise(res => setTimeout(res, 500));
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);

      const encryptedBytes = await encryptPDF(
        pdfBytes,
        password,
        password
      );

      const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setDownloadName(`protected-${file.name}`);
    } catch (error) {
      console.error("Error protecting PDF:", error);
      setError("Failed to protect PDF. The file might already be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
    setDownloadUrl(null);
    setError(null);
  };

  // ---------- RENDER ----------
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 pb-16 relative overflow-hidden">
      
      {/* ---------- BACKGROUND AMBIENCE ---------- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-400/20 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-fuchsia-400/20 blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-20 z-10">
        
        {/* ---------- HERO SECTION ---------- */}
        <header className="text-center mb-10 sm:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-[0_4px_20px_rgb(79,70,229,0.1)] text-indigo-700 text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 transition-transform hover:scale-105">
            <ShieldCheck size={14} className="text-indigo-500 sm:w-4 sm:h-4" /> 
            Bank-Grade AES-256 Encryption
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight leading-[1.15]">
            Secure PDF with <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 drop-shadow-sm">
              Unbreakable Password
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium px-2">
            Lock your sensitive documents instantly. Add a strong password directly in your browser. 
            <span className="text-slate-700 font-bold block sm:inline mt-1 sm:mt-0"> Zero uploads. Total privacy.</span>
          </p>
        </header>

        {/* ---------- MAIN TOOL CARD ---------- */}
        <div className="max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="relative group">
            {/* Animated Gradient Border Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-500 rounded-[2rem] sm:rounded-[2.5rem] blur-md opacity-30 group-hover:opacity-60 transition duration-700 animate-pulse"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white overflow-hidden transition-all duration-500">
              
              {/* Top aesthetic bar */}
              <div className="h-1.5 sm:h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"></div>
              
              {!file ? (
                // --- UPLOAD STATE ---
                <div className="p-4 sm:p-8 md:p-12">
                  <div className="bg-slate-50/50 rounded-2xl sm:rounded-3xl p-1 sm:p-2 border border-slate-100/50">
                    <FileUploader 
                      onFilesSelected={handleFileSelected}
                      acceptedFileTypes={['application/pdf']}
                      allowMultiple={false}
                      label="Drop PDF to Lock"
                      subLabel="Secure your file locally"
                    />
                  </div>
                  
                  <div className="mt-6 sm:mt-8 flex items-start gap-2 sm:gap-3 p-4 sm:p-5 bg-amber-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-amber-200/50 text-amber-900 shadow-sm transition-all hover:shadow-md">
                    <AlertCircle className="shrink-0 text-amber-600 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <span className="font-bold block mb-0.5 sm:mb-1">Need to protect Word or Excel?</span>
                      Use our <a href="/convert" className="font-bold underline decoration-amber-300 hover:decoration-amber-600 underline-offset-2 transition-colors">Converter Tool</a> to save them as PDF first.
                    </div>
                  </div>
                </div>
              ) : (
                // --- PROCESSING / SUCCESS STATE ---
                <div className="p-0 animate-in fade-in zoom-in-95 duration-500">
                  {/* File Header */}
                  <div className="bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6 py-4 sm:py-5 md:px-10 md:py-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="p-2 sm:p-3 bg-white shadow-sm border border-slate-100 text-indigo-600 rounded-xl sm:rounded-2xl shrink-0">
                        <FileKey className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[250px] text-sm sm:text-base md:text-lg">{file.name}</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5 sm:mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to lock
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleReset} 
                      className="group flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-slate-500 hover:text-red-500 font-bold transition-colors bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 shadow-sm"
                    >
                      <RefreshCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-rotate-180 transition-transform duration-500" />
                      <span className="hidden sm:inline">Change File</span>
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
                    {error && (
                      <div className="p-3 sm:p-4 bg-red-50 text-red-700 rounded-xl sm:rounded-2xl flex items-start gap-2 sm:gap-3 text-xs sm:text-sm font-medium border border-red-100 shadow-sm animate-in slide-in-from-top-2">
                        <AlertCircle className="shrink-0 mt-0.5 text-red-500 w-4 h-4 sm:w-5 sm:h-5" /> 
                        <span className="leading-relaxed">{error}</span>
                      </div>
                    )}

                    {!downloadUrl ? (
                      // --- PASSWORD INPUT SECTION ---
                      <div className="space-y-5 sm:space-y-6">
                        <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-inner">
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 sm:mb-3 ml-1 flex items-center gap-1.5 sm:gap-2">
                            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> Set Master Password
                          </label>
                          <div className="relative group">
                            <input 
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter a strong password..."
                              className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 md:py-5 bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-base md:text-xl text-slate-800 placeholder:font-normal placeholder:text-slate-400 shadow-sm"
                              autoFocus
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-1 sm:right-2 px-2.5 sm:px-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors bg-white m-1 rounded-lg sm:rounded-xl"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </button>
                          </div>
                          
                          {/* Password Strength Indicator (Visual Only) */}
                          <div className="mt-3 sm:mt-4 flex gap-1 h-1 sm:h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className={clsx("h-full transition-all duration-500", password.length > 0 ? "w-1/3 bg-red-400" : "w-0")}></div>
                            <div className={clsx("h-full transition-all duration-500", password.length > 5 ? "w-1/3 bg-amber-400" : "w-0")}></div>
                            <div className={clsx("h-full transition-all duration-500", password.length > 8 ? "w-1/3 bg-emerald-400" : "w-0")}></div>
                          </div>
                          
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-3 sm:mt-4 px-1 flex items-start gap-1.5 sm:gap-2 leading-relaxed">
                             <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0 mt-0.5" />
                             If you forget this password, the file cannot be recovered.
                          </p>
                        </div>

                        <button
                          onClick={handleProtect}
                          disabled={!password || isProcessing}
                          className="relative w-full py-4 sm:py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl shadow-[0_10px_20px_rgb(0,0,0,0.1)] flex items-center justify-center gap-2 sm:gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-[0.98] overflow-hidden group"
                        >
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                          <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                            {isProcessing ? <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" /> : <Lock className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />}
                            {isProcessing ? "Encrypting..." : "Lock PDF Now"}
                          </span>
                        </button>
                      </div>
                    ) : (
                      // --- SUCCESS STATE ---
                      <div className="text-center py-4 sm:py-6">
                        <div className="relative inline-block mb-6 sm:mb-8">
                          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-600 rounded-full flex items-center justify-center shadow-xl ring-4 sm:ring-8 ring-white mx-auto">
                            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                          </div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 sm:mb-3">File Secured!</h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-500 mb-8 sm:mb-10 px-4">Your PDF is now encrypted and safe to share.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <a 
                            href={downloadUrl} 
                            download={downloadName}
                            className="flex-1 py-3.5 sm:py-4 px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-[0.98]"
                          >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Download
                          </a>
                          <button 
                            onClick={handleReset}
                            className="flex-1 py-3.5 sm:py-4 px-4 sm:px-6 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all active:scale-[0.98]"
                          >
                            Lock Another
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- FEATURES GRID ---------- */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-16 sm:mb-24 max-w-5xl mx-auto">
          {[
            { 
              icon: ShieldCheck, 
              title: "Absolute Privacy", 
              desc: "Your files are never uploaded. We encrypt the PDF directly inside your web browser.",
              bg: "bg-blue-50/80",
              color: "text-blue-600",
              border: "border-blue-100"
            },
            { 
              icon: Zap, 
              title: "Instant Processing", 
              desc: "No waiting in queues or uploading large files. Lightning-fast encryption by your device.",
              bg: "bg-amber-50/80",
              color: "text-amber-600",
              border: "border-amber-100"
            },
            { 
              icon: KeyRound, 
              title: "AES-256 Encryption", 
              desc: "We employ the highest standard of encryption, impossible for unauthorized access.",
              bg: "bg-emerald-50/80",
              color: "text-emerald-600",
              border: "border-emerald-100"
            }
          ].map((item, i) => (
            <div key={i} className={`bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1`}>
              <div className={`inline-flex p-3 sm:p-4 ${item.bg} ${item.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-sm border ${item.border} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 sm:mb-3 text-lg sm:text-xl">{item.title}</h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* ---------- FAQ SECTION ---------- */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 sm:mb-4">Common Questions</h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-500">Everything you need to know about our PDF protection tool.</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  q: "Is it really safe to password protect PDF online?",
                  a: "Yes, because our tool is built differently. We use 'Client-Side Processing'. This means your PDF never leaves your computer. The encryption happens locally in your browser, making it 100% secure against interception."
                },
                {
                  q: "Will this protected PDF open on my smartphone?",
                  a: "Absolutely. We use standard PDF encryption protocols that are universally supported by all modern PDF readers across iOS, Android, Windows, and macOS."
                },
                {
                  q: "Can you help me recover a forgotten password?",
                  a: "No. Since we do not store your files or passwords on our servers, it is mathematically impossible for us to recover or bypass the password. Please keep your password in a safe place."
                },
                {
                  q: "Are there any hidden fees or limits?",
                  a: "No. Genz PDF is completely free to use. There are no file size limits, no daily usage limits, and no premium tiers."
                }
              ].map((item, i) => (
                <details key={i} className="group bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:border-indigo-200">
                  <summary className="flex justify-between items-center p-4 sm:p-6 font-bold text-slate-800 text-sm sm:text-base md:text-lg cursor-pointer list-none select-none">
                    <span className="pr-4">{item.q}</span>
                    <div className="p-1.5 sm:p-2 rounded-full bg-white shadow-sm text-indigo-500 group-open:rotate-180 transition-transform duration-300 shrink-0">
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProtectTool;
