import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateDownloadMutation,
  useUpdateDownloadMutation,
  useFetchDownloadByIdQuery,
} from "../../../../../redux/system/Downloads/downloadApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import DragDrop from "../../../../../components/DragDrop";

const DownloadsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: download, isLoading } = useFetchDownloadByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createDownload] = useCreateDownloadMutation();
  const [updateDownload] = useUpdateDownloadMutation();

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    file: "",
    description: "",
    file_type: "",
    version: "",
    file_size: 0,
    mime_type: "",
    thumbnail: "",
    category: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: false,
    is_featured: false,
    order: 0,
    published_at: "",
    download_count: 0,
    views_count: 0,
    uploaded_by: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (download && id) {
      setFormData({
        title: download?.data?.title || "",
        slug: download?.data?.slug || "",
        file: download?.data?.file || "",
        description: download?.data?.description || "",
        file_type: download?.data?.file_type || "",
        version: download?.data?.version || "",
        file_size: download?.data?.file_size || 0,
        mime_type: download?.data?.mime_type || "",
        thumbnail: download?.data?.thumbnail || "",
        category: download?.data?.category || "",
        tags: download?.data?.tags || "",
        meta_title: download?.data?.meta_title || "",
        meta_description: download?.data?.meta_description || "",
        meta_keywords: download?.data?.meta_keywords || "",
        status: download?.data?.status || false,
        is_featured: download?.data?.is_featured || false,
        order: download?.data?.order || 0,
        published_at: download?.data?.published_at || "",
        download_count: download?.data?.download_count || 0,
        views_count: download?.data?.views_count || 0,
        uploaded_by: download?.data?.uploaded_by || "",
      });
    }
  }, [download, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    if (id === "status" || id === "is_featured") newValue = value === "true";
    setFormData({ ...formData, [id]: newValue });
  };

  const setField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      file: "",
      description: "",
      file_type: "",
      version: "",
      file_size: 0,
      mime_type: "",
      thumbnail: "",
      category: "",
      tags: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: false,
      is_featured: false,
      order: 0,
      published_at: "",
      download_count: 0,
      views_count: 0,
      uploaded_by: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateDownload({ uuid: String(id), downloadData: formData }).unwrap();
      } else {
        await createDownload(formData).unwrap();
      }
      resetForm();
      navigate("/system/downloads");
    } catch (err: any) {
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Download" : "Create Download"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Downloads", href: "/system/downloads" },
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
                  {/* Each input below has a helpful placeholder */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      placeholder="Enter download title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      id="slug"
                      className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                      placeholder="auto-generated or custom slug"
                      value={formData.slug}
                      onChange={handleChange}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="file">File URL / Path</label>
                    <input
                      type="text"
                      id="file"
                      className={`form-control ${errors.file ? "is-invalid" : ""}`}
                      placeholder="https://example.com/file.zip"
                      value={formData.file}
                      onChange={handleChange}
                    />
                    {errors.file && <div className="invalid-feedback">{errors.file[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <input
                      type="text"
                      id="description"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      placeholder="Short description of the file"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="file_type">File Type</label>
                    <input
                      type="text"
                      id="file_type"
                      className={`form-control ${errors.file_type ? "is-invalid" : ""}`}
                      placeholder="e.g. zip, pdf, exe"
                      value={formData.file_type}
                      onChange={handleChange}
                    />
                    {errors.file_type && <div className="invalid-feedback">{errors.file_type[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="version">Version</label>
                    <input
                      type="text"
                      id="version"
                      className={`form-control ${errors.version ? "is-invalid" : ""}`}
                      placeholder="e.g. 1.0.0"
                      value={formData.version}
                      onChange={handleChange}
                    />
                    {errors.version && <div className="invalid-feedback">{errors.version[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="file_size">File Size (bytes)</label>
                    <input
                      type="number"
                      id="file_size"
                      className={`form-control ${errors.file_size ? "is-invalid" : ""}`}
                      placeholder="Size in bytes"
                      value={formData.file_size}
                      onChange={handleChange}
                    />
                    {errors.file_size && <div className="invalid-feedback">{errors.file_size[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="mime_type">MIME Type</label>
                    <input
                      type="text"
                      id="mime_type"
                      className={`form-control ${errors.mime_type ? "is-invalid" : ""}`}
                      placeholder="e.g. application/zip"
                      value={formData.mime_type}
                      onChange={handleChange}
                    />
                    {errors.mime_type && <div className="invalid-feedback">{errors.mime_type[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="thumbnail">Thumbnail</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop or select thumbnail image"
                    />
                    {logoFile && (
                      <small className="text-muted">Selected: {logoFile.name}</small>
                    )}
                    {errors.thumbnail && <div className="invalid-feedback">{errors.thumbnail[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      className={`form-control ${errors.category ? "is-invalid" : ""}`}
                      placeholder="Category name"
                      value={formData.category}
                      onChange={handleChange}
                    />
                    {errors.category && <div className="invalid-feedback">{errors.category[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="tags">Tags</label>
                    <input
                      type="text"
                      id="tags"
                      className={`form-control ${errors.tags ? "is-invalid" : ""}`}
                      placeholder="Comma-separated tags"
                      value={formData.tags}
                      onChange={handleChange}
                    />
                    {errors.tags && <div className="invalid-feedback">{errors.tags[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      className={`form-control ${errors.meta_title ? "is-invalid" : ""}`}
                      placeholder="SEO title"
                      value={formData.meta_title}
                      onChange={handleChange}
                    />
                    {errors.meta_title && <div className="invalid-feedback">{errors.meta_title[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <input
                      type="text"
                      id="meta_description"
                      className={`form-control ${errors.meta_description ? "is-invalid" : ""}`}
                      placeholder="SEO description"
                      value={formData.meta_description}
                      onChange={handleChange}
                    />
                    {errors.meta_description && <div className="invalid-feedback">{errors.meta_description[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_keywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="meta_keywords"
                      className={`form-control ${errors.meta_keywords ? "is-invalid" : ""}`}
                      placeholder="SEO keywords, comma-separated"
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                    {errors.meta_keywords && <div className="invalid-feedback">{errors.meta_keywords[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      value={String(formData.status)}
                      onChange={handleChange}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="is_featured">Is Featured</label>
                    <ToggleSwitch
                      id="is_featured"
                      checked={!!formData.is_featured}
                      onChange={(val) => setField("is_featured", val)}
                    />
                    {errors.is_featured && <div className="invalid-feedback">{errors.is_featured[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      placeholder="Display order number"
                      value={formData.order}
                      onChange={handleChange}
                    />
                    {errors.order && <div className="invalid-feedback">{errors.order[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="published_at">Published At</label>
                    <input
                      type="datetime-local"
                      id="published_at"
                      className={`form-control ${errors.published_at ? "is-invalid" : ""}`}
                      value={formData.published_at}
                      onChange={handleChange}
                    />
                    {errors.published_at && <div className="invalid-feedback">{errors.published_at[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="download_count">Download Count</label>
                    <input
                      type="number"
                      id="download_count"
                      className={`form-control ${errors.download_count ? "is-invalid" : ""}`}
                      placeholder="Number of downloads"
                      value={formData.download_count}
                      onChange={handleChange}
                    />
                    {errors.download_count && <div className="invalid-feedback">{errors.download_count[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="views_count">Views Count</label>
                    <input
                      type="number"
                      id="views_count"
                      className={`form-control ${errors.views_count ? "is-invalid" : ""}`}
                      placeholder="Number of views"
                      value={formData.views_count}
                      onChange={handleChange}
                    />
                    {errors.views_count && <div className="invalid-feedback">{errors.views_count[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="uploaded_by">Uploaded By</label>
                    <input
                      type="text"
                      id="uploaded_by"
                      className={`form-control ${errors.uploaded_by ? "is-invalid" : ""}`}
                      placeholder="Uploader name or ID"
                      value={formData.uploaded_by}
                      onChange={handleChange}
                    />
                    {errors.uploaded_by && <div className="invalid-feedback">{errors.uploaded_by[0]}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/system/downloads")}
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

export default DownloadsCreate;
