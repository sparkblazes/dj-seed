import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/navigation/BreadCrumbs";
import {
  useCreateContactsMutation,
  useUpdateContactsMutation,
  useFetchContactsByIdQuery,
} from "../../../../redux/engagement/Contacts/contactsApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const ContactsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: contacts, isLoading } = useFetchContactsByIdQuery(
    id ? String(id) : "0",
    { skip: !id }
  );

  const [createContacts] = useCreateContactsMutation();
  const [updateContacts] = useUpdateContactsMutation();

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    company: "",
    department: "",
    source: "",
    ip_address: "",
    user_agent: "",
    status: "",
    is_spam: false,
    follow_up_date: "",
    notes: "",
    assigned_to: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (contacts && id) {
      setFormData({
        name: contacts?.data?.name || "",
        email: contacts?.data?.email || "",
        phone: contacts?.data?.phone || "",
        subject: contacts?.data?.subject || "",
        message: contacts?.data?.message || "",
        company: contacts?.data?.company || "",
        department: contacts?.data?.department || "",
        source: contacts?.data?.source || "",
        ip_address: contacts?.data?.ip_address || "",
        user_agent: contacts?.data?.user_agent || "",
        status: contacts?.data?.status || "",
        is_spam: !!contacts?.data?.is_spam,
        follow_up_date: contacts?.data?.follow_up_date || "",
        notes: contacts?.data?.notes || "",
        assigned_to: contacts?.data?.assigned_to || "",
      });
    }
  }, [contacts, id]);

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
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      company: "",
      department: "",
      source: "",
      ip_address: "",
      user_agent: "",
      status: 1,
      is_spam: false,
      follow_up_date: "",
      notes: "",
      assigned_to: 1,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateContacts({ uuid: String(id), contactsData: formData }).unwrap();
        resetForm();
      } else {
        await createContacts(formData).unwrap();
      }
      navigate("/engagement/contacts");
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
        title={id ? "Edit Contacts" : "Create Contacts"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Contacts", href: "/engagement/contacts" },
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
                  {/* name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter full name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                  </div>

                  {/* email */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="example@domain.com"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                  </div>

                  {/* phone */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Enter phone number"
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone[0]}</div>}
                  </div>

                  {/* subject */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      placeholder="Enter subject"
                      className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    {errors.subject && <div className="invalid-feedback">{errors.subject[0]}</div>}
                  </div>

                  {/* message */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      placeholder="Enter message"
                      className={`form-control ${errors.message ? "is-invalid" : ""}`}
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message[0]}</div>}
                  </div>

                  {/* company */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      placeholder="Company name"
                      className={`form-control ${errors.company ? "is-invalid" : ""}`}
                      value={formData.company}
                      onChange={handleChange}
                    />
                    {errors.company && <div className="invalid-feedback">{errors.company[0]}</div>}
                  </div>

                  {/* department */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="department">Department</label>
                    <input
                      type="text"
                      id="department"
                      placeholder="Department name"
                      className={`form-control ${errors.department ? "is-invalid" : ""}`}
                      value={formData.department}
                      onChange={handleChange}
                    />
                    {errors.department && <div className="invalid-feedback">{errors.department[0]}</div>}
                  </div>

                  {/* source */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="source">Source</label>
                    <input
                      type="text"
                      id="source"
                      placeholder="Lead source"
                      className={`form-control ${errors.source ? "is-invalid" : ""}`}
                      value={formData.source}
                      onChange={handleChange}
                    />
                    {errors.source && <div className="invalid-feedback">{errors.source[0]}</div>}
                  </div>

                  {/* ip_address */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="ip_address">IP Address</label>
                    <input
                      type="text"
                      id="ip_address"
                      placeholder="User IP address"
                      className={`form-control ${errors.ip_address ? "is-invalid" : ""}`}
                      value={formData.ip_address}
                      onChange={handleChange}
                    />
                    {errors.ip_address && <div className="invalid-feedback">{errors.ip_address[0]}</div>}
                  </div>

                  {/* user_agent */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="user_agent">User Agent</label>
                    <input
                      type="text"
                      id="user_agent"
                      placeholder="Browser user agent"
                      className={`form-control ${errors.user_agent ? "is-invalid" : ""}`}
                      value={formData.user_agent}
                      onChange={handleChange}
                    />
                    {errors.user_agent && <div className="invalid-feedback">{errors.user_agent[0]}</div>}
                  </div>

                  {/* Status */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      value={formData.status || ""}
                      onChange={(e) => setField("status", e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="new">new</option>
                      <option value="viewed">viewed</option>
                      <option value="replied">replied</option>
                      <option value="closed">closed</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                  </div>

                  {/* is_spam */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_spam">Is Spam</label>
                    <ToggleSwitch
                      id="is_spam"
                      checked={!!formData.is_spam}
                      onChange={(val) => setFormData({ ...formData, is_spam: val })}
                    />
                    {errors.is_spam && (
                      <div className="invalid-feedback d-block">
                        {errors.is_spam[0]}
                      </div>
                    )}
                  </div>

                  {/* follow_up_date */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="follow_up_date">Follow-up Date</label>
                    <input
                      type="datetime-local"
                      id="follow_up_date"
                      placeholder="YYYY-MM-DD HH:mm"
                      className={`form-control ${errors.follow_up_date ? "is-invalid" : ""}`}
                      value={formData.follow_up_date}
                      onChange={handleChange}
                    />
                    {errors.follow_up_date && (
                      <div className="invalid-feedback">{errors.follow_up_date[0]}</div>
                    )}
                  </div>

                  {/* notes */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      placeholder="Additional notes"
                      className={`form-control ${errors.notes ? "is-invalid" : ""}`}
                      value={formData.notes}
                      onChange={handleChange}
                    />
                    {errors.notes && <div className="invalid-feedback">{errors.notes[0]}</div>}
                  </div>

                  {/* assigned_to */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="assigned_to">Assigned To</label>
                    <input
                      type="text"
                      id="assigned_to"
                      placeholder="User ID or name"
                      className={`form-control ${errors.assigned_to ? "is-invalid" : ""}`}
                      value={formData.assigned_to}
                      onChange={handleChange}
                    />
                    {errors.assigned_to && <div className="invalid-feedback">{errors.assigned_to[0]}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-primary me-2">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/engagement/contacts")}
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

export default ContactsCreate;
