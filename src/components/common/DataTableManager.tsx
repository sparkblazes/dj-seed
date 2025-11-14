import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import type { DataTableValue } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import type { NavigateFunction } from "react-router-dom";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"; // optional


interface DataTableManagerProps<T extends DataTableValue> {
    title: string;
    entityName: string; // e.g. "role", "user"
    data: T[];
    columns: { field: keyof T; header: string; sortable?: boolean }[];
    navigate: NavigateFunction;
    createPath: string; // e.g. "/roles/create"
    editPath: (id: number | string) => string; // function for edit path
}

export function DataTableManager<T extends DataTableValue>({
    title,
    entityName,
    data,
    columns,
    navigate,
    createPath,
    editPath,
}: DataTableManagerProps<T>) {
    const toast = useRef<Toast>(null);
    const [items, setItems] = useState<T[]>(data);
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteManyDialog, setDeleteManyDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");

    // ✅ Single delete
    const confirmDelete = (item: T) => {
        setItemToDelete(item);
        setDeleteDialog(true);
    };

    const deleteItem = () => {
        if (itemToDelete) {
            setItems((prev) => prev.filter((r) => r !== itemToDelete));
            toast.current?.show({
                severity: "success",
                summary: "Deleted",
                detail: `${entityName} deleted`,
                life: 3000,
            });
        }
        setDeleteDialog(false);
        setItemToDelete(null);
    };

    // ✅ Multiple delete
    const confirmDeleteSelected = () => setDeleteManyDialog(true);
    const deleteSelected = () => {
        setItems((prev) => prev.filter((r) => !selectedItems.includes(r)));
        setSelectedItems([]);
        toast.current?.show({
            severity: "success",
            summary: "Deleted",
            detail: `Selected ${entityName}s deleted`,
            life: 3000,
        });
        setDeleteManyDialog(false);
    };

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={() => setDeleteDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteItem} />
        </>
    );

    const deleteManyDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={() => setDeleteManyDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelected} />
        </>
    );

    const toolbarLeftTemplate = () => (
        <h4 className="fw-bold text-uppercase mb-0">{title}</h4>
    );

    const toolbarRightTemplate = () => (
        <Button
            label={`Add ${entityName}`}
            icon="pi pi-plus"
            severity="success"
            onClick={() => navigate(createPath)}
        />
    );

    const actionBodyTemplate = (rowData: T & { id?: number | string }) => (
        <div className="d-flex gap-2">
            <Button
                icon="pi pi-pencil"
                rounded
                outlined
                severity="success"
                onClick={() => rowData.id && navigate(editPath(rowData.id))}
            />
            <Button
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                onClick={() => confirmDelete(rowData)}
            />
        </div>
    );

     const header = (
        <div className="header-container">
          <button
            className="delete-btn"
            onClick={confirmDeleteSelected}
            disabled={!selectedItems.length}
          >
            <i className="pi pi-trash"></i> Delete Selected
          </button>
          <InputText
            type="search"
            placeholder="Search..."
            className="search-input"
            onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          />
        </div>
      );

    return (
        <div className="container-xxl">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={toolbarLeftTemplate} right={toolbarRightTemplate} />

                <DataTable
                    value={items}
                    selection={selectedItems}
                    onSelectionChange={(e) => setSelectedItems(e.value as T[])}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    globalFilter={globalFilter}
                    header={header}
                    selectionMode="multiple"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>

                    {columns.map((col) => (
                        <Column
                            key={String(col.field)}
                            field={String(col.field)}
                            header={col.header}
                            sortable={col.sortable}
                            body={(row: any) =>
                                typeof row[col.field] === "boolean"
                                    ? row[col.field]
                                        ? "✅ Active"
                                        : "❌ Inactive"
                                    : String(row[col.field])
                            }
                        />
                    ))}

                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
            </div>

            {/* Delete Dialogs */}
            <Dialog
                visible={deleteDialog}
                style={{ width: "32rem" }}
                header="Confirm"
                modal
                footer={deleteDialogFooter}
                onHide={() => setDeleteDialog(false)}
            >
                <div className="confirmation-content flex align-items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {itemToDelete && <span>Are you sure you want to delete this {entityName}?</span>}
                </div>
            </Dialog>

            <Dialog
                visible={deleteManyDialog}
                style={{ width: "32rem" }}
                header="Confirm"
                modal
                footer={deleteManyDialogFooter}
                onHide={() => setDeleteManyDialog(false)}
            >
                <div className="confirmation-content flex align-items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    <span>Are you sure you want to delete selected {entityName}s?</span>
                </div>
            </Dialog>
        </div>
    );
}
