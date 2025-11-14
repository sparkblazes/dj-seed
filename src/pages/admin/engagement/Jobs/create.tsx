import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateJobMutation,
  useUpdateJobMutation,
  useFetchJobByIdQuery,
} from "../../../../../redux/engagement/Jobs/jobApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const JobsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading } = useFetchJobByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createJob] = useCreateJobMutation();
  const [updateJob] = useUpdateJobMutation();

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    department: "",
    location: "",
    type: "",
    salary_min: 0,
    salary_max: 0,
    currency: "",
    benefits: "",
    deadline: "",
    is_remote: false,
    allow_external_apply: false,
    apply_url: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: 1,
    is_featured: false,
    order: 0,
    published_at: "",
    views_count: 0,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (job && id) {
      setFormData({
        title: job?.data?.title || "",
        slug: job?.data?.slug || "",
        short_description: job?.data?.short_description || "",
        description: job?.data?.description || "",
        department: job?.data?.department || "",
        location: job?.data?.location || "",
        type: job?.data?.type || "",
        salary_min: job?.data?.salary_min || "",
        salary_max: job?.data?.salary_max || "",
        currency: job?.data?.currency || "",
        benefits: job?.data?.benefits || "",
        deadline: job?.data?.deadline || "",
        is_remote: job?.data?.is_remote || "",
        allow_external_apply: job?.data?.allow_external_apply || "",
        apply_url: job?.data?.apply_url || "",
        meta_title: job?.data?.meta_title || "",
        meta_description: job?.data?.meta_description || "",
        meta_keywords: job?.data?.meta_keywords || "",
        status: job?.data?.status || "",
        is_featured: job?.data?.is_featured || "",
        order: job?.data?.order || "",
        published_at: job?.data?.published_at || "",
        views_count: job?.data?.views_count || "",
      });
    }
  }, [job, id]);

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
      title: "",
      slug: "",
      short_description: "",
      description: "",
      department: "",
      location: "",
      type: "",
      salary_min: 0,
      salary_max: 0,
      currency: "",
      benefits: "",
      deadline: "",
      is_remote: false,
      allow_external_apply: false,
      apply_url: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: 1,
      is_featured: false,
      order: 0,
      published_at: "",
      views_count: 0,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const d = new Date(formData.last_reviewed_at);
      formData.last_reviewed_at = d.toISOString().slice(0, 19).replace('T', '');
      if (id) {
        await updateJob({ uuid: String(id), jobData: formData }).unwrap();
        resetForm();
      } else {
        await createJob(formData).unwrap();
        resetForm();
      }
      navigate("/engagement/jobs");
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
        title={id ? "Edit Job" : "Create Job"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Jobs", href: "/engagement/jobs" },
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
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
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
                      placeholder="auto-generated or custom slug"
                      className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                      value={formData.slug}
                      onChange={handleChange}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="short_description">Short Description</label>
                    <textarea
                      id="short_description"
                      placeholder="Brief summary of the job"
                      className={`form-control ${errors.short_description ? "is-invalid" : ""}`}
                      value={formData.short_description}
                      onChange={handleChange}
                    />
                    {errors.short_description && <div className="invalid-feedback">{errors.short_description[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      placeholder="Detailed job description"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      rows={2}
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="department">Department</label>
                    <input
                      type="text"
                      id="department"
                      placeholder="e.g. Engineering, Marketing"
                      className={`form-control ${errors.department ? "is-invalid" : ""}`}
                      value={formData.department}
                      onChange={handleChange}
                    />
                    {errors.department && <div className="invalid-feedback">{errors.department[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      placeholder="City, Country or Remote"
                      className={`form-control ${errors.location ? "is-invalid" : ""}`}
                      value={formData.location}
                      onChange={handleChange}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="type">Type</label>
                    <select
                      id="type"
                      className={`form-control ${errors.type ? "is-invalid" : ""}`}
                      value={formData.type || ""}
                      onChange={(e) => setField("type", e.target.value)}
                    >
                      <option value="">Select job type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                      <option value="remote">Remote</option>
                    </select>
                    {errors.type && <div className="invalid-feedback">{errors.type[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="salary_min">Salary Min</label>
                    <input
                      type="number"
                      id="salary_min"
                      placeholder="Minimum salary"
                      className={`form-control ${errors.salary_min ? "is-invalid" : ""}`}
                      value={formData.salary_min}
                      onChange={handleChange}
                    />
                    {errors.salary_min && <div className="invalid-feedback">{errors.salary_min[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="salary_max">Salary Max</label>
                    <input
                      type="number"
                      id="salary_max"
                      placeholder="Maximum salary"
                      className={`form-control ${errors.salary_max ? "is-invalid" : ""}`}
                      value={formData.salary_max}
                      onChange={handleChange}
                    />
                    {errors.salary_max && <div className="invalid-feedback">{errors.salary_max[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="currency">Currency</label>
                    <input
                      type="text"
                      id="currency"
                      placeholder="e.g. USD, EUR, INR"
                      className={`form-control ${errors.currency ? "is-invalid" : ""}`}
                      value={formData.currency}
                      onChange={handleChange}
                    />
                    {errors.currency && <div className="invalid-feedback">{errors.currency[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="benefits">Benefits</label>
                    <textarea
                      id="benefits"
                      placeholder="List key benefits or perks"
                      className={`form-control ${errors.benefits ? "is-invalid" : ""}`}
                      value={formData.benefits}
                      onChange={handleChange}
                    />
                    {errors.benefits && <div className="invalid-feedback">{errors.benefits[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="deadline">Deadline</label>
                    <input
                      type="date"
                      id="deadline"
                      placeholder="Application deadline"
                      className={`form-control ${errors.deadline ? "is-invalid" : ""}`}
                      value={formData.deadline}
                      onChange={handleChange}
                    />
                    {errors.deadline && <div className="invalid-feedback">{errors.deadline[0]}</div>}
                  </div>

                  <div className="col-md-6 form-check">
                    <label className="form-check-label" htmlFor="is_remote">
                      Is Remote
                    </label>
                    <ToggleSwitch
                      id="is_remote"
                      checked={!!formData.is_remote}
                      onChange={(val) => setField("is_remote", val)}
                    />
                    {errors.is_remote && <div className="invalid-feedback">{errors.is_remote[0]}</div>}
                  </div>

                  <div className="col-md-6 form-check">
                    <label className="form-check-label" htmlFor="allow_external_apply">
                      Allow External Apply
                    </label>
                    <ToggleSwitch
                      id="allow_external_apply"
                      checked={!!formData.allow_external_apply}
                      onChange={(val) => setField("allow_external_apply", val)}
                    />
                    {errors.allow_external_apply && <div className="invalid-feedback">{errors.allow_external_apply[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="apply_url">Apply URL</label>
                    <input
                      type="text"
                      id="apply_url"
                      placeholder="External application link (if any)"
                      className={`form-control ${errors.apply_url ? "is-invalid" : ""}`}
                      value={formData.apply_url}
                      onChange={handleChange}
                    />
                    {errors.apply_url && <div className="invalid-feedback">{errors.apply_url[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      placeholder="SEO meta title"
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
                      placeholder="SEO meta description"
                      className={`form-control ${errors.meta_description ? "is-invalid" : ""}`}
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
                      placeholder="Comma separated keywords"
                      className={`form-control ${errors.meta_keywords ? "is-invalid" : ""}`}
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
                      value={formData.status || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                  </div>

                  <div className="col-md-6 form-check mt-4">
                    <label className="form-check-label" htmlFor="is_featured">
                      Is Featured
                    </label>
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
                      placeholder="Display order number"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
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
                      placeholder="Publish date & time"
                      className={`form-control ${errors.published_at ? "is-invalid" : ""}`}
                      value={formData.published_at}
                      onChange={handleChange}
                    />
                    {errors.published_at && <div className="invalid-feedback">{errors.published_at[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="views_count">Views Count</label>
                    <input
                      type="number"
                      id="views_count"
                      placeholder="Initial view count"
                      className={`form-control ${errors.views_count ? "is-invalid" : ""}`}
                      value={formData.views_count}
                      onChange={handleChange}
                    />
                    {errors.views_count && <div className="invalid-feedback">{errors.views_count[0]}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/engagement/jobs")}
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

export default JobsCreate;
