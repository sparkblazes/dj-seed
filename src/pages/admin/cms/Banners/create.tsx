import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DragDrop from "../../../../../src/components/common/DragDropUpload";
import Breadcrumb from "../../../../../src/components/navigation/BreadCrumbs";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useFetchBannerByIdQuery,
} from "../../../../../src/redux/cms/Banners/bannerApi";

const BannersCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: banner, isLoading } = useFetchBannerByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);


  const [formData, setFormData] = useState<any>({
    title: "",
    subtitle: "",
    image: "",
    background_image: "",
    video_url: "",
    button_text: "",
    button_link: "",
    link: "",
    order: 0,
    status: false,
    position: 1,
    target: "_self",
    start_date: "",
    end_date: "",
  });

  // ✅ state for backend validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Populate form when editing
  useEffect(() => {
    if (banner && id) {
      setFormData({
        title: banner?.data?.title || "",
        subtitle: banner?.data?.subtitle || "",
        image: banner?.data?.image || "",
        background_image: banner?.data?.background_image || "",
        video_url: banner?.data?.video_url || "",
        button_text: banner?.data?.button_text || "",
        button_link: banner?.data?.button_link || "",
        link: banner?.data?.link || "",
        order: banner?.data?.order || "",
        status: banner?.data?.status || "",
        position: banner?.data?.position || "",
        target: banner?.data?.target || "",
        start_date: banner?.data?.start_date || "",
        end_date: banner?.data?.end_date || "",

      });
    }
  }, [banner, id]);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      background_image: "",
      video_url: "",
      button_text: "",
      button_link: "",
      link: "",
      order: 0,
      status: false,
      position: 1,
      target: "_self",
      start_date: "",
      end_date: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateBanner({
          uuid: String(id),
          bannerData: formData,
        }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createBanner(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/banners"); // redirect back
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
        title={id ? "Edit Banner" : "Create Banner"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "banners", href: "/cms/banners" },
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
                  {/* Example field */}
                  {/* Title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Title"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      value={formData.title}
                      onChange={handleChange}
                    />

                    {errors.title && (
                      <div className="invalid-feedback d-block">{errors.title[0]}</div>
                    )}
                  </div>

                  {/* Subtitle */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="subtitle">Subtitle</label>
                    <input
                      type="text"
                      id="subtitle"
                      placeholder="SubTitle"
                      className="form-control"
                      value={formData.subtitle}
                      onChange={handleChange}
                    />

                    {errors.subtitle && (
                      <div className="invalid-feedback d-block">{errors.subtitle[0]}</div>
                    )}
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

                  {/* Background Image */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Background Image (PNG/JPG)</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setImageFile(files[0] ?? null)}
                      label="Drop background image here or click to select"
                    />
                    {imageFile && (
                      <small className="text-muted">
                        Selected: {imageFile.name}
                      </small>
                    )}
                  </div>

                  {/* Video URL */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="video_url">Video URL</label>
                    <input
                      type="url"
                      id="video_url"
                      placeholder="Video URL"
                      className="form-control"
                      value={formData.video_url}
                      onChange={handleChange}
                    />

                    {errors.video_url && (
                      <div className="invalid-feedback d-block">{errors.video_url[0]}</div>
                    )}
                  </div>

                  {/* Button Text */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="button_text">Button Text</label>
                    <input
                      type="text"
                      id="button_text"
                      className="form-control"
                      placeholder="Button Text"
                      value={formData.button_text}
                      onChange={handleChange}
                    />

                    {errors.button_text && (
                      <div className="invalid-feedback d-block">{errors.button_text[0]}</div>
                    )}
                  </div>

                  {/* Button Link */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="button_link">Button Link</label>
                    <input
                      type="text"
                      id="button_link"
                      className="form-control"
                      placeholder="Butto Link"
                      value={formData.button_link}
                      onChange={handleChange}
                    />

                    {errors.button_link && (
                      <div className="invalid-feedback d-block">{errors.button_link[0]}</div>
                    )}
                  </div>

                  {/* Link */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="link">Link</label>
                    <input
                      type="url"
                      id="link"
                      className="form-control"
                      placeholder="Link"
                      value={formData.link}
                      onChange={handleChange}
                    />

                    {errors.link && (
                      <div className="invalid-feedback d-block">{errors.link[0]}</div>
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

                  {/* Status */}

                  <div className="col-md-6 form-group">
                    <label htmlFor="position">Status</label>
                    <select
                      id="status"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      value={formData.position}
                      onChange={handleChange}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>


                    {errors.position && (
                      <div className="invalid-feedback d-block">{errors.position[0]}</div>
                    )}

                  </div>
                  {/* Position ID*/}
                  <div className="col-md-6 form-group">
                    <label htmlFor="position">Position ID</label>
                    <select
                      id="position"
                      className="form-control"
                      value={formData.position}
                      onChange={handleChange}
                    >
                      <option value="homepage">Homepage</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="footer">Footer</option>
                    </select>


                    {errors.position && (
                      <div className="invalid-feedback d-block">{errors.position[0]}</div>
                    )}
                  </div>

                  {/* Target */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="target">Target</label>
                    <select
                      id="target"
                      className="form-control"
                      value={formData.target}
                      onChange={handleChange}
                    >
                      <option value="_self">_self</option>
                      <option value="_blank">_blank</option>
                    </select>


                    {errors.target && (
                      <div className="invalid-feedback d-block">{errors.target[0]}</div>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      type="date"
                      id="start_date"
                      className="form-control"
                      value={formData.start_date}
                      onChange={handleChange}
                    />

                    {errors.start_date && (
                      <div className="invalid-feedback d-block">{errors.start_date[0]}</div>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      type="date"
                      id="end_date"
                      className="form-control"
                      value={formData.end_date}
                      onChange={handleChange}
                    />

                    {errors.end_date && (
                      <div className="invalid-feedback d-block">{errors.end_date[0]}</div>
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
                    onClick={() => navigate("/cms/banners")}
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

export default BannersCreate;
