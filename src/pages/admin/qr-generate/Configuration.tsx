// src/modules/admin/pages/qrCodeConfiguration/create.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/Layouts/Breadcrumb";
import DragDrop from "../../../../components/DragDrop";
import ToggleSwitch from "../../../../components/ToggleSwitch";

import {
  useFetchQRGenerateConfigurationQuery,
  useUpdateQRGenerateConfigurationMutation,
} from "../../../../redux/qr-generate/QRGenerateApi";

const ConfigurationCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ API hooks
  const { data: qrCodeConfiguration, isLoading } =
    useFetchQRGenerateConfigurationQuery();
  const [updateQRGenerateConfiguration] =
    useUpdateQRGenerateConfigurationMutation();

  // ✅ Form state
  const [form, setForm] = useState<any>({
    website_url: "",
    company_name: "",
    company_mobile_number: "",
    company_address: "",
    manufacturing_address: "",
    header_text: "",
    footer_text: "",
    facebook_id: "",
    instagram_id: "",
    twitter_id: "",
    linkedin_id: "",
    youtube_id: "",
    header_background_color: "#ffffff",
    footer_background_color: "#ffffff",
    show_logo: false,
  });
  // ✅ file state

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // ✅ populate when editing
  useEffect(() => {
    console.log("Fetched QR Generate:", qrCodeConfiguration);
    if (qrCodeConfiguration && id) {
      setForm({
        website_url: qrCodeConfiguration?.data?.website_url || "",
        company_name: qrCodeConfiguration?.data?.company_name || "",
        company_mobile_number:
          qrCodeConfiguration?.data?.company_mobile_number || "",
        company_address: qrCodeConfiguration?.data?.company_address || "",
        manufacturing_address:
          qrCodeConfiguration?.data?.manufacturing_address || "",
        header_text: qrCodeConfiguration?.data?.header_text || "",
        footer_text: qrCodeConfiguration?.data?.footer_text || "",
        facebook_id: qrCodeConfiguration?.data?.facebook_id || "",
        instagram_id: qrCodeConfiguration?.data?.instagram_id || "",
        twitter_id: qrCodeConfiguration?.data?.twitter_id || "",
        linkedin_id: qrCodeConfiguration?.data?.linkedin_id || "",
        youtube_id: qrCodeConfiguration?.data?.youtube_id || "",
        header_background_color:
          qrCodeConfiguration?.data?.header_background_color || "#ffffff",
        footer_background_color:
          qrCodeConfiguration?.data?.footer_background_color || "#ffffff",
        show_logo: qrCodeConfiguration?.data?.show_logo === "1",
      });
    }
  }, [qrCodeConfiguration, id]);

  // ✅ helpers
  const setField = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      website_url: "",
      company_name: "",
      company_mobile_number: "",
      company_address: "",
      manufacturing_address: "",
      header_text: "",
      footer_text: "",
      facebook_id: "",
      instagram_id: "",
      twitter_id: "",
      linkedin_id: "",
      youtube_id: "",
      header_background_color: "#ffffff",
      footer_background_color: "#ffffff",
    });
    setLogoFile(null);
    setErrors({});
  };

  // ✅ submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      // construct payload
      const payload = { ...form };

      if (logoFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) =>
          formData.append(key, String(value))
        );
        formData.append("logo", logoFile);

        await updateQRGenerateConfiguration({
          qrData: formData,
        }).unwrap();
        // ✅ reset form
        resetForm();
        navigate("/admin");
      } else {
        await updateQRGenerateConfiguration({
          qrData: payload,
        }).unwrap();

        // ✅ reset form
        resetForm();
        navigate("/admin");
      }
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
        title={"Settings"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings", active: true },
        ]}
      />

      <div className="">
        {isLoading && <p>Loading...</p>}

        {errors.general && (
          <div className="alert alert-danger">{errors.general.join(", ")}</div>
        )}
        <form onSubmit={handleSubmit} className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {isLoading && <p>Loading...</p>}

                {errors.general && (
                  <div className="alert alert-danger">
                    {errors.general.join(", ")}
                  </div>
                )}

                {/* submit buttons */}
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-header">Company Information</div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="company_name">Company Name</label>
                    <input
                      id="company_name"
                      className={`form-control ${
                        errors.company_name ? "is-invalid" : ""
                      }`}
                      placeholder="Company Name"
                      value={form.company_name || ""}
                      onChange={(e) => setField("company_name", e.target.value)}
                    />
                    {errors.company_name && (
                      <div className="invalid-feedback">
                        {errors.company_name[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="company_mobile_number">
                      Company Mobile Number
                    </label>
                    <input
                      id="company_mobile_number"
                      placeholder="Company Mobile Number"
                      className={`form-control ${
                        errors.company_mobile_number ? "is-invalid" : ""
                      }`}
                      value={form.company_mobile_number || ""}
                      onChange={(e) =>
                        setField("company_mobile_number", e.target.value)
                      }
                    />
                    {errors.company_mobile_number && (
                      <div className="invalid-feedback">
                        {errors.company_mobile_number[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="company_address">Company Address</label>
                    <textarea
                      id="company_address"
                      rows={3}
                      placeholder="Company Address"
                      className={`form-control ${
                        errors.company_address ? "is-invalid" : ""
                      }`}
                      value={form.company_address || ""}
                      onChange={(e) =>
                        setField("company_address", e.target.value)
                      }
                    />
                    {errors.company_address && (
                      <div className="invalid-feedback">
                        {errors.company_address[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="manufacturing_address">
                      Manufacturing Address
                    </label>
                    <textarea
                      id="manufacturing_address"
                      rows={3}
                      placeholder="Manufacturing Address"
                      className={`form-control ${
                        errors.manufacturing_address ? "is-invalid" : ""
                      }`}
                      value={form.manufacturing_address || ""}
                      onChange={(e) =>
                        setField("manufacturing_address", e.target.value)
                      }
                    />
                    {errors.manufacturing_address && (
                      <div className="invalid-feedback">
                        {errors.manufacturing_address[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="website_url">Website URL</label>
                    <input
                      id="website_url"
                      type="url"
                      placeholder="Website URL"
                      className={`form-control ${
                        errors.website_url ? "is-invalid" : ""
                      }`}
                      value={form.website_url || ""}
                      onChange={(e) => setField("website_url", e.target.value)}
                    />
                    {errors.website_url && (
                      <div className="invalid-feedback">
                        {errors.website_url[0]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Facebook IDs</label>
                    <input
                      id="facebook_id"
                      placeholder="Facebook"
                      className="form-control"
                      value={form.facebook_id || ""}
                      onChange={(e) => setField("facebook_id", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Instagram IDs</label>
                    <input
                      id="instagram_id"
                      placeholder="Instagram"
                      className="form-control"
                      value={form.instagram_id || ""}
                      onChange={(e) => setField("instagram_id", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Twitter IDs</label>
                    <input
                      id="twitter_id"
                      placeholder="Twitter"
                      className="form-control"
                      value={form.twitter_id || ""}
                      onChange={(e) => setField("twitter_id", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>LinkedIn IDs</label>
                    <input
                      id="linkedin_id"
                      placeholder="LinkedIn"
                      className="form-control"
                      value={form.linkedin_id || ""}
                      onChange={(e) => setField("linkedin_id", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>YouTube IDs</label>
                    <input
                      id="youtube_id"
                      placeholder="YouTube"
                      className="form-control"
                      value={form.youtube_id || ""}
                      onChange={(e) => setField("youtube_id", e.target.value)}
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Logo (PNG/JPG)</label>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-header">QR Code Configuration</div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="header_text">Header Text</label>
                    <input
                      id="header_text"
                      className={`form-control ${
                        errors.header_text ? "is-invalid" : ""
                      }`}
                      value={form.header_text || ""}
                      placeholder="Header Text"
                      onChange={(e) => setField("header_text", e.target.value)}
                    />
                    {errors.header_text && (
                      <div className="invalid-feedback">
                        {errors.header_text[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="footer_text">Footer Text</label>
                    <input
                      id="footer_text"
                      className={`form-control ${
                        errors.footer_text ? "is-invalid" : ""
                      }`}
                      value={form.footer_text || ""}
                      placeholder="Footer Text"
                      onChange={(e) => setField("footer_text", e.target.value)}
                    />
                    {errors.footer_text && (
                      <div className="invalid-feedback">
                        {errors.footer_text[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small">
                      Header Background Color
                    </label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={form.header_background_color || "#ffffff"}
                      onChange={(e) =>
                        setField("header_background_color", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small">
                      Header Font Color
                    </label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={form.header_color || "#ffffff"}
                      onChange={(e) => setField("header_color", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small">
                      Footer Background Color
                    </label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={form.footer_background_color || "#ffffff"}
                      onChange={(e) =>
                        setField("footer_background_color", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small">
                      Footer Font Color
                    </label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={form.footer_color || "#ffffff"}
                      onChange={(e) => setField("footer_color", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <ToggleSwitch
                      id="showLogoSwitch"
                      label="Show Logo"
                      checked={!!form.show_logo}
                      onChange={(val) => setField("show_logo", val)}
                      onText="Logo will be displayed"
                      offText="Logo will not be displayed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                {isLoading && <p>Loading...</p>}

                {errors.general && (
                  <div className="alert alert-danger">
                    {errors.general.join(", ")}
                  </div>
                )}

                {/* submit buttons */}
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                   Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ConfigurationCreate;
