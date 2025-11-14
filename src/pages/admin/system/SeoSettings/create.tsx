import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateSeoSettingMutation,
  useUpdateSeoSettingMutation,
  useFetchSeoSettingByIdQuery,
} from "../../../../../redux/system/SeoSettings/seoSettingApi";
import { useLazyFetchDropdownPagesQuery } from "../../../../../redux/cms/Pages/pageApi";
import AsyncSelect from "react-select/async";
import DragDrop from "../../../../../components/DragDrop";

const SeoSettingsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: seoSetting, isLoading } = useFetchSeoSettingByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createSeoSetting] = useCreateSeoSettingMutation();
  const [updateSeoSetting] = useUpdateSeoSettingMutation();
  const [triggerSearch] = useLazyFetchDropdownPagesQuery();

  const [formData, setFormData] = useState<any>({
    page_type: "",
    page_id: 0,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_title: "",
    og_description: "",
    og_type: "",
    og_image: "",
    og_url: "",
    twitter_card: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    canonical_url: "",
    robots: "",
    json_ld: "",
    schema_type: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (seoSetting && id) {
      setFormData({
        page_type: seoSetting?.data?.page_type || "",
        page_id: seoSetting?.data?.page_id || "",
        meta_title: seoSetting?.data?.meta_title || "",
        meta_description: seoSetting?.data?.meta_description || "",
        meta_keywords: seoSetting?.data?.meta_keywords || "",
        og_title: seoSetting?.data?.og_title || "",
        og_description: seoSetting?.data?.og_description || "",
        og_type: seoSetting?.data?.og_type || "",
        og_image: seoSetting?.data?.og_image || "",
        og_url: seoSetting?.data?.og_url || "",
        twitter_card: seoSetting?.data?.twitter_card || "",
        twitter_title: seoSetting?.data?.twitter_title || "",
        twitter_description: seoSetting?.data?.twitter_description || "",
        twitter_image: seoSetting?.data?.twitter_image || "",
        canonical_url: seoSetting?.data?.canonical_url || "",
        robots: seoSetting?.data?.robots || "",
        json_ld: seoSetting?.data?.json_ld || "",
        schema_type: seoSetting?.data?.schema_type || "",
      });
    }
  }, [seoSetting, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [id]: newValue });
  };

  const resetForm = () => {
    setFormData({
      page_type: "",
      page_id: 0,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      og_title: "",
      og_description: "",
      og_type: "",
      og_image: "",
      og_url: "",
      twitter_card: "",
      twitter_title: "",
      twitter_description: "",
      twitter_image: "",
      canonical_url: "",
      robots: "",
      json_ld: "",
      schema_type: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateSeoSetting({ uuid: String(id), seoSettingData: formData }).unwrap();
      } else {
        await createSeoSetting(formData).unwrap();
      }
      resetForm();
      navigate("/system/seosettings");
    } catch (err: any) {
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }
  };

  const loadCategoryOptions = async (inputValue: any) => {
    const res = await triggerSearch(inputValue).unwrap();
    const arr = Array.isArray(res) ? res : (res as any).data ?? [];
    return arr.map((cat: any) => ({ value: cat.id, label: cat.name }));
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit SeoSettings" : "Create SeoSettings"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "SeoSettings", href: "/system/seosettings" },
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
                  {/* page_type */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="page_type">Page Type</label>
                    <input
                      type="text"
                      id="page_type"
                      className={`form-control ${errors.page_type ? "is-invalid" : ""}`}
                      placeholder="e.g., cms, blog, product"
                      value={formData.page_type}
                      onChange={handleChange}
                    />
                    {errors.page_type && <div className="invalid-feedback">{errors.page_type[0]}</div>}
                  </div>

                  {/* page_id */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="page_id">Page</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      loadOptions={loadCategoryOptions}
                      value={
                        formData.page_id
                          ? { value: formData.page_id, label: formData.name ?? "" }
                          : null
                      }
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          page_id: option ? option.value : null,
                          name: option ? option.label : "",
                        })
                      }
                      placeholder="Search and select a page…"
                    />
                    {errors.page_id && <div className="invalid-feedback">{errors.page_id[0]}</div>}
                  </div>

                  {/* Meta fields */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      className={`form-control ${errors.meta_title ? "is-invalid" : ""}`}
                      placeholder="Page title for SEO"
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
                      placeholder="Short description for search engines"
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
                      placeholder="Comma-separated keywords"
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                    {errors.meta_keywords && <div className="invalid-feedback">{errors.meta_keywords[0]}</div>}
                  </div>

                  {/* OG fields */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="og_title">OG Title</label>
                    <input
                      type="text"
                      id="og_title"
                      className={`form-control ${errors.og_title ? "is-invalid" : ""}`}
                      placeholder="Open Graph title for social sharing"
                      value={formData.og_title}
                      onChange={handleChange}
                    />
                    {errors.og_title && <div className="invalid-feedback">{errors.og_title[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="og_description">OG Description</label>
                    <input
                      type="text"
                      id="og_description"
                      className={`form-control ${errors.og_description ? "is-invalid" : ""}`}
                      placeholder="Open Graph description"
                      value={formData.og_description}
                      onChange={handleChange}
                    />
                    {errors.og_description && <div className="invalid-feedback">{errors.og_description[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="og_type">OG Type</label>
                    <input
                      type="text"
                      id="og_type"
                      className={`form-control ${errors.og_type ? "is-invalid" : ""}`}
                      placeholder="e.g., website, article"
                      value={formData.og_type}
                      onChange={handleChange}
                    />
                    {errors.og_type && <div className="invalid-feedback">{errors.og_type[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="og_image">OG Image</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop or select an image"
                    />
                    {logoFile && <small className="text-muted">Selected: {logoFile.name}</small>}
                    {errors.og_image && <div className="invalid-feedback">{errors.og_image[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="og_url">OG URL</label>
                    <input
                      type="text"
                      id="og_url"
                      className={`form-control ${errors.og_url ? "is-invalid" : ""}`}
                      placeholder="Canonical page URL"
                      value={formData.og_url}
                      onChange={handleChange}
                    />
                    {errors.og_url && <div className="invalid-feedback">{errors.og_url[0]}</div>}
                  </div>

                  {/* Twitter fields */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="twitter_card">Twitter Card</label>
                    <input
                      type="text"
                      id="twitter_card"
                      className={`form-control ${errors.twitter_card ? "is-invalid" : ""}`}
                      placeholder="e.g., summary_large_image"
                      value={formData.twitter_card}
                      onChange={handleChange}
                    />
                    {errors.twitter_card && <div className="invalid-feedback">{errors.twitter_card[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="twitter_title">Twitter Title</label>
                    <input
                      type="text"
                      id="twitter_title"
                      className={`form-control ${errors.twitter_title ? "is-invalid" : ""}`}
                      placeholder="Title for Twitter card"
                      value={formData.twitter_title}
                      onChange={handleChange}
                    />
                    {errors.twitter_title && <div className="invalid-feedback">{errors.twitter_title[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="twitter_description">Twitter Description</label>
                    <input
                      type="text"
                      id="twitter_description"
                      className={`form-control ${errors.twitter_description ? "is-invalid" : ""}`}
                      placeholder="Description for Twitter card"
                      value={formData.twitter_description}
                      onChange={handleChange}
                    />
                    {errors.twitter_description && <div className="invalid-feedback">{errors.twitter_description[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="twitter_image">Twitter Image</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop or select an image"
                    />
                    {logoFile && <small className="text-muted">Selected: {logoFile.name}</small>}
                    {errors.twitter_image && <div className="invalid-feedback">{errors.twitter_image[0]}</div>}
                  </div>

                  {/* Misc */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="canonical_url">Canonical URL</label>
                    <input
                      type="text"
                      id="canonical_url"
                      className={`form-control ${errors.canonical_url ? "is-invalid" : ""}`}
                      placeholder="Canonical link (optional)"
                      value={formData.canonical_url}
                      onChange={handleChange}
                    />
                    {errors.canonical_url && <div className="invalid-feedback">{errors.canonical_url[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="robots">Robots</label>
                    <input
                      type="text"
                      id="robots"
                      className={`form-control ${errors.robots ? "is-invalid" : ""}`}
                      placeholder="e.g., index, follow"
                      value={formData.robots}
                      onChange={handleChange}
                    />
                    {errors.robots && <div className="invalid-feedback">{errors.robots[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="json_ld">JSON-LD</label>
                    <input
                      type="text"
                      id="json_ld"
                      className={`form-control ${errors.json_ld ? "is-invalid" : ""}`}
                      placeholder="Structured data in JSON-LD format"
                      value={formData.json_ld}
                      onChange={handleChange}
                    />
                    {errors.json_ld && <div className="invalid-feedback">{errors.json_ld[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="schema_type">Schema Type</label>
                    <input
                      type="text"
                      id="schema_type"
                      className={`form-control ${errors.schema_type ? "is-invalid" : ""}`}
                      placeholder="e.g., Article, Product"
                      value={formData.schema_type}
                      onChange={handleChange}
                    />
                    {errors.schema_type && <div className="invalid-feedback">{errors.schema_type[0]}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/system/seosettings")}
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

export default SeoSettingsCreate;
