import React from 'react';
import { ShieldCheck, UserX, FileKey, Trash2, Lock } from 'lucide-react';

export const Policy: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full text-green-600 mb-6 shadow-sm">
           <ShieldCheck size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Our Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Promise</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          At Genz PDF, your safety is our top priority. We have built our website to be 100% private and secure.
        </p>
      </div>

      {/* Security Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        
        {/* Card 1: No Personal Data */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <UserX size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No Personal Data Needed</h3>
          <p className="text-slate-600 leading-relaxed">
            You can use all our tools without sharing your Name, Email, or Phone number. We believe in anonymity first.
          </p>
        </div>

        {/* Card 2: Files are Private */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
            <FileKey size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Your Files are Private</h3>
          <p className="text-slate-600 leading-relaxed">
            We only use your files to perform the task you want (like Merging or Splitting). We never open, read, or analyze contents.
          </p>
        </div>

        {/* Card 3: Automatic Deletion */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="bg-rose-50 w-14 h-14 rounded-xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
            <Trash2 size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Automatic Deletion</h3>
          <p className="text-slate-600 leading-relaxed">
            As soon as your work is done, your files are instantly deleted from our system. We keep zero records.
          </p>
        </div>

        {/* Card 4: No Sharing */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="bg-amber-50 w-14 h-14 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No Sharing</h3>
          <p className="text-slate-600 leading-relaxed">
            We do not share your data with any third-party websites, advertisers, or companies. Your data stays yours.
          </p>
        </div>

      </div>

      {/* Trust Badge / Footer Note */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-8 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-green-900 mb-2">Use Genz PDF with complete confidence.</h3>
        <p className="text-green-700 text-lg">Your data stays yours. Simple, Secure, and 100% Free.</p>
      </div>
    </div>
  );
};
