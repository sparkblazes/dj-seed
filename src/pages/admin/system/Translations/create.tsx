import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateTranslationMutation,
  useUpdateTranslationMutation,
  useFetchTranslationByIdQuery,
} from "../../../../../redux/system/Translations/translationApi";
import { useLazyFetchDropdownLanguagesQuery } from "../../../../../redux/system/Languages/languageApi";

import AsyncSelect from "react-select/async";
import ToggleSwitch from "../../../../../components/ToggleSwitch";

const TranslationsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: translation, isLoading } = useFetchTranslationByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createTranslation] = useCreateTranslationMutation();
  const [updateTranslation] = useUpdateTranslationMutation();

  const [formData, setFormData] = useState<any>({
    language_id: "",
    group: "",
    namespace: "",
    key: "",
    value: "",
    context: "",
    is_html: false,
    is_active: true,
    version: 1,
    last_reviewed_at: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (translation && id) {
      setFormData({
        language_id: translation?.data?.language_id || "",
        group: translation?.data?.group || "",
        namespace: translation?.data?.namespace || "",
        key: translation?.data?.key || "",
        value: translation?.data?.value || "",
        context: translation?.data?.context || "",
        is_html: translation?.data?.is_html || "",
        is_active: translation?.data?.is_active || "",
        version: translation?.data?.version || "",
        last_reviewed_at: translation?.data?.last_reviewed_at || "",
      });
    }
  }, [translation, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
    if (id === "is_html" || id === "is_active") newValue = value === "true";
    setFormData({ ...formData, [id]: newValue });
  };

  const setField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setFormData({
      language_id: "",
      group: "",
      namespace: "",
      key: "",
      value: "",
      context: "",
      is_html: false,
      is_active: true,
      version: 1,
      last_reviewed_at: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const d = new Date(formData.last_reviewed_at);
      formData.last_reviewed_at = d.toISOString().slice(0, 19).replace("T", " ");
      if (id) {
        await updateTranslation({ uuid: String(id), translationData: formData }).unwrap();
        resetForm();
      } else {
        await createTranslation(formData).unwrap();
        resetForm();
      }
      navigate("/system/translations");
    } catch (err: any) {
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }
  };

  const [triggerSearch] = useLazyFetchDropdownLanguagesQuery();
  const loadCategoryOptions = async (inputValue: any) => {
    const res = await triggerSearch(inputValue).unwrap();
    const arr = Array.isArray(res) ? res : (res as any).data ?? [];
    return arr.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }));
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Translation" : "Create Translation"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Translations", href: "/system/translations" },
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
                  {/* language_id */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="language_id">Language</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      isClearable
                      loadOptions={loadCategoryOptions}
                      value={
                        formData.language_id
                          ? { value: formData.language_id, label: formData.name ?? "" }
                          : null
                      }
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          language_id: option ? option.value : "",
                          name: option ? option.label : "",
                        })
                      }
                      placeholder="Search and select a language..."
                    />
                    {errors.language_id && (
                      <div className="invalid-feedback d-block">{errors.language_id[0]}</div>
                    )}
                  </div>

                  {/* group */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="group">Group</label>
                    <input
                      type="text"
                      id="group"
                      name="group"
                      placeholder="e.g. validation, messages"
                      className={`form-control ${errors.group ? "is-invalid" : ""}`}
                      value={formData.group}
                      onChange={handleChange}
                    />
                    {errors.group && <div className="invalid-feedback">{errors.group[0]}</div>}
                  </div>

                  {/* namespace */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="namespace">Namespace</label>
                    <input
                      type="text"
                      id="namespace"
                      name="namespace"
                      placeholder="Optional namespace (e.g. auth)"
                      className={`form-control ${errors.namespace ? "is-invalid" : ""}`}
                      value={formData.namespace}
                      onChange={handleChange}
                    />
                    {errors.namespace && <div className="invalid-feedback">{errors.namespace[0]}</div>}
                  </div>

                  {/* key */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="key">Key</label>
                    <input
                      type="text"
                      id="key"
                      name="key"
                      placeholder="Unique translation key (e.g. welcome_message)"
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
                      placeholder="Translation text shown to users"
                      className={`form-control ${errors.value ? "is-invalid" : ""}`}
                      value={formData.value}
                      onChange={handleChange}
                    />
                    {errors.value && <div className="invalid-feedback">{errors.value[0]}</div>}
                  </div>

                  {/* context */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="context">Context</label>
                    <input
                      type="text"
                      id="context"
                      name="context"
                      placeholder="Optional context for translators"
                      className={`form-control ${errors.context ? "is-invalid" : ""}`}
                      value={formData.context}
                      onChange={handleChange}
                    />
                    {errors.context && <div className="invalid-feedback">{errors.context[0]}</div>}
                  </div>

                  {/* is_html */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_html">Is HTML</label>
                    <ToggleSwitch
                      id="is_html"
                      checked={!!formData.is_html}
                      onChange={(val) => setField("is_html", val)}
                      onText="HTML enabled"
                      offText="HTML disabled"
                    />
                    {errors.is_html && (
                      <div className="invalid-feedback">{errors.is_html[0]}</div>
                    )}
                  </div>

                  {/* is_active */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="is_active">Is Active</label>
                    <ToggleSwitch
                      id="is_active"
                      checked={!!formData.is_active}
                      onChange={(val) => setField("is_active", val)}
                      onText="Active"
                      offText="Inactive"
                    />
                    {errors.is_active && (
                      <div className="invalid-feedback">{errors.is_active[0]}</div>
                    )}
                  </div>

                  {/* version */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="version">Version</label>
                    <input
                      type="number"
                      id="version"
                      name="version"
                      placeholder="Enter version number"
                      className={`form-control ${errors.version ? "is-invalid" : ""}`}
                      value={formData.version}
                      onChange={handleChange}
                    />
                    {errors.version && <div className="invalid-feedback">{errors.version[0]}</div>}
                  </div>

                  {/* last_reviewed_at */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="last_reviewed_at">Last Reviewed At</label>
                    <input
                      type="datetime-local"
                      id="last_reviewed_at"
                      name="last_reviewed_at"
                      placeholder="Select last review date & time"
                      className={`form-control ${errors.last_reviewed_at ? "is-invalid" : ""}`}
                      value={formData.last_reviewed_at}
                      onChange={handleChange}
                    />
                    {errors.last_reviewed_at && (
                      <div className="invalid-feedback">{errors.last_reviewed_at[0]}</div>
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
                    onClick={() => navigate("/system/translations")}
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

export default TranslationsCreate;
