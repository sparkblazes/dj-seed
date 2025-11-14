import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import {
  useCreateRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../../redux/userManagement/role/rolesApi";
import { useGetModuleWisePermissionQuery } from "../../../redux/userManagement/permissions/permissionsApi";

interface RoleFormData {
  role_name: string;
  description: string;
  permissions: string[];
}

const RoleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toastRef = useRef<Toast>(null);

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const { data: roleData } = useGetRoleByIdQuery(id!, { skip: !id });

  const { data: permissionsData } = useGetModuleWisePermissionQuery();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({ mode: "onChange" });

  const [formData, setFormData] = useState<RoleFormData>({
    role_name: "",
    description: "",
    permissions: [],
  });

  // ✅ Prefill when editing
  useEffect(() => {
    if (roleData?.data && id) {
      const role = roleData.data;
      let perms: string[] = [];

      if (Array.isArray(role.permissions)) {
        // Normal case: array of objects
        perms = role.permissions.map((p: any) =>
          typeof p === "string" ? p : p._id || ""
        );
      } else if (typeof role.permissions === "object" && role.permissions !== null) {
        // Object case (like { create: true })
        perms = Object.keys(role.permissions).filter((k) => role.permissions[k]);
      } else if (typeof role.permissions === "string") {
        // Single string
        perms = [role.permissions];
      }

      setFormData({
        role_name: role.role_name || "",
        description: role.description || "",
        permissions: perms.filter(Boolean),
      });

      setValue("role_name", role.role_name || "");
      setValue("description", role.description || "");
      setValue("permissions", perms.filter(Boolean));
    }
  }, [roleData, id, setValue]);

  // ✅ Keep permissions synced
  useEffect(() => {
    setValue("permissions", formData.permissions);
  }, [formData.permissions, setValue]);

  // ✅ Toggle individual permission
  const handlePermissionToggle = (permId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((id) => id !== permId)
          : [...prev.permissions, permId],
      };
    });
  };

  // ✅ Toggle module permissions
  const handleModuleToggle = (modulePermIds: string[]) => {
    const allSelected = modulePermIds.every((id) => formData.permissions.includes(id));
    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((id) => !modulePermIds.includes(id))
        : [...new Set([...prev.permissions, ...modulePermIds])],
    }));
  };

  // ✅ Toggle all permissions
  const allPermissionIds: string[] =
    permissionsData?.data?.flatMap((mod: any) =>
      mod.actions.map((a: string) => `${mod._id}_${a}`)
    ) || [];

  const isAllSelected =
    allPermissionIds.length > 0 &&
    allPermissionIds.every((id) => formData.permissions.includes(id));

  const handleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: isAllSelected ? [] : [...new Set(allPermissionIds)],
    }));
  };

  // ✅ Submit handler
  const onSubmit = async (data: RoleFormData) => {
    try {
      const payload = { ...formData, ...data };
      if (id) {
        await updateRole({ id, body: payload }).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Role updated successfully!",
          life: 3000,
        });
      } else {
        await createRole(payload).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Created",
          detail: "Role created successfully!",
          life: 3000,
        });
      }
      reset();
      setTimeout(() => navigate("/roles"), 800);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.data?.message || "Something went wrong!",
        life: 4000,
      });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />

      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{id ? "Edit Role" : "Create Role"}</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Role Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Role Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.role_name ? "is-invalid" : ""}`}
                  {...register("role_name", { required: "Role name is required" })}
                  value={formData.role_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role_name: e.target.value }))
                  }
                />
                {errors.role_name && (
                  <div className="invalid-feedback">{errors.role_name.message}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Description</label>
                <input
                  type="text"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  {...register("description", { required: "Description is required" })}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description.message}</div>
                )}
              </div>
            </div>

            {/* Permissions Section */}
            <div className="mt-4">
              <div className="row fw-bold border-bottom pb-3 mb-3 align-items-center bg-light rounded px-2 py-2">
                <div className="col-4 d-flex align-items-center p-0 ps-4">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    id="selectAll"
                  />
                  <label htmlFor="selectAll" className="mb-0 ms-2">
                    Modules
                  </label>
                </div>
                <div className="col fw-bold">Actions</div>
              </div>

              <div className="p-3 rounded bg-light-subtle">
                {permissionsData?.data?.map((module: any, index: number) => {
                  const modulePermIds = module.actions.map(
                    (a: string) => `${module._id}_${a}`
                  );
                  const moduleSelected = modulePermIds.every((id) =>
                    formData.permissions.includes(id)
                  );

                  return (
                    <div key={index} className="row align-items-start mb-4 pb-3 border-bottom">
                      <div className="col-4 d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={moduleSelected}
                          onChange={() => handleModuleToggle(modulePermIds)}
                          id={`module-${index}`}
                        />
                        <label
                          htmlFor={`module-${index}`}
                          className="fw-semibold text-capitalize mb-0 ms-2"
                        >
                          {module.module_name?.name || "Unnamed Module"}
                        </label>
                      </div>

                      <div className="col d-flex flex-wrap">
                        {module.actions?.map((action: string, idx: number) => {
                          const permId = `${module._id}_${action}`;
                          const isChecked = formData.permissions.includes(permId);
                          return (
                            <div key={idx} className="form-check me-4 mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`perm-${permId}`}
                                checked={isChecked}
                                onChange={() => handlePermissionToggle(permId)}
                              />
                              <label
                                className="form-check-label text-capitalize ms-1"
                                htmlFor={`perm-${permId}`}
                              >
                                {action}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={isCreating || isUpdating}
              >
                {id
                  ? isUpdating
                    ? "Updating..."
                    : "Update Role"
                  : isCreating
                    ? "Creating..."
                    : "Create Role"}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2 px-4"
                onClick={() => navigate("/roles")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleCreate;
