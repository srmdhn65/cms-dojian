import React, { useState, useEffect } from 'react';
import ErrorText from '../Typography/ErrorText';

interface MultipleFileUploadProps {
  labelTitle?: string;
  error?: string;
  className?: string;
  readonly?: boolean;
  updateFormValue?: (arg: { updateType: string; value: string[] }) => void;
  updateType: string;
  defaultFiles?: string[]; // Default value, can be Base64 or URL
}

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  labelTitle,
  error,
  readonly = false,
  updateFormValue,
  updateType,
  defaultFiles = [], // Set default to empty array
}) => {
  const [filePreviews, setFilePreviews] = useState<string[]>(defaultFiles);

  // Load default files on mount
  useEffect(() => {
    if (defaultFiles.length > 0) {
      setFilePreviews(defaultFiles);
      if (updateFormValue) {
        updateFormValue({ updateType, value: defaultFiles });
      }
    }
  }, [defaultFiles, updateFormValue, updateType]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const filePromises = files.map((file) => convertToBase64(file));

    Promise.all(filePromises)
      .then((base64Files) => {
        const updatedFiles = [...filePreviews, ...base64Files];
        setFilePreviews(updatedFiles);
        if (updateFormValue) {
          updateFormValue({ updateType, value: updatedFiles });
        }
      })
      .catch((error) => console.error('Error converting files to Base64:', error));
  };

  // Convert file to Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Remove image by index
  const handleRemoveFile = (index: number) => {
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    setFilePreviews(updatedPreviews);
    if (updateFormValue) {
      updateFormValue({ updateType, value: updatedPreviews });
    }
  };

  return (
    <div className="w-full mb-4">
      {labelTitle && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {labelTitle}
        </label>
      )}

      {/* File Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        readOnly={readonly}
        onChange={handleFileChange}
        className="file-input"
      />

      {/* Display selected image previews */}
      <div className="file-preview-container" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
        {filePreviews.map((preview, index) => (
          <div key={index} style={{ marginRight: '10px', position: 'relative' }}>
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <button
              onClick={() => handleRemoveFile(index)}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
              type="button"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {error && (
        <ErrorText styleClass="text-start mt-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </ErrorText>
      )}
    </div>
  );
};

export default MultipleFileUpload;
