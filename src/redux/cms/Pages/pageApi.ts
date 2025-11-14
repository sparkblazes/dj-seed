import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Page, PageDropdown } from "./pageTypes";

export const pageApi = createApi({
  reducerPath: "pageApi",
  baseQuery,
  tagTypes: ["Pages"],
  endpoints: (builder) => ({
    // ✅ GET PAGES WITH PAGINATION + SEARCH + SORT
    fetchPages: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Page[];      // actual records
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
        url: "/cms/pages",
        method: "GET",
        params,
      }),
      providesTags: ["Pages"],
    }),

    // ✅ GET SINGLE PAGE BY ID
    fetchPageById: builder.query<Page, string>({
      query: (uuid) => `/cms/pages/${uuid}`,
    }),

    // ✅ CREATE PAGE
    createPage: builder.mutation<Page, Partial<Page>>({
      query: (pageData) => ({
        url: "/cms/pages",
        method: "POST",
        body: pageData,
      }),
      invalidatesTags: ["Pages"],
    }),

    // ✅ UPDATE PAGE
    updatePage: builder.mutation<Page, { uuid: string; pageData: Partial<Page> }>({
      query: ({ uuid, pageData }) => ({
        url: `/cms/pages/${uuid}`,
        method: "PUT",
        body: pageData,
      }),
      invalidatesTags: ["Pages"],
    }),

    // ✅ DELETE PAGE
    deletePage: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pages"],
    }),

    // ✅ DROPDOWN PAGES (for selects / async search)
    fetchDropdownPages: builder.query<PageDropdown[], void>({
      query: () => `/cms/dropdown-pages`,
    }),

    // ✅ IMPORT PAGES
    importPages: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/pages-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT PAGES
    exportPages: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/pages-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchPagesQuery,
  useFetchPageByIdQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useFetchDropdownPagesQuery,
  useImportPagesMutation,
  useExportPagesMutation,
  // 👇 RTK automatically creates the lazy version for you:
  useLazyFetchDropdownPagesQuery,
} = pageApi;
