// src/modules/admin/pages/QrGenerate/create.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/Layouts/Breadcrumb";
import QuillEditor from "../../../../components/QuillEditor";

import {
  useCreateQRGenerateMutation,
  useUpdateQRGenerateMutation,
  useFetchQRGenerateByIdQuery,
} from "../../../../redux/qr-generate/QRGenerateApi";
// 👇 lazy query import
import { useLazySearchDropdownProductsQuery } from "../../../../redux/ecommerce/Products/productApi";
import AsyncSelect from "react-select/async";

const QRGenerateCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ API hooks
  const { data: qrGenerate, isLoading } = useFetchQRGenerateByIdQuery(
    id ? String(id) : "0",
    { skip: !id }
  );
  const [createQRGenerate] = useCreateQRGenerateMutation();
  const [updateQRGenerate] = useUpdateQRGenerateMutation();

  // ✅ Form state
  const [form, setForm] = useState<any>({
    verity_name: "",
    product_id: "",
    english_input_text: "",
    hindi_input_text: "",
    gujarati_input_text: "",
    status: 1,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const handleEnglishChange = (value: string) =>
    setField("english_input_text", value);
  const handleHindiChange = (value: string) =>
    setField("hindi_input_text", value);
  const handleGujaratiChange = (value: string) =>
    setField("gujarati_input_text", value);
  // ✅ populate when editing
  useEffect(() => {
    console.log("Fetched QR Generate:", qrGenerate);
    if (qrGenerate && id) {
      setForm({
        verity_name: qrGenerate?.data?.verity_name || "",
        product_id: qrGenerate?.data?.product_id || "",
        english_input_text: qrGenerate?.data?.english_input_text || "",
        hindi_input_text: qrGenerate?.data?.hindi_input_text || "",
        gujarati_input_text: qrGenerate?.data?.gujarati_input_text || "",
        status: qrGenerate?.data?.status ?? true,
      });
    }
  }, [qrGenerate, id]);

  // ✅ helpers
  const setField = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      verity_name: "",
      product_id: "",
      english_input_text: "",
      hindi_input_text: "",
      gujarati_input_text: "",
      status: true,
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

        if (id) {
          await updateQRGenerate({
            uuid: String(id),
            qrData: formData,
          }).unwrap();
          // ✅ reset form
          resetForm();
          navigate("/qr-generate");
        } else {
          await createQRGenerate(formData as any).unwrap();
          // ✅ reset form
          resetForm();
          navigate("/qr-generate");
        }
      } else {
        if (id) {
          await updateQRGenerate({
            uuid: String(id),
            qrData: payload,
          }).unwrap();
        } else {
          await createQRGenerate(payload).unwrap();
        }
      }
    } catch (err: any) {
      if (err?.status === 422 && err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        console.error("Submit error", err);
      }
    }
  };

  // ✅ useLazy*Query returns a trigger function you can call

  const [triggerSearch] = useLazySearchDropdownProductsQuery();

  // ✅ loader function for AsyncSelect
  const loadProductOptions = async (inputValue: string) => {
    try {
      const res = await triggerSearch(inputValue).unwrap();
      // ✅ ensure we use res.data
      const products = Array.isArray(res?.data) ? res.data : [];
      return products.map((pro: any) => ({
        value: pro.id,
        label: pro.text,
      }));
    } catch (err) {
      console.error("Product search failed", err);
      return [];
    }
  };
  return (
    <>
      <Breadcrumb
        title={id ? "Edit QR Generate" : "Create QR Generate"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "QR Generate", href: "/qr-generate" },
          { label: id ? "Edit" : "Create", active: true },
        ]}
      />

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {isLoading && <p>Loading...</p>}

              {errors.general && (
                <div className="alert alert-danger">
                  {errors.general.join(", ")}
                </div>
              )}

              {/* ✅ your existing form here — keep using setField() */}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* ✅ searchable product dropdown */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="product_id">Product</label>
                    <AsyncSelect
                      classNamePrefix="select"
                      cacheOptions
                      defaultOptions
                      isClearable
                      loadOptions={loadProductOptions}
                      value={
                        form.product_id
                          ? {
                              value: form.product_id,
                              label: form.title ?? "",
                            }
                          : null
                      }
                      onChange={(
                        option: { value: string; label: string } | null
                      ) =>
                        setForm({
                          ...form,
                          product_id: option ? option.value : "",
                          title: option ? option.label : "",
                        })
                      }
                      placeholder="Type to search products..."
                    />
                    {errors.product && (
                      <div className="invalid-feedback">
                        {errors.product[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="verity_name">Variety Name</label>
                    <input
                      id="verity_name"
                      placeholder="Variety Name"
                      className={`form-control ${
                        errors.verity_name ? "is-invalid" : ""
                      }`}
                      value={form.verity_name || ""}
                      onChange={(e) => setField("verity_name", e.target.value)}
                    />
                    {errors.verity_name && (
                      <div className="invalid-feedback">
                        {errors.verity_name[0]}
                      </div>
                    )}
                  </div>
                  {id && qrGenerate?.data?.status && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label small">Status</label>
                      <select
                        className="form-control"
                        value={form.status ? 1 : 0}
                        onChange={(e) =>
                          setField("status", e.target.value === "1")
                        }
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  )}

                  {/* multilingual Quill editors — full width below */}
                  <div className="col-md-6 mt-3">
                    <label>English Product Matter</label>
                    <QuillEditor
                      value={form.english_input_text}
                      onChange={handleEnglishChange}
                      minHeight={180}
                      maxHeight={300}
                    />
                    {errors.english_input_text && (
                      <div className="invalid-feedback d-block">
                        {errors.english_input_text[0]}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mt-3">
                    <label>Hindi Product Matter</label>
                    <QuillEditor
                      value={form.hindi_input_text}
                      onChange={handleHindiChange}
                      minHeight={180}
                      maxHeight={300}
                    />
                    {errors.hindi_input_text && (
                      <div className="invalid-feedback d-block">
                        {errors.hindi_input_text[0]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mt-3">
                    <label>Gujarati Product Matter</label>
                    <QuillEditor
                      value={form.gujarati_input_text}
                      onChange={handleGujaratiChange}
                      minHeight={180}
                      maxHeight={300}
                    />
                    {errors.gujarati_input_text && (
                      <div className="invalid-feedback d-block">
                        {errors.gujarati_input_text[0]}
                      </div>
                    )}
                  </div>
                </div>
                {/* submit buttons */}
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/qr-generate")}
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

export default QRGenerateCreate;
