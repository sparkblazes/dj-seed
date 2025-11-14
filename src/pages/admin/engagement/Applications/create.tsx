import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";

import {
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useFetchApplicationByIdQuery,
} from "../../../../../redux/engagement/Applications/applicationApi";

import { useLazyFetchDropdownJobsQuery } from "../../../../../redux/engagement/Jobs/jobApi";
import AsyncSelect from "react-select/async";

const ApplicationsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: application, isLoading } = useFetchApplicationByIdQuery(
    id ? String(id) : "0",
    { skip: !id }
  );

  const [createApplication] = useCreateApplicationMutation();
  const [updateApplication] = useUpdateApplicationMutation();

  const [formData, setFormData] = useState<any>({
    job_id: "",
    user_id: "",
    name: "",
    email: "",
    phone: "",
    resume: "",
    cover_letter: "",
    linkedin: "",
    portfolio_url: "",
    message: "",
    status: "",
    interview_date: "",
    interview_location: "",
    hr_notes: "",
    rating: "",
    assigned_to: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (application && id) {
      setFormData({
        job_id: application?.data?.job_id || "",
        user_id: application?.data?.user_id || "",
        name: application?.data?.name || "",
        email: application?.data?.email || "",
        phone: application?.data?.phone || "",
        resume: application?.data?.resume || "",
        cover_letter: application?.data?.cover_letter || "",
        linkedin: application?.data?.linkedin || "",
        portfolio_url: application?.data?.portfolio_url || "",
        message: application?.data?.message || "",
        status: application?.data?.status || "",
        interview_date: application?.data?.interview_date || "",
        interview_location: application?.data?.interview_location || "",
        hr_notes: application?.data?.hr_notes || "",
        rating: application?.data?.rating || "",
        assigned_to: application?.data?.assigned_to || "",
      });
    }
  }, [application, id]);

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
      job_id: "",
      user_id: "",
      name: "",
      email: "",
      phone: "",
      resume: "",
      cover_letter: "",
      linkedin: "",
      portfolio_url: "",
      message: "",
      status: "",
      interview_date: "",
      interview_location: "",
      hr_notes: "",
      rating: "",
      assigned_to: "",
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
        await updateApplication({
          uuid: String(id),
          applicationData: formData,
        }).unwrap();
        resetForm();
      } else {
        await createApplication(formData).unwrap();
        resetForm();
      }
      navigate("/engagement/applications");
    } catch (err: any) {
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }
  };

  const [triggerSearch] = useLazyFetchDropdownJobsQuery();
  const loadJobOptions = async (inputValue: any) => {
    const res = await triggerSearch(inputValue).unwrap();
    const arr = Array.isArray(res) ? res : (res as any).data ?? [];
    return arr.map((cat: any) => ({
      value: cat.id,
      label: cat.title,
    }));
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Application" : "Create Application"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Application", href: "/engagement/applications" },
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
                  {/* Job ID */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="job_id">Job</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      loadOptions={loadJobOptions}
                      value={
                        formData.job_id
                          ? {
                            value: formData.job_id,
                            label: formData.title ?? "",
                          }
                          : null
                      }
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          job_id: option ? option.value : "",
                          title: option ? option.label : "",
                        })
                      }
                      placeholder="Search and select a job"
                    />
                    {errors.job_id && (
                      <div className="invalid-feedback d-block">
                        {errors.job_id[0]}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter full name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name[0]}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="example@domain.com"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email[0]}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Enter phone number"
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone[0]}</div>
                    )}
                  </div>

                  {/* Resume */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="resume">Resume</label>
                    <input
                      type="text"
                      id="resume"
                      placeholder="Paste resume URL or file name"
                      className={`form-control ${errors.resume ? "is-invalid" : ""}`}
                      value={formData.resume}
                      onChange={handleChange}
                    />
                    {errors.resume && (
                      <div className="invalid-feedback">{errors.resume[0]}</div>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="col-6 form-group mb-3">
                    <label htmlFor="cover_letter">Cover Letter</label>
                    <textarea
                      id="cover_letter"
                      placeholder="Write a brief cover letter"
                      className={`form-control ${errors.cover_letter ? "is-invalid" : ""}`}
                      rows={1}
                      value={formData.cover_letter}
                      onChange={handleChange}
                    />
                    {errors.cover_letter && (
                      <div className="invalid-feedback">
                        {errors.cover_letter[0]}
                      </div>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      type="url"
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      className={`form-control ${errors.linkedin ? "is-invalid" : ""}`}
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                    {errors.linkedin && (
                      <div className="invalid-feedback">{errors.linkedin[0]}</div>
                    )}
                  </div>

                  {/* Portfolio URL */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="portfolio_url">Portfolio URL</label>
                    <input
                      type="url"
                      id="portfolio_url"
                      placeholder="https://portfolio.example"
                      className={`form-control ${errors.portfolio_url ? "is-invalid" : ""}`}
                      value={formData.portfolio_url}
                      onChange={handleChange}
                    />
                    {errors.portfolio_url && (
                      <div className="invalid-feedback">
                        {errors.portfolio_url[0]}
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="col-6 form-group mb-3">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      placeholder="Additional message to HR"
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      rows={1}
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && (
                      <div className="invalid-feedback">{errors.message[0]}</div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      value={formData.status}
                      onChange={(e) => setField("status", e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="new">new</option>
                      <option value="reviewed">reviewed</option>
                      <option value="shortlisted">shortlisted</option>
                      <option value="interview_scheduled">interview_scheduled</option>
                      <option value="offered">offered</option>
                      <option value="hired">hired</option>
                      <option value="rejected">rejected</option>
                    </select>
                    {errors.status && (
                      <div className="invalid-feedback">{errors.status[0]}</div>
                    )}
                  </div>

                  {/* Interview Date */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="interview_date">Interview Date</label>
                    <input
                      type="date"
                      id="interview_date"
                      placeholder="Select interview date"
                      className={`form-control ${errors.interview_date ? "is-invalid" : ""}`}
                      value={formData.interview_date}
                      onChange={handleChange}
                    />
                    {errors.interview_date && (
                      <div className="invalid-feedback">
                        {errors.interview_date[0]}
                      </div>
                    )}
                  </div>

                  {/* Interview Location */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="interview_location">Interview Location</label>
                    <input
                      type="text"
                      id="interview_location"
                      placeholder="Enter interview location"
                      className={`form-control ${errors.interview_location ? "is-invalid" : ""}`}
                      value={formData.interview_location}
                      onChange={handleChange}
                    />
                    {errors.interview_location && (
                      <div className="invalid-feedback">
                        {errors.interview_location[0]}
                      </div>
                    )}
                  </div>

                  {/* HR Notes */}
                  <div className="col-6 form-group mb-3">
                    <label htmlFor="hr_notes">HR Notes</label>
                    <textarea
                      id="hr_notes"
                      placeholder="Internal HR notes"
                      className={`form-control ${errors.hr_notes ? "is-invalid" : ""}`}
                      rows={1}
                      value={formData.hr_notes}
                      onChange={handleChange}
                    />
                    {errors.hr_notes && (
                      <div className="invalid-feedback">{errors.hr_notes[0]}</div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="rating">Rating</label>
                    <input
                      type="number"
                      id="rating"
                      placeholder="Enter rating (1–5)"
                      className={`form-control ${errors.rating ? "is-invalid" : ""}`}
                      value={formData.rating}
                      onChange={handleChange}
                    />
                    {errors.rating && (
                      <div className="invalid-feedback">{errors.rating[0]}</div>
                    )}
                  </div>

                  {/* Assigned To */}
                  <div className="col-md-6 form-group mb-3">
                    <label htmlFor="assigned_to">Assigned To</label>
                    <input
                      type="text"
                      id="assigned_to"
                      placeholder="Name of recruiter/HR"
                      className={`form-control ${errors.assigned_to ? "is-invalid" : ""}`}
                      value={formData.assigned_to}
                      onChange={handleChange}
                    />
                    {errors.assigned_to && (
                      <div className="invalid-feedback">
                        {errors.assigned_to[0]}
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
                    onClick={() => navigate("/engagement/applications")}
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

export default ApplicationsCreate;
