import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useFetchTestimonialByIdQuery,
} from "../../../../../redux/engagement/Testimonials/testimonialApi";
import DragDrop from "../../../../../components/DragDrop";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const TestimonialsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: testimonial, isLoading } = useFetchTestimonialByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createTestimonial] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();

  const [formData, setFormData] = useState<any>({
    name: "",
    designation: "",
    company: "",
    location: "",
    message: "",
    rating: undefined,
    image: "",
    video_url: "",
    linkedin: "",
    twitter: "",
    website: "",
    status: true,
    is_featured: false,
    order: 0,
    meta_title: "",
    meta_description: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (testimonial && id) {
      setFormData({
        name: testimonial?.data?.name || "",
        designation: testimonial?.data?.designation || "",
        company: testimonial?.data?.company || "",
        location: testimonial?.data?.location || "",
        message: testimonial?.data?.message || "",
        rating: testimonial?.data?.rating || "",
        image: testimonial?.data?.image || "",
        video_url: testimonial?.data?.video_url || "",
        linkedin: testimonial?.data?.linkedin || "",
        twitter: testimonial?.data?.twitter || "",
        website: testimonial?.data?.website || "",
        status: testimonial?.data?.status || "",
        is_featured: testimonial?.data?.is_featured || "",
        order: testimonial?.data?.order || "",
        meta_title: testimonial?.data?.meta_title || "",
        meta_description: testimonial?.data?.meta_description || "",
      });
    }
  }, [testimonial, id]);

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

  const setField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      company: "",
      location: "",
      message: "",
      rating: undefined,
      image: "",
      video_url: "",
      linkedin: "",
      twitter: "",
      website: "",
      status: "",
      is_featured: false,
      order: 0,
      meta_title: "",
      meta_description: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateTestimonial({ uuid: String(id), testimonialData: formData }).unwrap();
        resetForm();
      } else {
        await createTestimonial(formData).unwrap();
        resetForm();
      }
      navigate("/engagement/testimonials");
    } catch (err: any) {
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
        title={id ? "Edit Testimonial" : "Create Testimonial"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Testimonial", href: "/engagement/testimonials" },
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
                  {/* name* */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name || ""}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                  </div>

                  {/* designation */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="designation">Designation</label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      placeholder="Enter designation"
                      className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                      value={formData.designation || ""}
                      onChange={handleChange}
                    />
                    {errors.designation && <div className="invalid-feedback">{errors.designation[0]}</div>}
                  </div>

                  {/* company */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Enter company name"
                      className={`form-control ${errors.company ? "is-invalid" : ""}`}
                      value={formData.company || ""}
                      onChange={handleChange}
                    />
                    {errors.company && <div className="invalid-feedback">{errors.company[0]}</div>}
                  </div>

                  {/* location */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Enter location"
                      className={`form-control ${errors.location ? "is-invalid" : ""}`}
                      value={formData.location || ""}
                      onChange={handleChange}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location[0]}</div>}
                  </div>

                  {/* message* */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Write testimonial message"
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      value={formData.message || ""}
                      onChange={handleChange}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message[0]}</div>}
                  </div>

                  {/* rating */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="rating">Rating</label>
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      placeholder="1–5"
                      className={`form-control ${errors.rating ? "is-invalid" : ""}`}
                      value={formData.rating || ""}
                      onChange={handleChange}
                    />
                    {errors.rating && <div className="invalid-feedback">{errors.rating[0]}</div>}
                  </div>

                  {/* image */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="image">Image</label>
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
                    {errors.image_url && <div className="invalid-feedback">{errors.image_url[0]}</div>}
                  </div>

                  {/* video_url */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="video_url">Video URL</label>
                    <input
                      type="text"
                      id="video_url"
                      name="video_url"
                      placeholder="Paste video URL"
                      className={`form-control ${errors.video_url ? "is-invalid" : ""}`}
                      value={formData.video_url || ""}
                      onChange={handleChange}
                    />
                    {errors.video_url && <div className="invalid-feedback">{errors.video_url[0]}</div>}
                  </div>

                  {/* linkedin */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      placeholder="LinkedIn profile URL"
                      className={`form-control ${errors.linkedin ? "is-invalid" : ""}`}
                      value={formData.linkedin || ""}
                      onChange={handleChange}
                    />
                    {errors.linkedin && <div className="invalid-feedback">{errors.linkedin[0]}</div>}
                  </div>

                  {/* twitter */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="twitter">Twitter</label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      placeholder="Twitter handle or URL"
                      className={`form-control ${errors.twitter ? "is-invalid" : ""}`}
                      value={formData.twitter || ""}
                      onChange={handleChange}
                    />
                    {errors.twitter && <div className="invalid-feedback">{errors.twitter[0]}</div>}
                  </div>

                  {/* website */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="website">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      placeholder="Website URL"
                      className={`form-control ${errors.website ? "is-invalid" : ""}`}
                      value={formData.website || ""}
                      onChange={handleChange}
                    />
                    {errors.website && <div className="invalid-feedback">{errors.website[0]}</div>}
                  </div>

                  {/* status* */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
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

                  {/* is_featured */}
                  <div className="col-md-6 form-group">
                    <ToggleSwitch
                      id="is_featured"
                      label="Is Featured"
                      checked={!!formData.is_featured}
                      onChange={(val) => setField("is_featured", val)}
                    />
                    {errors.is_featured && (
                      <div className="invalid-feedback d-block">
                        {errors.is_featured[0]}
                      </div>
                    )}
                  </div>

                  {/* order* */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      placeholder="Enter display order"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      value={formData.order || ""}
                      onChange={handleChange}
                    />
                    {errors.order && <div className="invalid-feedback">{errors.order[0]}</div>}
                  </div>

                  {/* meta_title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      name="meta_title"
                      placeholder="SEO meta title"
                      className={`form-control ${errors.meta_title ? "is-invalid" : ""}`}
                      value={formData.meta_title || ""}
                      onChange={handleChange}
                    />
                    {errors.meta_title && <div className="invalid-feedback">{errors.meta_title[0]}</div>}
                  </div>

                  {/* meta_description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <textarea
                      id="meta_description"
                      name="meta_description"
                      placeholder="SEO meta description"
                      className={`form-control ${errors.meta_description ? "is-invalid" : ""}`}
                      value={formData.meta_description || ""}
                      onChange={handleChange}
                    />
                    {errors.meta_description && <div className="invalid-feedback">{errors.meta_description[0]}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/engagement/testimonials")}
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

export default TestimonialsCreate;
