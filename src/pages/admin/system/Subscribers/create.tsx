import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateSubscriberMutation,
  useUpdateSubscriberMutation,
  useFetchSubscriberByIdQuery,
} from "../../../../../redux/system/Subscribers/subscriberApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const SubscribersCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: subscriber, isLoading } = useFetchSubscriberByIdQuery(
    id ? String(id) : "0",
    { skip: !id }
  );
  const [createSubscriber] = useCreateSubscriberMutation();
  const [updateSubscriber] = useUpdateSubscriberMutation();

  const [formData, setFormData] = useState<any>({
    email: "",
    name: "",
    status: true,
    source: "",
    ip_address: "",
    user_agent: "",
    subscribed_at: "",
    unsubscribed_at: "",
    is_bounced: false,
    is_verified: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Populate form when editing
  useEffect(() => {
    if (subscriber && id) {
      setFormData({
        email: subscriber?.data?.email || "",
        name: subscriber?.data?.name || "",
        status: subscriber?.data?.status || "",
        source: subscriber?.data?.source || "",
        ip_address: subscriber?.data?.ip_address || "",
        user_agent: subscriber?.data?.user_agent || "",
        subscribed_at: subscriber?.data?.subscribed_at || "",
        unsubscribed_at: subscriber?.data?.unsubscribed_at || "",
        is_bounced: subscriber?.data?.is_bounced || false,
        is_verified: subscriber?.data?.is_verified || false,
      });
    }
  }, [subscriber, id]);

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

  const setField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      status: true,
      source: "",
      ip_address: "",
      user_agent: "",
      subscribed_at: "",
      unsubscribed_at: "",
      is_bounced: false,
      is_verified: false,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const d = new Date(formData.last_reviewed_at);
      formData.last_reviewed_at = d.toISOString().slice(0, 19).replace("T", "");
      if (id) {
        await updateSubscriber({
          uuid: String(id),
          subscriberData: formData,
        }).unwrap();
        resetForm();
      } else {
        await createSubscriber(formData).unwrap();
        resetForm();
      }
      navigate("/system/subscribers");
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
        title={id ? "Edit Subscriber" : "Create Subscriber"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Subscribers", href: "/system/subscribers" },
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
                  {/* email */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter subscriber email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email[0]}</div>
                    )}
                  </div>

                  {/* name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter subscriber name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name[0]}</div>
                    )}
                  </div>

                  {/* status */}
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
                    {errors.status && (
                      <div className="invalid-feedback">{errors.status[0]}</div>
                    )}
                  </div>

                  {/* source */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="source">Source</label>
                    <input
                      type="text"
                      id="source"
                      name="source"
                      placeholder="Enter source (e.g., website, campaign)"
                      className={`form-control ${errors.source ? "is-invalid" : ""}`}
                      value={formData.source}
                      onChange={handleChange}
                    />
                    {errors.source && (
                      <div className="invalid-feedback">{errors.source[0]}</div>
                    )}
                  </div>

                  {/* ip_address */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="ip_address">IP Address</label>
                    <input
                      type="text"
                      id="ip_address"
                      name="ip_address"
                      placeholder="Enter IP address"
                      className={`form-control ${errors.ip_address ? "is-invalid" : ""}`}
                      value={formData.ip_address}
                      onChange={handleChange}
                    />
                    {errors.ip_address && (
                      <div className="invalid-feedback">{errors.ip_address[0]}</div>
                    )}
                  </div>

                  {/* user_agent */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="user_agent">User Agent</label>
                    <input
                      type="text"
                      id="user_agent"
                      name="user_agent"
                      placeholder="Enter browser/user agent string"
                      className={`form-control ${errors.user_agent ? "is-invalid" : ""}`}
                      value={formData.user_agent}
                      onChange={handleChange}
                    />
                    {errors.user_agent && (
                      <div className="invalid-feedback">{errors.user_agent[0]}</div>
                    )}
                  </div>

                  {/* subscribed_at */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="subscribed_at">Subscribed At</label>
                    <input
                      type="datetime-local"
                      id="subscribed_at"
                      name="subscribed_at"
                      placeholder="Select subscription date & time"
                      className={`form-control ${errors.subscribed_at ? "is-invalid" : ""
                        }`}
                      value={formData.subscribed_at}
                      onChange={handleChange}
                    />
                    {errors.subscribed_at && (
                      <div className="invalid-feedback">
                        {errors.subscribed_at[0]}
                      </div>
                    )}
                  </div>

                  {/* unsubscribed_at */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="unsubscribed_at">Unsubscribed At</label>
                    <input
                      type="datetime-local"
                      id="unsubscribed_at"
                      name="unsubscribed_at"
                      placeholder="Select unsubscription date & time"
                      className={`form-control ${errors.unsubscribed_at ? "is-invalid" : ""
                        }`}
                      value={formData.unsubscribed_at}
                      onChange={handleChange}
                    />
                    {errors.unsubscribed_at && (
                      <div className="invalid-feedback">
                        {errors.unsubscribed_at[0]}
                      </div>
                    )}
                  </div>

                  {/* is_bounced */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_bounced">Is Bounced</label>
                    <ToggleSwitch
                      id="is_bounced"
                      checked={!!formData.is_bounced}
                      onChange={(val) => setField("is_bounced", val)}
                    />
                    {errors.is_bounced && (
                      <div className="invalid-feedback">
                        {errors.is_bounced[0]}
                      </div>
                    )}
                  </div>

                  {/* is_verified */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_verified">Is Verified</label>
                    <ToggleSwitch
                      id="is_verified"
                      checked={!!formData.is_verified}
                      onChange={(val) => setField("is_verified", val)}
                    />
                    {errors.is_verified && (
                      <div className="invalid-feedback">
                        {errors.is_verified[0]}
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
                    className="btn btn-light"
                    onClick={() => navigate("/system/subscribers")}
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

export default SubscribersCreate;
