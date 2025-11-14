import { Outlet, Route } from "react-router-dom";
import OrdersIndex from "../pages/admin/ecommerce/Orders/index";
import PaymentsIndex from "../pages/admin/ecommerce/Payments/index";

import ProductCategoriesIndex from "../pages/admin/ecommerce/ProductCategories/index";
import ProductCategoriesCreate from "../pages/admin/ecommerce/ProductCategories/create";
import ProductsIndex from "../pages/admin/ecommerce/Products/index";
import ProductsCreate from "../pages/admin/ecommerce/Products/create";


export const EcommerceRoutes = (
  <Route path="ecommerce" element={<Outlet />}>
    {/* Orders Routes */}
    <Route path="orders">
      <Route index element={<OrdersIndex />} />
    </Route>
    {/* Payments Routes */}
    <Route path="payments">
      <Route index element={<PaymentsIndex />} />
    </Route>
    {/* Product Categories Routes */}
    <Route path="product-categories">
      <Route index element={<ProductCategoriesIndex />} />
      <Route path="create" element={<ProductCategoriesCreate />} />
      <Route path="edit/:id" element={<ProductCategoriesCreate />} />
    </Route>

       {/* Products Routes */}
    <Route path="product">
      <Route index element={<ProductsIndex />} />
      <Route path="create" element={<ProductsCreate />} />
      <Route path="edit/:id" element={<ProductsCreate />} />
    </Route>
 
 

  </Route>
);
