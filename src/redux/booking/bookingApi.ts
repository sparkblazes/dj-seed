import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/baseQuery";
import type { Booking, BookingDropdown } from "./bookingTypes";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery,
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    // ✅ GET BOOKINGS WITH PAGINATION + SEARCH + SORT
    fetchBookings: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Booking[];   // actual records
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
        url: "/bookings/booking",
        method: "GET",
        params,
      }),
      providesTags: ["Booking"],
    }),

    // ✅ GET SINGLE BOOKING
    fetchBookingById: builder.query<any, string>({
      query: (uuid) => `/bookings/booking/${uuid}`,
    }),

    // ✅ CREATE
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (bookingData) => ({
        url: "/bookings/booking",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    // ✅ UPDATE
    updateBooking: builder.mutation<
      Booking,
      { uuid: string; bookingData: Partial<Booking> }
    >({
      query: ({ uuid, bookingData }) => ({
        url: `/bookings/booking/${uuid}`,
        method: "PUT",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    // ✅ DELETE
    deleteBooking: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/bookings/booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),

    // ✅ DROPDOWN BOOKINGS
    fetchDropdownBookings: builder.query<BookingDropdown[], void>({
      query: () => `/dropdown-bookings`,
    }),

    // ✅ IMPORT BOOKINGS
    importBookings: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/bookings/booking-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT BOOKINGS
    exportBookings: builder.mutation<any, { uuids: any[] }>({
      query: ({ uuids }) => ({
        url: "/bookings/booking-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchBookingsQuery,
  useFetchBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useFetchDropdownBookingsQuery,
  useImportBookingsMutation,
  useExportBookingsMutation,
} = bookingApi;

