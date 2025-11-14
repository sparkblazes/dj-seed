// src/modules/admin/pages/engagement/Faqs/create.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/navigation/BreadCrumbs";
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useFetchFaqByIdQuery,
} from "../../../../redux/engagement/Faqs/faqApi";
import { useLazyFetchDropdownFaqCategoriesQuery } from "../../../../redux/engagement/FaqCategories/faqCategoriesApi";
import AsyncSelect from "react-select/async";
import ToggleSwitch from "../../../../components/common/ToggleSwitch";

const FaqsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: faq, isLoading } = useFetchFaqByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();

  const [formData, setFormData] = useState<any>({
    category_id: "",
    question: "",
    answer: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: true,
    is_featured: false,
    order: 0,
    views_count: 0,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (faq && id) {
      setFormData({
        category_id: faq?.data?.category_id || "",
        question: faq?.data?.question || "",
        answer: faq?.data?.answer || "",
        tags: faq?.data?.tags || "",
        meta_title: faq?.data?.meta_title || "",
        meta_description: faq?.data?.meta_description || "",
        meta_keywords: faq?.data?.meta_keywords || "",
        status: faq?.data?.status || "",
        is_featured: faq?.data?.is_featured || "",
        order: faq?.data?.order || "",
        views_count: faq?.data?.views_count || "",
      });
    }
  }, [faq, id]);

  const setField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    if (id === "status" || id === "is_featured") newValue = value === "true";
    setFormData({ ...formData, [id]: newValue });
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      question: "",
      answer: "",
      tags: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: true,
      is_featured: false,
      order: 0,
      views_count: 0,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateFaq({ uuid: String(id), faqsData: formData }).unwrap();
        resetForm();
      } else {
        await createFaq(formData).unwrap();
        resetForm();
      }
      navigate("/engagement/faqs");
    } catch (err: any) {
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }
  };

  const [triggerSearch] = useLazyFetchDropdownFaqCategoriesQuery();
  const loadCategoryOptions = async (inputValue: string) => {
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
        title={id ? "Edit Faqs" : "Create Faqs"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Faq", href: "/engagement/faqs" },
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
                  {/* Category */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="category_id">Category</label>
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
                      placeholder="Search or select a category"
                    />
                    {errors.category && (
                      <div className="invalid-feedback">
                        {errors.category[0]}
                      </div>
                    )}
                  </div>

                  {/* Question */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="question">Question</label>
                    <input
                      type="text"
                      id="question"
                      placeholder="Enter the FAQ question"
                      className={`form-control ${errors.question ? "is-invalid" : ""
                        }`}
                      value={formData.question}
                      onChange={handleChange}
                    />
                    {errors.question && (
                      <div className="invalid-feedback">{errors.question[0]}</div>
                    )}
                  </div>

                  {/* Answer */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="answer">Answer</label>
                    <textarea
                      id="answer"
                      placeholder="Provide a clear answer"
                      className={`form-control ${errors.answer ? "is-invalid" : ""
                        }`}
                      rows={1}
                      value={formData.answer}
                      onChange={handleChange}
                    />
                    {errors.answer && (
                      <div className="invalid-feedback">{errors.answer[0]}</div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="tags">Tags</label>
                    <input
                      type="text"
                      id="tags"
                      placeholder="Comma-separated tags (e.g. support, account)"
                      className={`form-control ${errors.tags ? "is-invalid" : ""}`}
                      value={formData.tags}
                      onChange={handleChange}
                    />
                    {errors.tags && (
                      <div className="invalid-feedback">{errors.tags[0]}</div>
                    )}
                  </div>

                  {/* Meta Title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      placeholder="SEO meta title"
                      className={`form-control ${errors.metaTitle ? "is-invalid" : ""
                        }`}
                      value={formData.meta_title}
                      onChange={handleChange}
                    />
                    {errors.metaTitle && (
                      <div className="invalid-feedback">
                        {errors.metaTitle[0]}
                      </div>
                    )}
                  </div>

                  {/* Meta Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <input
                      type="text"
                      id="meta_description"
                      placeholder="Short SEO description"
                      className={`form-control ${errors.metaDescription ? "is-invalid" : ""
                        }`}
                      value={formData.meta_description}
                      onChange={handleChange}
                    />
                    {errors.metaDescription && (
                      <div className="invalid-feedback">
                        {errors.metaDescription[0]}
                      </div>
                    )}
                  </div>

                  {/* Meta Keywords */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_keywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="meta_keywords"
                      placeholder="Keywords separated by commas"
                      className={`form-control ${errors.metaKeywords ? "is-invalid" : ""
                        }`}
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                    {errors.metaKeywords && (
                      <div className="invalid-feedback">
                        {errors.metaKeywords[0]}
                      </div>
                    )}
                  </div>

                  {/* Status */}
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

                  {/* Is Featured */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_featured">Is Featured</label>
                    <ToggleSwitch
                      id="is_featured"
                      checked={!!formData.is_featured}
                      onChange={(val) => setField("is_featured", val)}
                    />
                    {errors.is_featured && (
                      <div className="invalid-feedback">
                        {errors.is_featured[0]}
                      </div>
                    )}
                  </div>

                  {/* Order */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      placeholder="Display order (e.g. 1)"
                      className={`form-control ${errors.order ? "is-invalid" : ""
                        }`}
                      value={formData.order}
                      onChange={handleChange}
                    />
                    {errors.order && (
                      <div className="invalid-feedback">{errors.order[0]}</div>
                    )}
                  </div>

                  {/* Views Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="views_count">Views Count</label>
                    <input
                      type="number"
                      id="views_count"
                      placeholder="Initial views count (optional)"
                      className={`form-control ${errors.views_count ? "is-invalid" : ""
                        }`}
                      value={formData.views_count}
                      onChange={handleChange}
                    />
                    {errors.views_count && (
                      <div className="invalid-feedback">
                        {errors.views_count[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/engagement/faqs")}
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

export default FaqsCreate;
