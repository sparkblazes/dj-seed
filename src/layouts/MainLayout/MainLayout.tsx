import React from "react";
import { Outlet } from "react-router-dom";

import Topbar from "../../components/navigation/Topbar";
import Sidebar from "../../components/navigation/Sidebar";
import Footer from "../../components/navigation/Footer";

const MainLayout: React.FC = () => {
  return (
    <div className="wrapper">
      <Topbar />
      <Sidebar />
      <div className="page-content">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
