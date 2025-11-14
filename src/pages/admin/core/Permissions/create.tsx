// src/modules/admin/pages/engagement/Faqs/create.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";

import {
  useCreatePermissionsMutation,
  useUpdatePermissionsMutation,
  useFetchPermissionsByIdQuery,
} from "../../../../../redux/core/Permissions/permissionsApi";

const PermissionsCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: permissions, isLoading } = useFetchPermissionsByIdQuery(
    id ? String(id) : "0",
    {
      skip: !id,
    }
  );

  const [createPermissions] = useCreatePermissionsMutation();
  const [updatePermissions] = useUpdatePermissionsMutation();

  const [formData, setFormData] = useState<any>({
    name: "",
    guard_name: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // populate form when editing
  useEffect(() => {
    if (permissions && id) {
      setFormData({
        name: permissions?.data?.name || "",
        guard_name: permissions?.data?.guard_name || "",
      });
    }
  }, [permissions, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      guard_name: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) {
        await updatePermissions({
          uuid: String(id),
          permissionsData: formData,
        }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createPermissions(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/core/permissions"); // redirect back
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
        title={id ? "Edit Permissions" : "Create Permissions"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Permissions", href: "/core/permissions" },
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
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name[0]}</div>
                    )}
                  </div>

                  {/* guard_name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="guard_name">Guard Name</label>
                    <input
                      type="text"
                      id="guard_name"
                      className={`form-control ${
                        errors.guard_name ? "is-invalid" : ""
                      }`}
                      value={formData.guard_name}
                      onChange={handleChange}
                    />
                    {errors.guard_name && (
                      <div className="invalid-feedback">
                        {errors.guard_name[0]}
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
                    onClick={() => navigate("/core/permissions")}
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

export default PermissionsCreate;
