import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Language, LanguageDropdown } from "./languageTypes";

export const languageApi = createApi({
  reducerPath: "languageApi",
  baseQuery,
  tagTypes: ["Languages"],
  endpoints: (builder) => ({
    // ✅ GET LANGUAGE WITH PAGINATION + SEARCH + SORT
    fetchLanguages: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Language[];   // actual records
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
        url: "/system/languages",
        method: "GET",
        params,
      }),
      providesTags: ["Languages"],
    }),

    // ✅ GET SINGLE LANGUAGE
    fetchLanguageById: builder.query<Language, string>({
      query: (uuid) => `/system/languages/${uuid}`,
    }),

    // ✅ CREATE
    createLanguage: builder.mutation<Language, Partial<Language>>({
      query: (languageData) => ({
        url: "/system/languages",
        method: "POST",
        body: languageData,
      }),
      invalidatesTags: ["Languages"],
    }),

    // ✅ UPDATE
    updateLanguage: builder.mutation<Language, { uuid: string; languageData: Partial<Language> }>({
      query: ({ uuid, languageData }) => ({
        url: `/system/languages/${uuid}`,
        method: "PUT",
        body: languageData,
      }),
      invalidatesTags: ["Languages"],
    }),

    // ✅ DELETE
    deleteLanguage: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/system/languages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Languages"],
    }),

    // ✅ DROPDOWN LANGUAGES
    fetchDropdownLanguages: builder.query<LanguageDropdown[], void>({
      query: () => `/system/dropdown-languages`,
    }),

    // ✅ DROPDOWN LANGUAGES
    LazyFetchDropdownLanguagesQuery: builder.query<LanguageDropdown[], any>({
      query: (search) => `/system/dropdown-languages?search=${search}`,
    }),

    // ✅ IMPORT LANGUAGES
    importLanguages: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/system/languages-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT LANGUAGES
    exportLanguages: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/system/languages-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchLanguagesQuery,
  useFetchLanguageByIdQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
  useFetchDropdownLanguagesQuery,
  useImportLanguagesMutation,
  useExportLanguagesMutation,
  useLazyFetchDropdownLanguagesQuery,
} = languageApi;
