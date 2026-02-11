import React from 'react';
import { AppMode } from '../types';
import { Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  setMode: (mode: AppMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ setMode }) => {
  
  // Helper function for navigation (Changes mode & scrolls up)
  const handleNav = (mode: AppMode) => {
    setMode(mode); 
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto relative overflow-hidden">
      {/* Decorative Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ==================== TOP SECTION: Links & Brand ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <button 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity text-left group"
            >
              {/* Custom Logo Image */}
              <img 
                src="/logo.png" 
                alt="Genz PDF Logo" 
                className="w-12 h-12 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 bg-white" 
              />
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Genz PDF
              </span>
            </button>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Your all-in-one solution for PDF management. Secure, fast, and completely free tools to Merge, Split, Convert, and Optimize documents with AI power.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest">Product</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              {['merge', 'split', 'convert', 'compress', 'resize'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => handleNav(item as AppMode)} 
                    className="hover:text-primary-600 transition-colors text-left capitalize flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-600 transition-colors"></span>
                    {item} PDF
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              {['about', 'contact', 'policy', 'terms'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => handleNav(item as AppMode)} 
                    className="hover:text-primary-600 transition-colors text-left capitalize flex items-center gap-2 group font-medium"
                  >
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-600 transition-colors"></span>
                    {item === 'policy' ? 'Privacy Policy' : item === 'terms' ? 'Terms & Conditions' : item + ' Us'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-slate-100 my-10"></div>

        {/* ==================== BOTTOM BAR: PRO LAYOUT ==================== */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-8 text-center xl:text-left">
          
          {/* 1. COPYRIGHT SECTION (Dark Pill Design with Green Dot) */}
          <div className="order-3 xl:order-1 min-w-[240px] flex justify-center xl:justify-start">
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e293b] border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 cursor-default group">
                {/* Glowing Green Dot */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                {/* Text */}
                <p className="text-slate-300 text-[11px] font-bold tracking-widest uppercase group-hover:text-white transition-colors">
                  © {new Date().getFullYear()} Genz PDF. All rights reserved.
                </p>
             </div>
          </div>

          {/* 2. MADE IN INDIA BADGE (Center - Premium Dark & Tricolor) */}
          <div className="order-1 xl:order-2 animate-in fade-in zoom-in duration-700">
            <div className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0f172a] border border-slate-800 shadow-2xl shadow-slate-200 hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 cursor-default select-none hover:-translate-y-1">
              
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                Developed with
              </span>
              
              {/* Beating Heart with Red Glow */}
              <Heart 
                size={20} 
                className="text-red-500 fill-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" 
              />
              
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                in
              </span>
              
              {/* Tricolor Gradient Text for INDIA */}
              <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] drop-shadow-sm">
                INDIA
              </span>
            </div>
          </div>

          {/* 3. DEVELOPERS SECTION (Right - Dark Buttons turning Blue) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 order-2 xl:order-3 min-w-[240px] justify-end">
             
             {/* 'Developed by' Label */}
             <div className="px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-full shadow-sm">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
                  Developed by
                </span>
             </div>
             
             <div className="flex items-center gap-3">
                {/* Pintu's Link - Black to Blue on Hover */}
                <a 
                  href="https://www.linkedin.com/in/pintu-chauhan-ctuap/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1e293b] text-slate-300 border border-slate-700 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-wide">Pintu</span>
                </a>

                {/* Raushan's Link - Black to Blue on Hover */}
                <a 
                  href="https://www.linkedin.com/in/raushan-kumar-0b5340373/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1e293b] text-slate-300 border border-slate-700 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 group shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold tracking-wide">Raushan</span>
                </a>
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
