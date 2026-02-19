import React, { useState, useRef } from 'react';
import { pipeline, env } from '@xenova/transformers';
import { FileAudio, Download, Loader2, RefreshCcw, CheckCircle2, Zap, Languages } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Use CDN for models
env.allowLocalModels = false; 

export const AudioToTextTool: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading_model' | 'processing' | 'success' | 'error'>('idle');
    const [transcribedText, setTranscribedText] = useState<string>('');
    const [targetLanguage, setTargetLanguage] = useState<string>('english');
    const [progress, setProgress] = useState<number>(0);
    
    const transcriber = useRef<any>(null);

    const loadModel = async () => {
        if (!transcriber.current) {
            setStatus('loading_model');
            try {
                transcriber.current = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
                    progress_callback: (p: any) => {
                       if (p.status === 'progress') {
                           setProgress(Math.round(p.progress));
                       }
                    }
                });
            } catch (err) {
                setStatus('error');
                console.error(err);
                return false;
            }
        }
        return true;
    };

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setTranscribedText('');
            setStatus('idle');
        }
    };

    const processAudio = async () => {
        if (!file) return;
        const isLoaded = await loadModel();
        if (!isLoaded) return;

        setStatus('processing');
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const offlineContext = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start();
            const renderedBuffer = await offlineContext.startRendering();
            const audioData = renderedBuffer.getChannelData(0);

            const output = await transcriber.current(audioData, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: targetLanguage,
                task: 'transcribe',
            });

            setTranscribedText(output.text);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const downloadTXT = () => {
        const blob = new Blob([transcribedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GenzPDF_Audio_${file?.name}.txt`;
        a.click();
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(transcribedText, 180);
        doc.text(splitText, 15, 20);
        doc.save(`GenzPDF_Audio_${file?.name}.pdf`);
    };

    const downloadDOCX = async () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [new Paragraph({ children: [new TextRun(transcribedText)] })],
            }],
        });
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GenzPDF_Audio_${file?.name}.docx`;
        a.click();
    };

    const handleReset = () => {
        setFile(null);
        setTranscribedText('');
        setStatus('idle');
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            <header className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-4">
                    <Zap size={14} /> AI Audio to Text
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    Convert Audio to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Text</span>
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto">100% Client-Side Private AI. Convert MP3/WAV to TXT, PDF, or DOCX without uploading.</p>
            </header>

            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                {!file ? (
                    <div className="p-8 md:p-12">
                        <FileUploader onFilesSelected={handleFileSelected} allowMultiple={false} acceptedFileTypes={['audio/mpeg', 'audio/wav', 'audio/ogg']} label="Drop Audio File Here" subLabel="MP3, WAV, OGG" />
                    </div>
                ) : (
                    <div className="p-6 md:p-10">
                        <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600"><FileAudio size={24}/></div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{file.name}</h3>
                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={handleReset} className="p-2 text-slate-400 hover:text-red-500"><RefreshCcw size={20}/></button>
                        </div>

                        {status === 'idle' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 uppercase mb-2 flex items-center gap-2"><Languages size={16}/> Select Output Language</label>
                                    <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="english">English</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="spanish">Spanish</option>
                                        <option value="french">French</option>
                                    </select>
                                </div>
                                <button onClick={processAudio} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                                    <Zap size={20}/> Generate Text
                                </button>
                            </div>
                        )}

                        {(status === 'loading_model' || status === 'processing') && (
                            <div className="text-center py-10">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {status === 'loading_model' ? 'Loading AI Model...' : 'Processing Audio...'}
                                </h3>
                                {status === 'loading_model' && <p className="text-slate-500">Downloading AI weights (this happens only once). Progress: {progress}%</p>}
                                {status === 'processing' && <p className="text-slate-500">Transcribing audio securely in your browser...</p>}
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32}/></div>
                                    <h2 className="text-2xl font-bold text-slate-900">Transcription Complete!</h2>
                                </div>
                                <textarea readOnly value={transcribedText} className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 resize-none" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button onClick={downloadTXT} className="py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700"><Download size={18}/> Download TXT</button>
                                    <button onClick={downloadPDF} className="py-3 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-700"><Download size={18}/> Download PDF</button>
                                    <button onClick={downloadDOCX} className="py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700"><Download size={18}/> Download DOCX</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default AudioToTextTool;
