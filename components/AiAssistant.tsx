import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { analyzeDocumentImage, getAiAssistance } from '../services/geminiService';
import { clsx } from 'clsx';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your PDF Fusion assistant. I can help you organize your documents or answer questions about file management.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    let responseText = '';

    if (selectedImage) {
      // Image analysis mode
      responseText = await analyzeDocumentImage(selectedImage.split(',')[1], 'image/jpeg'); // Assuming jpeg for simplicity or extract from base64
      setSelectedImage(null);
    } else {
      // Text chat mode
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      responseText = await getAiAssistance(userMsg.text, history);
    }

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed",
              msg.role === 'user'
                ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
            )}
          >
            {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
            ))}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-2">
             <Loader2 className="w-4 h-4 animate-spin" />
             <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {selectedImage && (
            <div className="mb-2 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-20 rounded border border-slate-200" />
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                >
                    <X size={12} />
                </button>
            </div>
        )}
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            title="Upload image for analysis"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={selectedImage ? "Ask about this image..." : "Ask me anything..."}
            className="flex-1 bg-slate-100 border-0 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 resize-none max-h-32"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};