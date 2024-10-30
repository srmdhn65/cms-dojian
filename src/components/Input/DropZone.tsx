import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  title: string;
  error?: string;
  updateType: string;
  defaultValue?: string;
  updateInputValue?: (arg: { updateType: string; value: string }) => void;
  register?: any;
  multiple?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  title,
  error,
  updateType,
  defaultValue,
  updateInputValue,
  multiple = false,
}) => {
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noClick: true});
  const files = acceptedFiles.map(file => <li key={file.path}>{file.path}</li>);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;
    
  };



  return (
    <div className="w-full mb-4">
      {title && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {title}
        </label>
      )}
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Dropzone without click events</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileDropzone;
