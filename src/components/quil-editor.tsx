import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

type QuillEditorProps = {
    initialContent?: string;
    onChange: (htmlContent: string, plainText: string) => void;
};

const QuillEditor: React.FC<QuillEditorProps> = ({ initialContent = "", onChange }) => {
    const { quill, quillRef } = useQuill();

    useEffect(() => {
        if (quill) {
            // Set initial content
            quill.clipboard.dangerouslyPasteHTML(initialContent);

            // Move cursor to the end after setting content
            setTimeout(() => {
                quill.setSelection(quill.getLength());
            }, 0);

            // Listen for text changes
            const handleChange = () => {
                const htmlContent = quill.root.innerHTML; // Get HTML
                const plainText = quill.getText().trim(); // Get plain text
                onChange(htmlContent, plainText);
            };

            quill.on("text-change", handleChange);

            return () => {
                quill.off("text-change", handleChange);
            };
        }
    }, [quill, initialContent, onChange]);

    return (
        <div className="mb-3" style={{ height: 300 }}>
            <div ref={quillRef} />
        </div>
    );
};

export default QuillEditor;
