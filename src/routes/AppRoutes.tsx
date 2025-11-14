import { Routes, Route, StaticRouter } from "react-router-dom";
import MainLayout from "../layouts/AdminLayout/AdminLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import PrivateRoute from "./PrivateRoute";

import Dashboard from "../pages/admin/dashboard/Dashboard";
import Login from "../pages/admin/auth/Login";
import NetworkErrorPage from "../pages/errors/NetworkErrorPage";
import UserManagementRoute from "./UserManagementRoute";
import { CMSRoutes } from "./cmsRoutes";
import { EngagementRoutes } from "./EngagementRoutes";
import { EcommerceRoutes } from "./EcommerceRoutes";
import { SystemRoutes } from "./SystemRoutes";
import { CoreRoutes } from "./CoreRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public/Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Network error route */}
      <Route path="/network-error" element={<NetworkErrorPage />} />

      {/* Private routes */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        {/*  Additional private routes can be added here */}

        {UserManagementRoute}
        {CMSRoutes}
        {EngagementRoutes}
        {EcommerceRoutes}
        {SystemRoutes}
        {CoreRoutes}

      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
