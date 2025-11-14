import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Ticket, PaginationMeta, TicketDropdown } from "./ticketTypes";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery,
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchTickets: builder.query<
      { data: Ticket[]; meta: PaginationMeta },
      { per_page?: number; page?: number; search?: string; sort_by?: string; sort_order?: string }
    >({
      query: (params) => ({
        url: "/support/tickets",
        method: "GET",
        params,
      }),
      providesTags: ["Tickets"],
    }),

    // ✅ GET SINGLE JOB
    fetchTicketById: builder.query<Ticket, number>({
      query: (id) => `/support/tickets/${id}`,
    }),

    // ✅ CREATE
    createTicket: builder.mutation<Ticket, Partial<Ticket>>({
      query: (ticketData) => ({
        url: "/support/tickets",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["Tickets"],
    }),

    // ✅ UPDATE
    updateTicket: builder.mutation<Ticket, { id: number; ticketData: Partial<Ticket> }>({
      query: ({ id, ticketData }) => ({
        url: `/support/tickets/${id}`,
        method: "PUT",
        body: ticketData,
      }),
      invalidatesTags: ["Tickets"],
    }),

    // ✅ DELETE
    deleteTicket: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/support/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
    }),

    // ✅ DROPDOWN JOBS
    fetchDropdownTickets: builder.query<TicketDropdown[], void>({
      query: () => `/support/dropdown-tickets`,
    }),

    // ✅ IMPORT JOBS
    importTickets: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/support/tickets-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT JOBS
    exportTickets: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/support/tickets-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchTicketsQuery,
  useFetchTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useFetchDropdownTicketsQuery,
  useImportTicketsMutation,
  useExportTicketsMutation,
} = ticketApi;
