import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../api/baseQuery";
import { setCredentials, logout } from "./authSlice";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: any;
  };
}

interface MeResponse {
  success: boolean;
  data: {
    user: any;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string; user: any },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => {
        return {
          token: response.data.token,
          user: response.data.user,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),

    me: builder.query<{ user: any }, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: MeResponse) => {
        return { user: response.data };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("me - fetched user:", data.user);
          dispatch(
            setCredentials({
              user: data,
              token: localStorage.getItem("token") || "",
            })
          );
        } catch (err) {
          // 🚀 If token expired, force logout
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
