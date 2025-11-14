import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/baseQuery";
import type {
  QRGenerateRecord,
  QRGenerateDropdown,
  QRGenerateListResponse,
  QRGenerateSingleResponse,
  QRGenerateConfigurationRecord,
} from "./QRGenerateTypes";

export const qrGenerateApi = createApi({
  reducerPath: "qrGenerateApi",
  baseQuery,
  tagTypes: ["QRGenerate"],
  endpoints: (builder) => ({
    // ✅ GET QR LIST WITH PAGINATION + SEARCH + SORT
    fetchQRGenerates: builder.query<
      QRGenerateListResponse,
      {
        per_page?: number;
        page?: number;
        search?: string;
        sort_by?: string;
        sort_order?: string;
        status?: number;
      }
    >({
      query: (params) => ({
        url: "/qrgenerate/qrcodes",
        method: "GET",
        params,
      }),
      providesTags: ["QRGenerate"],
    }),

    // ✅ GET SINGLE QR
    fetchQRGenerateById: builder.query<QRGenerateSingleResponse, string>({
      query: (uuid) => `/qrgenerate/qrcodes/${uuid}`,
      providesTags: (_r, _e, id) => [{ type: "QRGenerate", id }],
    }),

    // ✅ CREATE
    createQRGenerate: builder.mutation<QRGenerateRecord, Partial<QRGenerateRecord>>({
      query: (qrData) => ({
        url: "/qrgenerate/qrcodes",
        method: "POST",
        body: qrData,
      }),
      invalidatesTags: ["QRGenerate"],
    }),

    // ✅ UPDATE
    updateQRGenerate: builder.mutation<
      QRGenerateRecord,
      { uuid: string; qrData: Partial<QRGenerateRecord> | FormData }
    >({
      query: ({ uuid, qrData }) => ({
        url: `/qrgenerate/qrcodes/${uuid}`,
        method: "PUT",
        body: qrData,
      }),
      invalidatesTags: (_r, _e, { uuid }) => [{ type: "QRGenerate", id: uuid }],
    }),

    // ✅ DELETE
    deleteQRGenerate: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/qrgenerate/qrcodes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QRGenerate"],
    }),

    // ✅ DROPDOWN
    fetchDropdownQRGenerates: builder.query<QRGenerateDropdown[], void>({
      query: () => `/qrgenerate/qrcodes-qr-generates`,
    }),

    // ✅ UPDATE CONFIGURATION
    updateQRGenerateConfiguration: builder.mutation<
      QRGenerateConfigurationRecord,
      { qrData: Partial<QRGenerateConfigurationRecord> | FormData }
    >({
      query: (qrData) => ({
        url: "/qrgenerate/qrcodes-configuration",
        method: "POST",
        body: qrData,
      }),
      invalidatesTags: ["QRGenerate"],
    }),

    // ✅ GET CONFIGURATION
    fetchQRGenerateConfiguration: builder.query<QRGenerateConfigurationRecord, void>({
      query: () => `/qrgenerate/qrcodes-configuration`,
      providesTags: ["QRGenerate"],
    }),
  }),
});

export const {
  useFetchQRGeneratesQuery,
  useFetchQRGenerateByIdQuery,
  useCreateQRGenerateMutation,
  useUpdateQRGenerateMutation,
  useDeleteQRGenerateMutation,
  useFetchDropdownQRGeneratesQuery,
  useUpdateQRGenerateConfigurationMutation,
  useFetchQRGenerateConfigurationQuery,
} = qrGenerateApi;
