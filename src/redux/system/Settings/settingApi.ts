import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Setting, SettingDropdown } from "./settingTypes";

export const settingApi = createApi({
  reducerPath: "settingApi",
  baseQuery,
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    // ✅ GET APITOKEN WITH PAGINATION + SEARCH + SORT
    fetchSettings: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Permissions[];   // actual records
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
        url: "/system/settings",
        method: "GET",
        params,
      }),
      providesTags: ["Settings"],
    }),

    // ✅ GET SINGLE APITOKEN
    fetchSettingById: builder.query<Setting, string>({
      query: (uuid) => `/system/settings/${uuid}`,
    }),

    // ✅ CREATE
    createSetting: builder.mutation<Setting, Partial<Setting>>({
      query: (settingData) => ({
        url: "/system/settings",
        method: "POST",
        body: settingData,
      }),
      invalidatesTags: ["Settings"],
    }),

    // ✅ UPDATE
    updateSetting: builder.mutation<Setting, { uuid: string; settingData: Partial<Setting> }>({
      query: ({ uuid, settingData }) => ({
        url: `/system/settings/${uuid}`,
        method: "PUT",
        body: settingData,
      }),
      invalidatesTags: ["Settings"],
    }),

    // ✅ DELETE
    deleteSetting: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/system/settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),

    // ✅ DROPDOWN APITOKENS
    fetchDropdownSettings: builder.query<SettingDropdown[], void>({
      query: () => `/system/dropdown-settings`,
    }),

    // ✅ IMPORT APITOKENS
    importSettings: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/system/settings-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT APITOKENS
    exportSettings: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/system/settings-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchSettingsQuery,
  useFetchSettingByIdQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
  useFetchDropdownSettingsQuery,
  useImportSettingsMutation,
  useExportSettingsMutation,
} = settingApi;
