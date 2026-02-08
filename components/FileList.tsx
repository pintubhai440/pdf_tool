import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { FileText, GripVertical, Trash2, Eye } from 'lucide-react';
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
      className="bg-white border border-slate-200 rounded-lg p-3 mb-2 flex items-center shadow-sm select-none"
    >
      <div
        className="cursor-grab active:cursor-grabbing p-2 mr-2 text-slate-400 hover:text-slate-600"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical size={20} />
      </div>
      
      <div className="bg-red-50 p-2 rounded-lg mr-3">
        <FileText className="text-red-500 w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-slate-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      <button
        onClick={() => onRemove(file.id)}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        title="Remove file"
      >
        <Trash2 size={18} />
      </button>
    </Reorder.Item>
  );
};

export const FileList: React.FC<FileListProps> = ({ files, setFiles, onRemove }) => {
  return (
    <div className="w-full">
      <Reorder.Group axis="y" values={files} onReorder={setFiles}>
        {files.map((file) => (
          <FileItem key={file.id} file={file} onRemove={onRemove} />
        ))}
      </Reorder.Group>
    </div>
  );
};