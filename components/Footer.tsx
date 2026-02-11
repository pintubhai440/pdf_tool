import React from 'react';
import { AppMode } from '../types';
import { Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  setMode: (mode: AppMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ setMode }) => {
  
  const handleNav = (mode: AppMode) => {
    setMode(mode); 
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Bottom Bar: Layout adjusted for Pro Look */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-8 text-center xl:text-left">
          
          {/* 1. Copyright (Left) */}
          <p className="text-slate-400 text-sm font-medium order-3 xl:order-1 min-w-[200px]">
            © {new Date().getFullYear()} Genz PDF. All rights reserved.
          </p>

          {/* 2. PRO "Made in India" Badge (Center - Dark & Big) */}
          <div className="order-1 xl:order-2 animate-in fade-in zoom-in duration-700">
            <div className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0f172a] border border-slate-800 shadow-2xl shadow-slate-200 hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 cursor-default select-none hover:-translate-y-1">
              
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                Developed with
              </span>
              
              {/* Beating Heart with Glow */}
              <Heart 
                size={20} 
                className="text-red-500 fill-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" 
              />
              
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                in
              </span>
              
              {/* Tricolor Gradient Text for INDIA with White for contrast */}
              <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] drop-shadow-sm">
                INDIA
              </span>
            </div>
          </div>

          {/* 3. Developers (Right - Highlighted) */}
          <div className="flex flex-wrap items-center justify-center gap-4 order-2 xl:order-3 min-w-[200px]">
             
             {/* Highlighted "Developed By" Badge */}
             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-[10px] uppercase font-extrabold text-indigo-700 tracking-widest">
                  Developed by
                </span>
             </div>
             
             <div className="flex items-center gap-2">
                {/* Pintu's Link */}
                <a 
                  href="https://www.linkedin.com/in/pintu-chauhan-ctuap/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Pintu Chauhan</span>
                </a>

                {/* Raushan's Link */}
                <a 
                  href="https://www.linkedin.com/in/raushan-kumar-0b5340373/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Raushan Kumar</span>
                </a>
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
