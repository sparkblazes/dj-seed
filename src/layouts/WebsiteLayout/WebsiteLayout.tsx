import React from "react";
import { Outlet } from "react-router-dom";

import Topbar from "../../components/websiteNavigation/Topbar";
import Sidebar from "../../components/websiteNavigation/Sidebar";
import Footer from "../../components/websiteNavigation/Footer";

const WebsiteLayout: React.FC = () => {
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

export default WebsiteLayout;
