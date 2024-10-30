import { useEffect, useRef, FC, useState } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import ErrorText from '../Typography/ErrorText';

interface CustomTextEditorProps {
  labelTitle?: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  updateType: string;
  updateFormValue?: (arg: { updateType: string; value: string }) => void;
}

const CustomTextEditor: FC<CustomTextEditorProps> = ({
  labelTitle,
  error,
  defaultValue = '', // Set a default value if none is provided
  updateFormValue,
  updateType,
}) => {
  const [loading, setLoading] = useState(false);
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: '#toolbar',
      history: {
        delay: 1000,
        maxStack: 500,
        userOnly: true,
      },
    },
    formats: ["size", "bold", "script", "italic", "underline", "align", "color", "list"],
  });

  // A ref to prevent re-setting default value after initial render
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (quill) {
        if (isInitialMount.current) {
          setLoading(true);      
        }
      // Set initial content only once
      quill.clipboard.dangerouslyPasteHTML(defaultValue);
      setLoading(false);
      isInitialMount.current = false;
      quill.on('text-change', () => {
        updateInputValue(quill.root.innerHTML);
      });
    }
  }, [quill, isInitialMount.current === true]);

  const updateInputValue = (val: string) => {
    updateFormValue &&
      updateFormValue({
        updateType: updateType,
        value: val,
      });
  };

  return (
    loading ? (
      <div className="w-full mb-4"></div>)
      : (
        <div className="w-full mb-4">
          {labelTitle && (
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              {labelTitle}
            </label>
          )}
          <div
            id="toolbar"
            className="bg-gray-100 dark:bg-gray-800 p-2 rounded-t-lg border-b border-gray-300 dark:border-gray-600"
          >
            <select className="ql-size">
              <option value="small" />
              <option value="large" />
              <option value="huge" />
            </select>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-script" value="sub" />
            <button className="ql-script" value="super" />
            <select className="ql-align" />
            <select className="ql-color" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
          </div>
    
          <div
            ref={quillRef}
            style={{ height: 300 }}
            className="bg-gray-100 dark:bg-gray-800 p-2 rounded-b-lg border border-gray-300 dark:border-gray-600"
          />
    
          {error && (
            <ErrorText styleClass="text-start mt-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </ErrorText>
          )}
        </div>
      )
  ) ;
};

export default CustomTextEditor;
