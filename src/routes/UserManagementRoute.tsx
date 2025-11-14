import { Outlet, Route } from "react-router-dom";
import RoleIndex from "../pages/userManagement/role/index";
import RoleCreate from "../pages/userManagement/role/create";
// ===== Permission Pages =====
import PermissionIndex from "../pages/userManagement/permissions/index";
import PermissionCreate from "../pages/userManagement/permissions/create";

import UserIndex from "../pages/userManagement/user/index";
import UserCreate from "../pages/userManagement/user/create";

import ModuleIndex from "../pages/userManagement/module/index";
import ModuleCreate from "../pages/userManagement/module/create";


export default (
  <Route path=""  element={<Outlet />}>
 
    {/* Role Routes */}
    <Route path="roles">
      <Route index element={<RoleIndex />} />
      <Route path="create" element={<RoleCreate />} />
      <Route path="edit/:id" element={<RoleCreate />} />
    </Route>

     {/* ===== Permission Routes ===== */}
    <Route path="permissions">
      <Route index element={<PermissionIndex />} />
      <Route path="create" element={<PermissionCreate />} />
      <Route path="edit/:id" element={<PermissionCreate />} />
    </Route>

    <Route path="users">
      <Route index element={<UserIndex />} />
      <Route path="create" element={<UserCreate />} />
      <Route path="edit/:id" element={<UserCreate />} />
    </Route>  

    <Route path="Modules">
      <Route index element={<ModuleIndex />} />
      <Route path="create" element={<ModuleCreate />} />
      <Route path="edit/:id" element={<ModuleCreate />} />
    </Route>
 
  </Route>
);
