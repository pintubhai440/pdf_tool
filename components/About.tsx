import React from 'react';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Genz PDF</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Making digital document management simple, secure, and free for everyone.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <div className="prose prose-lg text-slate-600 max-w-none">
            <p className="text-lg leading-relaxed">
              <strong className="text-slate-900">Genz PDF</strong> is here to make your digital life easier. 
              We have eliminated the stress of document management by combining essential tools—
              <span className="text-indigo-600 font-medium"> Merge, Split, Convert, Compress, and Resize</span>
              —into one seamless platform.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 my-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Instant & Easy</h3>
              <p className="text-sm text-slate-600">Everything in one place. No difficult steps—just simple, effective tools.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center text-green-600 mb-4">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">100% Free</h3>
              <p className="text-sm text-slate-600">Productivity shouldn't come with a price tag. Premium quality at zero cost.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Secure</h3>
              <p className="text-sm text-slate-600">Your files are processed securely. We value your privacy and data safety.</p>
            </div>
          </div>

          {/* Mission Text */}
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              We believe that productivity shouldn't come with a price tag. That’s why we offer our 
              premium-quality services completely free of cost. Simple, secure, and built for you.
            </p>
            <p>
              That’s why we created a solution that brings everything together in one place. 
              <strong> Genz PDF is your one-stop destination for all things PDF and Image.</strong> 
              Whether you need to Merge reports, Split pages, Convert formats, Compress heavy files, 
              or Resize Images, we give you the power to do it instantly and securely.
            </p>
            <p className="italic border-l-4 border-indigo-500 pl-4 py-2 bg-slate-50 rounded-r-lg">
              "We want to make high-quality technology easy for everyone to use. That is why all our 
              tools are completely free for you. No secret fees, no difficult steps—just simple, effective tools."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
