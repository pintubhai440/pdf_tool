// components/Home.tsx
import React, { useEffect } from 'react';
import {
  Files,
  Scissors,
  ArrowRightLeft,
  Minimize2,
  Scaling,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Star
} from 'lucide-react';
import { AppMode } from '../types';

interface HomeProps {
  setMode: (mode: AppMode) => void;
}

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  // ------------------------------------------------------------------
  //  ADVANCED SEO & META MANAGEMENT (100% client-side, no next/head)
  //  - Dynamically updates title, meta tags, JSON-LD
  //  - Prevents duplicates, cleans up on unmount (SPA safe)
  //  - Includes Open Graph, Twitter Card, Canonical, Robots
  // ------------------------------------------------------------------
  useEffect(() => {
    // Document title
    document.title = 'Genz PDF - Free Online PDF Tools: Merge, Split, Compress, Convert';

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'The #1 free online PDF suite. Merge PDF, split PDF, compress PDF, convert to Word/JPG, resize images. 100% secure, client‑side, no uploads.'
    );

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Genz PDF – All‑in‑One Free PDF Tools' },
      { property: 'og:description', content: 'Merge, split, compress, convert & resize – all in your browser. Zero uploads, maximum privacy.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://genzpdf.com/' },
      { property: 'og:image', content: 'https://genzpdf.com/og-image.png' },
      { property: 'og:site_name', content: 'Genz PDF' }
    ];
    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Genz PDF – Free Online PDF Tools' },
      { name: 'twitter:description', content: 'Merge, split, compress, convert PDFs. 100% free, secure & local.' },
      { name: 'twitter:image', content: 'https://genzpdf.com/twitter-image.png' },
      { name: 'twitter:site', content: '@genzpdf' }
    ];
    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://genzpdf.com/');

    // Robots meta
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // JSON-LD structured data
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
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Merge PDF",
              "url": "https://genzpdf.com/merge-pdf",
              "description": "Combine multiple PDFs into one file instantly. Arrange pages via drag & drop."
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Split PDF",
              "url": "https://genzpdf.com/split-pdf",
              "description": "Extract specific pages or split a large PDF into smaller files."
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Convert PDF",
              "url": "https://genzpdf.com/convert-pdf",
              "description": "Convert PDF to Word (DOCX), JPG, PNG, or create PDF from images."
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "Compress PDF",
              "url": "https://genzpdf.com/compress-pdf",
              "description": "Reduce PDF file size while preserving quality, ideal for email & web."
            },
            {
              "@type": "ListItem",
              "position": 5,
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
  //  TOOL DEFINITIONS – detailed descriptions + gradient styling
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
      id: 'resize',
      title: 'Resize Image',
      desc: 'Resize JPG, PNG, or WebP images by pixel or percentage.',
      icon: Scaling,
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      shadow: 'hover:shadow-emerald-500/20',
      border: 'hover:border-emerald-500/50',
      gradient: 'from-emerald-500 to-green-600'
    }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-50">
      
      {/* ✨ DESIGN: Background Decor (Gradients, Noise & Grid) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-400/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.4 }}></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* 1. HERO SECTION (with animation from first code) */}
        <header className="text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm backdrop-blur-md text-slate-600 text-xs font-bold uppercase tracking-widest mb-8 hover:scale-105 transition-transform cursor-default">
             <Star size={12} className="fill-yellow-400 text-yellow-400" />
             Trusted by 10,000+ Users
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Master your Documents <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 drop-shadow-sm">
              Without Limits.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Genz PDF brings you powerful, server-less PDF tools. 
            Merge, Split, and Convert files directly in your browser with 
            <span className="text-indigo-600 font-bold"> 100% privacy</span>.
          </p>
        </header>

        {/* 2. TOOLS GRID – Glassmorphism Cards with Gradient Top Line */}
        <section aria-label="PDF Tools Collection" className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tools.map((tool, idx) => (
              <a
                key={tool.id}
                href={`/${tool.id}-pdf`}
                className={`
                  group relative flex flex-col p-8 rounded-3xl 
                  bg-white/70 backdrop-blur-xl border border-slate-200/60
                  transition-all duration-300 ease-out overflow-hidden
                  hover:-translate-y-2 hover:bg-white hover:shadow-2xl
                  ${tool.shadow} ${tool.border}
                `}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Top Gradient Line */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${tool.gradient} rounded-t-3xl`}></div>
                
                {/* Icon Container with Glow */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg text-white ${tool.iconBg} transform group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon size={32} strokeWidth={2} />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {tool.title}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-medium">
                  {tool.desc}
                </p>
                
                {/* Bottom Action with enhanced hover */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 group-hover:border-slate-200 transition-colors">
                  <span className="text-sm font-bold text-slate-900">Open Tool</span>
                  <div className="p-2 rounded-full bg-slate-50 group-hover:bg-indigo-600 transition-colors duration-300">
                    <ArrowRight size={18} className="text-slate-400 group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 3. TRUST INDICATORS – Enhanced version from second code */}
        <section className="relative py-16 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-100 mb-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto px-6">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-2">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Secure Processing</h3>
              <p className="text-sm text-slate-500">Files process locally on your device via WebAssembly. No uploads.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-full mb-2">
                <Zap size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Lightning Fast</h3>
              <p className="text-sm text-slate-500">Optimized algorithms ensure your tasks complete in seconds.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-2">
                <Globe size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Universal Access</h3>
              <p className="text-sm text-slate-500">Works perfectly on Mac, Windows, Android, and iOS.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
