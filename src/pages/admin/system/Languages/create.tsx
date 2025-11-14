import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useFetchLanguageByIdQuery,
} from "../../../../../redux/system/Languages/languageApi";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import DragDrop from "../../../../../components/DragDrop";

const LanguagesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: language, isLoading } = useFetchLanguageByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createLanguage] = useCreateLanguageMutation();
  const [updateLanguage] = useUpdateLanguageMutation();

  const [formData, setFormData] = useState<any>({
    code: "",
    locale: "",
    name: "",
    native_name: "",
    flag: "",
    direction: "",
    is_default: false,
    status: true,
    order: 0,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (language && id) {
      setFormData({
        code: language?.data?.code || "",
        locale: language?.data?.locale || "",
        name: language?.data?.name || "",
        native_name: language?.data?.native_name || "",
        flag: language?.data?.flag || "",
        direction: language?.data?.direction || "",
        is_default: language?.data?.is_default || false,
        status: language?.data?.status ?? true,
        order: language?.data?.order || 0,
      });
    }
  }, [language, id]);

  const setField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

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

  const resetForm = () => {
    setFormData({
      code: "",
      locale: "",
      name: "",
      native_name: "",
      flag: "",
      direction: "",
      is_default: false,
      status: true,
      order: 0,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updateLanguage({ uuid: String(id), languageData: formData }).unwrap();
      } else {
        await createLanguage(formData).unwrap();
      }
      resetForm();
      navigate("/system/languages");
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
        title={id ? "Edit Language" : "Create Language"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Languages", href: "/system/languages" },
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
                  {/* code */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="code">Code</label>
                    <input
                      type="text"
                      id="code"
                      placeholder="e.g. en, fr, hi"
                      className={`form-control ${errors.code ? "is-invalid" : ""}`}
                      value={formData.code}
                      onChange={handleChange}
                    />
                    {errors.code && <div className="invalid-feedback">{errors.code[0]}</div>}
                  </div>

                  {/* locale */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="locale">Locale</label>
                    <input
                      type="text"
                      id="locale"
                      placeholder="e.g. en_US, fr_FR"
                      className={`form-control ${errors.locale ? "is-invalid" : ""}`}
                      value={formData.locale}
                      onChange={handleChange}
                    />
                    {errors.locale && <div className="invalid-feedback">{errors.locale[0]}</div>}
                  </div>

                  {/* name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="English, French, Hindi…"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                  </div>

                  {/* native_name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="native_name">Native Name</label>
                    <input
                      type="text"
                      id="native_name"
                      placeholder="Language name in its own script"
                      className={`form-control ${errors.native_name ? "is-invalid" : ""}`}
                      value={formData.native_name}
                      onChange={handleChange}
                    />
                    {errors.native_name && <div className="invalid-feedback">{errors.native_name[0]}</div>}
                  </div>

                  {/* flag */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="flag">Flag</label>
                    <DragDrop
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      onFiles={(files) => setLogoFile(files[0] ?? null)}
                      label="Drop or click to upload flag image"
                    />
                    {logoFile && (
                      <small className="text-muted">Selected: {logoFile.name}</small>
                    )}
                    {errors.flag && <div className="invalid-feedback">{errors.flag[0]}</div>}
                  </div>

                  {/* direction */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="direction">Direction</label>
                    <select
                      id="direction"
                      className={`form-control ${errors.direction ? "is-invalid" : ""}`}
                      value={formData.direction}
                      onChange={(e) => setField("direction", e.target.value)}
                    >
                      <option value="">Select text direction</option>
                      <option value="ltr">Left to Right (LTR)</option>
                      <option value="rtl">Right to Left (RTL)</option>
                    </select>
                    {errors.direction && <div className="invalid-feedback">{errors.direction[0]}</div>}
                  </div>

                  {/* is_default */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_default">Is Default</label>
                    <ToggleSwitch
                      id="is_default"
                      checked={!!formData.is_default}
                      onChange={(val) => setFormData({ ...formData, is_default: val })}
                    />
                    {errors.is_default && (
                      <div className="invalid-feedback d-block">
                        {errors.is_default[0]}
                      </div>
                    )}
                  </div>

                  {/* status */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      value={formData.status ? "1" : "0"}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value === "1" })
                      }
                    >
                      <option value="">Select status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status[0]}</div>}
                  </div>

                  {/* order */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
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
                    onClick={() => navigate("/system/languages")}
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

export default LanguagesCreate;
