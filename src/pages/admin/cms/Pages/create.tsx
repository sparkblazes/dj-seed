import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DragDrop from "../../../../../components/DragDrop";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreatePageMutation,
  useUpdatePageMutation,
  useFetchPageByIdQuery,
} from "../../../../../redux/cms/Pages/pageApi";


const PagesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: page, isLoading } = useFetchPageByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_image: "",
    parent_id: "",
    type: "page",
    template: "",
    is_featured: false,
    is_menu_visible: false,
    order: 0,
    status: 1,
    visibility: "public",
    published_at: "",

  });

  // ✅ state for backend validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Populate form when editing
  useEffect(() => {
    if (page && id) {
      setFormData({
        title: page?.data?.title || "",
        slug: page?.data?.slug || "",
        content: page?.data?.content || "",
        meta_title: page?.data?.meta_title || "",
        meta_description: page?.data?.meta_description || "",
        meta_keywords: page?.data?.meta_keywords || "",
        og_image: page?.data?.og_image || "",
        parent_id: page?.data?.parent_id || "",
        type: page?.data?.type || "",
        template: page?.data?.template || "",
        is_featured: page?.data?.is_featured || "",
        is_menu_visible: page?.data?.is_menu_visible || "",
        order: page?.data?.order || "",
        status: page?.data?.status || "",
        visibility: page?.data?.visibility || "",
        published_at: page?.data?.published_at || "",
      });
    }
  }, [page, id]);

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
      title: "",
      slug: "",
      content: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      og_image: "",
      parent_id: "",
      type: "",
      template: "",
      is_featured: false,
      is_menu_visible: false,
      order: 0,
      status: 1,
      visibility: "",
      published_at: "",

    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // clear old errors
    try {
      if (id) {
        await updatePage({ uuid: String(id), pageData: formData }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createPage(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/pages");
    } catch (err: any) {
      // ✅ catch Laravel-style 422 validation errors
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }
  };
  const [logoFile, setLogoFile] = useState<File | null>(null);

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Page" : "Create Page"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pages", href: "/cms/pages" },
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
                      placeholder="Slug"
                      className="form-control"
                      value={formData.slug}
                      onChange={handleChange}
                    />
                    {errors.slug && (
                      <div className="invalid-feedback d-block">{errors.slug[0]}</div>
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
                    {errors.content &&
                      <div className="invalid-feedback d-block">{errors.content[0]}</div>
                    }
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
                    {errors.meta_title &&
                      <div className="invalid-feedback d-block">{errors.meta_title[0]}</div>
                    }
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
                  {/* Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop logo here or click to select"
                    />
                    {logoFile && (
                      <small className="text-muted">
                        Selected: {logoFile.name}
                      </small>
                    )}
                  </div>

                  {/* Type */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Type</label>
                    <select
                      id="Types"
                      className="form-control"
                      value={formData.Types}
                      onChange={handleChange}
                    >
                      <option value="page">Page</option>
                      <option value="post">Post</option>
                      <option value="landing">Landing</option>
                      <option value="custom">Custom</option>

                    </select>
                    {errors.type && (
                      <div className="invalid-feedback d-block">{errors.type[0]}</div>
                    )}
                  </div>

                  {/* Template */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="template">Template</label>
                    <input
                      type="text"
                      id="template"
                      placeholder="Template"
                      className="form-control"
                      value={formData.template}
                      onChange={handleChange}
                    />
                    {errors.template && (
                      <div className="invalid-feedback d-block">{errors.template[0]}</div>
                    )}
                  </div>

                  {/* Is Featured */}
                  <div className="col-md-6 mb-3">
                    <ToggleSwitch
                      id="showLogoSwitch"
                      label="Is Featured"
                      checked={!!formData.is_featured}
                      onChange={(val) => setField("is_featured", val)}
                      onText="Is Featured will be Apply"
                      offText="Is Featured will not be Apply"
                    />
                    {errors.is_featured && (
                      <div className="invalid-feedback d-block">{errors.is_featured[0]}</div>
                    )}
                  </div>

                  {/* Is Menu Visible */}
                  <div className="col-md-6 mb-3">
                    <ToggleSwitch
                      id="showLogoSwitch"
                      label="Is Menu Visible"
                      checked={!!formData.is_menu_visible}
                      onChange={(val) => setField("is_menu_visible", val)}
                      onText="Is Menu will be Visible "
                      offText="Is Menu will not be Visible "
                    />
                    {errors.is_featured && (
                      <div className="invalid-feedback d-block">{errors.is_featured[0]}</div>
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

                  {/* Visibility */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Visibility</label>
                    <select
                      id="visibility"
                      className="form-control"
                      value={formData.visibility}
                      onChange={handleChange}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="draft">Draft</option>

                    </select>
                  </div>

                  {/* OG Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">OG Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop OG image here or click to select"
                    />
                    {logoFile && (
                      <small className="text-muted">
                        Selected: {logoFile.name}
                      </small>
                    )}
                  </div>

                  {/* Parent ID */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="parent_id">Parent ID</label>
                    <input
                      type="text"
                      id="parent_id"
                      placeholder="Parent ID"
                      className="form-control"
                      value={formData.parent_id}
                      onChange={handleChange}
                    />
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
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/cms/pages")}
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

export default PagesCreate;
