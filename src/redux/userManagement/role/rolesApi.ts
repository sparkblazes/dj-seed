// src/api/roles.api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type {
    RoleListResponse,
    RoleSingleResponse,
    DropdownRoleResponse,
    CreateRoleInput,
    UpdateRoleInput,
    ApiResponse,
} from "./rolesTypes";

export const rolesApi = createApi({
    reducerPath: "rolesApi",
    baseQuery,
    tagTypes: ["Roles"],

    endpoints: (builder) => ({
        // ====== CREATE ROLE ======
        createRole: builder.mutation<RoleSingleResponse, CreateRoleInput>({
            query: (body) => ({
                url: "/roles",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),

        // ====== GET ALL ROLES ======
        getRoles: builder.query<
            RoleListResponse,
            { page?: number; limit?: number; search?: string; status?: string }
        >({
            query: (params) => ({
                url: "/roles",
                method: "GET",
                params,
            }),
            providesTags: ["Roles"],
        }),

        // ====== GET SINGLE ROLE ======
        getRoleById: builder.query<RoleSingleResponse, string>({
            query: (id) => `/roles/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Roles", id }],
        }),

        // ====== UPDATE ROLE ======
        updateRole: builder.mutation<RoleSingleResponse, { id: string; body: UpdateRoleInput }>({
            query: ({ id, body }) => ({
                url: `/roles/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Roles", id }, "Roles"],
        }),

        // ====== DELETE SINGLE ROLE ======
        deleteRole: builder.mutation<ApiResponse, string>({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "Roles", id }, "Roles"],
        }),

        // ====== DELETE MULTIPLE ROLES ======
        deleteMultipleRoles: builder.mutation<
            ApiResponse,
            { ids: string[] }
        >({
            query: (body) => ({
                url: "/roles/delete-multiple",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),

        // ✅ DROPDOWN API (for dynamic search)
        dropdownRole: builder.query<
            DropdownRoleResponse,
            { search?: string }
        >({
            query: (params) => ({
                url: "/roles/dropdown",
                method: "GET",
                params,
            }),
            providesTags: ["Roles"],
        }),


    }),
});

export const {
    useCreateRoleMutation,
    useGetRolesQuery,
    useGetRoleByIdQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useDeleteMultipleRolesMutation,
    useDropdownRoleQuery,
} = rolesApi;
