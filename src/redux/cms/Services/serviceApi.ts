import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Service, ServiceDropdown } from "./serviceTypes";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery,
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    // ✅ GET SERVICES WITH PAGINATION + SEARCH + SORT
    fetchServices: builder.query<
      {
            success: boolean;
            message: string;
            columns: string[];
            visible_columns: string[];
            data: {
              current_page: number;
              data: Service[];   // actual records
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
        url: "/cms/services",
        method: "GET",
        params,
      }),
      providesTags: ["Services"],
    }),

    // ✅ GET SINGLE SERVICE
    fetchServiceById: builder.query<Service, string>({
      query: (uuid) => `/cms/services/${uuid}`,
    }),

    // ✅ CREATE
    createService: builder.mutation<Service, Partial<Service>>({
      query: (serviceData) => ({
        url: "/cms/services",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["Services"],
    }),

    // ✅ UPDATE
    updateService: builder.mutation<Service, { uuid: string; serviceData: Partial<Service> }>({
      query: ({ uuid, serviceData }) => ({
        url: `/cms/services/${uuid}`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: ["Services"],
    }),

    // ✅ DELETE
    deleteService: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),

    // ✅ DROPDOWN SERVICES
    fetchDropdownServices: builder.query<ServiceDropdown[], void>({
      query: () => `/cms/dropdown-services`,
    }),

    // ✅ IMPORT SERVICES
    importServices: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/services-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT SERVICES
    exportServices: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/services-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchServicesQuery,
  useFetchServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useFetchDropdownServicesQuery,
  useImportServicesMutation,
  useExportServicesMutation,
} = serviceApi;
