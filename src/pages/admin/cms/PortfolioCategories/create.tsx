import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DragDrop from "../../../../../components/DragDrop";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreatePortfolioCategorieMutation,
  useUpdatePortfolioCategorieMutation,
  useFetchPortfolioCategorieByIdQuery,
} from "../../../../../redux/cms/PortfolioCategories/portfolioCategorieApi";

const PortfolioCategoriesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: portfolioCategorie, isLoading } = useFetchPortfolioCategorieByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createPortfolioCategorie] = useCreatePortfolioCategorieMutation();
  const [updatePortfolioCategorie] = useUpdatePortfolioCategorieMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    order: 0,
    status: 1,
    is_featured: false,
  });
  // ✅ state for backend validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({});


  // Populate form when editing
  useEffect(() => {
    if (portfolioCategorie && id) {
      setFormData({
        name: portfolioCategorie?.data?.name || "",
        slug: portfolioCategorie?.data?.slug || "",
        description: portfolioCategorie?.data?.description || "",
        icon: portfolioCategorie?.data?.icon || "",
        image: portfolioCategorie?.data?.image || "",
        order: portfolioCategorie?.data?.order || "",
        meta_title: portfolioCategorie?.data?.meta_title || "",
        meta_description: portfolioCategorie?.data?.meta_description || "",
        meta_keywords: portfolioCategorie?.data?.meta_keywords || "",
        status: portfolioCategorie?.data?.status || "",
        is_featured: portfolioCategorie?.data?.is_featured || "",
      })
    }
  }, [portfolioCategorie, id]);

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
      name: "",
      slug: "",
      description: "",
      icon: "",
      image: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      order: 0,
      status: 1,
      is_featured: false,
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
        await updatePortfolioCategorie({ uuid: String(id), portfolioCategorieData: formData }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createPortfolioCategorie(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/portfolio-categories");
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
        title={id ? "Edit Portfolio Categorie" : "Create Portfolio Categories"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "PortfolioCategories", href: "/cms/portfolio-categories" },
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
                  {/* Name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback d-block">{errors.name[0]}</div>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="slug">Slug </label>
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
                    <label htmlFor="description">Description </label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Icon */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="icon">Icon </label>
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

                  {/* Meta Title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title </label>
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
                    <label htmlFor="meta_description">Meta Description </label>
                    <textarea
                      id="meta_description"
                      className="form-control"
                      placeholder="Meta Description "
                      value={formData.meta_description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_keywords">Meta Keywords </label>
                    <input
                      type="text"
                      id="meta_keywords"
                      placeholder="Meta Keywords"
                      className="form-control"
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Order */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order </label>
                    <input
                      type="number"
                      id="order"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      value={formData.order}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status </label>
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
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/cms/portfolioCategories")}
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

export default PortfolioCategoriesCreate;
