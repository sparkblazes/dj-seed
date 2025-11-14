import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetRoleHasPermissionsQuery,
  useDeleteRoleHasPermissionMutation,
  useDeleteMultipleRoleHasPermissionsMutation,
} from "../../../redux/userManagement/rolehaspermission/rolehaspermissionApi";
import CommonDataTable from "../../../components/common/SingleDataTable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

interface RolePermission {
  _id: string;
  role_id: { _id: string; role_name: string };
  permission_id: { _id: string; name: string };
  created_at: string;
}

const RoleHasPermissionIndex: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);

  const { data, isLoading, refetch } = useGetRoleHasPermissionsQuery({ page: 1, limit: 10 });
  const rolePermissions =
    data?.data?.rolePermissions?.map((rp) => ({
      _id: rp._id,
      role_name: rp.role_id?.role_name || "-",
      permission_name: rp.permission_id?.name || "-",
      created_at: new Date(rp.created_at).toLocaleString("en-GB"),
    })) || [];

  const [deleteRolePermission] = useDeleteRoleHasPermissionMutation();
  const [deleteMultipleRolePermissions] = useDeleteMultipleRoleHasPermissionsMutation();

  const handleDelete = async (rp: RolePermission) => {
    try {
      await deleteRolePermission(rp._id).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Role–Permission deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete",
        life: 3000,
      });
    }
  };

  const handleMultiDelete = async (selected: RolePermission[]) => {
    try {
      const ids = selected.map((rp) => rp._id);
      await deleteMultipleRolePermissions({ ids }).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Selected Role–Permissions deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete selected records",
        life: 3000,
      });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />

      <CommonDataTable<RolePermission>
        title="Role–Permissions"
        data={rolePermissions}
        columns={[
          { field: "_id", header: "ID" },
          { field: "role_name", header: "Role" },
          { field: "permission_name", header: "Permission" },
          { field: "created_at", header: "Created At" },
        ]}
        onAdd={() => navigate("/role-has-permissions/create")}
        onEdit={(rp) => navigate(`/role-has-permissions/edit/${rp._id}`)}
        onDelete={handleDelete}
        onDeleteMultiple={handleMultiDelete}
        enableDeleteSelected
      />

      <div className="mt-3 text-end">
        <Button label="Refresh" icon="pi pi-refresh" onClick={() => refetch()} loading={isLoading} />
      </div>
    </div>
  );
};

export default RoleHasPermissionIndex;
