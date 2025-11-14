import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Job, JobDropdown } from "./jobTypes";

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery,
  tagTypes: ["Jobs"],
  endpoints: (builder) => ({
    // ✅ GET JOBS WITH PAGINATION + SEARCH + SORT
    fetchJobs: builder.query<
        {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Job[];   // actual records
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
        url: "/engagement/jobs",
        method: "GET",
        params,
      }),
      providesTags: ["Jobs"],
    }),

    // ✅ GET SINGLE JOB
    fetchJobById: builder.query<any, string>({
      query: (uuid) => `/engagement/jobs/${uuid}`,
    }),

    // ✅ CREATE
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (jobData) => ({
        url: "/engagement/jobs",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Jobs"],
    }),

    // ✅ UPDATE
    updateJob: builder.mutation<Job, { uuid: string; jobData: Partial<Job> }>({
      query: ({ uuid, jobData }) => ({
        url: `/engagement/jobs/${uuid}`,
        method: "PUT",
        body: jobData,
      }),
      invalidatesTags: ["Jobs"],
    }),

    // ✅ DELETE
    deleteJob: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/engagement/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),

    // ✅ DROPDOWN JOBS
    fetchDropdownJobs: builder.query<JobDropdown[], void>({
      query: () => `/engagement/dropdown-jobs`,
    }),

    // ✅ DROPDOWN JOBS
    useLazyFetchDropdownJobsQuery: builder.query<JobDropdown[], any>({
      query: (search) => `/engagement/dropdown-jobs?search=${search}`,
    }),

    // ✅ IMPORT JOBS
    importJobs: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/engagement/jobs-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT JOBS
    exportJobs: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/engagement/jobs-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchJobsQuery,
  useFetchJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useFetchDropdownJobsQuery,
  useImportJobsMutation,
  useExportJobsMutation,
  useLazyFetchDropdownJobsQuery,
} = jobApi;
