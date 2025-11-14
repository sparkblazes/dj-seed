import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { sidebarMenu } from "../../config/sidebarMenu";
import logosm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
// import logoLight from "../../assets/images/logo-light.png";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [menuSize, setMenuSize] = useState<"default" | "sm-hover" | "sm-hover-active">(
    "sm-hover-active"
  );

  const toggleMenuSize = () => {
    setMenuSize((prev) =>
      prev === "sm-hover-active" ? "sm-hover" : "sm-hover-active"
    );
    // Also update the <html> attribute like your config script does
    document.documentElement.setAttribute("data-menu-size", menuSize);
  };

  return (
    <div className={`main-nav ${menuSize}`}>
      {/* Sidebar Logo */}
      <div className="logo-box">
        <NavLink to="/" className="logo-dark">
          <img src={logosm} className="logo-sm" alt="logo sm" />
          <img src={logoDark} className="logo-lg" alt="logo dark" />
        </NavLink>
        <NavLink to="/" className="logo-light">
          {/* <img src={logosm} className="logo-sm" alt="logo sm" />
          <img src={logoLight} className="logo-lg" alt="logo light" /> */}
          <span className="logo-lg text-white h2">DJ Seeds</span>
        </NavLink>
      </div>

      {/* Menu Toggle Button */}
      <button
        type="button"
        className="button-sm-hover"
        aria-label="Show Full Sidebar"
        onClick={toggleMenuSize}
      >
        <Icon icon="solar:double-alt-arrow-right-bold-duotone" />
      </button>

      {/* Sidebar Menu */}
      <div className="scrollbar" data-simplebar>
        <ul className="navbar-nav" id="navbar-nav">
          {sidebarMenu.map((item, idx) =>
            item.isTitle ? (
              <li key={idx} className="menu-title mt-2">
                {item.label}
              </li>
            ) : (
              <li key={idx} className="nav-item">
                <NavLink
                  to={item.path || "#"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {item.icon && (
                    <span className="nav-icon">
                      <Icon icon={item.icon} />
                    </span>
                  )}
                  <span className="nav-text">{item.label}</span>
                </NavLink>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
