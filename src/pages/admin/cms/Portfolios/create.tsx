import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DragDrop from "../../../../../components/DragDrop";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useFetchPortfolioByIdQuery,
} from "../../../../../redux/cms/Portfolios/portfolioApi";

//  👇 lazy query import
import { useLazyFetchDropdownBlogCategoriesQuery } from "../../../../../redux/cms/BlogCategories/blogCategorieApi";


import AsyncSelect from "react-select/async";

const PortfoliosCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: portfolio, isLoading } = useFetchPortfolioByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createPortfolio] = useCreatePortfolioMutation();
  const [updatePortfolio] = useUpdatePortfolioMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<any>({
    category_id: "",
    author_id: "",
    title: "",
    slug: "",
    subtitle: "",
    short_description: "",
    description: "",
    image: "",
    banner_image: "",
    video: "",
    gallery: "",
    client_name: "",
    project_url: "",
    technologies: "",
    completed_at: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: 1,
    is_featured: false,
    order: 0,
    published_at: "",
    views_count: "",
  });
  // ✅ state for backend validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Populate form when editing
  useEffect(() => {
    if (portfolio && id) {
      setFormData({
        category_id: portfolio?.data?.category_id || "",
        author_id: portfolio?.data?.author_id || "",
        title: portfolio?.data?.title || "",
        slug: portfolio?.data?.slug || "",
        subtitle: portfolio?.data?.subtitle || "",
        short_description: portfolio?.data?.short_description || "",
        description: portfolio?.data?.description || "",
        image: portfolio?.data?.image || "",
        banner_image: portfolio?.data?.banner_image || "",
        video: portfolio?.data?.video || "",
        gallery: portfolio?.data?.gallery || "",
        client_name: portfolio?.data?.client_name || "",
        project_url: portfolio?.data?.project_url || "",
        technologies: portfolio?.data?.technologies || "",
        completed_at: portfolio?.data?.completed_at || "",
        meta_title: portfolio?.data?.meta_title || "",
        meta_description: portfolio?.data?.meta_description || "",
        meta_keywords: portfolio?.data?.meta_keywords || "",
        status: portfolio?.data?.status || "",
        is_featured: portfolio?.data?.is_featured || "",
        order: portfolio?.data?.order || "",
        published_at: portfolio?.data?.published_at || "",
        views_count: portfolio?.data?.views_count || "",
      })
    };
  }, [portfolio, id]);

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
      category_id: "",
      author_id: "",
      title: "",
      slug: "",
      subtitle: "",
      short_description: "",
      description: "",
      image: "",
      banner_image: "",
      video: "",
      gallery: "",
      client_name: "",
      project_url: "",
      technologies: "",
      completed_at: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: 1,
      is_featured: false,
      order: 0,
      published_at: "",
      views_count: "",
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
        await updatePortfolio({ uuid: String(id), portfolioData: formData }).unwrap();
        resetForm(); // ✅ reset form after update

      } else {
        await createPortfolio(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/portfolios");
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
        title={id ? "Edit Portfolio" : "Create Portfolio"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Portfolios", href: "/cms/portfolios" },
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

                  {/* Title*/}
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">Title </label>
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

                  {/* Subtitle */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="subtitle">Subtitle </label>
                    <input
                      type="text"
                      id="subtitle"
                      placeholder="Subtitle"
                      className="form-control"
                      value={formData.subtitle}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Short Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="short_description">Short Description </label>
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
                    <label htmlFor="description">Description </label>
                    <textarea
                      id="description"
                      placeholder="Description"
                      className="form-control"
                      value={formData.description}
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

                  {/* Video */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="video">Video </label>
                    <input
                      type="text"
                      id="video"
                      placeholder="Video"
                      className="form-control"
                      value={formData.video}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Gallery */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="gallery">Gallery </label>
                    <input
                      type="text"
                      id="gallery"
                      placeholder="Gallery"
                      className="form-control"
                      value={formData.gallery}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Client Name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="client_name">Client Name </label>
                    <input
                      type="text"
                      id="client_name"
                      placeholder="Client Name"
                      className="form-control"
                      value={formData.client_name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Project URL */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="project_url">Project URL </label>
                    <input
                      type="text"
                      id="project_url"
                      placeholder="Project URL"
                      className="form-control"
                      value={formData.project_url}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Technologies */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="technologies">Technologies </label>
                    <input
                      type="text"
                      id="technologies"
                      placeholder="Technologies"
                      className="form-control"
                      value={formData.technologies}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Completed At */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="completed_at">Completed At </label>
                    <input
                      type="date"
                      id="completed_at"
                      className="form-control"
                      value={formData.completed_at}
                      onChange={handleChange}
                    />
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
                      placeholder="Meta Description"
                      className="form-control"
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
                    {errors.order && (
                      <div className="invalid-feedback d-block">{errors.order[0]}</div>
                    )}
                  </div>

                  {/* Published At */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="published_at">Published At </label>
                    <input
                      type="date"
                      id="published_at"
                      className="form-control"
                      value={formData.published_at}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Views Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="views_count">Views Count </label>
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

                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/cms/portfolios")}
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

export default PortfoliosCreate;
