import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/Layouts/Breadcrumb";
import DataTable from "../../../../components/Common/DataTable";
import ColumnSettingsModal from "../../../../components/Common/ColumnSettingsModal";

import {
  useFetchQRGeneratesQuery,
  useDeleteQRGenerateMutation,
} from "../../../../redux/qr-generate/QRGenerateApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setVisibleColumns,
} from "../../../../redux/qr-generate/QRGenerateSlice";
import type { RootState, AppDispatch } from "../../../../redux/store";

const LS_KEY = "qr_generate_table_columns";

const QRGenerateIndex: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { filters, visibleColumns } = useSelector(
    (state: RootState) => state.QRGenerateUI
  );

  const { data, isLoading } = useFetchQRGeneratesQuery(filters);
  const [deleteQRGenerate] = useDeleteQRGenerateMutation();

  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this QR Generate?")) {
      await deleteQRGenerate(id);
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

  return (
    <>
      <Breadcrumb
        title="QR Generate"
        subtitle="Your QR Generate Module."
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "QR Generate", active: true },
        ]}
        url="/qr-generate/create"
        urlIcon="plus"
        btnName="Configure"
        btnUrl="/qr-generate/configuration"
        btnNameUrlIcon="settings"
      />

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {/* Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">QR Generate List</h4>

                <div className="d-flex gap-2">
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

              {/* 🔎 Search + Filters */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search QR Generate..."
                    value={filters.search}
                    onChange={(e) =>
                      dispatch(setFilters({ search: e.target.value, page: 1 }))
                    }
                  />
                </div>

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
                          navigate(`/qr-generate/edit/${row.uuid}`)
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
        visibleColumns={data?.visible_columns || []}
        setVisibleColumns={(cols) => dispatch(setVisibleColumns(cols))}
        defaultColumns={visibleColumns || []}
        localStorageKey={LS_KEY}
      />
    </>
  );
};

export default QRGenerateIndex;
