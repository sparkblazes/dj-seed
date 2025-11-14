import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Application, ApplicationDropdown } from "./applicationTypes";

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery,
  tagTypes: ["Application"],
  endpoints: (builder) => ({
    // ✅ GET APPLICATION WITH PAGINATION + SEARCH + SORT
    fetchApplications: builder.query<
      {
              success: boolean;
              message: string;
              columns: string[];
              visible_columns: string[];
              data: {
                current_page: number;
                data: Application[];   // actual records
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
        url: "/engagement/applications",
        method: "GET",
        params,
      }),
      providesTags: ["Application"],
    }),

    // ✅ GET SINGLE APPLICATION
    fetchApplicationById: builder.query<Application, string>({
      query: (uuid) => `/engagement/applications/${uuid}`,
    }),

    // ✅ CREATE
    createApplication: builder.mutation<Application, Partial<Application>>({
      query: (applicationData) => ({
        url: "/engagement/applications",
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Application"],
    }),

    // ✅ UPDATE
    updateApplication: builder.mutation<Application, { uuid: string; applicationData: Partial<Application> }>({
      query: ({ uuid, applicationData }) => ({
        url: `/engagement/applications/${uuid}`,
        method: "PUT",
        body: applicationData,
      }),
      invalidatesTags: ["Application"],
    }),

    // ✅ DELETE
    deleteApplication: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/engagement/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Application"],
    }),

    // ✅ DROPDOWN APPLICATIONS
    fetchDropdownApplications: builder.query<ApplicationDropdown[], void>({
      query: () => `/engagement/dropdown-applications`,
    }),

    // ✅ IMPORT APPLICATIONS
    importApplications: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/engagement/applications-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT APPLICATIONS
    exportApplications: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/engagement/applications-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchApplicationsQuery,
  useFetchApplicationByIdQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useFetchDropdownApplicationsQuery,
  useImportApplicationsMutation,
  useExportApplicationsMutation,
} = applicationApi;
