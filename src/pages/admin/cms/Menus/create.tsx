import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useFetchMenuByIdQuery,
} from "../../../../../redux/cms/Menus/menuApi";

const MenusCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: menu, isLoading } = useFetchMenuByIdQuery(id ? String(id) : "0", {
    skip: !id,
  });
  const [createMenu] = useCreateMenuMutation();
  const [updateMenu] = useUpdateMenuMutation();

  const [formData, setFormData] = useState<any>({
    name: "",
    position: "",
    slug: "",
    is_active: false,
    is_default: false,
    order: 0,
    icon: "",
    css_class: "",
    description: "",

  });

  // ✅ state for backend validation errors
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Populate form when editing
  useEffect(() => {
    if (menu && id) {
      setFormData({
        name: menu?.data?.name || "",
        position: menu?.data?.position || "",
        slug: menu?.data?.slug || "",
        is_active: menu?.data?.is_active || "",
        is_default: menu?.data?.is_default || "",
        order: menu?.data?.order || "",
        icon: menu?.data?.icon || "",
        css_class: menu?.data?.css_class || "",
        description: menu?.data?.description || "",
      });
    }
  }, [menu, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;

    setFormData((prev: any) => ({ ...prev, [id]: newValue }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      slug: "",
      is_active: false,
      is_default: false,
      order: 0,
      icon: "",
      css_class: "",
      description: "",
    });
    setErrors({});
  };
  // ✅ helpers
  const setField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // clear old errors
    try {
      if (id) {
        await updateMenu({ uuid: String(id), menuData: formData }).unwrap();
        resetForm(); // ✅ reset form after update
      } else {
        await createMenu(formData).unwrap();
        resetForm(); // ✅ reset form after create
      }
      navigate("/cms/menus");
    } catch (err: any) {
      // ✅ catch Laravel-style 422 validation errors
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
        title={id ? "Edit Menu" : "Create Menu"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Menus", href: "/cms/menus" },
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
                  {/* Name */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback d-block">{errors.name[0]}</div>
                    )}
                  </div>

                  {/* Position */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="position">Position</label>
                    <input
                      type="text"
                      id="position"
                         placeholder="Position"
                      className="form-control"
                      value={formData.position}
                      onChange={handleChange}
                    />
                    {errors.position && (
                      <div className="invalid-feedback d-block">{errors.position[0]}</div>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      id="slug"
                         placeholder="Slug"
                      className="form-control"
                      value={formData.slug}
                      onChange={handleChange}
                    />

                    {errors.slug && (
                      <div className="invalid-feedback d-block">{errors.slug[0]}</div>
                    )}
                  </div>

                  {/* Is Active */}
                  <div className="col-md-6 mb-3">
                    <ToggleSwitch
                      id="showLogoSwitch"
                      label="Is Active"
                      checked={!!formData.is_active}
                      onChange={(val) => setField("is_active", val)}
                      onText="Is Active will be Apply"
                      offText="Is Active will not be Apply"
                    />
                    {errors.is_active && (
                      <div className="invalid-feedback d-block">{errors.is_featured[0]}</div>
                    )}
                  </div>


                  {/* Is Default */}
                  <div className="col-md-6 mb-3">
                    <ToggleSwitch
                      id="showLogoSwitch"
                      label="Is Default"
                      checked={!!formData.is_default}
                      onChange={(val) => setField("is_default", val)}
                      onText="Is Default will be Apply"
                      offText="Is Default will not be Apply"
                    />
                    {errors.is_featured && (
                      <div className="invalid-feedback d-block">{errors.is_featured[0]}</div>
                    )}
                  </div>


                  {/* Order */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      className={`form-control ${errors.order ? "is-invalid" : ""}`}
                      value={formData.order}
                      onChange={handleChange}
                    />
                    {errors.order && (
                      <div className="invalid-feedback d-block">{errors.order[0]}</div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="icon">Icon</label>
                    <input
                      type="text"
                      id="icon"
                      placeholder="Icon"
                      className="form-control"
                      value={formData.icon}
                      onChange={handleChange}
                    />
                    {errors.icon && (
                      <div className="invalid-feedback d-block">{errors.icon[0]}</div>
                    )}
                  </div>

                  {/* CSS Class */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="css_class">CSS Class</label>
                    <input
                      type="text"
                      id="css_class"
                      placeholder="CSS Class"
                      className="form-control"
                      value={formData.css_class}
                      onChange={handleChange}
                    />
                    {errors.css_class &&
                      <div className="invalid-feedback d-block">{errors.css_class[0]}</div>
                    }
                  </div>

                  {/* Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description &&
                      <div className="invalid-feedback d-block">{errors.description[0]}</div>
                    }
                  </div>

                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate("/cms/menus")}
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

export default MenusCreate;
