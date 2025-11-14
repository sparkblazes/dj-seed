// src/redux/userManagement/permissions/permissionsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type {
  PermissionListResponse,
  PermissionSingleResponse,
  DropdownPermissionListResponse,
  CreatePermissionInput,
  UpdatePermissionInput,
  ApiResponse,
  ModulePermissionListResponse
} from "./permissionsTypes";

export const permissionsApi = createApi({
  reducerPath: "permissionsApi",
  baseQuery,
  tagTypes: ["Permissions"],

  endpoints: (builder) => ({
    // ====== CREATE PERMISSION ======
    createPermission: builder.mutation<PermissionSingleResponse, CreatePermissionInput>({
      query: (body) => ({
        url: "/permissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Permissions"],
    }),

    // ====== GET ALL PERMISSIONS ======
    getPermissions: builder.query<PermissionListResponse, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: "/permissions",
        method: "GET",
        params,
      }),
      providesTags: ["Permissions"],
    }),
    // ====== GET MODULE-WISE PERMISSIONS ======
    getModuleWisePermission: builder.query<ModulePermissionListResponse, any>({
      query: () => ({
        url: "/permissions/modual-wise-premission",
        method: "GET",
      }),
      providesTags: ["Permissions"],
    }),

    // ====== GET SINGLE PERMISSION ======
    getPermissionById: builder.query<PermissionSingleResponse, string>({
      query: (id) => `/permissions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Permissions", id }],
    }),

    // ====== UPDATE PERMISSION ======
    updatePermission: builder.mutation<PermissionSingleResponse, { id: string; body: UpdatePermissionInput }>({
      query: ({ id, body }) => ({
        url: `/permissions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Permissions", id },
        "Permissions",
      ],
    }),

    // ====== DELETE SINGLE PERMISSION ======
    deletePermission: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Permissions", id },
        "Permissions",
      ],
    }),

    // ====== DELETE MULTIPLE PERMISSIONS ======
    deleteMultiplePermissions: builder.mutation<ApiResponse, { ids: string[] }>({
      query: (body) => ({
        url: "/permissions/delete-multiple",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Permissions"],
    }),

    // ====== DROPDOWN PERMISSIONS (dynamic search) ======
    dropdownPermissions: builder.query<
      DropdownPermissionListResponse,
      { search?: string }
    >({
      query: (params) => ({
        url: "/permissions/dropdown",
        method: "GET",
        params,
      }),
      providesTags: ["Permissions"],
    }),

  }),
});

export const {
  useCreatePermissionMutation,
  useGetPermissionsQuery,
  useGetModuleWisePermissionQuery,
  useGetPermissionByIdQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useDeleteMultiplePermissionsMutation,
  useDropdownPermissionsQuery, // ✅ new hook for dropdown
} = permissionsApi;
