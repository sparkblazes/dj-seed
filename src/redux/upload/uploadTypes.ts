export interface UploadedFile {
  fileName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface UploadResponseSingle {
  success: boolean;
  message: string;
  data: UploadedFile;
}

export interface UploadResponseMultiple {
  success: boolean;
  message: string;
  data: UploadedFile[];
}

export interface usedeleteUploadimgMutation {
  success: boolean;
  message: string;
  filename: string;
}
