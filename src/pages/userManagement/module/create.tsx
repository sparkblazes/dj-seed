
// export default ModuleCreate;
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import {
  useCreateModuleMutation,
  useGetModuleByIdQuery,
  useUpdateModuleMutation,
  useDropdownModulesQuery,
} from "../../../redux/userManagement/module/moduleApi";

interface ModuleFormData {
  name: string;
  slug: string;
  icon?: string;
  route_name: string;
  parent_id?: string | null;
  sort_order?: number;
  description?: string;
}

const ModuleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toastRef = useRef<Toast>(null);

  const [createModule, { isLoading: isCreating }] = useCreateModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdateModuleMutation();
  const { data: moduleData } = useGetModuleByIdQuery(id!, { skip: !id });

  // ✅ Dropdown for parent modules
  const { data: parentModulesData, isFetching: isParentLoading } =
    useDropdownModulesQuery({ search: "" }, { refetchOnMountOrArgChange: true });

  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ModuleFormData>({ mode: "onChange" });

  // ✅ Prefill on edit
  useEffect(() => {
    if (moduleData?.data) {
      const m = moduleData.data;
      Object.keys(m).forEach((key) => {
        setValue(key as keyof ModuleFormData, (m as any)[key]);
      });
      if (m.parent_id?._id) {
        setSelectedParent(m.parent_id._id);
      }
    }
  }, [moduleData, setValue]);

  // ✅ Build dropdown options
  const parentOptions =
    parentModulesData?.data?.map((mod: any) => ({
      label: mod.name,
      value: mod._id,
    })) || [];

  // ✅ Submit handler
  const onSubmit = async (formData: ModuleFormData) => {
    try {
      const payload = { ...formData, parent_id: selectedParent || null };

      if (id) {
        await updateModule({ id, body: payload }).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Module updated successfully!",
          life: 3000,
        });
      } else {
        await createModule(payload).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Created",
          detail: "Module created successfully!",
          life: 3000,
        });
      }

      reset();
      setTimeout(() => navigate("/modules"), 1000);
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
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">{id ? "Update Module" : "Create New Module"}</h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row">
                  {/* Name */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Enter module name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>

                  {/* Slug */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Slug</label>
                    <input
                      type="text"
                      className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                      placeholder="Enter slug"
                      {...register("slug", { required: "Slug is required" })}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                  </div>

                  {/* Icon */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Icon</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. pi pi-user"
                      {...register("icon")}
                    />
                  </div>

                  {/* route_name */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Route Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.route_name ? "is-invalid" : ""}`}
                      placeholder="Enter Route Name (e.g. /users)"
                      {...register("route_name", { required: "Route Name is required" })}
                    />
                    {errors.route_name && <div className="invalid-feedback">{errors.route_name.message}</div>}
                  </div>

                  {/* ✅ Parent Module Dropdown (Searchable) */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Parent Module</label>
                    <Dropdown
                      value={selectedParent}
                      options={parentOptions}
                      onChange={(e) => {
                        setSelectedParent(e.value);
                        setValue("parent_id", e.value);
                      }}
                      placeholder="Search & select parent module"
                      filter
                      filterBy="label"
                      showClear
                      loading={isParentLoading}
                      emptyMessage="No modules found"
                      className="w-100"
                    />
                  </div>

                  {/* Sort Order */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Sort Order</label>
                    <input type="number" className="form-control" {...register("sort_order")} />
                  </div>

                  {/* Description */}
                  <div className="col-lg-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Enter description"
                      {...register("description")}
                    ></textarea>
                  </div>
                </div>

                {/* Buttons */}
                <div className="border-top pt-3">
                  <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
                    {id
                      ? isUpdating
                        ? "Updating..."
                        : "Update Module"
                      : isCreating
                      ? "Creating..."
                      : "Create Module"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/modules")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCreate;
