import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateApiTokenMutation,
  useUpdateApiTokenMutation,
  useFetchApiTokenByIdQuery,
} from "../../../../../redux/system/ApiTokens/apiTokenApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const ApiTokensCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: apiToken, isLoading } = useFetchApiTokenByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createApiToken] = useCreateApiTokenMutation();
  const [updateApiToken] = useUpdateApiTokenMutation();

  const [formData, setFormData] = useState<any>({
    token: "",
    token_type: "",
    scopes: "",
    expires_at: "",
    device_name: "",
    ip_address: "",
    user_agent: "",
    last_used_at: "",
    usage_count: 0,
    is_revoked: false,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (apiToken && id) {
      setFormData({
        token: apiToken?.data?.token || "",
        token_type: apiToken?.data?.token_type || "",
        scopes: apiToken?.data?.scopes || "",
        expires_at: apiToken?.data?.expires_at || "",
        device_name: apiToken?.data?.device_name || "",
        ip_address: apiToken?.data?.ip_address || "",
        user_agent: apiToken?.data?.user_agent || "",
        last_used_at: apiToken?.data?.last_used_at || "",
        is_revoked: apiToken?.data?.is_revoked || "",
        is_active: apiToken?.data?.is_active || "",
      });
    }
  }, [apiToken, id]);

  const setField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    if (id === "is_revoked" || id === "is_active") newValue = value === "true";
    setFormData({ ...formData, [id]: newValue });
  };

  const resetForm = () => {
    setFormData({
      token: "",
      token_type: "",
      scopes: "",
      expires_at: "",
      device_name: "",
      ip_address: "",
      user_agent: "",
      last_used_at: "",
      usage_count: 0,
      is_revoked: false,
      is_active: true,
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
        await updateApiToken({ uuid: String(id), apiTokenData: formData }).unwrap();
        resetForm();
      } else {
        await createApiToken(formData).unwrap();
        resetForm();
      }
      navigate("/system/api-tokens");
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
        title={id ? "Edit api-Tokens" : "Create api-Tokens"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "ApiTokens", href: "/system/api-tokens" },
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
                  {/* token */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="token">Token</label>
                    <input
                      type="text"
                      id="token"
                      name="token"
                      placeholder="Enter token"
                      className={`form-control ${errors.token ? "is-invalid" : ""}`}
                      value={formData.token}
                      onChange={handleChange}
                    />
                    {errors.token && <div className="invalid-feedback">{errors.token[0]}</div>}
                  </div>

                  {/* token_type */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="token_type">Token Type</label>
                    <select
                      id="token_type"
                      className={`form-control ${errors.token_type ? "is-invalid" : ""}`}
                      value={formData.token_type || ""}
                      onChange={(e) => setField("token_type", e.target.value)}
                    >
                      <option value="">Select token type</option>
                      <option value="personal">personal</option>
                      <option value="oauth">oauth</option>
                      <option value="system">system</option>
                    </select>
                    {errors.token_type && (
                      <div className="invalid-feedback">{errors.token_type[0]}</div>
                    )}
                  </div>

                  {/* scopes */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="scopes">Scopes</label>
                    <input
                      type="text"
                      id="scopes"
                      name="scopes"
                      placeholder="Enter scopes"
                      className={`form-control ${errors.scopes ? "is-invalid" : ""}`}
                      value={formData.scopes}
                      onChange={handleChange}
                    />
                    {errors.scopes && <div className="invalid-feedback">{errors.scopes[0]}</div>}
                  </div>

                  {/* expires_at */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="expires_at">Expires At</label>
                    <input
                      type="datetime-local"
                      id="expires_at"
                      name="expires_at"
                      placeholder="Select expiry date and time"
                      className={`form-control ${errors.expires_at ? "is-invalid" : ""}`}
                      value={formData.expires_at}
                      onChange={handleChange}
                    />
                    {errors.expires_at && <div className="invalid-feedback">{errors.expires_at[0]}</div>}
                  </div>

                  {/* device_name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="device_name">Device Name</label>
                    <input
                      type="text"
                      id="device_name"
                      name="device_name"
                      placeholder="Enter device name"
                      className={`form-control ${errors.device_name ? "is-invalid" : ""}`}
                      value={formData.device_name}
                      onChange={handleChange}
                    />
                    {errors.device_name && <div className="invalid-feedback">{errors.device_name[0]}</div>}
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
                    {errors.ip_address && <div className="invalid-feedback">{errors.ip_address[0]}</div>}
                  </div>

                  {/* user_agent */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="user_agent">User Agent</label>
                    <input
                      type="text"
                      id="user_agent"
                      name="user_agent"
                      placeholder="Enter user agent"
                      className={`form-control ${errors.user_agent ? "is-invalid" : ""}`}
                      value={formData.user_agent}
                      onChange={handleChange}
                    />
                    {errors.user_agent && <div className="invalid-feedback">{errors.user_agent[0]}</div>}
                  </div>

                  {/* last_used_at */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="last_used_at">Last Used At</label>
                    <input
                      type="datetime-local"
                      id="last_used_at"
                      name="last_used_at"
                      placeholder="Select last used date and time"
                      className={`form-control ${errors.last_used_at ? "is-invalid" : ""}`}
                      value={formData.last_used_at}
                      onChange={handleChange}
                    />
                    {errors.last_used_at && <div className="invalid-feedback">{errors.last_used_at[0]}</div>}
                  </div>

                  {/* usage_count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="usage_count">Usage Count</label>
                    <input
                      type="number"
                      id="usage_count"
                      name="usage_count"
                      placeholder="Enter usage count"
                      className={`form-control ${errors.usage_count ? "is-invalid" : ""}`}
                      value={formData.usage_count}
                      onChange={handleChange}
                    />
                    {errors.usage_count && <div className="invalid-feedback">{errors.usage_count[0]}</div>}
                  </div>

                  {/* is_revoked */}
                  <div className="col-md-3 form-group">
                    <label htmlFor="is_revoked">Is Revoked</label>
                    <ToggleSwitch
                      id="is_revoked"
                      checked={!!formData.is_revoked}
                      onChange={(val) => setField("is_revoked", val)}
                    />
                    {errors.is_revoked && (
                      <div className="invalid-feedback">{errors.is_revoked[0]}</div>
                    )}
                  </div>

                  {/* is_active */}
                  <div className="col-md-3 form-group">
                    <label htmlFor="is_active">Is Active</label>
                    <ToggleSwitch
                      id="is_active"
                      checked={!!formData.is_active}
                      onChange={(val) => setField("is_active", val)}
                    />
                    {errors.is_active && (
                      <div className="invalid-feedback">{errors.is_active[0]}</div>
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
                    onClick={() => navigate("/system/api-tokens")}
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

export default ApiTokensCreate;
