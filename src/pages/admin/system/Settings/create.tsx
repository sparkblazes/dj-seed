import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useFetchSettingByIdQuery,
} from "../../../../../redux/system/Settings/settingApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const SettingsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: setting, isLoading } = useFetchSettingByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createSetting] = useCreateSettingMutation();
  const [updateSetting] = useUpdateSettingMutation();

  const [formData, setFormData] = useState<any>({
    key: "",
    value: "",
    type: "",
    group: "",
    label: "",
    description: "",
    is_autoload: false,
    order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (setting && id) {
      setFormData({
        key: setting?.data?.key || "",
        value: setting?.data?.value || "",
        type: setting?.data?.type || "",
        group: setting?.data?.group || "",
        label: setting?.data?.label || "",
        description: setting?.data?.description || "",
        is_autoload: !!setting?.data?.is_autoload,
        order: setting?.data?.order || 0,
      });
    }
  }, [setting, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      key: "",
      value: "",
      type: "",
      group: "",
      label: "",
      description: "",
      is_autoload: false,
      order: 0,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateSetting({ uuid: String(id), settingData: formData }).unwrap();
        resetForm();
      } else {
        await createSetting(formData).unwrap();
        resetForm();
      }
      navigate("/system/settings");
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
        title={id ? "Edit Setting" : "Create Setting"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings", href: "/system/settings" },
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
                  {/* key */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="key">Key</label>
                    <input
                      type="text"
                      id="key"
                      name="key"
                      placeholder="e.g. site_name"
                      className={`form-control ${errors.key ? "is-invalid" : ""}`}
                      value={formData.key}
                      onChange={handleChange}
                    />
                    {errors.key && <div className="invalid-feedback">{errors.key[0]}</div>}
                  </div>

                  {/* value */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="value">Value</label>
                    <input
                      type="text"
                      id="value"
                      name="value"
                      placeholder="e.g. My Awesome Website"
                      className={`form-control ${errors.value ? "is-invalid" : ""}`}
                      value={formData.value}
                      onChange={handleChange}
                    />
                    {errors.value && <div className="invalid-feedback">{errors.value[0]}</div>}
                  </div>

                  {/* type */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="type">Type</label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      placeholder="e.g. string, boolean, integer"
                      className={`form-control ${errors.type ? "is-invalid" : ""}`}
                      value={formData.type}
                      onChange={handleChange}
                    />
                    {errors.type && <div className="invalid-feedback">{errors.type[0]}</div>}
                  </div>

                  {/* group */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="group">Group</label>
                    <input
                      type="text"
                      id="group"
                      name="group"
                      placeholder="e.g. general, email, seo"
                      className={`form-control ${errors.group ? "is-invalid" : ""}`}
                      value={formData.group}
                      onChange={handleChange}
                    />
                    {errors.group && <div className="invalid-feedback">{errors.group[0]}</div>}
                  </div>

                  {/* label */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="label">Label</label>
                    <input
                      type="text"
                      id="label"
                      name="label"
                      placeholder="Display name for this setting"
                      className={`form-control ${errors.label ? "is-invalid" : ""}`}
                      value={formData.label}
                      onChange={handleChange}
                    />
                    {errors.label && <div className="invalid-feedback">{errors.label[0]}</div>}
                  </div>

                  {/* description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Brief explanation of the setting"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description[0]}</div>}
                  </div>

                  {/* is_autoload */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_autoload">Is Autoload</label>
                    <ToggleSwitch
                      id="is_autoload"
                      checked={!!formData.is_autoload}
                      onChange={(val) => setField("is_autoload", val)}
                    />
                    {errors.is_autoload && (
                      <div className="invalid-feedback">{errors.is_autoload[0]}</div>
                    )}
                  </div>

                  {/* order */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      placeholder="Display order (e.g. 1)"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      value={formData.order}
                      onChange={handleChange}
                    />
                    {errors.order && <div className="invalid-feedback">{errors.order[0]}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/system/settings")}
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

export default SettingsCreate;
