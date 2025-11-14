// src/api/baseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../redux/store";
import config from "../config";

// Create a raw fetchBaseQuery instance
const rawBaseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl, // e.g. "http://localhost:8000/api"
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom wrapper to handle unauthorized redirects
const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // clear token from redux + localStorage
    api.dispatch({ type: "auth/logout" });

    // redirect to login
    window.location.href = "/login";
  }

  return result;
};

export default baseQuery;
