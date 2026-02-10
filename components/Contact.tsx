import React from 'react';
import { Mail, Phone, Users, MessageSquare, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      
      {/* Header Section */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Touch</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We are here to help! Whether you need to report a problem, clarify a doubt, or simply learn more about our tools.
        </p>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-8 mb-12 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-md text-indigo-600">
            <MessageSquare size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">How can we help you?</h2>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Do you have a question about Genz PDF? Did you spot a bug? Our team is here to ensure your experience is smooth and hassle-free. Don't hesitate to contact us regarding any technical issues or general inquiries.
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Email Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group">
          <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <Mail size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
          <p className="text-slate-500 mb-6 text-sm">For queries, bug reports, or suggestions, please drop us an email.</p>
          <div className="space-y-3">
            <a href="mailto:p7431309@gmail.com" className="flex items-center gap-3 text-slate-700 hover:text-blue-600 font-medium transition-colors p-2 hover:bg-slate-50 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              p7431309@gmail.com
            </a>
            <a href="mailto:rkamari12345@gmail.com" className="flex items-center gap-3 text-slate-700 hover:text-blue-600 font-medium transition-colors p-2 hover:bg-slate-50 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              rkamari12345@gmail.com
            </a>
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group">
          <div className="bg-green-50 w-14 h-14 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
            <Phone size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Phone Support</h3>
          <p className="text-slate-500 mb-6 text-sm">You can also reach us directly via phone for urgent assistance.</p>
          <div className="space-y-3">
            <a href="tel:+916268025669" className="flex items-center gap-3 text-slate-700 hover:text-green-600 font-medium transition-colors p-2 hover:bg-slate-50 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              +91 62680 25669
            </a>
            <a href="tel:+918404916832" className="flex items-center gap-3 text-slate-700 hover:text-green-600 font-medium transition-colors p-2 hover:bg-slate-50 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              +91 84049 16832
            </a>
          </div>
        </div>

        {/* Team Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group">
          <div className="bg-purple-50 w-14 h-14 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">The Team</h3>
          <p className="text-slate-500 mb-6 text-sm">Dedicated to providing you with the best free PDF tools.</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-slate-700 font-medium text-center">
              Genz PDF is proudly developed and maintained by <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-lg">
                Pintu & Raushan
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
