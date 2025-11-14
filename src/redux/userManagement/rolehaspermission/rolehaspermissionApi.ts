// src/redux/userManagement/rolehaspermission/rolehaspermissionApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type {
  RoleHasPermissionListResponse,
  RoleHasPermissionSingleResponse,
  CreateRoleHasPermissionInput,
  UpdateRoleHasPermissionInput,
  DropdownRoleHasPermissionResponse,
  ApiResponse,
} from "./rolehaspermissionTypes";

export const roleHasPermissionApi = createApi({
  reducerPath: "roleHasPermissionApi",
  baseQuery,
  tagTypes: ["RoleHasPermission"],
  endpoints: (builder) => ({
    // ✅ CREATE
    createRoleHasPermission: builder.mutation<
      RoleHasPermissionSingleResponse,
      CreateRoleHasPermissionInput
    >({
      query: (body) => ({
        url: "/role-has-permissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RoleHasPermission"],
    }),

    // ✅ GET ALL (Paginated List)
    getRoleHasPermissions: builder.query<
      RoleHasPermissionListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/role-has-permissions",
        method: "GET",
        params,
      }),
      providesTags: ["RoleHasPermission"],
    }),

    // ✅ GET BY ID
    getRoleHasPermissionById: builder.query<
      RoleHasPermissionSingleResponse,
      string
    >({
      query: (id) => `/role-has-permissions/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "RoleHasPermission", id },
      ],
    }),

    // ✅ UPDATE
    updateRoleHasPermission: builder.mutation<
      RoleHasPermissionSingleResponse,
      { id: string; body: UpdateRoleHasPermissionInput }
    >({
      query: ({ id, body }) => ({
        url: `/role-has-permissions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "RoleHasPermission", id },
        "RoleHasPermission",
      ],
    }),

    // ✅ DELETE
    deleteRoleHasPermission: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/role-has-permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "RoleHasPermission", id },
        "RoleHasPermission",
      ],
    }),

    // ✅ DELETE MULTIPLE
    deleteMultipleRoleHasPermissions: builder.mutation<
      ApiResponse,
      { ids: string[] }
    >({
      query: (body) => ({
        url: "/role-has-permissions/delete-multiple",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RoleHasPermission"],
    }),

    // ✅ DROPDOWN (for UI selection)
    dropdownRoleHasPermissions: builder.query<
      DropdownRoleHasPermissionResponse,
      { search?: string }
    >({
      query: (params) => ({
        url: "/role-has-permissions/dropdown",
        method: "GET",
        params,
      }),
      providesTags: ["RoleHasPermission"],
    }),
  }),
});

export const {
  useCreateRoleHasPermissionMutation,
  useGetRoleHasPermissionsQuery,
  useGetRoleHasPermissionByIdQuery,
  useUpdateRoleHasPermissionMutation,
  useDeleteRoleHasPermissionMutation,
  useDeleteMultipleRoleHasPermissionsMutation,
  useDropdownRoleHasPermissionsQuery,
} = roleHasPermissionApi;
