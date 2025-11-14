import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DragDrop from "../../../../../components/DragDrop";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useFetchBlogByIdQuery,
} from "../../../../../redux/cms/Blogs/blogApi";

//  👇 lazy query import
import { useLazyFetchDropdownBlogCategoriesQuery } from "../../../../../redux/cms/BlogCategories/blogCategorieApi";

import AsyncSelect from "react-select/async";

const BlogsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: blog, isLoading } = useFetchBlogByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<any>({
    category_id: "",
    author_id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_image: "",
    status: 1,
    is_featured: false,
    published_at: "",
    views_count: "",
    order: 0,
  });
  // ✅ state for backend validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({});


  // Populate form when editing
  useEffect(() => {
    if (blog && id) {
      setFormData({
        category_id: blog?.data?.category_id || "",
        author_id: blog?.data?.author_id || "",
        slug: blog?.data?.slug || "",
        title: blog?.data?.title || "",
        excerpt: blog?.data?.excerpt || "",
        content: blog?.data?.content || "",
        featured_image: blog?.data?.featured_image || "",
        tags: blog?.data?.tags || "",
        meta_title: blog?.data?.meta_title || "",
        meta_description: blog?.data?.meta_description || "",
        meta_keywords: blog?.data?.meta_keywords || "",
        og_image: blog?.data?.og_image || "",
        status: blog?.data?.status || "",
        published_at: blog?.data?.published_at || "",
        views_count: blog?.data?.views_count || "",
        order: blog?.data?.order || "",
      });
    }
  }, [blog, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;

    setFormData({ ...formData, [id]: newValue });
  };

  // ✅ helpers
  const setField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };


  const resetForm = () => {
    setFormData({
      category_id: "",
      author_id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      tags: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      og_image: "",
      status: 1,
      is_featured: false,
      published_at: "",
      views_count: "",
      order: 0,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // clear old errors
    try {
      if (id) {
        await updateBlog({ uuid: String(id), blogData: formData }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createBlog(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/blogs");
    } catch (err: any) {
      // ✅ catch Laravel-style 422 validation errors
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }

  };

  // ✅ useLazy*Query returns a trigger function you can call any time
  const [triggerSearch] = useLazyFetchDropdownBlogCategoriesQuery();

  const loadCategoryOptions = async (inputValue: any) => {
    // ✅ call the trigger function with your argument
    const res = await triggerSearch(inputValue).unwrap();
    const arr = Array.isArray(res) ? res : (res as any).data ?? [];
    return arr.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }));
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Blog" : "Create Blog"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Blogs", href: "/cms/blogs" },
          { label: id ? "Edit" : "Create", active: true },
        ]}
      />

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {isLoading && <p>Loading...</p>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Category ID */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="category_id">Category ID</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      loadOptions={loadCategoryOptions}
                      value={
                        formData.category_id
                          ? {
                            value: formData.category_id,
                            label: formData.category_name ?? "",
                          }
                          : null
                      }
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          category_id: option ? option.value : "",
                          category_name: option ? option.label : "",
                        })
                      }
                      placeholder="Type to search categories..."
                    />

                  </div>

                  {/* Author ID */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="author_id">Author ID</label>
                    <input
                      type="text"
                      id="author_id"
                      placeholder="Author ID"
                      className="form-control"
                      value={formData.author_id}
                      onChange={handleChange}
                    />
                    {errors.author_id && (
                      <div className="invalid-feedback d-block">{errors.author_id[0]}</div>
                    )}

                  </div>

                  {/* Title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="invalid-feedback d-block">{errors.title[0]}</div>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      id="slug"
                      placeholder="slug"
                      className="form-control"
                      value={formData.slug}
                      onChange={handleChange}
                    />
                    {errors.slug && (
                      <div className="invalid-feedback d-block">{errors.slug[0]}</div>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="excerpt">Excerpt</label>
                    <textarea
                      id="excerpt"
                      placeholder="Excerpt"
                      className="form-control"
                      value={formData.excerpt}
                      onChange={handleChange}
                    />
                    {errors.excerpt && (
                      <div className="invalid-feedback d-block">{errors.excerpt[0]}</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="Content"
                      value={formData.content}
                      onChange={handleChange}
                    />
                    {errors.content && (
                      <div className="invalid-feedback d-block">{errors.content[0]}</div>
                    )}
                  </div>

                  {/* Featured Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label"> Featured Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setImageFile(files[0] ?? null)}
                      label="Drop featured image here or click to select"
                    />
                    {imageFile && (
                      <small className="text-muted">
                        Selected: {imageFile.name}
                      </small>
                    )}
                  </div>
                  {/* Tags */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="tags">Tags</label>
                    <input
                      type="text"
                      id="tags"
                      placeholder="Tags"
                      className="form-control"
                      value={formData.tags}
                      onChange={handleChange}
                    />
                    {errors.tags && (
                      <div className="invalid-feedback d-block">{errors.tags[0]}</div>
                    )}
                  </div>

                  {/* Meta Title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      placeholder="Meta Title"
                      className="form-control"
                      value={formData.meta_title}
                      onChange={handleChange}
                    />
                    {errors.meta_title && (
                      <div className="invalid-feedback d-block">{errors.meta_title[0]}</div>
                    )}
                  </div>

                  {/* Meta Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <textarea
                      id="meta_description"
                      className="form-control"
                      placeholder="Meta Description"
                      value={formData.meta_description}
                      onChange={handleChange}
                    />
                    {errors.meta_description && (
                      <div className="invalid-feedback d-block">{errors.meta_description[0]}</div>
                    )}
                  </div>

                  {/* Meta Keywords */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_keywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="meta_keywords"
                      placeholder="Meta Keywords"
                      className="form-control"
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                    {errors.meta_keywords && (
                      <div className="invalid-feedback d-block">{errors.meta_keywords[0]}</div>
                    )}
                  </div>

                  {/* OG Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">OG Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setImageFile(files[0] ?? null)}
                      label="Drop OG image here or click to select"
                    />
                    {imageFile && (
                      <small className="text-muted">
                        Selected: {imageFile.name}
                      </small>
                    )}
                  </div>


                  {/* Status */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                    {errors.status && (
                      <div className="invalid-feedback d-block">{errors.status[0]}</div>
                    )}
                  </div>

                  {/* Is Featured */}
                  <div className="col-md-6 mb-3">
                    <ToggleSwitch
                      id="showLogoSwitch"
                      label=" Is Featured"
                      checked={!!formData.is_featured}
                      onChange={(val) => setField("is_featured", val)}
                      onText="Is Featured will be Apply"
                      offText="Is Featured will not be Apply"

                    />
                    {errors.is_featured && (
                      <div className="invalid-feedback d-block">{errors.is_featured[0]}</div>
                    )}
                  </div>


                  {/* Published At */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="published_at">Published At</label>
                    <input
                      type="date"
                      id="published_at"
                      className="form-control"
                      value={formData.published_at}
                      onChange={handleChange}
                    />
                    {errors.published_at && (
                      <div className="invalid-feedback d-block">{errors.published_at[0]}</div>
                    )}
                  </div>

                  {/* Views Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="views_count">Views Count</label>
                    <input
                      type="number"
                      id="views_count"
                      className="form-control"
                      value={formData.views_count}
                      onChange={handleChange}
                    />
                    {errors.views_count && (
                      <div className="invalid-feedback d-block">{errors.views_count[0]}</div>
                    )}
                  </div>

                  {/* Order */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      value={formData.order}
                      onChange={handleChange}
                    />
                    {errors.order && (
                      <div className="invalid-feedback d-block">{errors.order[0]}</div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/cms/blogs")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsCreate;
