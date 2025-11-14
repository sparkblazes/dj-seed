import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DragDrop from "../../../../../components/DragDrop";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useFetchServiceByIdQuery,
} from "../../../../../redux/cms/Services/serviceApi";

const ServicesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: Service, isLoading } = useFetchServiceByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    icon: "",
    image: "",
    banner_image: "",
    price: "",
    discount_price: "",
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
    if (Service && id) {
      setFormData({
        title: Service?.data?.title || "",
        slug: Service?.data?.slug || "",
        short_description: Service?.data?.short_description || "",
        description: Service?.data?.description || "",
        icon: Service?.data?.icon || "",
        image: Service?.data?.image || "",
        banner_image: Service?.data?.banner_image || "",
        price: Service?.data?.price || "",
        discount_price: Service?.data?.discount_price || "",
        meta_title: Service?.data?.meta_title || "",
        meta_description: Service?.data?.meta_description || "",
        meta_keywords: Service?.data?.meta_keywords || "",
        status: Service?.data?.status || "",
        is_featured: Service?.data?.is_featured || "",
        order: Service?.data?.order || "",
        published_at: Service?.data?.published_at || "",
      });
    }
  }, [Service, id]);

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

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      icon: "",
      image: "",
      banner_image: "",
      price: "",
      discount_price: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: 1,
      is_featured: false,
      order: 0,
      published_at: ""
    });
    setErrors({});
  };

  // ✅ helpers
  const setField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // clear old errors
    try {
      if (id) {
        await updateService({ uuid: String(id), serviceData: formData }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createService(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/Services");
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
        title={id ? "Edit Service" : "Create Service"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Services", href: "/cms/Services" },
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

                  {/* Short Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="short_description">Short Description</label>
                    <textarea
                      id="short_description"
                      placeholder="Short Description"
                      className="form-control"
                      value={formData.short_description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      placeholder="Description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Icon */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="icon">Icon</label>
                    <input
                      type="text"
                      id="icon"
                      placeholder="Icon"
                      className="form-control"
                      value={formData.icon}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setImageFile(files[0] ?? null)}
                      label="Drop image here or click to select"
                    />
                    {imageFile && (
                      <small className="text-muted">
                        Selected: {imageFile.name}
                      </small>
                    )}
                  </div>

                  {/* Banner Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Banner Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setImageFile(files[0] ?? null)}
                      label="Drop Banner image here or click to select"
                    />
                    {imageFile && (
                      <small className="text-muted">
                        Selected: {imageFile.name}
                      </small>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      placeholder="Price"
                      className="form-control"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Discount Price */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="discount_price">Discount Price</label>
                    <input
                      type="number"
                      id="discount_price"
                      placeholder="Discount Price"
                      className="form-control"
                      value={formData.discount_price}
                      onChange={handleChange}
                    />
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
                  </div>

                  {/* Meta Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <textarea
                      id="meta_description"
                      placeholder="Meta Description"
                      className="form-control"
                      value={formData.meta_description}
                      onChange={handleChange}
                    />
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
                  </div>

                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/cms/Services")}
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

export default ServicesCreate;
