import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Banner, BannerDropdown } from "./bannerTypes";

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery,
  tagTypes: ["Banners"],
  endpoints: (builder) => ({
    // ✅ GET BANNERS WITH PAGINATION + SEARCH + SORT
    fetchBanners: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Banner[];   // actual records
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
        url: "/cms/banners",
        method: "GET",
        params,
      }),
      providesTags: ["Banners"],
    }),

    // ✅ GET SINGLE BANNER
    fetchBannerById: builder.query<Banner, string>({
      query: (uuid) => `/cms/banners/${uuid}`,
    }),

    // ✅ CREATE
    createBanner: builder.mutation<Banner, Partial<Banner>>({
      query: (bannerData) => ({
        url: "/cms/banners",
        method: "POST",
        body: bannerData,
      }),
      invalidatesTags: ["Banners"],
    }),

    // ✅ UPDATE
    updateBanner: builder.mutation<Banner, { uuid: string; bannerData: Partial<Banner> }>({
      query: ({ uuid, bannerData }) => ({
        url: `/cms/banners/${uuid}`,
        method: "PUT",
        body: bannerData,
      }),
      invalidatesTags: ["Banners"],
    }),

    // ✅ DELETE
    deleteBanner: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),

    // ✅ DROPDOWN BANNERS
    fetchDropdownBanners: builder.query<BannerDropdown[], void>({
      query: () => `/cms/dropdown-banners`,
    }),

    // ✅ IMPORT BANNERS
    importBanners: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/banners-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT BANNERS
    exportBanners: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/banners-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchBannersQuery,
  useFetchBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useFetchDropdownBannersQuery,
  useImportBannersMutation,
  useExportBannersMutation,
} = bannerApi;
