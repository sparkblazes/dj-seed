import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type {
  ModuleList,
  ModuleListResponse,
  ModuleSingleResponse,
  CreateModuleInput,
  UpdateModuleInput,
  DropdownModuleListResponse,
  ApiResponse,
} from "./moduleTypes";

export const moduleApi = createApi({
  reducerPath: "moduleApi",
  baseQuery,
  tagTypes: ["Modules"],
  endpoints: (builder) => ({
    // ✅ CREATE MODULE
    createModule: builder.mutation<ModuleSingleResponse, CreateModuleInput>({
      query: (body) => ({
        url: "/modules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Modules"],
    }),

    // ✅ GET ALL MODULES (Paginated List)
    getModules: builder.query<
      ModuleListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/modules",
        method: "GET",
        params,
      }),
      providesTags: ["Modules"],
    }),

    // ✅ GET SINGLE MODULE BY ID
    getModuleById: builder.query<ModuleSingleResponse, string>({
      query: (id) => `/modules/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Modules", id }],
    }),

    // ✅ UPDATE MODULE
    updateModule: builder.mutation<
      ModuleSingleResponse,
      { id: string; body: UpdateModuleInput }
    >({
      query: ({ id, body }) => ({
        url: `/modules/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Modules", id },
        "Modules",
      ],
    }),

    // ✅ DELETE SINGLE MODULE
    deleteModule: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/modules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Modules", id },
        "Modules",
      ],
    }),

    // ✅ DELETE MULTIPLE MODULES
    deleteMultipleModules: builder.mutation<ApiResponse, { ids: string[] }>({
      query: (body) => ({
        url: "/modules/delete-multiple",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Modules"],
    }),

    // ✅ DROPDOWN API
    dropdownModules: builder.query<
      DropdownModuleListResponse,
      { search?: string }
    >({
      query: (params) => ({
        url: "/modules/dropdown",
        method: "GET",
        params,
      }),
      providesTags: ["Modules"],
    }),
  }),
});

export const {
  useCreateModuleMutation,
  useGetModulesQuery,
  useGetModuleByIdQuery,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useDeleteMultipleModulesMutation,
  useDropdownModulesQuery,
} = moduleApi;
