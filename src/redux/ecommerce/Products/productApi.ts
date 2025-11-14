import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type {
  Product,
  PaginationMeta,
  ProductDropdown,
  ProductDropdownResponse,
} from "./productTypes";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery,
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // ✅ GET PRODUCTS WITH PAGINATION + SEARCH + SORT
    fetchProducts: builder.query<
      { data: Product[]; meta: PaginationMeta },
      { per_page?: number; page?: number; search?: string; sort_by?: string; sort_order?: string }
    >({
      query: (params) => ({
        url: "/ecommerce/products",
        method: "GET",
        params,
      }),
      providesTags: ["Products"],
    }),

    // ✅ GET SINGLE PRODUCT
    fetchProductById: builder.query<Product, number>({
      query: (id) => `/ecommerce/products/${id}`,
    }),

    // ✅ CREATE
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (productData) => ({
        url: "/ecommerce/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ UPDATE
    updateProduct: builder.mutation<Product, { id: number; productData: Partial<Product> }>({
      query: ({ id, productData }) => ({
        url: `/ecommerce/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ DELETE
    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/ecommerce/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ DROPDOWN (static, no search)
    fetchDropdownProducts: builder.query<ProductDropdownResponse, void>({
      query: () => `/ecommerce/dropdown-products`,
    }),

    // ✅ DROPDOWN (with search)
    searchDropdownProducts: builder.query<ProductDropdownResponse, string>({
      query: (search) => `/ecommerce/dropdown-products?search=${search}`,
    }),

    // ✅ IMPORT
    importProducts: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/ecommerce/products-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT
    exportProducts: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/ecommerce/products-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchDropdownProductsQuery,
  useSearchDropdownProductsQuery,
  useLazySearchDropdownProductsQuery,
  useImportProductsMutation,
  useExportProductsMutation,
} = productApi;
