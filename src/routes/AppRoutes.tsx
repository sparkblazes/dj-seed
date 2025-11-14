import { Routes, Route, StaticRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import PrivateRoute from "./PrivateRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/Login";
import NetworkErrorPage from "../pages/errors/NetworkErrorPage";
import UserManagementRoute from "./UserManagementRoute";


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
          // <PrivateRoute>
          <MainLayout />
          // </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        {/*  Additional private routes can be added here */}

        {UserManagementRoute}
 
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
