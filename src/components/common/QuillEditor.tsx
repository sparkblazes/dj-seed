// src/components/QuillEditor.tsx
import React, { useEffect, useMemo } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  maxHeight?: number;
  imageUpload?: (file: File) => Promise<string>;
};

const QuillEditor: React.FC<Props> = ({
  value = "",
  onChange,
  placeholder = "Write something...",
  readOnly = false,
  minHeight = 100,
  maxHeight = 400,
  imageUpload,
}) => {
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          // note: list is a single format; toolbar provides ordered/bullet options
          [{ list: "ordered" }, { list: "bullet" }],
        
        ],
        handlers: {
          image: function (this: any) {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              if (imageUpload) {
                try {
                  const url = await imageUpload(file);
                  const range = this.quill.getSelection(true);
                  this.quill.insertEmbed(range?.index ?? 0, "image", url, "user");
                  this.quill.setSelection((range?.index ?? 0) + 1);
                } catch (err) {
                  console.error("Image upload failed", err);
                }
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                const range = this.quill.getSelection(true);
                const base64 = reader.result as string;
                this.quill.insertEmbed(range?.index ?? 0, "image", base64, "user");
                this.quill.setSelection((range?.index ?? 0) + 1);
              };
              reader.readAsDataURL(file);
            };
          },
        },
      },
    };
  }, [imageUpload]);

  // ✅ Correct formats: include 'list' (not 'bullet')
  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",        // list covers both ordered and bullet
      "blockquote",
      "code-block",
      "link",
      "image",
    ],
    []
  );

  const options = useMemo(
    () => ({
      theme: "snow",
      modules,
      placeholder,
      formats,
    }),
    [modules, placeholder, formats]
  );

  const { quill, quillRef } = useQuill(options);

  useEffect(() => {
    if (!quill) return;

    const current = quill.root.innerHTML;
    if (value && value !== current) quill.root.innerHTML = value;

    const handler = () => {
      const html = quill.root.innerHTML;
      const clean = DOMPurify.sanitize(html);
      onChange?.(clean);
    };

    quill.on("text-change", handler);
    quill.enable(!readOnly);

    quill.root.style.minHeight = `${minHeight}px`;
    if (maxHeight && maxHeight > 0) {
      quill.root.style.maxHeight = `${maxHeight}px`;
      quill.root.style.overflowY = "auto";
      quill.root.querySelectorAll("img").forEach((img) => {
        (img as HTMLImageElement).style.maxWidth = "100%";
        (img as HTMLImageElement).style.height = "auto";
      });
    } else {
      quill.root.style.overflowY = "visible";
    }

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, value, onChange, readOnly, minHeight, maxHeight]);

  useEffect(() => {
    if (!quill) return;
    const current = quill.root.innerHTML;
    if (value !== undefined && value !== current) quill.root.innerHTML = value;
  }, [value, quill]);

  return (
    <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #e6e6e6" }}>
      <div ref={quillRef} />
    </div>
  );
};

export default QuillEditor;
