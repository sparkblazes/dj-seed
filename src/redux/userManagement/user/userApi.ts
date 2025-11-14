// src/api/userApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type {
  UserListResponse,
  UserSingleResponse,
  CreateUserInput,
  UpdateUserInput,
  ApiResponse,
} from "./userTypes";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // ====== CREATE USER ======
    createUser: builder.mutation<UserSingleResponse, CreateUserInput>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // ====== GET ALL USERS ======
    getUsers: builder.query<UserListResponse, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),

    // ====== GET SINGLE USER ======
    getUserById: builder.query<UserSingleResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    // ====== UPDATE USER ======
    updateUser: builder.mutation<
    UserSingleResponse,
     { id: string; body: UpdateUserInput }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }, "Users"],
    }),

    // ====== DELETE SINGLE USER ======
    deleteUser: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Users", id }, "Users"],
    }),

    // ====== DELETE MULTIPLE USERS ======
    deleteMultipleUsers: builder.mutation<ApiResponse, { ids: string[] }>({
      query: (body) => ({
        url: "/users/delete-multiple",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    
    // ====== DROPDOWN USERS ======
    getUsersDropdown: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          users: { _id: string; name: string; email: string }[];
          pagination?: any;
        };
      },
      { search?: string }
    >({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params: { ...params, dropdown: true },
      }),
    }),


  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteMultipleUsersMutation,
  useGetUsersDropdownQuery,
} = userApi;
