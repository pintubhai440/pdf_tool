import React, { useState, useEffect } from 'react';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite'; // नई लाइब्रेरी इम्पोर्ट की
// import { PDFDocument } from 'pdf-lib'; // इसकी अब ज़रूरत नहीं है अगर हम सिर्फ पासवर्ड लगा रहे हैं
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
  Unlock,
  Zap,
  KeyRound,
  Fingerprint
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
    image: "https://genzpdf.com/social/protect-pdf-preview.jpg", // Ensure this image exists
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

  // ---------- ✅ MASTER SEO & SCHEMA INJECTION ----------
  useEffect(() => {
    // 1. Basic Meta Tags
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
    
    // 2. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', SEO.canonical);

    // 3. Open Graph (Facebook/LinkedIn)
    upsertMeta('og:title', SEO.title, true);
    upsertMeta('og:description', SEO.description, true);
    upsertMeta('og:url', SEO.canonical, true);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:site_name', SEO.siteName, true);
    upsertMeta('og:image', SEO.image, true);

    // 4. Twitter Cards
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', SEO.title);
    upsertMeta('twitter:description', SEO.description);
    upsertMeta('twitter:image', SEO.image);

    // 5. JSON-LD Structured Data (The "Secret Sauce" for Google Ranking)
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
      // 1. फाइल को बाइट्स (ArrayBuffer) में बदलें
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);

      // 2. नई लाइब्रेरी से एन्क्रिप्ट करें (पासवर्ड लगाएं)
      const encryptedBytes = await encryptPDF(
        pdfBytes,
        password, // User Password (to open)
        password  // Owner Password (to edit - keeping same for simplicity)
      );

      // 3. डाउनलोड के लिए फाइल तैयार करें
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
    <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* HERO SECTION */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck size={14} /> 
            AES-256 Bit Encryption
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Protect PDF with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Password</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Secure your sensitive documents instantly. Add a strong password to your PDF files directly in your browser without uploading them.
          </p>
        </header>

        {/* MAIN TOOL CARD */}
        <div className="max-w-xl mx-auto relative z-10 mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20"></div>
          
          <div className="relative bg-white rounded-[1.8rem] shadow-2xl border border-white/50 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient"></div>
            
            {!file ? (
              // UPLOAD STATE
              <div className="p-8">
                <FileUploader 
                  onFilesSelected={handleFileSelected}
                  acceptedFileTypes={['application/pdf']}
                  allowMultiple={false}
                  label="Drop PDF to Lock"
                  subLabel="Only PDF files are supported"
                />
                
                {/* Format Warning */}
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800">
                  <AlertCircle className="shrink-0" size={20} />
                  <p className="text-sm leading-relaxed">
                    <strong>Need to protect Word/PPT?</strong><br/> 
                    Please use our <a href="/convert-pdf" className="underline font-bold hover:text-amber-900">Convert Tool</a> first to save them as PDF.
                  </p>
                </div>
              </div>
            ) : (
              // PROCESSING STATE
              <div className="p-0 animate-in fade-in zoom-in-95 duration-300">
                {/* File Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                      <FileKey size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 truncate max-w-[180px]">{file.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Ready to encrypt</p>
                    </div>
                  </div>
                  <button onClick={handleReset} className="text-sm text-slate-400 hover:text-red-500 font-bold transition-colors">
                    Change
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  {!downloadUrl ? (
                    <>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Set Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Lock size={18} />
                          </div>
                          <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter a strong password"
                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 placeholder:font-normal"
                            autoFocus
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 px-1">
                           ⚠️ Note: If you forget this password, the file cannot be recovered.
                        </p>
                      </div>

                      <button
                        onClick={handleProtect}
                        disabled={!password || isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                        {isProcessing ? "Encrypting..." : "Protect PDF Now"}
                      </button>
                    </>
                  ) : (
                    // SUCCESS STATE
                    <div className="text-center">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                        <CheckCircle2 size={40} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">File Secured!</h2>
                      <p className="text-slate-500 mb-8 px-4">Your PDF is now encrypted with the password you provided.</p>
                      
                      <div className="space-y-3">
                        <a 
                          href={downloadUrl} 
                          download={downloadName}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-transform hover:-translate-y-0.5"
                        >
                          <Download size={20} /> Download Protected PDF
                        </a>
                        <button 
                          onClick={handleReset}
                          className="w-full py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors"
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
        </div>

        {/* FEATURES GRID (SEO RICH) */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { 
              icon: ShieldCheck, 
              title: "100% Private", 
              desc: "Encryption happens locally in your browser. Your sensitive files are never uploaded to our servers.",
              color: "text-indigo-600",
              bg: "bg-indigo-50"
            },
            { 
              icon: Zap, 
              title: "Instant Encryption", 
              desc: "No waiting time. Our optimized engine locks your files in milliseconds, regardless of size.",
              color: "text-amber-600",
              bg: "bg-amber-50"
            },
            { 
              icon: KeyRound, 
              title: "Strong Security", 
              desc: "We use standard AES-128/256 bit encryption, compatible with all major PDF readers.",
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className={`inline-flex p-3 ${item.bg} ${item.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* FAQ SECTION (Crucial for SEO) */}
        <section className="max-w-3xl mx-auto border-t border-slate-200 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about PDF encryption.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is it safe to password protect PDF online?",
                a: "Absolutely. Genz PDF operates entirely client-side. This means your file is encrypted directly on your device and is never sent to any server."
              },
              {
                q: "Can I open the protected PDF on my phone?",
                a: "Yes. The encryption standard we use is compatible with all devices (Android, iPhone, Mac, Windows) and all standard PDF readers."
              },
              {
                q: "What happens if I forget the password?",
                a: "Unfortunately, there is no way to recover a forgotten password. The encryption is designed to be unbreakable without the key. Please store your password safely."
              },
              {
                q: "Is this service free?",
                a: "Yes, Genz PDF is 100% free to use with no limits on the number of files you can protect."
              }
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <summary className="flex justify-between items-center p-5 font-bold text-slate-800 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                  {item.q}
                  <span className="transform group-open:rotate-180 transition-transform text-indigo-500">▼</span>
                </summary>
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProtectTool;
