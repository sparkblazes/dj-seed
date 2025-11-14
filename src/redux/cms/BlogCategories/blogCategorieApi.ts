import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { BlogCategorie, BlogCategorieDropdown } from "./blogCategorieTypes";

export const blogCategorieApi = createApi({
  reducerPath: "blogCategorieApi",
  baseQuery,
  tagTypes: ["BlogCategories"],
  endpoints: (builder) => ({
    // ✅ GET BLOGCATEGORIES WITH PAGINATION + SEARCH + SORT
    fetchBlogCategories: builder.query<
             {
                  success: boolean;
                  message: string;
                  columns: string[];
                  visible_columns: string[];
                  data: {
                    current_page: number;
                    data: BlogCategorie[];   // actual records
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
        url: "/cms/blog-categories",
        method: "GET",
        params,
      }),
      providesTags: ["BlogCategories"],
    }),

    // ✅ GET SINGLE BLOGCATEGORIES
    fetchBlogCategorieById: builder.query<BlogCategorie, string>({
      query: (id) => `/cms/blog-categories/${id}`,
    }),

    // ✅ CREATE
    createBlogCategorie: builder.mutation<BlogCategorie, Partial<BlogCategorie>>({
      query: (blogCategorieData) => ({
        url: "/cms/blog-categories",
        method: "POST",
        body: blogCategorieData,
      }),
      invalidatesTags: ["BlogCategories"],
    }),

    // ✅ UPDATE
    updateBlogCategorie: builder.mutation<BlogCategorie, { uuid: string; blogCategorieData: Partial<BlogCategorie> }>({
      query: ({ uuid, blogCategorieData }) => ({
        url: `/cms/blog-categories/${uuid}`,
        method: "PUT",
        body: blogCategorieData,
      }),
      invalidatesTags: ["BlogCategories"],
    }),

    // ✅ DELETE
    deleteBlogCategorie: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/blog-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogCategories"],
    }),

    // ✅ DROPDOWN BLOGCATEGORIES
    fetchDropdownBlogCategories: builder.query<BlogCategorieDropdown[], void>({
      query: () => `/cms/dropdown-blog-categories`,
    }),

    // ✅ DROPDOWN FAQCATEGORIES
    LazyFetchDropdownBlogCategoriesQuery: builder.query<BlogCategorieDropdown[], any>({
      query: (search) => `/cms/dropdown-blogs?search=${search}`,
    }),

    // ✅ IMPORT BLOGCATEGORIES
    importBlogCategories: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/blog-categories-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT BLOGCATEGORIES
    exportBlogCategories: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/blog-categories-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchBlogCategoriesQuery,
  useFetchBlogCategorieByIdQuery,
  useCreateBlogCategorieMutation,
  useUpdateBlogCategorieMutation,
  useDeleteBlogCategorieMutation,
  useFetchDropdownBlogCategoriesQuery,
  useImportBlogCategoriesMutation,
  useExportBlogCategoriesMutation,
  useLazyFetchDropdownBlogCategoriesQuery,
} = blogCategorieApi;
