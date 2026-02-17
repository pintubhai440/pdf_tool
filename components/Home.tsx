// components/Home.tsx
import React, { useEffect } from 'react';
import {
  Files,
  Scissors,
  ArrowRightLeft,
  Minimize2,
  Scaling,
  Lock,             // ✅ Protect PDF Icon
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  CheckCircle2
} from 'lucide-react';
import { AppMode } from '../types';

interface HomeProps {
  setMode: (mode: AppMode) => void;
}

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  // ------------------------------------------------------------------
  //  🚀 MASTER SEO CONFIGURATION (Google #1 Ranking Logic)
  // ------------------------------------------------------------------
  useEffect(() => {
    // 1. Dynamic Title (Targeting High Volume Keywords)
    document.title = 'Genz PDF - Free Online PDF Tools: Merge, Split, Compress, Convert & Protect';

    // 2. Meta Description (Optimized for CTR)
    const metaDescContent = 'The #1 free online PDF suite. Merge PDF, Split PDF, Compress PDF, Convert to Word/JPG, Resize Images, and Password Protect PDF. 100% secure, client-side, no uploads required. Bank-grade encryption.';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', metaDescContent);

    // 3. Keywords Meta (For Bing/Yahoo & Internal indexing)
    const keywordsContent = 'protect pdf, encrypt pdf, password protect pdf, lock pdf, merge pdf, split pdf, compress pdf, pdf converter, resize image, free pdf tools, client-side pdf editor';
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywordsContent);

    // 4. Open Graph Tags (Facebook/LinkedIn/WhatsApp)
    const upsertMeta = (prop: string, content: string) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertMeta('og:title', 'Genz PDF – Secure & Free PDF Tools (Merge, Split, Protect, Resize)');
    upsertMeta('og:description', 'Encrypt and protect your PDFs instantly. Merge, split, compress, resize images & convert files in your browser. Zero uploads, 100% privacy.');
    upsertMeta('og:type', 'website');
    upsertMeta('og:url', 'https://genzpdf.com/');
    upsertMeta('og:image', 'https://genzpdf.com/og-image.png');
    upsertMeta('og:site_name', 'Genz PDF');

    // 5. Twitter Card Tags
    const upsertNameMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertNameMeta('twitter:card', 'summary_large_image');
    upsertNameMeta('twitter:title', 'Genz PDF – Protect & Edit PDFs Free');
    upsertNameMeta('twitter:description', 'Add passwords to PDF, merge, split, compress, resize images and convert files securely online.');
    upsertNameMeta('twitter:image', 'https://genzpdf.com/twitter-image.png');
    upsertNameMeta('twitter:site', '@genzpdf');

    // 6. Canonical URL (Prevents Duplicate Content Penalty)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://genzpdf.com/');

    // 7. Robots Meta
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 8. JSON-LD Structured Data (The "Secret Sauce" for Rich Snippets)
    const scriptId = 'json-ld-home';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "Genz PDF Tools",
          "url": "https://genzpdf.com",
          "applicationCategory": "Productivity",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": "Merge PDF, Split PDF, Compress PDF, Convert PDF, Resize Image, Protect PDF"
        },
        {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Protect PDF", // 🏆 Priority Item
              "url": "https://genzpdf.com/protect-pdf",
              "description": "Encrypt PDF with password. AES-256 bit encryption for maximum security."
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Merge PDF",
              "url": "https://genzpdf.com/merge-pdf",
              "description": "Combine multiple PDFs into one file instantly. Arrange pages via drag & drop."
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Split PDF",
              "url": "https://genzpdf.com/split-pdf",
              "description": "Extract specific pages or split large PDF files into smaller documents."
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "Convert PDF",
              "url": "https://genzpdf.com/convert-pdf",
              "description": "Convert PDF to Word (DOCX), JPG, PNG, or create PDF from images seamlessly."
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": "Compress PDF",
              "url": "https://genzpdf.com/compress-pdf",
              "description": "Reduce PDF file size up to 90% without quality loss, ideal for email & web."
            },
            {
              "@type": "ListItem",
              "position": 6,
              "name": "Resize Image",
              "url": "https://genzpdf.com/resize-pdf",
              "description": "Resize JPG, PNG, WebP images by pixels or percentage – keeps transparency."
            }
          ]
        },
        {
          "@type": "Organization",
          "name": "Genz PDF",
          "url": "https://genzpdf.com",
          "logo": "https://genzpdf.com/logo.png",
          "sameAs": [
            "https://twitter.com/genzpdf",
            "https://facebook.com/genzpdf"
          ]
        }
      ]
    };
    scriptTag.textContent = JSON.stringify(schema);

  }, []); // Empty deps = runs once on mount

  // ------------------------------------------------------------------
  //  TOOLS DATA (Enhanced for UI & Engagement)
  // ------------------------------------------------------------------
  const tools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      desc: 'Combine multiple files into one document. Drag & drop reordering.',
      icon: Files,
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      shadow: 'hover:shadow-blue-500/20',
      border: 'hover:border-blue-500/50',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'split',
      title: 'Split PDF',
      desc: 'Separate pages or extract specific ranges into independent files.',
      icon: Scissors,
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
      shadow: 'hover:shadow-rose-500/20',
      border: 'hover:border-rose-500/50',
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      desc: 'Shrink file size up to 90% while preserving visual quality.',
      icon: Minimize2,
      iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
      shadow: 'hover:shadow-orange-500/20',
      border: 'hover:border-orange-500/50',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'convert',
      title: 'Convert PDF',
      desc: 'Transform PDFs to Word, JPG, PNG or create PDFs from images.',
      icon: ArrowRightLeft,
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
      shadow: 'hover:shadow-violet-500/20',
      border: 'hover:border-violet-500/50',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      id: 'resize',
      title: 'Resize Image',
      desc: 'Resize JPG, PNG, or WebP images by pixel or percentage.',
      icon: Scaling,
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      shadow: 'hover:shadow-emerald-500/20',
      border: 'hover:border-emerald-500/50',
      gradient: 'from-emerald-500 to-green-600'
    },
    // 🔐 PROTECT PDF TOOL (Highlighted)
    {
      id: 'protect',
      title: 'Protect PDF',
      desc: 'Encrypt your PDF with a password. Secure sensitive data instantly.',
      icon: Lock,
      iconBg: 'bg-gradient-to-br from-indigo-600 to-fuchsia-600',
      shadow: 'hover:shadow-indigo-500/30',
      border: 'hover:border-indigo-500/50',
      gradient: 'from-indigo-600 to-fuchsia-600',
      badge: 'New' // ✨ Special Badge
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-50">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.4 }}></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* HERO SECTION */}
        <header className="text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm backdrop-blur-md text-slate-600 text-xs font-bold uppercase tracking-widest mb-8 hover:scale-105 transition-transform cursor-default">
             <Star size={14} className="fill-yellow-400 text-yellow-400" />
             Trusted by 10,000+ Users
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Master your Documents <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 drop-shadow-sm">
              Without Limits.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Merge, Split, Compress, Convert, Resize, and <span className="text-indigo-600 font-bold">Protect</span> your documents. 
            Everything happens in your browser—files never leave your device.
          </p>
        </header>

        {/* TOOLS GRID */}
        <section aria-label="PDF Tools Collection" className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tools.map((tool, idx) => (
              <a
                key={tool.id}
                href={`/${tool.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMode(tool.id as AppMode);
                  window.history.pushState({}, '', `/${tool.id}`);
                }}
                className={`
                  group relative flex flex-col p-8 rounded-3xl 
                  bg-white/80 backdrop-blur-xl border border-slate-200/60
                  transition-all duration-300 ease-out overflow-hidden
                  hover:-translate-y-2 hover:bg-white hover:shadow-2xl
                  ${tool.shadow} ${tool.border}
                `}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Top Gradient Line */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${tool.gradient} rounded-t-3xl`}></div>
                
                {/* Badge (e.g. for Protect Tool) */}
                {tool.badge && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {tool.badge}
                  </div>
                )}

                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg text-white ${tool.iconBg} transform group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon size={32} strokeWidth={2} />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {tool.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-medium">
                  {tool.desc}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 group-hover:border-slate-200 transition-colors">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Launch Tool</span>
                  <div className="p-2 rounded-full bg-slate-50 group-hover:bg-indigo-600 transition-colors duration-300">
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* TRUST INDICATORS */}
        <section className="relative py-16 bg-white/60 backdrop-blur-md rounded-[3rem] border border-slate-200/60 mb-16 text-center shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto px-6">
            <div className="flex flex-col items-center gap-4 group">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">100% Secure</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Local processing via WebAssembly. Your files never touch our servers.</p>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Blazing Fast</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Optimized algorithms merge, split, and convert files in milliseconds.</p>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Universal</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Works on Chrome, Safari, Edge across Mac, Windows, and Mobile.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
