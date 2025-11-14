import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import {
  useCreateRoleHasPermissionMutation,
  useGetRoleHasPermissionByIdQuery,
  useUpdateRoleHasPermissionMutation,
} from "../../../redux/userManagement/rolehaspermission/rolehaspermissionApi";
import { useDropdownRoleQuery } from "../../../redux/userManagement/role/rolesApi";
import { useDropdownPermissionsQuery } from "../../../redux/userManagement/permissions/permissionsApi";

interface RoleHasPermissionFormData {
  role_id: string;
  permission_id: string;
}

const RoleHasPermissionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toastRef = useRef<Toast>(null);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);

  const [createRolePermission, { isLoading: isCreating }] = useCreateRoleHasPermissionMutation();
  const [updateRolePermission, { isLoading: isUpdating }] = useUpdateRoleHasPermissionMutation();
  const { data: rolePermissionData } = useGetRoleHasPermissionByIdQuery(id!, { skip: !id });

  // Dropdowns for roles and permissions
  const { data: rolesData, isFetching: isRolesLoading } = useDropdownRoleQuery({ search: "" });
  const { data: permissionsData, isFetching: isPermissionsLoading } = useDropdownPermissionsQuery({ search: "" });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RoleHasPermissionFormData>({ mode: "onChange" });

  // Prefill on edit
  useEffect(() => {
    if (rolePermissionData?.data) {
      const rp = rolePermissionData.data;
      setSelectedRole(rp.role_id?._id);
      setSelectedPermission(rp.permission_id?._id);
      setValue("role_id", rp.role_id?._id);
      setValue("permission_id", rp.permission_id?._id);
    }
  }, [rolePermissionData, setValue]);

  // Dropdown options
  const roleOptions =
    rolesData?.data?.map((r: any) => ({ label: r.name, value: r._id })) || [];
  const permissionOptions =
    permissionsData?.data?.map((p: any) => ({ label: p.name, value: p._id })) || [];

  // Submit handler
  const onSubmit = async (formData: RoleHasPermissionFormData) => {
    try {
      const payload = {
        ...formData,
        role_id: selectedRole!,
        permission_id: selectedPermission!,
      };

      if (id) {
        await updateRolePermission({ id, body: payload }).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Role–Permission updated successfully!",
          life: 3000,
        });
      } else {
        await createRolePermission(payload).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Created",
          detail: "Role–Permission created successfully!",
          life: 3000,
        });
      }

      reset();
      setTimeout(() => navigate("/role-has-permissions"), 1000);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.data?.message || "Something went wrong",
        life: 4000,
      });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">
            {id ? "Update Role–Permission" : "Create New Role–Permission"}
          </h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row">
              {/* Role Dropdown */}
              <div className="col-lg-6 mb-3">
                <label className="form-label">Select Role</label>
                <Dropdown
                  value={selectedRole}
                  options={roleOptions}
                  onChange={(e) => {
                    setSelectedRole(e.value);
                    setValue("role_id", e.value);
                  }}
                  placeholder="Select Role"
                  filter
                  showClear
                  loading={isRolesLoading}
                  className={`w-100 ${errors.role_id ? "p-invalid" : ""}`}
                />
                {errors.role_id && (
                  <small className="text-danger">Role is required</small>
                )}
              </div>

              {/* Permission Dropdown */}
              <div className="col-lg-6 mb-3">
                <label className="form-label">Select Permission</label>
                <Dropdown
                  value={selectedPermission}
                  options={permissionOptions}
                  onChange={(e) => {
                    setSelectedPermission(e.value);
                    setValue("permission_id", e.value);
                  }}
                  placeholder="Select Permission"
                  filter
                  showClear
                  loading={isPermissionsLoading}
                  className={`w-100 ${errors.permission_id ? "p-invalid" : ""}`}
                />
                {errors.permission_id && (
                  <small className="text-danger">Permission is required</small>
                )}
              </div>
            </div>

            <div className="border-top pt-3">
              <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
                {id
                  ? isUpdating
                    ? "Updating..."
                    : "Update Role–Permission"
                  : isCreating
                  ? "Creating..."
                  : "Create Role–Permission"}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => navigate("/role-has-permissions")}
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

export default RoleHasPermissionCreate;
