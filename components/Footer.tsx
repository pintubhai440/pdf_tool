import React from 'react';
import { AppMode } from '../types';
import { Linkedin, Heart, ShieldCheck, ArrowUpRight, Globe } from 'lucide-react';

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
      {/* ✅ JSON-LD STRUCTURED DATA – Organization & Persons (detailed) */}
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
              "sameAs": ["https://www.linkedin.com/company/genzpdf"],
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
        className="relative bg-slate-50/50 border-t border-slate-200 mt-auto overflow-hidden"
        role="contentinfo"
        itemScope
        itemType="https://schema.org/WPFooter"
      >
        {/* ✨ Subtle tech grid background */}
        <div
          className="absolute inset-0 z-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-0"></div>

        {/* ✨ Vibrant top gradient line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* ==================== MAIN GRID (5-4-3) ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* ---------- BRAND COLUMN (span 5) – Organization Microdata ---------- */}
            <div
              className="md:col-span-5 space-y-6"
              itemScope
              itemType="https://schema.org/Organization"
              itemID="#organization"
            >
              <a
                href="/"
                onClick={(e) => handleNav(e, 'home')}
                className="inline-flex items-center gap-3 group"
                aria-label="Genz PDF – Home"
                itemProp="url"
              >
                <meta itemProp="name" content="Genz PDF" />
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src="/logo.png"
                    alt="Genz PDF – Free Online PDF Editor"
                    width={56}
                    height={56}
                    className="relative w-14 h-14 object-contain bg-white rounded-xl shadow-sm border border-slate-100 p-1 transition-transform duration-300 group-hover:-translate-y-1"
                    itemProp="logo"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                    Genz PDF
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mt-1">
                    Professional Tools
                  </span>
                </div>
              </a>

              <p
                className="text-slate-500 text-sm leading-relaxed max-w-md font-medium"
                itemProp="description"
              >
                The ultimate <strong className="text-slate-700 font-semibold">Free Online PDF Tool</strong>.
                Securely Merge, Split, Convert, and Compress PDF documents directly in your browser.
                <span className="block mt-2 text-slate-400">
                  No servers. No uploads. No limits.
                </span>
              </p>

              {/* Trust badges – SSL, Privacy, Client‑Side */}
              <div className="flex flex-wrap gap-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-700 uppercase tracking-wide"
                  itemProp="award"
                >
                  <ShieldCheck size={14} aria-hidden="true" /> SSL Secure
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold text-blue-700 uppercase tracking-wide"
                  itemProp="award"
                >
                  <ShieldCheck size={14} aria-hidden="true" /> Privacy First
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-700 uppercase tracking-wide">
                  <Globe size={14} aria-hidden="true" /> Client‑Side
                </span>
              </div>
            </div>

            {/* ---------- PRODUCT LINKS (span 4) – with microdata ---------- */}
            <nav
              className="md:col-span-4"
              aria-labelledby="footer-tools-heading"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              <h4
                id="footer-tools-heading"
                className="text-xs font-extrabold text-slate-900 uppercase tracking-[0.2em] mb-6"
              >
                Utilities
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'merge', label: 'Merge PDF', position: 1, url: '/merge-pdf' },
                  { id: 'split', label: 'Split PDF', position: 2, url: '/split-pdf' },
                  { id: 'convert', label: 'Convert PDF', position: 3, url: '/convert-pdf' },
                  { id: 'compress', label: 'Compress PDF', position: 4, url: '/compress-pdf' },
                  { id: 'resize', label: 'Resize PDF', position: 5, url: '/resize-pdf' },
                ].map((item) => (
                  <li
                    key={item.id}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <a
                      href={item.url}
                      onClick={(e) => handleNav(e, item.id as AppMode)}
                      className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-300"
                      title={`Free tool to ${item.label.toLowerCase()}`}
                      itemProp="url"
                    >
                      <span
                        className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors"
                        itemProp="name"
                      >
                        {item.label}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                        aria-hidden="true"
                      />
                    </a>
                    <meta itemProp="position" content={String(item.position)} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---------- COMPANY LINKS (span 3) – with microdata ---------- */}
            <nav
              className="md:col-span-3"
              aria-labelledby="footer-company-heading"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              <h4
                id="footer-company-heading"
                className="text-xs font-extrabold text-slate-900 uppercase tracking-[0.2em] mb-6"
              >
                Company
              </h4>
              <ul className="space-y-2">
                {[
                  { id: 'about', label: 'About Us', position: 1, url: '/about' },
                  { id: 'contact', label: 'Contact Support', position: 2, url: '/contact' },
                  { id: 'policy', label: 'Privacy Policy', position: 3, url: '/policy' },
                  { id: 'terms', label: 'Terms of Service', position: 4, url: '/terms' },
                ].map((item) => (
                  <li
                    key={item.id}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <a
                      href={item.url}
                      onClick={(e) => handleNav(e, item.id as AppMode)}
                      className="inline-block text-sm text-slate-500 hover:text-slate-900 font-medium hover:translate-x-1 transition-transform duration-300"
                      itemProp="url"
                    >
                      <span itemProp="name">{item.label}</span>
                    </a>
                    <meta itemProp="position" content={String(item.position)} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ==================== BOTTOM BAR – Copyright + India + Developers ==================== */}
          <div className="pt-8 border-t border-slate-200 flex flex-col xl:flex-row justify-between items-center gap-6">
            {/* ---------- Copyright (with subtle ping dot) ---------- */}
            <div className="order-3 xl:order-1 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e293b] border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 cursor-default group">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <p className="text-slate-300 text-[11px] font-bold tracking-widest uppercase group-hover:text-white transition-colors">
                © {new Date().getFullYear()} Genz PDF.
              </p>
            </div>

            {/* ---------- Made in India badge (Country microdata) ---------- */}
            <div className="order-1 xl:order-2">
              <div
                className="relative group cursor-default"
                itemScope
                itemType="https://schema.org/Country"
                itemID="https://en.wikipedia.org/wiki/India"
              >
                <meta itemProp="name" content="India" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Made with
                  </span>
                  <Heart
                    size={14}
                    className="text-red-500 fill-red-500 animate-pulse"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    in
                  </span>
                  <span className="text-xs font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-slate-500 to-green-600">
                    INDIA
                  </span>
                </div>
              </div>
            </div>

            {/* ---------- Developer profiles (Person microdata) ---------- */}
            <div className="order-2 xl:order-3 flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Built by
              </span>

              <div className="flex -space-x-2 hover:space-x-1 transition-all duration-300">
                {/* Pintu Chauhan */}
                <a
                  href="https://www.linkedin.com/in/pintu-chauhan-ctuap/"
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="relative flex items-center gap-2 pl-3 pr-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-full border-2 border-white shadow-md transition-colors duration-300 z-10"
                  aria-label="LinkedIn Profile of Pintu Chauhan – Lead Developer"
                  itemProp="sameAs"
                  itemScope
                  itemType="https://schema.org/Person"
                  itemID="#pintu"
                >
                  <meta itemProp="name" content="Pintu Chauhan" />
                  <Linkedin size={12} className="fill-white" aria-hidden="true" />
                  <span className="text-[10px] font-bold tracking-wide" itemProp="givenName">
                    Pintu
                  </span>
                </a>

                {/* Raushan Kumar */}
                <a
                  href="https://www.linkedin.com/in/raushan-kumar-0b5340373/"
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="relative flex items-center gap-2 pl-3 pr-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-full border-2 border-white shadow-md transition-colors duration-300 z-0"
                  aria-label="LinkedIn Profile of Raushan Kumar – Co-Developer"
                  itemProp="sameAs"
                  itemScope
                  itemType="https://schema.org/Person"
                  itemID="#raushan"
                >
                  <meta itemProp="name" content="Raushan Kumar" />
                  <Linkedin size={12} className="fill-white" aria-hidden="true" />
                  <span className="text-[10px] font-bold tracking-wide" itemProp="givenName">
                    Raushan
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
