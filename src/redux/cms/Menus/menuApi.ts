import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Menu, MenuDropdown } from "./menuTypes";

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery,
  tagTypes: ["Menus"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchMenus: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Menu[];   // actual records
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
        url: "/cms/menus",
        method: "GET",
        params,
      }),
      providesTags: ["Menus"],
    }),

    // ✅ GET SINGLE MENU
    fetchMenuById: builder.query<Menu, string>({
      query: (uuid) => `/cms/menus/${uuid}`,
    }),

    // ✅ CREATE
    createMenu: builder.mutation<Menu, Partial<Menu>>({
      query: (menuData) => ({
        url: "/cms/menus",
        method: "POST",
        body: menuData,
      }),
      invalidatesTags: ["Menus"],
    }),

    // ✅ UPDATE
    updateMenu: builder.mutation<Menu, { uuid: string; menuData: Partial<Menu> }>({
      query: ({ uuid, menuData }) => ({
        url: `/cms/menus/${uuid}`,
        method: "PUT",
        body: menuData,
      }),
      invalidatesTags: ["Menus"],
    }),

    // ✅ DELETE
    deleteMenu: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/menus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menus"],
    }),

    // ✅ DROPDOWN JOBS
    fetchDropdownMenus: builder.query<MenuDropdown[], void>({
      query: () => `/cms/dropdown-menus`,
    }),

    // ✅ IMPORT JOBS
    importMenus: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/menus-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT JOBS
    exportMenus: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/menus-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchMenusQuery,
  useFetchMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useFetchDropdownMenusQuery,
  useImportMenusMutation,
  useExportMenusMutation,
} = menuApi;
