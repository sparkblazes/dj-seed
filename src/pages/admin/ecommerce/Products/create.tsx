import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useFetchProductByIdQuery,
} from "../../../../../redux/ecommerce/Products/productApi";

const ProductCategoriesCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useFetchProductByIdQuery(
    id ? Number(id) : 0,
    { skip: !id }
  );

  const [createProducts] = useCreateProductMutation();
  const [updateProducts] = useUpdateProductMutation();

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    sku: "",
    barcode: "",
    unit: "",
    model: "",
    short_description: "",
    description: "",
    price: 0,
    discount_price: 0,
    tax: 0,
    currency: "",
    stock: 0,
    is_manage_stock: false,
    min_order_qty: 0,
    max_order_qty: 0,
    is_backorder: false,
    image: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: 1,
    is_featured: false,
    order: 0,
    published_at: "",
    views_count: 0,
    sold_count: 0,
    avg_rating: 0,
    reviews_count: 0,
  });

  // Populate form in edit mode
  useEffect(() => {
    if (product && id) setFormData(product);
  }, [product, id]);

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
      await updateProducts({ id: Number(id), productData: formData }).unwrap();
    } else {
      await createProducts(formData).unwrap();
    }
    navigate("/ecommerce/products");
  };

  return (
    <>
      <Breadcrumb
        title={id ? "Edit Product" : "Create Product"}
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/ecommerce/products" },
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
                  {/* Title */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      className="form-control"
                      value={formData.title}
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

                  {/* SKU */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="sku">SKU</label>
                    <input
                      type="text"
                      id="sku"
                      className="form-control"
                      value={formData.sku}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Barcode */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="barcode">Barcode</label>
                    <input
                      type="text"
                      id="barcode"
                      className="form-control"
                      value={formData.barcode}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Unit */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="unit">Unit</label>
                    <input
                      type="text"
                      id="unit"
                      className="form-control"
                      value={formData.unit}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Model */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="model">Model</label>
                    <input
                      type="text"
                      id="model"
                      className="form-control"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Short Description */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="short_description">Short Description</label>
                    <textarea
                      id="short_description"
                      className="form-control"
                      rows={2}
                      value={formData.short_description}
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

                  {/* Price */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      className="form-control"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Discount Price */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="discount_price">Discount Price</label>
                    <input
                      type="number"
                      id="discount_price"
                      className="form-control"
                      value={formData.discount_price}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Tax */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="tax">Tax</label>
                    <input
                      type="number"
                      id="tax"
                      className="form-control"
                      value={formData.tax}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Currency */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="currency">Currency</label>
                    <input
                      type="text"
                      id="currency"
                      className="form-control"
                      value={formData.currency}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Stock */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      className="form-control"
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Manage Stock */}
                  <div className="col-md-6 form-check mt-4">
                    <input
                      type="checkbox"
                      id="is_manage_stock"
                      className="form-check-input"
                      checked={formData.is_manage_stock}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="is_manage_stock"
                      className="form-check-label"
                    >
                      Manage Stock
                    </label>
                  </div>

                  {/* Min Order Qty */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="min_order_qty">Min Order Qty</label>
                    <input
                      type="number"
                      id="min_order_qty"
                      className="form-control"
                      value={formData.min_order_qty}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Max Order Qty */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="max_order_qty">Max Order Qty</label>
                    <input
                      type="number"
                      id="max_order_qty"
                      className="form-control"
                      value={formData.max_order_qty}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Backorder */}
                  <div className="col-md-6 form-check mt-4">
                    <input
                      type="checkbox"
                      id="is_backorder"
                      className="form-check-input"
                      checked={formData.is_backorder}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_backorder">
                      Allow Backorder
                    </label>
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

                  {/* Published At */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="published_at">Published At</label>
                    <input
                      type="datetime-local"
                      id="published_at"
                      className="form-control"
                      value={formData.published_at}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Views Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="views_count">Views Count</label>
                    <input
                      type="number"
                      id="views_count"
                      className="form-control"
                      value={formData.views_count}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Sold Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="sold_count">Sold Count</label>
                    <input
                      type="number"
                      id="sold_count"
                      className="form-control"
                      value={formData.sold_count}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Average Rating */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="avg_rating">Average Rating</label>
                    <input
                      type="number"
                      id="avg_rating"
                      className="form-control"
                      value={formData.avg_rating}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Reviews Count */}
                  <div className="col-md-6 form-group">
                    <label htmlFor="reviews_count">Reviews Count</label>
                    <input
                      type="number"
                      id="reviews_count"
                      className="form-control"
                      value={formData.reviews_count}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-primary">
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light ms-2"
                    onClick={() => navigate("/ecommerce/products")}
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
