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
      {/* Optional: Top decorative gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <button 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity text-left group"
            >
              {/* Custom Logo Image */}
              <img 
                src="/logo.png" 
                alt="Genz PDF Logo" 
                className="w-10 h-10 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300" 
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                Genz PDF
              </span>
            </button>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Your all-in-one solution for PDF management. Merge, split, convert, and optimize documents with the power of AI.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {['merge', 'split', 'convert', 'compress', 'resize'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => handleNav(item as AppMode)} 
                    className="hover:text-primary-600 transition-colors text-left capitalize flex items-center gap-2"
                  >
                    {item} PDF
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><button onClick={() => handleNav('about')} className="hover:text-primary-600">About Us</button></li>
              <li><button onClick={() => handleNav('contact')} className="hover:text-primary-600">Contact Us</button></li>
              <li><button onClick={() => handleNav('policy')} className="hover:text-primary-600">Privacy Policy</button></li>
              <li><button onClick={() => handleNav('terms')} className="hover:text-primary-600">Terms & Conditions</button></li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-slate-100 my-8"></div>

        {/* Bottom Bar: Layout adjusted for Pro Look */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-6 text-center xl:text-left">
          
          {/* 1. Copyright (Left) */}
          <p className="text-slate-400 text-sm font-medium order-3 xl:order-1">
            © {new Date().getFullYear()} Genz PDF. All rights reserved.
          </p>

          {/* 2. PRO "Made in India" Badge (Center) */}
          <div className="order-1 xl:order-2 animate-in fade-in zoom-in duration-700">
            <div className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 cursor-default select-none">
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Developed with</span>
              
              {/* Beating Heart */}
              <Heart 
                size={14} 
                className="text-red-500 fill-red-500 animate-pulse drop-shadow-sm" 
              />
              
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">in</span>
              
              {/* Tricolor Gradient Text for INDIA */}
              <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] drop-shadow-sm">
                INDIA
              </span>
            </div>
          </div>

          {/* 3. Developers (Right) */}
          <div className="flex flex-wrap items-center justify-center gap-3 order-2 xl:order-3">
             <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest hidden sm:block">
               Created By
             </span>
             
             {/* Pintu's Link */}
             <a 
               href="https://www.linkedin.com/in/pintu-chauhan-ctuap/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 group shadow-sm"
             >
               <Linkedin size={14} className="group-hover:scale-110 transition-transform" />
               <span className="text-xs font-semibold">Pintu Chauhan</span>
             </a>

             {/* Raushan's Link */}
             <a 
               href="https://www.linkedin.com/in/raushan-kumar-0b5340373/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 group shadow-sm"
             >
               <Linkedin size={14} className="group-hover:scale-110 transition-transform" />
               <span className="text-xs font-semibold">Raushan Kumar</span>
             </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
