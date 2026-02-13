import React from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  Cpu, 
  Bot, 
  Ban, 
  Scale, 
  FileSignature, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      
      {/* Hero Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-4 shadow-sm">
           <FileSignature size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Conditions</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Please read these terms carefully before using our services.
        </p>
      </div>

      {/* Intro Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />
            Welcome to Genz PDF
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-6">
            Let’s be straight: If you are using our service, you fully agree to the terms listed below. 
            Unlike other tools in the market, we do not sell or store your data. Our rule is simple: 
            <span className="font-bold text-white border-b-2 border-green-400 ml-2">Your Data, Your Device.</span>
          </p>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="space-y-6">

        {/* 1. Service As Is */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Service Provided "As Is"</h3>
              <p className="text-slate-600 mb-4">
                This is a PDF utility tool. We do not claim that it will be 100% accurate.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-amber-400">
                <p className="text-slate-700 text-sm font-medium">
                  <strong>Reality Check:</strong> Technology can fail. If our tool makes a mistake while merging a PDF or gives an incorrect summary, we are not responsible. We can modify or remove any feature at any time without notice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Zero Storage */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-rose-50 p-3 rounded-xl text-rose-600 shrink-0">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Zero Storage Policy</h3>
              <p className="text-slate-600 mb-4">
                We do not store your documents. Files remain in your browser session only during processing.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                  <strong>Data Vanishes:</strong> As soon as you close the tab or refresh the page, your data is gone.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                  <strong>No Recovery:</strong> Do not expect "file recovery" from us. We cannot give back what we never kept.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Processing & Local Device */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Processing & Local Device Responsibility</h3>
              <p className="text-slate-600 mb-4">
                Since we don’t store data, most processing happens in your browser or a temporary server session.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-slate-900 mb-1">Performance</h4>
                  <p className="text-xs text-slate-500">
                    If you process a very large file (e.g., 500MB+) and your browser crashes, that is a limit of your device, not a fault of our tool.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-slate-900 mb-1">Data Loss</h4>
                  <p className="text-xs text-slate-500">
                    If your internet disconnects during processing and the file gets corrupted, we are not responsible. Always keep a backup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. AI Assistant */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600 shrink-0">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">4. AI Assistant & Tool Accuracy</h3>
              <p className="text-slate-600 mb-4">
                Our features (summarization, chat, etc.) are powerful, but they are not human.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Accuracy:</strong> The tool can give wrong answers ("hallucinations"). Do not blindly trust the tool's summary for legal contracts, medical reports, or financial documents. Always cross-check with the original document.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>No Professional Advice:</strong> This tool is not a lawyer or a doctor.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Prohibited Use */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-red-50 p-3 rounded-xl text-red-600 shrink-0">
              <Ban size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">5. Prohibited Use</h3>
              <p className="text-slate-600 mb-2">This platform is not for "doing whatever you want."</p>
              <div className="text-sm text-slate-600 space-y-2">
                <p><strong className="text-red-600">Malware:</strong> If you intentionally upload a virus or malicious file, we will block your access immediately and may take legal action.</p>
                <p><strong className="text-red-600">Illegal Content:</strong> Uploading any illegal, offensive, or copyrighted material is strictly prohibited.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Limitation of Liability */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-3 rounded-xl text-gray-600 shrink-0">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">6. Limitation of Liability</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                 <p className="text-slate-700 text-sm font-medium italic">
                  "Straight Talk: Genz PDF or its developers will not be responsible for any data loss, business interruption, or profit loss. You are using this tool entirely at your own risk."
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Changes to Terms */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">7. Changes to Terms</h3>
              <p className="text-slate-600">
                We can change these terms whenever we want. If you continue to use the tool, it means you accept the new terms.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Terms;
