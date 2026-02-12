import React from 'react';
import { AppMode } from '../types';
import { Linkedin, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setMode: (mode: AppMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ setMode }) => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, mode: AppMode) => {
    e.preventDefault();
    setMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ✅ JSON-LD STRUCTURED DATA – ORGANIZATION + PERSONS */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://genzpdf.com/#organization",
              "name": "Genz PDF",
              "url": "https://genzpdf.com",
              "logo": "https://genzpdf.com/logo.png",
              "description": "The ultimate Free Online PDF Tool. Securely Merge, Split, Convert, and Compress PDF documents directly in your browser. No sign-up required.",
              "sameAs": [
                "https://www.linkedin.com/company/genzpdf"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            },
            {
              "@type": "Person",
              "@id": "https://genzpdf.com/#pintu",
              "name": "Pintu Chauhan",
              "sameAs": "https://www.linkedin.com/in/pintu-chauhan-ctuap/"
            },
            {
              "@type": "Person",
              "@id": "https://genzpdf.com/#raushan",
              "name": "Raushan Kumar",
              "sameAs": "https://www.linkedin.com/in/raushan-kumar-0b5340373/"
            }
          ]
        })}
      </script>

      <footer
        className="bg-white border-t border-slate-200 mt-auto relative overflow-hidden"
        role="contentinfo"
        itemScope
        itemType="https://schema.org/WPFooter"
      >
        {/* Decorative Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" aria-hidden="true"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* ==================== TOP SECTION: BRAND + NAVIGATION ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            
            {/* ---------- BRAND COLUMN – Organization Microdata ---------- */}
            <div
              className="col-span-1 md:col-span-2"
              itemScope
              itemType="https://schema.org/Organization"
              itemID="#organization" // references the JSON-LD @id
            >
              <a
                href="/"
                onClick={(e) => handleNav(e, 'home')}
                className="flex items-center gap-3 mb-6 hover:opacity-90 transition-opacity text-left group w-fit"
                aria-label="Genz PDF – Home"
                itemProp="url"
              >
                <meta itemProp="name" content="Genz PDF" />
                <img
                  src="/logo.png"
                  alt="Genz PDF – Free Online PDF Editor"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 bg-white"
                  itemProp="logo"
                />
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                  Genz PDF
                </span>
              </a>
              <p
                className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium"
                itemProp="description"
              >
                The ultimate <strong className="text-slate-700 font-semibold">Free Online PDF Tool</strong>. Securely Merge, Split, Convert, and Compress PDF documents directly in your browser. No sign-up required.
              </p>
              
              {/* Trust Signals – now with microdata for awards/trust */}
              <div className="mt-6 flex items-center gap-4 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1" itemProp="award">
                  <ShieldCheck size={14} className="text-green-500" aria-hidden="true" /> SSL Secure
                </span>
                <span className="flex items-center gap-1" itemProp="award">
                  <ShieldCheck size={14} className="text-blue-500" aria-hidden="true" /> Privacy First
                </span>
              </div>
            </div>

            {/* ---------- TOOLS NAVIGATION – ARIA + SEMANTIC HEADINGS ---------- */}
            <nav
              aria-labelledby="footer-tools-heading"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              <h3
                id="footer-tools-heading"
                className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest border-b border-slate-100 pb-2 w-fit"
              >
                Tools
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  { id: 'merge', label: 'Merge PDF Files', url: '/merge-pdf' },
                  { id: 'split', label: 'Split PDF Pages', url: '/split-pdf' },
                  { id: 'convert', label: 'Convert to PDF', url: '/convert-pdf' },
                  { id: 'compress', label: 'Compress PDF Size', url: '/compress-pdf' },
                  { id: 'resize', label: 'Resize PDF', url: '/resize-pdf' }
                ].map((item) => (
                  <li key={item.id} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <a
                      href={item.url}
                      onClick={(e) => handleNav(e, item.id as AppMode)}
                      className="hover:text-primary-600 transition-colors flex items-center gap-2 group font-medium"
                      title={`Free tool to ${item.label.toLowerCase()}`}
                      itemProp="url"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-600 transition-colors" aria-hidden="true"></span>
                      <span itemProp="name">{item.label}</span>
                    </a>
                    <meta itemProp="position" content={String(item.id === 'merge' ? 1 : item.id === 'split' ? 2 : item.id === 'convert' ? 3 : item.id === 'compress' ? 4 : 5)} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---------- COMPANY NAVIGATION – ARIA + SEMANTIC HEADINGS ---------- */}
            <nav
              aria-labelledby="footer-company-heading"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              <h3
                id="footer-company-heading"
                className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest border-b border-slate-100 pb-2 w-fit"
              >
                Company
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  { id: 'about', label: 'About Us', url: '/about' },
                  { id: 'contact', label: 'Contact Support', url: '/contact' },
                  { id: 'policy', label: 'Privacy Policy', url: '/policy' },
                  { id: 'terms', label: 'Terms of Service', url: '/terms' }
                ].map((item) => (
                  <li key={item.id} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <a
                      href={item.url}
                      onClick={(e) => handleNav(e, item.id as AppMode)}
                      className="hover:text-primary-600 transition-colors flex items-center gap-2 group font-medium"
                      itemProp="url"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-600 transition-colors" aria-hidden="true"></span>
                      <span itemProp="name">{item.label}</span>
                    </a>
                    <meta itemProp="position" content={String(item.id === 'about' ? 1 : item.id === 'contact' ? 2 : item.id === 'policy' ? 3 : 4)} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Separator */}
          <div className="border-t border-slate-100 my-10" aria-hidden="true"></div>

          {/* ==================== BOTTOM BAR: PRO LAYOUT WITH PERSON SCHEMA ==================== */}
          <div className="flex flex-col xl:flex-row justify-between items-center gap-8 text-center xl:text-left">
            
            {/* 1. COPYRIGHT SECTION */}
            <div className="order-3 xl:order-1 min-w-[240px] flex justify-center xl:justify-start">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e293b] border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 cursor-default group">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <p className="text-slate-300 text-[11px] font-bold tracking-widest uppercase group-hover:text-white transition-colors">
                  © {new Date().getFullYear()} Genz PDF.
                </p>
              </div>
            </div>

            {/* 2. MADE IN INDIA BADGE – now with country microdata */}
            <div className="order-1 xl:order-2 animate-in fade-in zoom-in duration-700">
              <div
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0f172a] border border-slate-800 shadow-2xl shadow-slate-200 hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 cursor-default select-none hover:-translate-y-1"
                title="Proudly Developed in India"
                itemScope
                itemType="https://schema.org/Country"
                itemID="https://en.wikipedia.org/wiki/India"
              >
                <meta itemProp="name" content="India" />
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                  Developed with
                </span>
                <Heart
                  size={20}
                  className="text-red-500 fill-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                  aria-hidden="true"
                />
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                  in
                </span>
                <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] drop-shadow-sm">
                  INDIA
                </span>
              </div>
            </div>

            {/* 3. DEVELOPERS SECTION – Person schema + rel="author" */}
            <div className="flex flex-col sm:flex-row items-center gap-4 order-2 xl:order-3 min-w-[240px] justify-end">
              <div className="px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-full shadow-sm">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
                  Developed by
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Pintu Chauhan – Person Microdata */}
                <a
                  href="https://www.linkedin.com/in/pintu-chauhan-ctuap/"
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1e293b] text-slate-300 border border-slate-700 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                  aria-label="LinkedIn Profile of Pintu Chauhan – Lead Developer"
                  itemProp="sameAs"
                  itemScope
                  itemType="https://schema.org/Person"
                  itemID="#pintu"
                >
                  <meta itemProp="name" content="Pintu Chauhan" />
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-wide" itemProp="givenName">Pintu</span>
                </a>

                {/* Raushan Kumar – Person Microdata */}
                <a
                  href="https://www.linkedin.com/in/raushan-kumar-0b5340373/"
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1e293b] text-slate-300 border border-slate-700 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                  aria-label="LinkedIn Profile of Raushan Kumar – Co-Developer"
                  itemProp="sameAs"
                  itemScope
                  itemType="https://schema.org/Person"
                  itemID="#raushan"
                >
                  <meta itemProp="name" content="Raushan Kumar" />
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-wide" itemProp="givenName">Raushan</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
