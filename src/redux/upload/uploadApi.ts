import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  UploadedFile,
  UploadResponseSingle,
  UploadResponseMultiple,
  usedeleteUploadimgMutation,
} from "./uploadTypes";
import baseQuery from "../../api/baseQuery";

/**
 * RTK Query API for file uploads
 */
export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery,
  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    // ===== SINGLE FILE UPLOAD =====
    uploadSingle: builder.mutation<UploadResponseSingle, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/files/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // ===== MULTIPLE FILE UPLOAD =====
    uploadMultiple: builder.mutation<UploadResponseMultiple, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        return {
          url: "/files/uploads",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Upload"],
    }),


    // ===== DELETE SINGLE FILE =====
    deleteUploadImg: builder.mutation<usedeleteUploadimgMutation, string>({
      query: (filename) => ({
        url: `/files/${filename}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Upload"],
    }),

  }),
});

export const {
  useUploadSingleMutation,
  useUploadMultipleMutation,
  useDeleteUploadImgMutation,
} = uploadApi;
