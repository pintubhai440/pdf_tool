import React from 'react';
import { AppMode } from '../types';
import { FileStack, Github, Twitter, Linkedin } from 'lucide-react';

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
                PDF Fusion AI
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
              {/* ✅ ADDED RESIZE BUTTON HERE */}
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} PDF Fusion AI. All rights reserved.
          </p>
          
          {/* Social Placeholders (Dummy Links) */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors" aria-label="Github">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-blue-700 transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
