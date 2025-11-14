import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  UploadedFile,
  UploadResponseSingle,
  UploadResponseMultiple,
} from "./uploadTypes";
import { uploadApi } from "./uploadApi";

interface UploadState {
  loading: boolean;
  error: string | null;
  singleFile: UploadedFile | null;
  multipleFiles: UploadedFile[];
}

const initialState: UploadState = {
  loading: false,
  error: null,
  singleFile: null,
  multipleFiles: [],
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.singleFile = null;
      state.multipleFiles = [];
    },
  },
  extraReducers: (builder) => {
    // ===== SINGLE FILE UPLOAD =====
    builder.addMatcher(uploadApi.endpoints.uploadSingle.matchPending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(
      uploadApi.endpoints.uploadSingle.matchFulfilled,
      (state, action: PayloadAction<UploadResponseSingle>) => {
        state.loading = false;
        state.singleFile = action.payload.data; // ✅ use `.data`
      }
    );

    builder.addMatcher(uploadApi.endpoints.uploadSingle.matchRejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message || "Failed to upload single file";
    });

    // ===== MULTIPLE FILE UPLOAD =====
    builder.addMatcher(uploadApi.endpoints.uploadMultiple.matchPending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher(
      uploadApi.endpoints.uploadMultiple.matchFulfilled,
      (state, action: PayloadAction<UploadResponseMultiple>) => {
        state.loading = false;
        state.multipleFiles = action.payload.data; // ✅ use `.data`
      }
    );

    builder.addMatcher(uploadApi.endpoints.uploadMultiple.matchRejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message || "Failed to upload multiple files";
    });
  },
});

export const { reset } = uploadSlice.actions;
export default uploadSlice.reducer;
