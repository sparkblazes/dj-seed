import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../../components/Layouts/Breadcrumb";
import DataTable from "../../../../../components/Common/DataTable";
import ColumnSettingsModal from "../../../../../components/Common/ColumnSettingsModal";
import FileImportModal from "../../../../../components/Common/FileImportModal";

import {
  useFetchBookingsQuery,
  useDeleteBookingMutation,
  useImportBookingsMutation,
  useExportBookingsMutation,
} from "../../../../../redux/booking/bookingApi";

import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setVisibleColumns,
} from "../../../../../redux/booking/bookingSlice";
import type { RootState, AppDispatch } from "../../../../../redux/store";

const LS_KEY = "bookings_table_columns";

const BookingIndex: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { filters, visibleColumns } = useSelector(
    (state: RootState) => state.bookingsUI
  );

  const { data, isLoading } = useFetchBookingsQuery(filters);
  const [deleteBooking] = useDeleteBookingMutation();
  const [importBookings] = useImportBookingsMutation();
  const [exportBookings] = useExportBookingsMutation();

  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [importErrors, setImportErrors] = useState<any[]>([]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking(id);
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

    const res: any = await importBookings(formData);

    if (res?.data?.success === false && res.data.errors) {
      setImportErrors(res.data.errors);
    } else {
      setImportErrors([]);
      setShowImportModal(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportBookings({
        uuids: data?.data.data.map((booking) => booking.uuid.toString()) || [],
      });
      setImportErrors([]);
    } catch (err: any) {
      setImportErrors([
        {
          row: "-",
          field: [{ attribute: "export", errors: ["Failed to export bookings"] }],
        },
      ]);
    }
  };

  return (
    <>
      <Breadcrumb
        title="Bookings"
        subtitle="Your Booking Module."
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Bookings", active: true },
        ]}
        url="/booking/create"
        urlIcon="plus"
      />

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {/* Import/Export Errors */}
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
                <h4 className="card-title mb-0">Bookings List</h4>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setShowImportModal(true)}
                  >
                    <i className="fa-solid fa-file-import"></i>
                    <span>Import</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                    onClick={handleExport}
                  >
                    <i className="fa-solid fa-cloud-arrow-down"></i>
                    <span>Export</span>
                  </button>
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

              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search bookings..."
                    value={filters.search}
                    onChange={(e) =>
                      dispatch(setFilters({ search: e.target.value, page: 1 }))
                    }
                  />
                </div>

                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={filters.status || ""}
                    onChange={(e) =>
                      dispatch(
                        setFilters({
                          status: e.target.value || undefined,
                          page: 1,
                        })
                      )
                    }
                  >
                    <option value="">All Status</option>
                    <option value="1">Confirmed</option>
                    <option value="0">Pending</option>
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
                        onClick={() => navigate(`/booking/edit/${row.uuid}`)}
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
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ColumnSettingsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        allColumns={data?.columns || []}
        visibleColumns={data?.visible_columns || []}
        setVisibleColumns={(cols) => dispatch(setVisibleColumns(cols))}
        defaultColumns={visibleColumns || []}
        localStorageKey={LS_KEY}
      />

      <FileImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={handleImport}
      />
    </>
  );
};

export default BookingIndex;
