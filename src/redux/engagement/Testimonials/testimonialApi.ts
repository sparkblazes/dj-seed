import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Testimonial, TestimonialDropdown } from "./testimonialTypes";

export const testimonialApi = createApi({
  reducerPath: "testimonialApi",
  baseQuery,
  tagTypes: ["Testimonials"],
  endpoints: (builder) => ({
    // ✅ GET TESTIMONIAL WITH PAGINATION + SEARCH + SORT
    fetchTestimonials: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Testimonial[];   // actual records
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
        url: "/engagement/testimonials",
        method: "GET",
        params,
      }),
      providesTags: ["Testimonials"],
    }),

    // ✅ GET SINGLE TESTIMONIAL
    fetchTestimonialById: builder.query<Testimonial, string>({
      query: (uuid) => `/engagement/testimonials/${uuid}`,
    }),

    // ✅ CREATE
    createTestimonial: builder.mutation<Testimonial, Partial<Testimonial>>({
      query: (testimonialData) => ({
        url: "/engagement/testimonials",
        method: "POST",
        body: testimonialData,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    // ✅ UPDATE
    updateTestimonial: builder.mutation<Testimonial, { uuid: string; testimonialData: Partial<Testimonial> }>({
      query: ({ uuid, testimonialData }) => ({
        url: `/engagement/testimonials/${uuid}`,
        method: "PUT",
        body: testimonialData,
      }),
      invalidatesTags: ["Testimonials"],
    }),

    // ✅ DELETE
    deleteTestimonial: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/engagement/testimonials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonials"],
    }),

    // ✅ DROPDOWN TESTIMONIAL
    fetchDropdownTestimonials: builder.query<TestimonialDropdown[], void>({
      query: () => `/engagement/dropdown-testimonials`,
    }),

    // ✅ IMPORT TESTIMONIAL
    importTestimonials: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/engagement/testimonials-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT TESTIMONIAL
    exportTestimonials: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/engagement/testimonials-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchTestimonialsQuery,
  useFetchTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useFetchDropdownTestimonialsQuery,
  useImportTestimonialsMutation,
  useExportTestimonialsMutation,
} = testimonialApi;
