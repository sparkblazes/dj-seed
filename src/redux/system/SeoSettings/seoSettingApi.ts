import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { SeoSetting, SeoSettingDropdown } from "./seoSettingTypes";

export const seoSettingApi = createApi({
  reducerPath: "seoSettingApi",
  baseQuery,
  tagTypes: ["SeoSettings"],
  endpoints: (builder) => ({
    // ✅ GET SEOSETTING WITH PAGINATION + SEARCH + SORT
    fetchSeoSettings: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: SeoSetting[];   // actual records
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
        url: "/system/seosettings",
        method: "GET",
        params,
      }),
      providesTags: ["SeoSettings"],
    }),

    // ✅ GET SINGLE SEOSETTING
    fetchSeoSettingById: builder.query<SeoSetting, string>({
      query: (uuid) => `/system/seosettings/${uuid}`,
    }),

    // ✅ CREATE
    createSeoSetting: builder.mutation<SeoSetting, Partial<SeoSetting>>({
      query: (seoSettingData) => ({
        url: "/system/seosettings",
        method: "POST",
        body: seoSettingData,
      }),
      invalidatesTags: ["SeoSettings"],
    }),

    // ✅ UPDATE
    updateSeoSetting: builder.mutation<SeoSetting, { uuid: string; seoSettingData: Partial<SeoSetting> }>({
      query: ({ uuid, seoSettingData }) => ({
        url: `/system/seosettings/${uuid}`,
        method: "PUT",
        body: seoSettingData,
      }),
      invalidatesTags: ["SeoSettings"],
    }),

    // ✅ DELETE
    deleteSeoSetting: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/system/seosettings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SeoSettings"],
    }),

    // ✅ DROPDOWN SEOSETTINGS
    fetchDropdownSeoSettings: builder.query<SeoSettingDropdown[], void>({
      query: () => `/system/dropdown-seosettings`,
    }),

    // ✅ IMPORT SEOSETTINGS
    importSeoSettings: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/system/seosettings-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT SEOSETTINGS
    exportSeoSettings: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/system/seosettings-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchSeoSettingsQuery,
  useFetchSeoSettingByIdQuery,
  useCreateSeoSettingMutation,
  useUpdateSeoSettingMutation,
  useDeleteSeoSettingMutation,
  useFetchDropdownSeoSettingsQuery,
  useImportSeoSettingsMutation,
  useExportSeoSettingsMutation,
} = seoSettingApi;
