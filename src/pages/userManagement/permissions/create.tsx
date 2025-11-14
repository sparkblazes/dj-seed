import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatePermissionMutation,
  useGetPermissionByIdQuery,
  useUpdatePermissionMutation,
} from "../../../redux/userManagement/permissions/permissionsApi";
import { useDropdownModulesQuery } from "../../../redux/userManagement/module/moduleApi";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const baseActions = ["create", "read", "update", "delete"] as const;

interface PermissionFormData {
  module_name: string;
  actions: string[];
}

const PermissionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toastRef = useRef<Toast>(null);

  const [moduleSearch, setModuleSearch] = useState("");
  const [customActions, setCustomActions] = useState<string[]>([]);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionName, setNewActionName] = useState(""); // ✅ should be string, not array

  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionMutation();
  const { data: permissionData } = useGetPermissionByIdQuery(id!, { skip: !id });

  // 🔹 Fetch Modules for searchable dropdown
  const {
    data: modulesData,
    isFetching: isModulesLoading,
  } = useDropdownModulesQuery({ search: moduleSearch }, { refetchOnMountOrArgChange: true });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PermissionFormData>({
    mode: "onChange",
    defaultValues: { actions: [] },
  });

  useEffect(() => {
    if (permissionData?.data) {
      const existingActions = permissionData.data.actions || [];
      setValue("module_name", permissionData.data.module_name?._id || "");
      setValue("actions", existingActions);

      // Extract non-standard (custom) actions
      const custom = existingActions.filter(
        (a: string) => !baseActions.includes(a as any)
      );
      setCustomActions(custom);
    }
  }, [permissionData, setValue]);

  const onSubmit = async (formData: PermissionFormData) => {
    try {
      if (id) {
        await updatePermission({ id, body: formData as any }).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Permission updated successfully!",
          life: 3000,
        });
      } else {
        await createPermission(formData as any).unwrap();
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Permission created successfully!",
          life: 3000,
        });
      }
      reset();
      setTimeout(() => navigate("/permissions"), 1000);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.data?.message || "Something went wrong",
        life: 4000,
      });
    }
  };

  const selectedActions = watch("actions") || [];

  const toggleAction = (action: string) => {
    const newActions = selectedActions.includes(action)
      ? selectedActions.filter((a: string) => a !== action)
      : [...selectedActions, action];
    setValue("actions", newActions);
  };

  const addCustomAction = () => {
    const trimmed = newActionName.trim().toLowerCase();
    if (!trimmed) return;

    if (baseActions.includes(trimmed as any)) {
      toastRef.current?.show({
        severity: "warn",
        summary: "Duplicate",
        detail: "This action already exists as a standard action",
        life: 2500,
      });
      return;
    }

    if (customActions.includes(trimmed)) {
      toastRef.current?.show({
        severity: "warn",
        summary: "Duplicate",
        detail: "Custom action already added",
        life: 2500,
      });
      return;
    }

    const updatedCustom = [...customActions, trimmed];
    setCustomActions(updatedCustom);
    setValue("actions", [...selectedActions, trimmed]);
    setNewActionName("");
    setShowAddAction(false);
  };

  const removeCustomAction = (action: string) => {
    const filteredCustom = customActions.filter((a) => a !== action);
    setCustomActions(filteredCustom);
    setValue(
      "actions",
      selectedActions.filter((a: string) => a !== action)
    );
  };

  const selectedModuleId = watch("module_name");
  const moduleOptions =
    modulesData?.data?.map((m: any) => ({ label: m.name, value: m._id })) || [];

  return (
    <div className="container-xxl">
      <Toast ref={toastRef} />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {id ? "Update Permission" : "Create New Permission"}
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Module Dropdown */}
                <div className="mb-3">
                  <label className="form-label">Module Name</label>
                  <Dropdown
                    value={selectedModuleId}
                    options={moduleOptions}
                    placeholder="Search & select module"
                    filter
                    showClear
                    onChange={(e) => setValue("module_name", e.value)}
                    onFilter={(e) => setModuleSearch(e.filter?.trim() || "")}
                    filterBy="label"
                    className={`w-100 ${errors.module_name ? "p-invalid" : ""}`}
                    loading={isModulesLoading}
                    emptyMessage="No modules found"
                  />
                  {errors.module_name && (
                    <small className="p-error">{errors.module_name.message}</small>
                  )}
                </div>

                {/* Actions */}
                <div className="mb-3">
                  <label className="form-label">Actions</label>
                  <div className="d-flex gap-3 flex-wrap">
                    {baseActions.map((action) => (
                      <div key={action} className="form-check">
                        <input
                          type="checkbox"
                          id={action}
                          className="form-check-input"
                          checked={selectedActions.includes(action)}
                          onChange={() => toggleAction(action)}
                        />
                        <label htmlFor={action} className="form-check-label">
                          {action}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Other Actions */}
                  <div className="mt-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check me-3">
                        <input
                          type="checkbox"
                          id="custom-actions"
                          className="form-check-input"
                          checked={customActions.length > 0 || showAddAction}
                          onChange={(e) =>
                            setShowAddAction(e.target.checked || customActions.length > 0)
                          }
                        />
                        <label htmlFor="custom-actions" className="form-check-label">
                          Other Actions
                        </label>
                      </div>

                      {showAddAction && (
                        <>
                          <input
                            type="text"
                            placeholder="Enter action name"
                            className="form-control me-2"
                            style={{ width: "200px" }}
                            value={newActionName}
                            onChange={(e) => setNewActionName(e.target.value)}
                          />
                          <Button
                            type="button"
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-success"
                            onClick={addCustomAction}
                            tooltip="Add new custom action"
                          />
                        </>
                      )}
                      {!showAddAction && (
                        <Button
                          type="button"
                          icon="pi pi-plus"
                          className="p-button-rounded p-button-secondary ms-2"
                          onClick={() => setShowAddAction(true)}
                          tooltip="Add custom action"
                        />
                      )}
                    </div>

                    {/* Display custom action checkboxes */}
                    {customActions.map((action) => (
                      <div
                        key={action}
                        className="d-flex align-items-center mb-2 ms-4"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={selectedActions.includes(action)}
                          onChange={() => toggleAction(action)}
                        />
                        <label className="me-2">{action}</label>
                        <Button
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-text p-button-danger p-button-sm"
                          onClick={() => removeCustomAction(action)}
                          tooltip="Remove custom action"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="border-top pt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreating || isUpdating}
                  >
                    {id
                      ? isUpdating
                        ? "Updating..."
                        : "Update Permission"
                      : isCreating
                      ? "Creating..."
                      : "Create Permission"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/permissions")}
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

export default PermissionCreate;
