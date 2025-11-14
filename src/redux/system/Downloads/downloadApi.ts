import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Download, DownloadDropdown } from "./downloadTypes";

export const downloadApi = createApi({
  reducerPath: "downloadApi",
  baseQuery,
  tagTypes: ["Downloads"],
  endpoints: (builder) => ({
    // ✅ GET APITOKEN WITH PAGINATION + SEARCH + SORT
    fetchDownloads: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Download[];   // actual records
          last_page: number;
          per_page: number;
          total: number;
        };
      },
      {
        per_page?: number;
        page?: number;
        search?: string;
        sort_by?: string;
        sort_order?: string;
      }
    >({
      query: (params) => ({
        url: "/system/downloads",
        method: "GET",
        params,
      }),
      providesTags: ["Downloads"],
    }),

    // ✅ GET SINGLE APITOKEN
    fetchDownloadById: builder.query<any, string>({
      query: (uuid) => `/system/downloads/${uuid}`,
    }),

    // ✅ CREATE
    createDownload: builder.mutation<Download, Partial<Download>>({
      query: (downloadData) => ({
        url: "/system/downloads",
        method: "POST",
        body: downloadData,
      }),
      invalidatesTags: ["Downloads"],
    }),

    // ✅ UPDATE
    updateDownload: builder.mutation<Download, { uuid: string; downloadData: Partial<Download> }>({
      query: ({ uuid, downloadData }) => ({
        url: `/system/downloads/${uuid}`,
        method: "PUT",
        body: downloadData,
      }),
      invalidatesTags: ["Downloads"],
    }),

    // ✅ DELETE
    deleteDownload: builder.mutation<{ success: boolean; uuid: number }, number>({
      query: (id) => ({
        url: `/system/downloads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Downloads"],
    }),

    // ✅ DROPDOWN APITOKENS
    fetchDropdownDownloads: builder.query<DownloadDropdown[], void>({
      query: () => `/system/dropdown-downloads`,
    }),

    // ✅ IMPORT APITOKENS
    importDownloads: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/system/downloads-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT APITOKENS
    exportDownloads: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/system/downloads-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchDownloadsQuery,
  useFetchDownloadByIdQuery,
  useCreateDownloadMutation,
  useUpdateDownloadMutation,
  useDeleteDownloadMutation,
  useFetchDropdownDownloadsQuery,
  useImportDownloadsMutation,
  useExportDownloadsMutation,
} = downloadApi;
