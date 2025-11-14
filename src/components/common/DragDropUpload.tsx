import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import type { UploadedFile } from "../../redux/upload/uploadTypes";
import {
  useUploadSingleMutation,
  useUploadMultipleMutation,
} from "../../redux/upload/uploadApi";

interface DragDropUploadProps {
  multiple?: boolean;
  onUploadComplete?: (files: UploadedFile[] | UploadedFile) => void;
  maxFiles?: number;
  accept?: string;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  multiple = false,
  onUploadComplete,
  maxFiles = 5,
  accept = "image/*",
}) => {
  const [uploadSingle] = useUploadSingleMutation();
  const [uploadMultiple] = useUploadMultipleMutation();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      if (acceptedFiles.length > maxFiles) {
        setError(`You can upload up to ${maxFiles} file(s)`);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let uploaded: UploadedFile[] = [];

        if (multiple) {
          // ⬅ uploadMultiple returns UploadedFile[]
          const result = await uploadMultiple(acceptedFiles).unwrap();
          uploaded = result?.data;
          setFiles((prev) => [...prev, ...uploaded]);
        } else {
          // ⬅ uploadSingle returns UploadedFile
          const result = await uploadSingle(acceptedFiles[0]).unwrap();
          uploaded = [result?.data];
          setFiles(uploaded);
        }

        if (onUploadComplete)
          onUploadComplete(multiple ? uploaded : uploaded[0]);
      } catch (err: any) {
        setError(err?.data?.message || "Upload failed");
      } finally {
        setLoading(false);
      }
    },
    [uploadSingle, uploadMultiple, multiple, maxFiles, onUploadComplete]
  );

  const handleDelete = (fileName: string) => {
    const updatedFiles = files.filter((f) => f.fileName !== fileName);
    setFiles(updatedFiles);
    if (onUploadComplete)
      onUploadComplete(multiple ? updatedFiles : updatedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept
      ? accept.split(",").reduce((acc: Record<string, string[]>, type) => {
        acc[type.trim()] = [];
        return acc;
      }, {})
      : undefined,
  });

  return (
    <div className="p-4 border rounded-md w-full max-w-md mx-auto bg-white shadow-sm">
      {/* Dropzone area */}
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-md text-center cursor-pointer transition-all ${isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
          }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? "Drop the files here ..."
            : "Drag & drop files here, or click to select"}
        </p>
      </div>

      {loading && <p className="mt-2 text-blue-500">Uploading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* Uploaded image previews */}
      {files.length > 0 && (
        <div
          className={`grid gap-3 mt-4 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}
        >
          {files.map((file) => (
            <div
              key={file.fileName}
              className="relative group border rounded-md overflow-hidden bg-gray-100 shadow-sm"
            >
              {/* Delete button */}
              {/* <button
                type="button"
                onClick={() => handleDelete(file.fileName)}
                // className="absolute top-2 right-2"
                title="Delete file"
                style={{ marginLeft: "92%" }}               >
                <X size={14} strokeWidth={2} className="text-red-600" />
              </button> */}

              {/* Image */}
              {/* <img
                src={file.thumbnailUrl || file.fileUrl}
                alt={file.originalName}
                className="w-full h-32 object-cover rounded-md"
              /> */}

              {/* Filename */}
              {/* <p className="text-xs text-gray-600 mt-1 mb-1 px-1 text-center truncate">
                {file.originalName}
              </p> */}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DragDropUpload;
