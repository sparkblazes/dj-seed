import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { ProductCategorie, PaginationMeta, ProductCategorieDropdown } from "./productCategorieTypes";

export const productCategorieApi = createApi({
  reducerPath: "productCategorieApi",
  baseQuery,
  tagTypes: ["ProductCategories"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchProductCategories: builder.query<
      { data: ProductCategorie[]; meta: PaginationMeta },
      { per_page?: number; page?: number; search?: string; sort_by?: string; sort_order?: string }
    >({
      query: (params) => ({
        url: "/ecommerce/product-categories",
        method: "GET",
        params,
      }),
      providesTags: ["ProductCategories"],
    }),

    // ✅ GET SINGLE JOB
    fetchProductCategorieById: builder.query<ProductCategorie, number>({
      query: (id) => `/ecommerce/product-categories/${id}`,
    }),

    // ✅ CREATE
    createProductCategorie: builder.mutation<ProductCategorie, Partial<ProductCategorie>>({
      query: (productCategorieData) => ({
        url: "/ecommerce/product-categories",
        method: "POST",
        body: productCategorieData,
      }),
      invalidatesTags: ["ProductCategories"],
    }),

    // ✅ UPDATE
    updateProductCategorie: builder.mutation<ProductCategorie, { id: number; productCategorieData: Partial<ProductCategorie> }>({
      query: ({ id, productCategorieData }) => ({
        url: `/ecommerce/product-categories/${id}`,
        method: "PUT",
        body: productCategorieData,
      }),
      invalidatesTags: ["ProductCategories"],
    }),

    // ✅ DELETE
    deleteProductCategorie: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/ecommerce/product-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductCategories"],
    }),

    // ✅ DROPDOWN JOBS
    fetchDropdownProductCategories: builder.query<ProductCategorieDropdown[], void>({
      query: () => `/ecommerce/dropdown-product-categories`,
    }),

    // ✅ IMPORT JOBS
    importProductCategories: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/ecommerce/product-categories-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT JOBS
    exportProductCategories: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/ecommerce/product-categories-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchProductCategoriesQuery,
  useFetchProductCategorieByIdQuery,
  useCreateProductCategorieMutation,
  useUpdateProductCategorieMutation,
  useDeleteProductCategorieMutation,
  useFetchDropdownProductCategoriesQuery,
  useImportProductCategoriesMutation,
  useExportProductCategoriesMutation,
} = productCategorieApi;
