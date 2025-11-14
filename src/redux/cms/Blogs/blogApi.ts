import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../../api/baseQuery";
import type { Blog, BlogDropdown } from "./blogTypes";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery,
  tagTypes: ["Blogs"],
  endpoints: (builder) => ({
    // ✅ GET BLOGS WITH PAGINATION + SEARCH + SORT
   fetchBlogs: builder.query<
         {
           success: boolean;
           message: string;
           columns: string[];
           visible_columns: string[];
           data: {
             current_page: number;
             data: Blog[];   // actual records
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
        url: "/cms/blogs",
        method: "GET",
        params,
      }),
      providesTags: ["Blogs"],
    }),

    // ✅ GET SINGLE BLOG
    fetchBlogById: builder.query<Blog, string>({
      query: (uuid) => `/cms/blogs/${uuid}`,
    }),

    // ✅ CREATE
    createBlog: builder.mutation<Blog, Partial<Blog>>({
      query: (blogData) => ({
        url: "/cms/blogs",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ✅ UPDATE
    updateBlog: builder.mutation<Blog, { uuid: string; blogData: Partial<Blog> }>({
      query: ({ uuid, blogData }) => ({
        url: `/cms/blogs/${uuid}`,
        method: "PUT",
        body: blogData,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ✅ DELETE
    deleteBlog: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/cms/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ✅ DROPDOWN BLOGS
    fetchDropdownBlogs: builder.query<BlogDropdown[], void>({
      query: () => `/cms/dropdown-blogs`,
    }),

   

    // ✅ IMPORT BLOGS
    importBlogs: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/cms/blogs-import",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ EXPORT BLOGS
    exportBlogs: builder.mutation<Blob, { uuids: string[] }>({
      query: ({ uuids }) => ({
        url: "/cms/blogs-export",
        method: "POST",
        body: { uuids },
       responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchBlogsQuery,
  useFetchBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useFetchDropdownBlogsQuery,
  useImportBlogsMutation,
  useExportBlogsMutation,
} = blogApi;
