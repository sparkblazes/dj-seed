import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateProductCategorieMutation,
  useUpdateProductCategorieMutation,
  useFetchProductCategorieByIdQuery,
} from "../../../../../redux/ecommerce/ProductCategories/productCategorieApi";

const ProductCategoriesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: productCategorie, isLoading } =
    useFetchProductCategorieByIdQuery(id ? Number(id) : 0, { skip: !id });
  const [createProductCategorie] = useCreateProductCategorieMutation();
  const [updateProductCategorie] = useUpdateProductCategorieMutation();

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    parent_id: 0,
    description: "",
    icon: "",
    image: "",
    banner_image: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    order: 0,
    status: 1,
    is_featured: false,
  });

  // Populate form in edit mode
  useEffect(() => {
    if (productCategorie && id) setFormData(productCategorie);
  }, [productCategorie, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;
    let newValue: any = value;

    if (type === "number") newValue = Number(value);
    if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;

    setFormData({ ...formData, [id]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateProductCategorie({
        id: Number(id),
        productCategorieData: formData,
      }).unwrap();
    } else {
      await createProductCategorie(formData).unwrap();
    }
    navigate("/ecommerce/productCategories");
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Product Category" : "Create Product Category"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Product Categories", href: "/ecommerce/productCategories" },
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
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Slug */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      id="slug"
                      className="form-control"
                      value={formData.slug}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Parent ID */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="parent_id">Parent ID</label>
                    <input
                      type="number"
                      id="parent_id"
                      className="form-control"
                      value={formData.parent_id}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      className="form-control"
                      rows={2}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Icon */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="icon">Icon</label>
                    <input
                      type="text"
                      id="icon"
                      className="form-control"
                      value={formData.icon}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Image */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="image">Image</label>
                    <input
                      type="file"
                      id="image"
                      className="form-control"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Banner Image */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="banner_image">Banner Image</label>
                    <input
                      type="file"
                      id="banner_image"
                      className="form-control"
                      value={formData.banner_image}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Meta Title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_title">Meta Title</label>
                    <input
                      type="text"
                      id="meta_title"
                      className="form-control"
                      value={formData.meta_title}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_description">Meta Description</label>
                    <textarea
                      id="meta_description"
                      className="form-control"
                      rows={2}
                      value={formData.meta_description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="meta_keywords">Meta Keywords</label>
                    <input
                      type="text"
                      id="meta_keywords"
                      className="form-control"
                      value={formData.meta_keywords}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Order */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="order">Order</label>
                    <input
                      type="number"
                      id="order"
                      className="form-control"
                      value={formData.order}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="col-md-6 form-check mt-4">
                    <input
                      type="checkbox"
                      id="is_featured"
                      className="form-check-input"
                      checked={formData.is_featured}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_featured">
                      Is Featured
                    </label>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/ecommerce/productCategories")}
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

export default ProductCategoriesCreate;
