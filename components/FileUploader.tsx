import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  allowMultiple?: boolean;
  acceptedFileTypes?: string[]; // e.g., ['application/pdf', 'image/jpeg']
  label?: string;
  subLabel?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  allowMultiple = true,
  acceptedFileTypes = ['application/pdf'],
  label = "Click or Drag PDF file(s) here",
  subLabel
}) => {
  const isValidFileType = (file: File) => {
    // If no specific types defined, accept all
    if (!acceptedFileTypes || acceptedFileTypes.length === 0) return true;
    
    // Check exact mime type matches or wildcards like 'image/*'
    return acceptedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files).filter(isValidFileType);
      
      if (files.length > 0) {
        if (!allowMultiple) {
            onFilesSelected([files[0]]);
        } else {
            onFilesSelected(files);
        }
      }
    },
    [onFilesSelected, allowMultiple, acceptedFileTypes]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(isValidFileType);
      if (files.length > 0) {
         if (!allowMultiple) {
            onFilesSelected([files[0]]);
        } else {
            onFilesSelected(files);
        }
      }
    }
  };

  // Construct accept string for input
  const acceptString = acceptedFileTypes.join(',');

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={clsx(
        "border-2 border-dashed border-slate-300 rounded-xl p-10",
        "flex flex-col items-center justify-center text-center",
        "bg-white hover:bg-slate-50 transition-colors cursor-pointer",
        "group h-full min-h-[250px]"
      )}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        type="file"
        id="fileInput"
        multiple={allowMultiple}
        accept={acceptString}
        className="hidden"
        onChange={handleFileInput}
      />
      <div className="bg-primary-50 p-4 rounded-full mb-4 group-hover:bg-primary-100 transition-colors">
        <UploadCloud className="w-8 h-8 text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        {label}
      </h3>
      <p className="text-slate-500 text-sm">
        {subLabel || (allowMultiple 
          ? "Upload multiple files" 
          : "Upload a single file")}
      </p>
    </div>
  );
};