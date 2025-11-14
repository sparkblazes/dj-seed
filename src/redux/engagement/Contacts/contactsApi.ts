import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Contacts, ContactsDropdown } from "./contactsTypes";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery,
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    // ✅ GET CONTACTS WITH PAGINATION + SEARCH + SORT
    fetchContacts: builder.query<
      {
        success: boolean;
        message: string;
        columns: string[];
        visible_columns: string[];
        data: {
          current_page: number;
          data: Contacts[];   // actual records
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
        url: "/engagement/contacts",
        method: "GET",
        params,
      }),
      providesTags: ["Contacts"],
    }),

    // ✅ GET SINGLE CONTACTS
    fetchContactsById: builder.query<Contacts, string>({
      query: (uuid) => `/engagement/contacts/${uuid}`,
    }),

    // ✅ CREATE
    createContacts: builder.mutation<Contacts, Partial<Contacts>>({
      query: (contactsData) => ({
        url: "/engagement/contacts",
        method: "POST",
        body: contactsData,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ✅ UPDATE
    updateContacts: builder.mutation<Contacts, { uuid: string; contactsData: Partial<Contacts> }>({
      query: ({ uuid, contactsData }) => ({
        url: `/engagement/contacts/${uuid}`,
        method: "PUT",
        body: contactsData,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ✅ DELETE
    deleteContacts: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/engagement/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ✅ DROPDOWN CONTACTS
    fetchDropdownContacts: builder.query<ContactsDropdown[], void>({
      query: () => `/engagement/dropdown-contacts`,
    }),

    // ✅ IMPORT CONTACTS
    importContacts: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/engagement/contacts-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT CONTACTS
    exportContacts: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/engagement/contacts-export",
        method: "POST",
        body: { uuids },
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchContactsQuery,
  useFetchContactsByIdQuery,
  useCreateContactsMutation,
  useUpdateContactsMutation,
  useDeleteContactsMutation,
  useFetchDropdownContactsQuery,
  useImportContactsMutation,
  useExportContactsMutation,
} = contactsApi;
