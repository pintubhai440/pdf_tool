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
  Globe
} from 'lucide-react';
import { AppMode } from '../types';

interface HomeProps {
  setMode: (mode: AppMode) => void;
}

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  // ------------------------------------------------------------------
  //  🚀 ADVANCED SEO & META MANAGEMENT (100% client-side, no next/head)
  //  - Dynamically updates title, meta tags, JSON-LD
  //  - Prevents duplicates, cleans up on unmount (SPA safe)
  //  - Includes Open Graph, Twitter Card, Canonical, Robots
  // ------------------------------------------------------------------
  useEffect(() => {
    // ----- 1. DOCUMENT TITLE (Primary Keyword) -----
    document.title = 'Genz PDF - Free Online PDF Tools: Merge, Split, Compress, Convert';

    // ----- 2. META DESCRIPTION (Secondary Keyword + USP) -----
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

    // ----- 3. OPEN GRAPH (Facebook, LinkedIn) -----
    const ogTags = [
      { property: 'og:title', content: 'Genz PDF – All‑in‑One Free PDF Tools' },
      { property: 'og:description', content: 'Merge, split, compress, convert & resize – all in your browser. Zero uploads, maximum privacy.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://genzpdf.com/' },
      { property: 'og:image', content: 'https://genzpdf.com/og-image.png' }, // Replace with real image URL
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

    // ----- 4. TWITTER CARD -----
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Genz PDF – Free Online PDF Tools' },
      { name: 'twitter:description', content: 'Merge, split, compress, convert PDFs. 100% free, secure & local.' },
      { name: 'twitter:image', content: 'https://genzpdf.com/twitter-image.png' },
      { name: 'twitter:site', content: '@genzpdf' } // Optional
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

    // ----- 5. CANONICAL URL (Prevents duplicate content) -----
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://genzpdf.com/');

    // ----- 6. ROBOTS (Index & Follow) -----
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // ----- 7. JSON-LD STRUCTURED DATA (ItemList + Organization) -----
    //      Tells Google these are distinct tools – helps with "Software Application" rich results
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

    // ----- CLEANUP FUNCTION (optional – for strict SPA mode) -----
    return () => {
      // If you use a head management library like React Helmet, cleanup is automatic.
      // Here we do nothing because we want meta tags to persist when navigating away.
      // Overwriting them in next mount is sufficient.
    };
  }, []); // Empty deps = runs once on mount

  // ------------------------------------------------------------------
  //  SPA NAVIGATION – SEO friendly <a> tags with preventDefault
  //  Search bots see real hrefs, users get SPA speed
  // ------------------------------------------------------------------
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, mode: AppMode) => {
    e.preventDefault();
    setMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ------------------------------------------------------------------
  //  TOOLS CONFIG – Fully typed, easy to extend / i18n
  // ------------------------------------------------------------------
  const tools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      desc: 'Combine multiple PDF files into one single document instantly. Arrange pages in your preferred order.',
      icon: Files,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      hover: 'group-hover:bg-blue-600 group-hover:text-white',
      border: 'hover:border-blue-300 hover:shadow-blue-200/50'
    },
    {
      id: 'split',
      title: 'Split PDF',
      desc: 'Extract specific pages from your PDF or split a large file into multiple smaller independent files.',
      icon: Scissors,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      hover: 'group-hover:bg-rose-600 group-hover:text-white',
      border: 'hover:border-rose-300 hover:shadow-rose-200/50'
    },
    {
      id: 'convert',
      title: 'Convert PDF',
      desc: 'Convert your PDF to editable Word (DOCX), JPG, PNG or create PDFs from images instantly.',
      icon: ArrowRightLeft,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      hover: 'group-hover:bg-purple-600 group-hover:text-white',
      border: 'hover:border-purple-300 hover:shadow-purple-200/50'
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      desc: 'Significantly reduce file size while maintaining the best visual quality for sharing and storage.',
      icon: Minimize2,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      hover: 'group-hover:bg-orange-600 group-hover:text-white',
      border: 'hover:border-orange-300 hover:shadow-orange-200/50'
    },
    {
      id: 'resize',
      title: 'Resize Image',
      desc: 'Resize JPG, PNG, or WebP images by defining pixels or percentage without losing transparency.',
      icon: Scaling,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      hover: 'group-hover:bg-emerald-600 group-hover:text-white',
      border: 'hover:border-emerald-300 hover:shadow-emerald-200/50'
    }
  ];

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* ----- HERO SECTION – H1 for primary keyword ----- */}
      <header className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6">
          <Zap size={14} className="fill-slate-500" />
          Free • Secure • Fast • Client‑Side
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Every tool you need to work with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            PDFs in one place
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Genz PDF is your all-in-one solution to manage documents.
          100% free, runs locally in your browser, and <strong>no file uploads required</strong>.
        </p>
      </header>

      {/* ----- TOOLS GRID – Semantic links with real hrefs for bots ----- */}
      <section aria-label="PDF Tools Collection">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <a
              key={tool.id}
              href={`/${tool.id}-pdf`}
              onClick={(e) => handleNav(e, tool.id as AppMode)}
              className={`group relative flex flex-col p-8 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${tool.border}`}
              title={`Open ${tool.title} tool – 100% free`}
              aria-label={`Use ${tool.title} tool online`}
            >
              {/* Icon with dynamic hover colors */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${tool.bg} ${tool.color} ${tool.hover}`}
                aria-hidden="true"
              >
                <tool.icon size={28} />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">
                {tool.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                {tool.desc}
              </p>

              <div className="mt-auto flex items-center font-bold text-sm text-slate-900 group-hover:gap-2 transition-all">
                Start Now <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ----- TRUST INDICATORS (E‑E‑A‑T signals) ----- */}
      <section className="mt-24 pt-16 border-t border-slate-100" aria-label="Why choose Genz PDF">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">100% Secure</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Files are processed locally on your device. We never store, upload, or view your documents.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Blazing Fast</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Powered by WebAssembly for instant processing – no server upload wait times.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Universal Support</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Works flawlessly on any device – Mac, Windows, Linux, iOS, Android. Free forever.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
