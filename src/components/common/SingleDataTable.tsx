import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { Slider } from "primereact/slider";
// import { Dropdown } from "primereact/dropdown";
// import { InputNumber } from "primereact/inputnumber";
// import { InputMask } from "primereact/inputmask";
import { Link } from "react-router-dom";

export interface TableColumn<T> {
  field: keyof T | string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  dataType?:
  | "text"
  | "numeric"
  | "date"
  | "boolean"
  | "range"
  | "currency"
  | "email"
  | "phone"
  | "select"
  | "dateRange"
  | "datetime"
  | "timestamp";
  options?: { label: string; value: any }[]; // optional for select fields
  style?: React.CSSProperties;
  body?: (rowData: T) => React.ReactNode;
  ralatedEntity?: string; // for future use with relations
  relatedEntityField?: string; // for future use with relations
}

export interface SingleDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  visibleColumns?: string[];
  paginator?: boolean;
  rows?: number;
  selectionMode?: "single" | "multiple" | "checkbox" | null;
  loading?: boolean;
  onDelete?: (row: T) => void;
  onDeleteMultiple?: (rows: T[]) => void;
  enableDeleteSelected?: boolean;
  showFilter?: boolean;
  onFilterChange?: (filters: {
    global?: any;
    status?: string;
    columns?: Record<string, any>;
    sortField?: string;
    sortOrder?: "asc" | "desc" | number;
    sortingRalatedEntity?: string;
    sortingRelatedEntityField?: string;
    current_page?: number;
  }) => void;
  notShowInFilter?: string[];
  filters?: any;
  pagination?: {
    currentPage: number;
    perPage: number;
    totalRecords: number;
  };
  serverSide?: boolean; // <--- add this
  editUrlBase?: string;
  statusCountData?: string[]
}

const SingleDataTable = <
  T extends { uuid?: string | number; status?: "active" | "inactive" | number }
