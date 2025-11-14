import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Position, PositionDropdown } from "./positionTypes";

export const positionApi = createApi({
  reducerPath: "positionApi",
  baseQuery,
  tagTypes: ["Positions"],
  endpoints: (builder) => ({
    // ✅ GET POSITIONS WITH PAGINATION + SEARCH + SORT
    fetchPositions: builder.query<
          {
            success: boolean;
            message: string;
            columns: string[];
            visible_columns: string[];
            data: {
              current_page: number;
              data: Position[];   // actual records
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
        url: "/cms/position",
        method: "GET",
        params,
      }),
      providesTags: ["Positions"],
    }),

    // ✅ GET SINGLE Position
    fetchPositionById: builder.query<Position, string>({
      query: (uuid) => `/cms/position/${uuid}`,
    }),

    // ✅ CREATE
    createPosition: builder.mutation<Position, Partial<Position>>({
      query: (positionData) => ({
        url: "/cms/position",
        method: "POST",
        body: positionData,
      }),
      invalidatesTags: ["Positions"],
    }),

    // ✅ UPDATE
    updatePosition: builder.mutation<Position, { uuid: string; positionData: Partial<Position> }>({
      query: ({ uuid, positionData }) => ({
        url: `/cms/position/${uuid}`,
        method: "PUT",
        body: positionData,
      }),
      invalidatesTags: ["Positions"],
    }),

    // ✅ DELETE
    deletePosition: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/position/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),

    // ✅ DROPDOWN POSITIONS
    fetchDropdownPositions: builder.query<PositionDropdown[], void>({
      query: () => `/cms/dropdown-position`,
    }),

    // ✅ IMPORT POSITIONS
    importPositions: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/position-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT POSITIONS
    exportPositions: builder.mutation<any, { uuids: any[] }>({
      query: ({ uuids }) => ({
        url: "/cms/position-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchPositionsQuery,
  useFetchPositionByIdQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
  useFetchDropdownPositionsQuery,
  useImportPositionsMutation,
  useExportPositionsMutation,
} = positionApi;
