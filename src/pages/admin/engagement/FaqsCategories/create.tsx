import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateFaqCategoriesMutation,
  useUpdateFaqCategoriesMutation,
  useFetchFaqCategoriesByIdQuery,
} from "../../../../../redux/engagement/FaqCategories/faqCategoriesApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const FaqCategoriesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: faqCategories, isLoading } = useFetchFaqCategoriesByIdQuery(
    id ? String(id) : "0",
    { skip: !id }
  );
  const [createFaqCategories] = useCreateFaqCategoriesMutation();
  const [updateFaqCategories] = useUpdateFaqCategoriesMutation();

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    order: 0,
    status: false,
    is_featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (faqCategories && id) {
      setFormData({
        name: faqCategories?.data?.name || "",
        slug: faqCategories?.data?.slug || "",
        description: faqCategories?.data?.description || "",
        icon: faqCategories?.data?.icon || "",
        meta_title: faqCategories?.data?.meta_title || "",
        meta_description: faqCategories?.data?.meta_description || "",
        meta_keywords: faqCategories?.data?.meta_keywords || "",
        order: faqCategories?.data?.order || 0,
        status: faqCategories?.data?.status || "",
        is_featured: faqCategories?.data?.is_featured || false,
      });
    }
  }, [faqCategories, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [id]: newValue });
  };

  const setField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      order: 0,
      status: false,
      is_featured: false,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateFaqCategories({
          uuid: String(id),
          faqCategoriesData: formData,
        }).unwrap();
      } else {
        await createFaqCategories(formData).unwrap();
      }
      resetForm();
      navigate("/engagement/faqCategories");
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
        title={id ? "Edit Faq Category" : "Create Faq Category"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "FaqCategories", href: "/engagement/faqCategories" },
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
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter category name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      id="slug"
                      placeholder="e.g. faq-category-slug"
                      className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                      value={formData.slug}
                      onChange={handleChange}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      placeholder="Short description of the category"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="icon">Icon</label>
                    <input
                      type="text"
                      id="icon"
                      placeholder="Font Awesome class or image URL"
                      className={`form-control ${errors.icon ? "is-invalid" : ""}`}
                      value={formData.icon}
                      onChange={handleChange}
                    />
                    {errors.icon && <div className="invalid-feedback">{errors.icon[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      placeholder="SEO title (optional)"
                      className={`form-control ${errors.meta_title ? "is-invalid" : ""}`}
                      value={formData.meta_title}
                      onChange={handleChange}
                    />
                    {errors.meta_title && <div className="invalid-feedback">{errors.meta_title[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <textarea
                      id="meta_description"
                      placeholder="SEO description (optional)"
                      className={`form-control ${errors.meta_description ? "is-invalid" : ""}`}
                      value={formData.meta_description}
                      onChange={handleChange}
                    />
                    {errors.meta_description && (
                      <div className="invalid-feedback">{errors.meta_description[0]}</div>
                    )}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_keywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="meta_keywords"
                      placeholder="e.g. faq, support, help"
                      className={`form-control ${errors.meta_keywords ? "is-invalid" : ""}`}
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                    {errors.meta_keywords && (
                      <div className="invalid-feedback">{errors.meta_keywords[0]}</div>
                    )}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      placeholder="Display order (e.g. 1)"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      value={formData.order ?? 0}
                      onChange={handleChange}
                    />
                    {errors.order && <div className="invalid-feedback">{errors.order[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      value={formData.status || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group form-check">
                    <label className="form-check-label" htmlFor="is_featured">
                      Is Featured
                    </label>
                    <ToggleSwitch
                      id="is_featured"
                      checked={!!formData.is_featured}
                      onChange={(val) => setField("is_featured", val)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/engagement/faqCategories")}
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

export default FaqCategoriesCreate;
