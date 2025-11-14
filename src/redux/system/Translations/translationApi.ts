import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Translation, TranslationDropdown } from "./translationTypes";

export const translationApi = createApi({
  reducerPath: "translationApi",
  baseQuery,
  tagTypes: ["Translations"],
  endpoints: (builder) => ({
    // ✅ GET TRANSLATION WITH PAGINATION + SEARCH + SORT
    fetchTranslations: builder.query<
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
        url: "/system/translations",
        method: "GET",
        params,
      }),
      providesTags: ["Translations"],
    }),

    // ✅ GET SINGLE TRANSLATION
    fetchTranslationById: builder.query<Translation, string>({
      query: (uuid) => `/system/translations/${uuid}`,
    }),

    // ✅ CREATE
    createTranslation: builder.mutation<Translation, Partial<Translation>>({
      query: (translationData) => ({
        url: "/system/translations",
        method: "POST",
        body: translationData,
      }),
      invalidatesTags: ["Translations"],
    }),

    // ✅ UPDATE
    updateTranslation: builder.mutation<Translation, { uuid: string; translationData: Partial<Translation> }>({
      query: ({ uuid, translationData }) => ({
        url: `/system/translations/${uuid}`,
        method: "PUT",
        body: translationData,
      }),
      invalidatesTags: ["Translations"],
    }),

    // ✅ DELETE
    deleteTranslation: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/system/translations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Translations"],
    }),

    // ✅ DROPDOWN TRANSLATIONS
    fetchDropdownTranslations: builder.query<TranslationDropdown[], void>({
      query: () => `/system/dropdown-translations`,
    }),

    // ✅ IMPORT TRANSLATIONS
    importTranslations: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/system/translations-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT TRANSLATIONS
    exportTranslations: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/system/translations-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchTranslationsQuery,
  useFetchTranslationByIdQuery,
  useCreateTranslationMutation,
  useUpdateTranslationMutation,
  useDeleteTranslationMutation,
  useFetchDropdownTranslationsQuery,
  useImportTranslationsMutation,
  useExportTranslationsMutation,
} = translationApi;
