import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetPermissionsQuery,
  useDeletePermissionMutation,
  useDeleteMultiplePermissionsMutation,
} from "../../../redux/userManagement/permissions/permissionsApi";
import CommonDataTable from "../../../components/common/SingleDataTable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

interface Permission {
  _id: string;
  module_name: string;
  actions: string[];
  created_at?: string;
}

const PermissionsIndex: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = React.useRef<Toast>(null);

  const { data, isLoading, refetch } = useGetPermissionsQuery({ page: 1, limit: 10 });
   const permissions_data =
    data?.data?.permissions?.map((t) => ({
      _id: t._id,
      module_name: t.module_name?.name || "-",
      actions: t.actions,
      created_at: new Date(t.created_at).toLocaleString("en-GB"),
    })) || [];
  const [deletePermission] = useDeletePermissionMutation();
  const [deleteMultiplePermissions] = useDeleteMultiplePermissionsMutation();

  const handleDelete = async (permission: Permission) => {
    try {
      await deletePermission(permission._id).unwrap();
      toastRef.current?.show({ severity: "success", summary: "Deleted", detail: "Permission deleted successfully", life: 3000 });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({ severity: "error", summary: "Error", detail: err?.data?.message || "Failed to delete permission", life: 3000 });
    }
  };

  const handleMultiDelete = async (selectedPermissions: Permission[]) => {
    try {
      const ids = selectedPermissions.map((p) => p._id);
      await deleteMultiplePermissions({ ids }).unwrap();
      toastRef.current?.show({ severity: "success", summary: "Deleted", detail: "Selected permissions deleted successfully", life: 3000 });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({ severity: "error", summary: "Error", detail: err?.data?.message || "Failed to delete selected permissions", life: 3000 });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />

      <CommonDataTable<Permission>
        title="Permissions"
        data={permissions_data || []}
        columns={[
          { field: "_id", header: "ID" },
          { field: "module_name", header: "Module" },
          { field: "actions", header: "Actions", body: (row) => row.actions.join(", ") },
          { field: "created_at", header: "Created At" },
        ]}
        onAdd={() => navigate("/permissions/create")}
        onEdit={(permission) => navigate(`/permissions/edit/${permission._id}`)}
        onDelete={handleDelete}
        onDeleteMultiple={handleMultiDelete}
        enableDeleteSelected={true}
      />

      <div className="mt-3 text-end">
        <Button label="Refresh" icon="pi pi-refresh" onClick={() => refetch()} loading={isLoading} />
      </div>
    </div>
  );
};

export default PermissionsIndex;
