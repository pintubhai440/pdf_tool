import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  Unlock,
  HelpCircle,
  Cpu,
  Globe
} from 'lucide-react';
import { FileUploader } from './FileUploader';

export const ProtectTool: React.FC = () => {
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
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      const encryptedBytes = await encryptPDF(pdfBytes, password, password);
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

  // FAQ data – used both for the visible section and for structured data
  const faqItems = [
    {
      q: "Is it safe to password protect PDF online?",
      a: "Absolutely. Your file never leaves your browser. All encryption happens locally on your device using 256‑bit AES."
    },
    {
      q: "Can I remove the password later?",
      a: "Yes, if you know the password, you can use our 'Unlock PDF' tool to remove security restrictions permanently."
    },
    {
      q: "What happens if I forget the password?",
      a: "PDF encryption is designed to be unbreakable without the password. We cannot recover lost passwords – please save it in a safe place."
    },
    {
      q: "Is there a file size limit?",
      a: "Because processing happens in your browser, performance depends on your device. Generally, files up to 100MB are handled smoothly."
    }
  ];

  // Structured data (JSON‑LD) for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Genz PDF Protector",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online tool to password protect PDF files with 256-bit encryption. No upload – all in your browser.",
        "featureList": "Client‑side encryption, no registration, unlimited files, 256‑bit AES"
      },
      {
        "@type": "HowTo",
        "name": "How to Password Protect a PDF",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload PDF",
            "text": "Select or drag and drop your PDF file into the secure tool."
          },
          {
            "@type": "HowToStep",
            "name": "Set Password",
            "text": "Enter a strong password to encrypt your document."
          },
          {
            "@type": "HowToStep",
            "name": "Encrypt & Download",
            "text": "Click 'Protect PDF' to apply encryption and download your secured file instantly."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <>
      {/* ---------- META TAGS & STRUCTURED DATA (Helmet) ---------- */}
      <Helmet>
        <title>Protect PDF – Encrypt & Add Password to PDF Online (Free) | Genz PDF</title>
        <meta name="description" content="Securely password protect PDF files online for free. 100% client-side encryption ensures your documents never leave your device. Fast, private, and easy." />
        <meta name="keywords" content="protect pdf, encrypt pdf, password protect pdf, lock pdf, secure pdf online, add password to pdf, free pdf protector, client-side pdf encryption" />
        <meta name="author" content="Genz PDF" />
        <link rel="canonical" href="https://genzpdf.com/protect-pdf" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://genzpdf.com/protect-pdf" />
        <meta property="og:title" content="Protect PDF – Add Password to PDF Online Free" />
        <meta property="og:description" content="Encrypt your PDF with a password instantly. No upload, 100% secure." />
        <meta property="og:image" content="https://genzpdf.com/og-protect.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://genzpdf.com/protect-pdf" />
        <meta property="twitter:title" content="Protect PDF – Add Password to PDF Online Free" />
        <meta property="twitter:description" content="Encrypt your PDF with a password instantly. No upload, 100% secure." />
        <meta property="twitter:image" content="https://genzpdf.com/og-protect.jpg" />

        {/* JSON‑LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* ---------- MAIN UI (from first snippet, enriched) ---------- */}
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-6">
            <ShieldCheck size={14} /> 256-Bit AES Encryption
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
            Encrypt & Protect PDF <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Online</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The safest way to password protect PDF files. Free, private, and runs 100% in your browser—no server uploads.
          </p>
        </header>

        {/* Tool Interface */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative mb-20">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          {!file ? (
            <div className="p-8">
              <FileUploader
                onFilesSelected={handleFileSelected}
                acceptedFileTypes={['application/pdf']}
                allowMultiple={false}
                label="Drop PDF to Encrypt"
                subLabel="Secure your documents instantly"
              />
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <p className="text-sm text-amber-800">
                  <strong>Tip:</strong> Need to secure Word or Excel files?
                  <a href="/convert" className="underline font-bold ml-1 hover:text-amber-900">Convert to PDF</a> first.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-0">
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <FileKey size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 truncate max-w-[200px]">{file.name}</h3>
                    <p className="text-xs text-slate-500">Ready to secure</p>
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
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Set Master Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a strong password"
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
                      <p className="text-xs text-slate-400">Warning: If you lose this password, the file cannot be recovered.</p>
                    </div>

                    <button
                      onClick={handleProtect}
                      disabled={!password || isProcessing}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                      {isProcessing ? "Encrypting Document..." : "Protect PDF Now"}
                    </button>
                  </>
                ) : (
                  <div className="text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">PDF Secured Successfully!</h2>
                    <p className="text-slate-500 mb-8">Your file is now encrypted with your password.</p>

                    <div className="flex flex-col gap-3">
                      <a
                        href={downloadUrl}
                        download={downloadName}
                        className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-transform hover:-translate-y-1"
                      >
                        <Download size={20} /> Download Protected File
                      </a>
                      <button
                        onClick={handleReset}
                        className="w-full py-3.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                      >
                        Encrypt Another File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <article className="max-w-4xl mx-auto space-y-16">
          {/* Features Grid */}
          <section className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Client-Side Security", desc: "Your sensitive data never leaves your browser. Encryption happens locally on your device." },
              { icon: Unlock, title: "Instant Protection", desc: "No registration or waiting. Simply upload, set a password, and lock your file instantly." },
              { icon: Globe, title: "Universal Compatibility", desc: "Our standardized encryption works with Adobe Reader, Chrome, and all major PDF viewers." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex p-3 bg-slate-50 text-indigo-600 rounded-xl mb-4">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </section>

          {/* How-To Guide */}
          <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Cpu size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">How to Password Protect a PDF Online?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full">1</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Upload Your Document</h3>
                    <p className="text-slate-600">Select the PDF file you want to secure from your computer or mobile device.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full">2</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Create a Password</h3>
                    <p className="text-slate-600">Enter a strong, memorable password. This will be required to open or edit the file.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full">3</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Download & Share</h3>
                    <p className="text-slate-600">Click "Protect PDF" and instantly download your encrypted file.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-600" />
                  Why is this tool safe?
                </h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  Unlike other online tools, <strong>we do not upload your files to any server</strong>. All encryption processing happens directly in your browser using WebAssembly technology.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  This means your bank statements, legal contracts, and personal data remain 100% private and on your device.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section (matches structured data) */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-600">Common questions about PDF encryption</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {faqItems.map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-2">
                    <HelpCircle size={18} className="text-indigo-500 mt-1 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-600 ml-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  );
};

export default ProtectTool;
