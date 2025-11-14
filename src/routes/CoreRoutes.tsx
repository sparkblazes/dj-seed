import { Outlet, Route } from "react-router-dom";
import PermissionsIndex from "../pages/admin/core/Permissions/index";
import PermissionsCreate from "../pages/admin/core/Permissions/create";

export const CoreRoutes = (
  <Route path="core" element={<Outlet />}>
    {/* Permission routes */}
    <Route path="permissions">
      <Route index element={<PermissionsIndex />} />
      <Route path="create" element={<PermissionsCreate />} />
      <Route path="edit/:id" element={<PermissionsCreate />} />
    </Route>

  </Route>
);
