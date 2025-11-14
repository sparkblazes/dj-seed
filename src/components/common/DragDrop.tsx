// src/components/DragDrop.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import "../assets/DragDrop.css";

type Props = {
  accept?: string; // e.g. "image/*,application/pdf"
  multiple?: boolean;
  maxFiles?: number;
  initialFiles?: File[]; // optional preloaded files
  showPreview?: boolean;
  onFiles?: (files: File[]) => void; // called when files change (added/removed)
  className?: string;
  label?: string; // area label
};

export default function DragDrop({
  accept,
  multiple = false,
  maxFiles = 5,
  initialFiles = [],
  showPreview = true,
  onFiles,
  className = "",
  label = "Drag & drop files here, or click to select",
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // object URLs for previews
  const [previews, setPreviews] = useState<Record<string, string>>({});

  // build previews for image files
  useEffect(() => {
    const next: Record<string, string> = {};
    files.forEach((f) => {
      if (f.type.startsWith("image/")) {
        next[f.name + f.size] = URL.createObjectURL(f);
      }
    });
    setPreviews((prev) => {
      // revoke old urls not present in next
      Object.values(prev).forEach((url) => {
        if (!Object.values(next).includes(url)) URL.revokeObjectURL(url);
      });
      return next;
    });

    // cleanup on unmount
    return () => {
      Object.values(next).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  // notify parent
  useEffect(() => {
    onFiles?.(files);
  }, [files, onFiles]);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFiles = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;
      const arr = Array.from(selectedFiles);

      // filter by accept if provided
      const filtered = accept
        ? arr.filter((f) => {
            const accepts = accept.split(",").map((s) => s.trim());
            // quick match for image/*, application/pdf etc.
            return accepts.some((a) => {
              if (a === "*") return true;
              if (a.endsWith("/*")) {
                const prefix = a.replace("/*", "");
                return f.type.startsWith(prefix);
              }
              return f.type === a || f.name.toLowerCase().endsWith(a);
            });
          })
        : arr;

      let nextFiles = multiple ? [...files, ...filtered] : filtered.slice(0, 1);
      if (maxFiles) nextFiles = nextFiles.slice(0, maxFiles);
      setFiles(nextFiles);
    },
    [accept, files, maxFiles, multiple]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset input so same file can be chosen again
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // keyboard: press Enter/Space to open file dialog
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFileDialog();
    }
  };

  return (
    <div className={`dd-root ${className}`}>
      <div
        className={`dd-dropzone ${isDragging ? "dd-dragover" : ""}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        onClick={openFileDialog}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label={label}
      >
        <input
          ref={inputRef}
          type="file"
          className="dd-input"
          onChange={onInputChange}
          accept={accept}
          multiple={multiple}
        />
        <div className="dd-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="me-2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 5 17 10" />
            <line x1="12" y1="5" x2="12" y2="21" />
          </svg>
          <div>
            <div className="dd-label">{label}</div>
            <div className="dd-sub">Click or drop files to upload</div>
          </div>
        </div>
      </div>

      {/* previews + list */}
      <div className="dd-list">
        {files.length === 0 ? (
          <div className="dd-empty text-muted">No files selected</div>
        ) : (
          files.map((f, i) => {
            const key = f.name + f.size;
            const preview = previews[key];
            return (
              <div className="dd-item" key={key}>
                {showPreview && preview ? (
                  <img src={preview} alt={f.name} className="dd-thumb" />
                ) : (
                  <div className="dd-file-icon">{f.name.split(".").pop()}</div>
                )}
                <div className="dd-meta">
                  <div className="dd-name">{f.name}</div>
                  <div className="dd-size">{(f.size / 1024).toFixed(1)} KB</div>
                </div>
                <div className="dd-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFile(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
