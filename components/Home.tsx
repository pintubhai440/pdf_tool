import React from 'react';
import { 
  Files, 
  Scissors, 
  ArrowRightLeft, 
  Minimize2, 
  Scaling, 
  ArrowRight 
} from 'lucide-react';
import { AppMode } from '../types';

interface HomeProps {
  setMode: (mode: AppMode) => void;
}

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  const tools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      desc: 'Combine multiple PDF files into one single document in seconds.',
      icon: Files,
      color: 'text-blue-600',
      bg: 'bg-blue-50 hover:bg-blue-100',
      border: 'hover:border-blue-200'
    },
    {
      id: 'split',
      title: 'Split PDF',
      desc: 'Separate one page or a whole set for easy conversion into independent files.',
      icon: Scissors,
      color: 'text-rose-600',
      bg: 'bg-rose-50 hover:bg-rose-100',
      border: 'hover:border-rose-200'
    },
    {
      id: 'convert',
      title: 'Convert PDF',
      desc: 'Convert your PDF to JPG, PNG, Word or create PDFs from images.',
      icon: ArrowRightLeft,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100',
      border: 'hover:border-purple-200'
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      desc: 'Reduce file size while optimizing for maximal PDF quality.',
      icon: Minimize2,
      color: 'text-orange-600',
      bg: 'bg-orange-50 hover:bg-orange-100',
      border: 'hover:border-orange-200'
    },
    {
      id: 'resize',
      title: 'Resize Image',
      desc: 'Resize your images by defining pixels or percentage easily.',
      icon: Scaling,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100',
      border: 'hover:border-emerald-200'
    }
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PDF Tools</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We make it easy to handle your documents. Select a tool below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setMode(tool.id as AppMode)}
            className={`group relative flex flex-col items-start p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:shadow-xl ${tool.bg} ${tool.border}`}
          >
            <div className={`p-3 rounded-xl bg-white shadow-sm mb-5 ${tool.color}`}>
              <tool.icon size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
              {tool.title}
            </h3>
            <p className="text-slate-600 text-left mb-6 leading-relaxed">
              {tool.desc}
            </p>
            
            <div className="mt-auto flex items-center gap-2 font-semibold text-sm text-slate-900 group-hover:gap-3 transition-all">
              Try Now <ArrowRight size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
