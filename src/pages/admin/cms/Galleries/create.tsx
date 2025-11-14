import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DragDrop from "../../../../../components/DragDrop";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateGallerieMutation,
  useUpdateGallerieMutation,
  useFetchGallerieByIdQuery,
} from "../../../../../redux/cms/Galleries/gallerieApi";

const GalleriesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: gallerie, isLoading } = useFetchGallerieByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createGallerie] = useCreateGallerieMutation();
  const [updateGallerie] = useUpdateGallerieMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    description: "",
    cover_image: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: 1,
    is_featured: false,
    order: 0,
    published_at: "",

  });
  // ✅ state for backend validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({});


  // Populate form when editing
  useEffect(() => {
    if (gallerie && id) {
      setFormData({
        title: gallerie?.data?.title || "",
        slug: gallerie?.data?.slug || "",
        description: gallerie?.data?.description || "",
        cover_image: gallerie?.data?.cover_image || "",
        meta_title: gallerie?.data?.meta_title || "",
        meta_description: gallerie?.data?.meta_description || "",
        meta_keywords: gallerie?.data?.meta_keywords || "",
        status: gallerie?.data?.status || "",
        is_featured: gallerie?.data?.is_featured || "",
        order: gallerie?.data?.order || "",
        published_at: gallerie?.data?.published_at || "",
      });
    }
  }, [gallerie, id]);

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
      description: "",
      cover_image: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: 1,
      is_featured: false,
      order: 0,
      published_at: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // clear old errors
    try {
      if (id) {
        await updateGallerie({ uuid: String(id), gallerieData: formData }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createGallerie(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/galleries");
    } catch (err: any) {
      // ✅ catch Laravel-style 422 validation errors
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
        title={id ? "Edit Gallerie" : "Create Gallerie"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Galleries", href: "/cms/galleries" },
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

                  {/* Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <div className="invalid-feedback d-block">{errors.description[0]}</div>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cover Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setImageFile(files[0] ?? null)}
                      label="Drop Cover image here or click to select"
                    />
                    {imageFile && (
                      <small className="text-muted">
                        Selected: {imageFile.name}
                      </small>
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
                    onClick={() => navigate("/cms/galleries")}
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

export default GalleriesCreate;