>({
  data,
  columns,
  visibleColumns: visibleColumnsProp,
  rows = 50,
  selectionMode = "checkbox",
  loading = false,
  onDelete,
  onDeleteMultiple,
  enableDeleteSelected = true,
  showFilter = true,
  onFilterChange,
  notShowInFilter = [],
  filters,
  pagination,
  serverSide = false,
  editUrlBase = "",
  statusCountData = []
}: SingleDataTableProps<T>) => {
  const toast = useRef<Toast | null>(null);
  const STORAGE_KEY = "datatable_visible_columns";

  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteManyDialog, setDeleteManyDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<T | null>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const normalizeStatus = (val: any) =>
    val === 1 || val === "1" || val === "active" ? "active" : "inactive";

  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
  const [columnDialogVisible, setColumnDialogVisible] = useState(false);
  const [filterSidebarVisible, setFilterSidebarVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return visibleColumnsProp?.length
          ? visibleColumnsProp
          : columns.map((c) => c.field as string);
      }
    }
    return visibleColumnsProp?.length
      ? visibleColumnsProp
      : columns.map((c) => c.field as string);
  });
  const hasStatusField = data.length > 0 && "status" in data[0];

  useEffect(() => {
    if (hasStatusField) {
      if (statusFilter === "all") setFilteredData(data);
      else
        setFilteredData(
          data.filter((item) => normalizeStatus(item.status) === statusFilter)
        );
    } else {
      setFilteredData(data);
    }
  }, [data, statusFilter, hasStatusField]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    if (onFilterChange && serverSide) {
      onFilterChange({
        global: globalFilterValue,
        status: statusFilter,
        columns: columnFilters,
        sortField,
        sortOrder,
      });
    }
  }, [statusFilter]);

  // client-side filtering for when pagination is client-side or for preview
  useEffect(() => {
    const formattedColumns = Object.entries(columnFilters).map(
      ([key, value]) => {
        const col = columns.find((c) => c.field === key);
        return col
          ? {
            [key]: value,
            ralatedEntity: col.ralatedEntity,
            relatedEntityField: col.relatedEntityField || null,
          }
          : { [key]: value };
      }
    );
    if (serverSide) {
      // 🔹 Only notify parent to refetch (API call) — no local filtering
      if (onFilterChange) {
        onFilterChange({
          global: globalFilterValue,
          status: statusFilter,
          columns: formattedColumns,
          sortField,
          sortOrder,
          sortingRalatedEntity:
            columns.find((c) => c.field === sortField)?.ralatedEntity || "",
          sortingRelatedEntityField:
            columns.find((c) => c.field === sortField)?.relatedEntityField ||
            "",
        });
      }
      let filtered = [...data];
      setFilteredData(filtered);
    } else {
      // 🔹 Local filtering for client-side mode
      let filtered = [...data];

      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (d) =>
            d.status === statusFilter ||
            d.status === (statusFilter === "active" ? "active" : 0)
        );
      }

      if (globalFilterValue.trim() !== "") {
        const query = globalFilterValue.toLowerCase();
        filtered = filtered.filter((row) =>
          visibleColumns.some((col) => {
            const val = String((row as any)[col] ?? "").toLowerCase();
            return val.includes(query);
          })
        );
      }

      for (const [field, filterVal] of Object.entries(columnFilters)) {
        if (!filterVal || filterVal === "") continue;
        filtered = filtered.filter((row) => {
          const val = (row as any)[field];
          if (Array.isArray(filterVal)) {
            const [min, max] = filterVal;
            return Number(val) >= min && Number(val) <= max;
          } else if (filterVal instanceof Date) {
            return new Date(val).toDateString() === filterVal.toDateString();
          } else {
            return String(val ?? "")
              .toLowerCase()
              .includes(String(filterVal).toLowerCase());
          }
        });
      }

      setFilteredData(filtered);

      if (onFilterChange) {
        onFilterChange({
          global: globalFilterValue,
          status: statusFilter,
          columns: columnFilters,
          sortField,
          sortOrder,
          sortingRalatedEntity:
            columns.find((c) => c.field === sortField)?.ralatedEntity || "",
          sortingRelatedEntityField:
            columns.find((c) => c.field === sortField)?.relatedEntityField ||
            "",
        });
      }
    }
  }, [
    data,
    globalFilterValue,
    statusFilter,
    columnFilters,
    visibleColumns,
    sortField,
    sortOrder,
    serverSide,
  ]);

  const confirmDeleteRow = (row: T) => {
    setRowToDelete(row);
    setDeleteDialog(true);
  };
  const deleteRow = () => {
    if (rowToDelete && onDelete) onDelete(rowToDelete);
    toast.current?.show({
      severity: "success",
      summary: "Deleted",
      detail: "Item deleted successfully",
      life: 3000,
    });
    setDeleteDialog(false);
    setRowToDelete(null);
  };
  const confirmDeleteSelected = () => setDeleteManyDialog(true);
  const deleteSelectedRows = () => {
    if (onDeleteMultiple && selectedRows.length) onDeleteMultiple(selectedRows);
    toast.current?.show({
      severity: "success",
      summary: "Deleted",
      detail: "Selected items deleted",
      life: 3000,
    });
    setSelectedRows([]);
    setDeleteManyDialog(false);
  };

  const toggleColumnInChooser = (colField: string) => {
    setVisibleColumns((prev) =>
      prev.includes(colField)
        ? prev.filter((c) => c !== colField)
        : [...prev, colField]
    );
  };

  const actionBodyTemplate = (row: T) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <Link
        to={`${editUrlBase}/${row.uuid}`}
        className="p-button p-button-rounded p-button-info p-button-text"
        title="Edit"
      >
        <i className="pi pi-pen-to-square" />
      </Link>

      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        text
        tooltip="Delete"
        tooltipOptions={{ position: "bottom" }}
        onClick={() => confirmDeleteRow(row)}
      />
    </div>
  );

  // Server-side pagination helpers:
  const isServerPagination = Boolean(
    pagination && pagination.totalRecords !== undefined
  );

  return (
    <div className="card p-4 surface-card shadow-2 border-round">
      <Toast ref={toast} />

      {/* Header */}
      <div className="table-header mb-3">
        {enableDeleteSelected && (
          <Button
            icon="pi pi-trash"
            label="Delete Selected"
            severity="danger"
            onClick={confirmDeleteSelected}
            disabled={selectedRows.length === 0}
          />
        )}

        <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
          {Object.entries(statusCountData).map(([key, value]) => (
            <Button
              key={key}
              label={`${key} (${value})`}
              className={`p-button-text ${statusFilter.toLowerCase() === key.toLowerCase()
                  ? "p-button-primary"
                  : ""
                }`}
              onClick={() => setStatusFilter(key.toLowerCase() as any)}
            />
          ))}
        </div>

        <div className="header-controls">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={(e) => setGlobalFilterValue(e.target.value)}
              placeholder="Search..."
            />
          </span>
          {showFilter && (
            <Button
              icon="pi pi-filter"
              rounded
              outlined
              tooltip="Advanced Filters"
              tooltipOptions={{ position: "bottom" }}
              onClick={() => setFilterSidebarVisible(true)}
            />
          )}
          <Button
            icon="pi pi-objects-column"
            rounded
            outlined
            tooltip="Show/Hide Columns"
            tooltipOptions={{ position: "bottom" }}
            onClick={() => setColumnDialogVisible(true)}
          />
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        value={filteredData}
        paginator
        rows={rows}
        lazy={isServerPagination} // enable lazy mode for server pagination
        totalRecords={pagination?.totalRecords ?? filteredData.length}
        first={((pagination?.currentPage ?? 1) - 1) * rows}
        selectionMode={selectionMode}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
        loading={loading}
        sortMode="single"
        sortField={sortField}
        sortOrder={sortOrder === "asc" ? 1 : sortOrder === "desc" ? -1 : 0}
        emptyMessage="No records found"
        responsiveLayout="scroll"
        removableSort
        onPage={(e) => {
          const nextPage = Math.floor(e.first / e.rows) + 1;
          // keep other filter params intact and notify parent
          if (onFilterChange) {
            onFilterChange({
              ...(filters || {}),
              current_page: nextPage,
            });
          }
        }}
        onSort={(e: any) => {
          const newSortField = e.sortField;
          const newSortOrder = e.sortOrder === 1 ? "asc" : "desc";
          setSortField(newSortField);
          setSortOrder(newSortOrder);

          if (onFilterChange) {
            onFilterChange({
              global: globalFilterValue,
              status: statusFilter,
              columns: columnFilters,
              sortField: newSortField,
              sortOrder: newSortOrder,
              sortingRalatedEntity:
                columns.find((c) => c.field === newSortField)?.ralatedEntity ||
                "",
              sortingRelatedEntityField:
                columns.find((c) => c.field === newSortField)
                  ?.relatedEntityField || "",
            });
          }
        }}
      >
        {selectionMode === "checkbox" && (
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        )}

        {columns
          .filter((col) => visibleColumns.includes(col.field as string))
          .map((col) => (
            <Column
              key={col.field as string}
              field={col.field as string}
              header={col.header}
              sortable={col.sortable}
              body={col.body}
            />
          ))}

        <Column
          header="Actions"
          headerStyle={{ width: "6rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
          body={actionBodyTemplate}
        />
      </DataTable>

      {/* Delete Dialogs */}
      <Dialog
        visible={deleteDialog}
        style={{ width: "25rem" }}
        header="Confirm Delete"
        modal
        onHide={() => setDeleteDialog(false)}
        footer={
          <>
            <Button
              label="No"
              icon="pi pi-times"
              text
              onClick={() => setDeleteDialog(false)}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              severity="danger"
              onClick={deleteRow}
            />
          </>
        }
      >
        <p>Are you sure you want to delete this record?</p>
      </Dialog>

      <Dialog
        visible={deleteManyDialog}
        style={{ width: "25rem" }}
        header="Confirm Delete"
        modal
        onHide={() => setDeleteManyDialog(false)}
        footer={
          <>
            <Button
              label="No"
              icon="pi pi-times"
              text
              onClick={() => setDeleteManyDialog(false)}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              severity="danger"
              onClick={deleteSelectedRows}
            />
          </>
        }
      >
        <p>Are you sure you want to delete selected records?</p>
      </Dialog>

      {/* Column Chooser */}
      <Dialog
        header="Manage Columns"
        visible={columnDialogVisible}
        style={{ width: "30rem", maxWidth: "95vw" }}
        modal
        draggable={false}
        className="p-fluid"
        onHide={() => setColumnDialogVisible(false)}
      >
        {/* Search Box */}
        <div className="mb-4">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              className="w-full"
              placeholder="Search columns..."
              value={columnSearch}
              onChange={(e) => setColumnSearch(e.target.value)}
            />
          </span>
        </div>

        {/* Scrollable Checkbox List */}
        <div
          className="p-3 border-round"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid var(--surface-border)",
          }}
        >
          {columns
            .filter((c) =>
              (c.header || c.field.toString())
                .toLowerCase()
                .includes(columnSearch.toLowerCase())
            )
            .map((col) => {
              const key = col.field as string;
              return (
                <div
                  key={key}
                  className="flex align-items-center justify-content-between mb-2"
                >
                  <div className="flex align-items-center gap-2">
                    <Checkbox
                      inputId={key}
                      checked={visibleColumns.includes(key)}
                      onChange={() => toggleColumnInChooser(key)}
                    />
                    <label
                      htmlFor={key}
                      className="text-sm font-medium"
                      style={{ marginLeft: "13px" }}
                    >
                      {col.header}
                    </label>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer Buttons */}
        <div
          className="flex justify-content-end gap-2 mt-4"
          style={{ display: "flex" }}
        >
          <Button
            label="Reset"
            severity="secondary"
            outlined
            onClick={() =>
              setVisibleColumns(columns.map((c) => c.field as string))
            }
          />
          <Button
            label="Done"
            icon="pi pi-check"
            onClick={() => setColumnDialogVisible(false)}
          />
        </div>
      </Dialog>

      {/* Sidebar Filters */}
      <Sidebar
        visible={filterSidebarVisible}
        position="right"
        onHide={() => setFilterSidebarVisible(false)}
        style={{ width: "25rem" }}
      >
        <h5>Filters</h5>
        {columns
          .filter((col) => !notShowInFilter.includes(col.field as string))
          .map((col) => {
            const field = col.field as string;
            return (
              <div key={field} className="mb-3">
                <label className="block mb-2 font-medium">{col.header}</label>
                <div>
                  {col.dataType === "numeric" || col.dataType === "range" ? (
                    <Slider
                      value={columnFilters[field] ?? [0, 100]}
                      onChange={(e) =>
                        setColumnFilters((p) => ({ ...p, [field]: e.value }))
                      }
                      range
                    />
                  ) : col.dataType === "date" ? (
                    <Calendar
                      value={columnFilters[field] ?? null}
                      onChange={(e) =>
                        setColumnFilters((p) => ({ ...p, [field]: e.value }))
                      }
                      dateFormat="dd/mm/yy"
                      placeholder="Select date"
                      showIcon
                      style={{ width: "100%" }}
                    />
                  ) : col.dataType === "datetime" ? (
                    <Calendar
                      value={columnFilters[field] ?? null}
                      onChange={(e) =>
                        setColumnFilters((p) => ({ ...p, [field]: e.value }))
                      }
                      dateFormat="dd/mm/yy"
                      placeholder="Select date"
                      showIcon
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <InputText
                      value={columnFilters[field] ?? ""}
                      onChange={(e) =>
                        setColumnFilters((p) => ({
                          ...p,
                          [field]: e.target.value,
                        }))
                      }
                      placeholder={`Filter ${col.header}`}
                      className="w-full"
                      style={{ width: "100%" }} // ✅ full width
                    />
                  )}
                </div>
              </div>
            );
          })}

        <div className="flex justify-content-between mt-4">
          <Button
            label="Clear"
            outlined
            onClick={() => {
              setStatusFilter("all");
              setColumnFilters({});
              setGlobalFilterValue("");
            }}
          />
          <Button
            label="Apply"
            onClick={() => setFilterSidebarVisible(false)}
          />
        </div>
      </Sidebar>
    </div>
  );
};

export default SingleDataTable;
