import React from 'react';
import { Reorder, useDragControls, AnimatePresence, motion } from 'framer-motion';
import { FileText, GripVertical, Trash2 } from 'lucide-react';
import { PdfFile } from '../types';

interface FileListProps {
  files: PdfFile[];
  setFiles: (files: PdfFile[]) => void;
  onRemove: (id: string) => void;
}

const FileItem: React.FC<{ file: PdfFile; onRemove: (id: string) => void }> = ({
  file,
  onRemove,
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={file}
      id={file.id}
      dragListener={false}
      dragControls={controls}
      // ✨ Animation Props Added
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0,0,0,0.05)" }}
      whileDrag={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-white border border-slate-200 rounded-xl p-3 flex items-center shadow-sm select-none mb-3 cursor-default relative overflow-hidden group"
    >
      {/* Drag handle */}
      <div
        className="cursor-grab active:cursor-grabbing p-2 mr-2 text-slate-400 hover:text-indigo-600 transition-colors"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical size={20} />
      </div>

      {/* File icon with shine effect */}
      <div className="relative bg-red-50 p-2.5 rounded-lg mr-3 overflow-hidden">
        <FileText className="text-red-500 w-5 h-5 relative z-10" />
        <div className="absolute inset-0 bg-white/50 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
          {file.name}
        </p>
        <p className="text-xs text-slate-500 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded-md mt-1">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      {/* Remove button */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "#FEF2F2", color: "#EF4444" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(file.id)}
        className="p-2 text-slate-300 rounded-full transition-colors"
        title="Remove file"
      >
        <Trash2 size={18} />
      </motion.button>
    </Reorder.Item>
  );
};

export const FileList: React.FC<FileListProps> = ({ files, setFiles, onRemove }) => {
  return (
    <div className="w-full max-h-[450px] overflow-y-auto pr-2 custom-scrollbar p-1">
      <Reorder.Group axis="y" values={files} onReorder={setFiles}>
        <AnimatePresence initial={false} mode='popLayout'>
          {files.map((file) => (
            <FileItem key={file.id} file={file} onRemove={onRemove} />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
};
