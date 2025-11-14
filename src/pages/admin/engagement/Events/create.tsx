import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
  useFetchEventByIdQuery,
} from "../../../../../redux/engagement/Events/eventApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import DragDrop from "../../../../../components/DragDrop";

const EventsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading } = useFetchEventByIdQuery(id ? String(id) : "0", { skip: !id });
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    banner_image: "",
    thumbnail: "",
    start_date: "",
    end_date: "",
    location: "",
    type: "",
    event_url: "",
    organizer: "",
    contact_email: "",
    contact_phone: "",
    is_registration_open: false,
    max_attendees: 0,
    registered_count: 0,
    ticket_price: 0,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: false,
    is_featured: false,
    order: 0,
    published_at: "",
    views_count: 0,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (event && id) {
      setFormData({
        title: event?.data?.title || "",
        slug: event?.data?.slug || "",
        subtitle: event?.data?.subtitle || "",
        description: event?.data?.description || "",
        banner_image: event?.data?.banner_image || "",
        thumbnail: event?.data?.thumbnail || "",
        start_date: event?.data?.start_date || "",
        end_date: event?.data?.end_date || "",
        location: event?.data?.location || "",
        type: event?.data?.type || "",
        event_url: event?.data?.event_url || "",
        organizer: event?.data?.organizer || "",
        contact_email: event?.data?.contact_email || "",
        contact_phone: event?.data?.contact_phone || "",
        is_registration_open: event?.data?.is_registration_open || "",
        max_attendees: event?.data?.max_attendees || "",
        registered_count: event?.data?.registered_count || "",
        ticket_price: event?.data?.ticket_price || "",
        meta_title: event?.data?.meta_title || "",
        meta_description: event?.data?.meta_description || "",
        meta_keywords: event?.data?.meta_keywords || "",
        status: event?.data?.status || "",
        is_featured: event?.data?.is_featured || "",
        order: event?.data?.order || "",
        published_at: event?.data?.published_at || "",
        views_count: event?.data?.views_count || "",
      });
    }
  }, [event, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [id]: newValue });
  };

  const setField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      banner_image: "",
      thumbnail: "",
      start_date: "",
      end_date: "",
      location: "",
      type: "",
      event_url: "",
      organizer: "",
      contact_email: "",
      contact_phone: "",
      is_registration_open: true,
      max_attendees: 0,
      registered_count: 0,
      ticket_price: 0,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: false,
      is_featured: true,
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
      if (id) {
        await updateEvent({ uuid: String(id), eventData: formData }).unwrap();
        resetForm();
      } else {
        await createEvent(formData).unwrap();
        resetForm();
      }
      navigate("/engagement/events");
    } catch (err: any) {
      if (err?.status === 422 && err.data?.errors) setErrors(err.data.errors);
      else console.error("Submit error", err);
    }
  };

  const [logoFile, setLogoFile] = useState<File | null>(null);

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Event" : "Create Event"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Event", href: "/engagement/events" },
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
                  {/* Text fields with placeholders */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Enter Event Title"
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
                      placeholder="tech-conference-2025"
                      className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                      value={formData.slug}
                      onChange={handleChange}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="subtitle">Subtitle</label>
                    <input
                      type="text"
                      id="subtitle"
                      placeholder="Enter Event subtitle"
                      className={`form-control ${errors.subtitle ? "is-invalid" : ""}`}
                      value={formData.subtitle}
                      onChange={handleChange}
                    />
                    {errors.subtitle && <div className="invalid-feedback">{errors.subtitle[0]}</div>}
                  </div>

                  <div className="col-6 form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      placeholder="Enter a detailed event description..."
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description[0]}</div>}
                  </div>

                  {/* DragDrop for banner image */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="banner_image">Banner Image</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop or click to upload banner"
                    />
                    {logoFile && <small className="text-muted">Selected: {logoFile.name}</small>}
                    {errors.banner_image && <div className="invalid-feedback">{errors.banner_image[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="thumbnail">Thumbnail</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop or click to upload"
                    />
                    {logoFile && (
                      <small className="text-muted">
                        Selected: {logoFile.name}
                      </small>
                    )}
                    {errors.thumbnail && <div className="invalid-feedback">{errors.thumbnail[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      type="date"
                      id="start_date"
                      placeholder="YYYY-MM-DD"
                      className={`form-control ${errors.start_date ? "is-invalid" : ""}`}
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                    {errors.start_date && <div className="invalid-feedback">{errors.start_date[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      type="date"
                      id="end_date"
                      placeholder="YYYY-MM-DD"
                      className={`form-control ${errors.end_date ? "is-invalid" : ""}`}
                      value={formData.end_date}
                      onChange={handleChange}
                    />
                    {errors.end_date && <div className="invalid-feedback">{errors.end_date[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      placeholder="e.g. San Francisco, CA or Online"
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
                      value={formData.type}
                      onChange={(e) => setField("type", e.target.value)}
                    >
                      <option value="">Select type</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    {errors.type && <div className="invalid-feedback">{errors.type[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="event_url">Event URL</label>
                    <input
                      type="url"
                      id="event_url"
                      placeholder="https://example.com/event"
                      className={`form-control ${errors.event_url ? "is-invalid" : ""}`}
                      value={formData.event_url}
                      onChange={handleChange}
                    />
                    {errors.event_url && <div className="invalid-feedback">{errors.event_url[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="organizer">Organizer</label>
                    <input
                      type="text"
                      id="organizer"
                      placeholder="Organizer name or company"
                      className={`form-control ${errors.organizer ? "is-invalid" : ""}`}
                      value={formData.organizer}
                      onChange={handleChange}
                    />
                    {errors.organizer && <div className="invalid-feedback">{errors.organizer[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="contact_email">Contact Email</label>
                    <input
                      type="email"
                      id="contact_email"
                      placeholder="contact@example.com"
                      className={`form-control ${errors.contact_email ? "is-invalid" : ""}`}
                      value={formData.contact_email}
                      onChange={handleChange}
                    />
                    {errors.contact_email && <div className="invalid-feedback">{errors.contact_email[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="contact_phone">Contact Phone</label>
                    <input
                      type="tel"
                      id="contact_phone"
                      placeholder="+1 555 123 4567"
                      className={`form-control ${errors.contact_phone ? "is-invalid" : ""}`}
                      value={formData.contact_phone}
                      onChange={handleChange}
                    />
                    {errors.contact_phone && <div className="invalid-feedback">{errors.contact_phone[0]}</div>}
                  </div>

                  {/* Switches & numbers */}
                  <div className="col-md-6 form-check">
                    <ToggleSwitch
                      id="showRegistrationSwitch"
                      label="Is Registration Open"
                      checked={!!formData.is_registration_open}
                      onChange={(val) => setFormData({ ...formData, is_registration_open: val })}
                    />
                    {errors.is_registration_open && (
                      <div className="invalid-feedback d-block">{errors.is_registration_open[0]}</div>
                    )}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="max_attendees">Max Attendees</label>
                    <input
                      type="number"
                      id="max_attendees"
                      placeholder="e.g. 200"
                      className={`form-control ${errors.max_attendees ? "is-invalid" : ""}`}
                      value={formData.max_attendees}
                      onChange={handleChange}
                    />
                    {errors.max_attendees && <div className="invalid-feedback">{errors.max_attendees[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="registered_count">Registered Count</label>
                    <input
                      type="number"
                      id="registered_count"
                      placeholder="e.g. 50"
                      className={`form-control ${errors.registered_count ? "is-invalid" : ""}`}
                      value={formData.registered_count}
                      onChange={handleChange}
                    />
                    {errors.registered_count && <div className="invalid-feedback">{errors.registered_count[0]}</div>}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="ticket_price">Ticket Price</label>
                    <input
                      type="number"
                      id="ticket_price"
                      placeholder="e.g. 99.99"
                      className={`form-control ${errors.ticket_price ? "is-invalid" : ""}`}
                      value={formData.ticket_price}
                      onChange={handleChange}
                    />
                    {errors.ticket_price && <div className="invalid-feedback">{errors.ticket_price[0]}</div>}
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
                      placeholder="keyword1, keyword2"
                      className={`form-control ${errors.meta_keywords ? "is-invalid" : ""}`}
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                    {errors.meta_keywords && <div className="invalid-feedback">{errors.meta_keywords[0]}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small">Status</label>
                    <select
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      value={formData.status ? 1 : 0}
                      onChange={(e) => setField("status", e.target.value === "1")}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                  </div>

                  <div className="col-md-6 form-check">
                    <ToggleSwitch
                      id="showFeaturedSwitch"
                      label="Show is_featured"
                      checked={!!formData.is_featured}
                      onChange={(val) => setFormData({ ...formData, is_featured: val })}
                    />
                    {errors.is_featured && (
                      <div className="invalid-feedback d-block">{errors.is_featured[0]}</div>
                    )}
                  </div>

                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      placeholder="e.g. 1"
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
                      placeholder="YYYY-MM-DD HH:mm"
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
                      placeholder="e.g. 0"
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
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/engagement/events")}
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

export default EventsCreate;
