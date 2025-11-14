import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Event, EventDropdown } from "./eventTypes";

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery,
  tagTypes: ["Events"],
  endpoints: (builder) => ({
    // ✅ GET EVENT WITH PAGINATION + SEARCH + SORT
    fetchEvents: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Event[];   // actual records
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
        url: "/engagement/events",
        method: "GET",
        params,
      }),
      providesTags: ["Events"],
    }),

    // ✅ GET SINGLE EVENT
    fetchEventById: builder.query<Event, string>({
      query: (uuid) => `/engagement/events/${uuid}`,
    }),

    // ✅ CREATE
    createEvent: builder.mutation<Event, Partial<Event>>({
      query: (eventData) => ({
        url: "/engagement/events",
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["Events"],
    }),

    // ✅ UPDATE
    updateEvent: builder.mutation<Event, { uuid: string; eventData: Partial<Event> }>({
      query: ({ uuid, eventData }) => ({
        url: `/engagement/events/${uuid}`,
        method: "PUT",
        body: eventData,
      }),
      invalidatesTags: ["Events"],
    }),

    // ✅ DELETE
    deleteEvent: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/engagement/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),

    // ✅ DROPDOWN EVENTS
    fetchDropdownEvents: builder.query<EventDropdown[], void>({
      query: () => `/engagement/dropdown-events`,
    }),

    // ✅ IMPORT EVENTS
    importEvents: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/engagement/events-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT EVENTS
    exportEvents: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/engagement/events-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchEventsQuery,
  useFetchEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useFetchDropdownEventsQuery,
  useImportEventsMutation,
  useExportEventsMutation,
} = eventApi;
