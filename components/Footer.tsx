import React from 'react';
import { AppMode } from '../types';
import { FileStack, Linkedin } from 'lucide-react';

interface FooterProps {
  setMode: (mode: AppMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ setMode }) => {
  
  // Helper function to keep code clean
  const handleNav = (mode: AppMode) => {
    setMode(mode); // Yeh App.js wala changeMode call karega jo scroll up karta hai
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column (Clickable Logo -> Home) */}
          <div className="col-span-1 md:col-span-2">
            <button 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity text-left"
            >
              <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                <FileStack size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                Genz PDF
              </span>
            </button>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Your all-in-one solution for PDF management. Merge, split, convert, and optimize documents with the power of AI.
            </p>
          </div>

          {/* Quick Links (Product) */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => handleNav('merge')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('split')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('convert')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Convert PDF
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('compress')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('resize')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Resize PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links (About, Contact, Privacy) */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => handleNav('about')} 
                  className="hover:text-primary-600 transition-colors font-medium text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('policy')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('terms')} 
                  className="hover:text-primary-600 transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Developers */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm order-2 md:order-1">
            © {new Date().getFullYear()} Genz PDF. All rights reserved.
          </p>
          
          {/* Developer Credits - Beautiful Pill Design */}
          <div className="flex flex-wrap items-center justify-center gap-4 order-1 md:order-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
              Developers
            </span>
            
            {/* Pintu's Link */}
            <a 
              href="https://www.linkedin.com/in/pintu-chauhan-ctuap/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 group shadow-sm"
              title="Connect with Pintu Chauhan on LinkedIn"
            >
              <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Pintu Chauhan</span>
            </a>

            {/* Raushan's Link */}
            <a 
              href="https://www.linkedin.com/in/raushan-kumar-0b5340373/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 group shadow-sm"
              title="Connect with Raushan Kumar on LinkedIn"
            >
              <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Raushan Kumar</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
