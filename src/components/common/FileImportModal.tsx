// src/components/Common/FileImportModal.tsx
import React, { useState } from "react";
import type { DragEvent } from "react";

interface FileImportModalProps {
  show: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<any>;
}

const FileImportModal: React.FC<FileImportModalProps> = ({
  show,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    { row: string; field: { attribute: string; errors: string[] }[] }[]
  >([]);

  if (!show) return null;

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setErrors([]);
    try {
      const res = await onUpload(file);

      if (res?.success === false && res.errors) {
        setErrors(res.errors);
      } else if (res?.error?.status === 422 && res.error.data?.errors) {
        const laravelErrors = Object.entries(res.error.data.errors).map(
          ([field, msgs]) => ({
            row: "-",
            field: [{ attribute: field, errors: msgs as string[] }],
          })
        );
        setErrors(laravelErrors);
      } else {
        setFile(null);
        onClose();
      }
    } catch (err) {
      console.error("Upload failed", err);
      setErrors([
        {
          row: "-",
          field: [{ attribute: "import", errors: ["Upload failed."] }],
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg border-0">
          {/* Header */}
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">📂 Import Jobs</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Drag-and-drop + click to choose */}
            <label
              className={`border-2 rounded-3 p-5 w-100 text-center position-relative
                ${dragOver ? "bg-primary bg-opacity-10 border-primary" : "bg-light border-dashed"}
                transition-all`}
              style={{
                cursor: "pointer",
                borderStyle: "dashed",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <p className="text-success fw-bold fs-5 mb-0">{file.name}</p>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-up fs-1 text-secondary mb-2"></i>
                  <p className="text-muted mb-0">
                    Drag &amp; drop your file here <br />
                    <span className="fw-semibold text-primary">
                      or click to choose a file
                    </span>
                  </p>
                </>
              )}
              <input
                type="file"
                hidden
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFile(e.target.files[0]);
                }}
              />
            </label>

            {/* Validation Errors */}
            {errors.length > 0 && (
              <div className="mt-4">
                <h6 className="text-danger">⚠️ Validation Errors:</h6>
                <ul className="list-group">
                  {errors.map((err, idx) => (
                    <li key={idx} className="list-group-item">
                      <strong>Row {err.row}:</strong>{" "}
                      {err.field.map((f, i) => (
                        <span key={i} className="text-danger d-block">
                          {f.attribute} → {f.errors.join(", ")}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Close
            </button>
            <button
              className="btn btn-primary"
              disabled={!file || loading}
              onClick={handleUpload}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileImportModal;
