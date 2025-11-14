import React from "react";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  title: string;
  path: string;
}

interface BreadcrumbsProps {
  customTitle?: string;
  item?: BreadcrumbItem[];
  url?: string; // URL for Create button
  urlIcon?: string; // Icon class for Create button
  showImport?: boolean; // Optional: show Import button
  showExport?: boolean; // Optional: show Export button
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  customTitle,
  item = [],
  url,
  urlIcon,
  showImport = true,
  showExport = true,
}) => {
  return (
    <>
      {/* Page title */}
      {customTitle && <h2 className="mb-1">{customTitle}</h2>}

      {/* Breadcrumb and buttons in one line */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        {/* Breadcrumb */}
        {item && item.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              {item.map((crumb, idx) => (
                <li
                  key={idx}
                  className={`breadcrumb-item${idx === item.length - 1 ? " active" : ""}`}
                  aria-current={idx === item.length - 1 ? "page" : undefined}
                >
                  {idx === item.length - 1 ? (
                    crumb.title
                  ) : (
                    <Link to={crumb.path || "#"}>{crumb.title}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Buttons on the right */}
        <div className="d-flex gap-3">
          {showExport && (
            <button className="btn btn-link text-body px-3">
              <span className="fa-solid fa-file-export"></span>
              Export
            </button>
          )}
          {showImport && (
            <button className="btn btn-link text-body px-3">
              <span className="fa-solid fa-file-export me-2"></span>
              Import
            </button>
          )}
          {url && (
            <Link to={url} className="btn btn-primary px-3">
              {urlIcon && <span className={`fas fa-${urlIcon} me-1`}></span>}
              <IoMdAdd />
              Create
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Breadcrumbs;
