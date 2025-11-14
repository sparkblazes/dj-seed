import React from "react";
import { Navigate } from "react-router-dom";
import { useMeQuery } from "../redux/auth/authApi";
import { useAppSelector } from "../redux/auth/hooks";
import FullScreenLoader from "../components/common/FullScreenLoader";


interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);

  // 🚀 Always validate if token exists
  const { data, isLoading, isError } = useMeQuery(undefined, {
    skip: !token,
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    {/* 🔹 Global loader for API actions */ }
    return 
    <FullScreenLoader
      show={isLoading}
      message={
        isLoading
          ? "Loading tickets..."
                : undefined
      }
    />; // Loader/spinner here
  }
  console.log("PrivateRoute - isError:", isError, "data:", data);
  if (isError || !data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
