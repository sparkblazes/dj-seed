import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetRolesQuery,
  useDeleteRoleMutation,
  useDeleteMultipleRolesMutation,
} from "../../../redux/userManagement/role/rolesApi"; // adjust import path if needed
import CommonDataTable from "../../../components/common/SingleDataTable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import BreadCrumbs  from "../../../components/navigation/BreadCrumbs"; 
interface Role {
  _id: string;
  role_name: string;
  description: string;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

const RoleIndex: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = React.useRef<Toast>(null);

  // ✅ RTK Query hooks
  const { data, isLoading, refetch } = useGetRolesQuery({
    page: 1,
    limit: 10,
  });
  const roles_data =
    data?.data?.roles?.map((t) => ({
      _id: t._id,
      role_name: t.role_name,
      description: t.description,
      permissions: t.permissions?.module_name || "-",
      created_at: new Date(t.created_at).toLocaleString("en-GB"),
      updated_at: new Date(t.updated_at).toLocaleString("en-GB"),
    })) || [];
  const [deleteRole] = useDeleteRoleMutation();
  const [deleteMultipleRoles] = useDeleteMultipleRolesMutation();

  // ✅ Handle single delete
  const handleDelete = async (role: Role) => {
    try {
      await deleteRole(role._id).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Role deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete role",
        life: 3000,
      });
    }
  };

  // ✅ Handle multi-delete
  const handleMultiDelete = async (selectedRoles: Role[]) => {
    try {
      const ids = selectedRoles.map((r) => r._id);
      await deleteMultipleRoles({ ids }).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Selected roles deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete selected roles",
        life: 3000,
      });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />
      <BreadCrumbs
        customTitle="Vendors"
        item={[
          { title: "Home", path: "/" },
          { title: "Purchase Vendor", path: "/purchase-vendor" },
          { title: "Vendors", path: "/purchase-vendor/vendors" },
        ]}
        url="/purchase-vendor/vendors/create"
        urlIcon="plus"
         showImport={false}
        showExport={false}
      />

      <CommonDataTable<Role>
        title="Roles"
        data={roles_data}
        columns={[
          { field: "_id", header: "ID" },
          { field: "role_name", header: "Role Name" },
          { field: "description", header: "Description" },
          { field: "permissions", header: "permissions" },
          { field: "created_at", header: "Created At" },
          { field: "updated_at", header: "Updated At" },
        ]}
        onAdd={() => navigate("/roles/create")}
        onEdit={(role) => navigate(`/roles/edit/${role._id}`)}
        onDelete={handleDelete}
        onDeleteMultiple={handleMultiDelete} // important!
        enableDeleteSelected={true}
      />

      {/* You can optionally add a manual refresh button */}
      <div className="mt-3 text-end">
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          onClick={() => refetch()}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default RoleIndex;
