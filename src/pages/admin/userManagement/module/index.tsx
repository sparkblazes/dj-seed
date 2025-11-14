import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetModulesQuery,
  useDeleteModuleMutation,
  useDeleteMultipleModulesMutation,
} from "../../../redux/userManagement/module/moduleApi";
import CommonDataTable from "../../../components/common/SingleDataTable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

interface Module {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  route_name: string;
  parent_id?: string;
  sort_order?: number;
  description?: string;
  created_at?: string;
}

const ModuleIndex: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);

  const { data, isLoading, refetch } = useGetModulesQuery({ page: 1, limit: 10 });
  const modules_data =
    data?.data?.modules?.map((m) => ({
      _id: m._id,
      name: m.name,
      slug: m.slug,
      icon: m.icon || "-",
      route_name: m.route_name,
      parent_id: m.parent_id?.name || "-",
      sort_order: m.sort_order,
      description: m.description || "-",
      created_at: new Date(m.created_at).toLocaleString("en-GB"),
    })) || [];

  const [deleteModule] = useDeleteModuleMutation();
  const [deleteMultipleModules] = useDeleteMultipleModulesMutation();

  const handleDelete = async (module: Module) => {
    try {
      await deleteModule(module._id).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Module deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete module",
        life: 3000,
      });
    }
  };

  const handleMultiDelete = async (selectedModules: Module[]) => {
    try {
      const ids = selectedModules.map((m) => m._id);
      await deleteMultipleModules({ ids }).unwrap();
      toastRef.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Selected modules deleted successfully",
        life: 3000,
      });
      refetch();
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.data?.message || "Failed to delete selected modules",
        life: 3000,
      });
    }
  };

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />

      <CommonDataTable<Module>
        title="Modules"
        data={modules_data}
        columns={[
          { field: "_id", header: "ID" },
          { field: "name", header: "Name" },
          { field: "slug", header: "Slug" },
          { field: "icon", header: "Icon" },
          { field: "route_name", header: "Route Name" },
          { field: "parent_id", header: "Parent Module" },
          { field: "sort_order", header: "Sort Order" },
          { field: "description", header: "Description" },
          { field: "created_at", header: "Created At" },
        ]}
        onAdd={() => navigate("/modules/create")}
        onEdit={(module) => navigate(`/modules/edit/${module._id}`)}
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

export default ModuleIndex;
