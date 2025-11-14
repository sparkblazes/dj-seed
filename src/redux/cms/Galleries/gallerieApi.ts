import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Gallerie, GallerieDropdown } from "./gallerieTypes";

export const gallerieApi = createApi({
  reducerPath: "gallerieApi",
  baseQuery,
  tagTypes: ["Galleries"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchGalleries: builder.query<
    {
            success: boolean;
            message: string;
            columns: string[];
            visible_columns: string[];
            data: {
              current_page: number;
              data: Gallerie[];   // actual records
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
        url: "/cms/galleries",
        method: "GET",
        params,
      }),
      providesTags: ["Galleries"],
    }),

    // ✅ GET SINGLE JOB
    fetchGallerieById: builder.query<Gallerie, string>({
      query: (uuid) => `/cms/galleries/${uuid}`,
    }),

    // ✅ CREATE
    createGallerie: builder.mutation<Gallerie, Partial<Gallerie>>({
      query: (gallerieData) => ({
        url: "/cms/galleries",
        method: "POST",
        body: gallerieData,
      }),
      invalidatesTags: ["Galleries"],
    }),

    // ✅ UPDATE
    updateGallerie: builder.mutation<Gallerie, { uuid: string; gallerieData: Partial<Gallerie> }>({
      query: ({ uuid, gallerieData }) => ({
        url: `/cms/galleries/${uuid}`,
        method: "PUT",
        body: gallerieData,
      }),
      invalidatesTags: ["Galleries"],
    }),

    // ✅ DELETE
    deleteGallerie: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/galleries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Galleries"],
    }),

    // ✅ DROPDOWN JOBS
    fetchDropdownGalleries: builder.query<GallerieDropdown[], void>({
      query: () => `/cms/dropdown-galleries`,
    }),

    // ✅ IMPORT JOBS
    importGalleries: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/galleries-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT JOBS
    exportGalleries: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/galleries-export",
        method: "POST",
        body: { uuids },
       responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchGalleriesQuery,
  useFetchGallerieByIdQuery,
  useCreateGallerieMutation,
  useUpdateGallerieMutation,
  useDeleteGallerieMutation,
  useFetchDropdownGalleriesQuery,
  useImportGalleriesMutation,
  useExportGalleriesMutation,
} = gallerieApi;
