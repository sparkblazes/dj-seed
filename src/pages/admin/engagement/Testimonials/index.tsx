import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import DataTable from "../../../../../components/Common/DataTable";
import ColumnSettingsModal from "../../../../../components/Common/ColumnSettingsModal";
import FileImportModal from "../../../../../components/Common/FileImportModal";

import {
  useFetchTestimonialsQuery,
  useDeleteTestimonialMutation,
  useImportTestimonialsMutation,
  useExportTestimonialsMutation,
} from "../../../../../redux/engagement/Testimonials/testimonialApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setVisibleColumns,
} from "../../../../../redux/engagement/Events/eventSlice";
import type { RootState, AppDispatch } from "../../../../../redux/store";

// const ALL_COLUMNS = [
//   { key: "id", label: "ID", sortable: true },
//   { key: "title", label: "Title", sortable: true },
//   { key: "slug", label: "Slug", sortable: true },
//   { key: "subtitle", label: "Subtitle" },
//   { key: "description", label: "Description" },
//   { key: "thumbnail", label: "Thumbnail" },
//   { key: "location", label: "Location" },
// ];

// const DEFAULT_COLUMNS = ["id", "title", "subtitle", "location", "thumbnail"];
const LS_KEY = "testimonials_table_columns";

const TestimonialsIndex: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { filters, visibleColumns } = useSelector(
    (state: RootState) => state.eventUI
  );

  const { data, isLoading } = useFetchTestimonialsQuery(filters);
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [importTestimonials] = useImportTestimonialsMutation();
  const [exportTestimonials] = useExportTestimonialsMutation();

  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // 🔹 Error state for import/export
  const [importErrors, setImportErrors] = useState<any[]>([]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonials?")) {
      await deleteTestimonial(id);
    }
  };

  const handleSort = (field: string) => {
    if (filters.sort_by === field) {
      dispatch(
        setFilters({
          sort_order: filters.sort_order === "asc" ? "desc" : "asc",
        })
      );
    } else {
      dispatch(setFilters({ sort_by: field, sort_order: "asc" }));
    }
  };

  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res: any = await importTestimonials(formData);

    if (res?.data?.success === false && res.data.errors) {
      setImportErrors(res.data.errors); // show validation errors
    } else {
      setImportErrors([]); // clear errors if success
      setShowImportModal(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportTestimonials({
        uuids: data?.data.data.map((event: any) => event.uuid.toString()) || [],
      });
      setImportErrors([]); // clear errors
    } catch (err: any) {
      setImportErrors([
        {
          row: "-",
          field: [{ attribute: "export", errors: ["Failed to export testimonials"] }],
        },
      ]);
    }
  };

  return (
    <>
      <Breadcrumb
        title="Testimonial"
        subtitle="Your Testimonials Module."
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Testimonial", active: true },
        ]}
        url="/engagement/testimonials/create"
        urlIcon="plus"
      />

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">

              {/* 🔹 Show Import/Export Errors Below Table */}
              {importErrors.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-danger">Errors:</h6>
                  <ul className="list-group">
                    {importErrors.map((err, idx) => (
                      <li key={idx} className="list-group-item">
                        <strong>Row {err.row}:</strong>{" "}
                        {err.field.map((f: any, i: number) => (
                          <span key={i} className="text-danger d-block">
                            {f.attribute} → {f.errors.join(", ")}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Title */}
                <h4 className="card-title mb-0">Jobs List</h4>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  {/* Import */}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setShowImportModal(true)}
                  >
                    <i className="fa-solid fa-filter"></i>
                    <span>Import</span>
                  </button>

                  {/* Export */}
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                    onClick={handleExport}
                  >
                    <i className="fa-solid fa-cloud-arrow-down"></i>
                    <span>Export</span>
                  </button>

                  {/* Column Settings */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="mdi mdi-tune"></i>
                    <span>Column Settings</span>
                  </button>
                </div>
              </div>


              {/* Search */}
              {/* 🔎 Search + Filters */}
              <div className="row mb-3">
                {/* Search */}
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search jobs..."
                    value={filters.search}
                    onChange={(e) =>
                      dispatch(setFilters({ search: e.target.value, page: 1 }))
                    }
                  />
                </div>

                {/* Department */}
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={filters.department || ""}
                    onChange={(e) =>
                      dispatch(
                        setFilters({
                          department: e.target.value || undefined,
                          page: 1,
                        })
                      )
                    }
                  >
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* Location */}
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={filters.location || ""}
                    onChange={(e) =>
                      dispatch(
                        setFilters({
                          location: e.target.value || undefined,
                          page: 1,
                        })
                      )
                    }
                  >
                    <option value="">All Locations</option>
                    <option value="NY">New York</option>
                    <option value="LDN">London</option>
                    <option value="DEL">Delhi</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={
                      filters.status !== undefined ? String(filters.status) : ""
                    }
                    onChange={(e) =>
                      dispatch(
                        setFilters({
                          status:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          page: 1,
                        })
                      )
                    }
                  >
                    <option value="">All Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <DataTable
                  data={data?.data.data || []}
                  columns={data?.columns || []}
                  visibleColumns={data?.visible_columns || []}
                  sortBy={filters.sort_by}
                  sortOrder={filters.sort_order}
                  onSort={handleSort}
                  actions={(row) => (
                    <>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() =>
                          navigate(`/engagement/testimonials/edit/${row.uuid}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(row.uuid)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  pagination={{
                    currentPage: data?.data.current_page || 1,
                    perPage: data?.data.per_page || 10,
                    total: data?.data.total || 0,
                    onPageChange: (page) => dispatch(setFilters({ page })),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Column Settings Modal */}
      <ColumnSettingsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        allColumns={data?.columns || []}
        visibleColumns={visibleColumns}
        setVisibleColumns={(cols) => dispatch(setVisibleColumns(cols))}
        defaultColumns={visibleColumns || []}
        localStorageKey={LS_KEY}
      />

      {/* File Import Modal */}
      <FileImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={handleImport}
      />
    </>
  );
};

export default TestimonialsIndex;
