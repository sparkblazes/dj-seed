import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";


export interface ColumnConfig<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  body?: (row: T) => React.ReactNode;
  editor?: (row: T, setRow: (val: Partial<T>) => void) => React.ReactNode;
}

interface CommonCRUDTableProps<T> {
  title: string;
  emptyRecord: T;
  service?: {
    fetch: () => Promise<T[]>;
    save: (record: T) => Promise<void>;
    delete: (record: T) => Promise<void>;
  };
  columns: ColumnConfig<T>[];
}

export default function CommonCRUDTable<T extends { id: string | number }>({
  title,
  emptyRecord,
  service,
  columns,
}: CommonCRUDTableProps<T>) {
  const [records, setRecords] = useState<T[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteManyDialog, setDeleteManyDialog] = useState(false);
  const [record, setRecord] = useState<T>(emptyRecord);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    service?.fetch().then((data) => setRecords(data));
  }, []);

  const openNew = () => {
    setRecord(emptyRecord);
 
  };

  

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const hideDeleteManyDialog = () => {
    setDeleteManyDialog(false);
  };

  const confirmDeleteRecord = (rec: T) => {
    setRecord(rec);
    setDeleteDialog(true);
  };

  const deleteRecord = async () => {
    try {
      await service?.delete(record);
      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: `${title} Deleted`,
        life: 3000,
      });

    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to delete ${title}`,
        life: 3000,
      });
    }
    setDeleteDialog(false);
  };

  const confirmDeleteSelected = () => {
    setDeleteManyDialog(true);
  };

  const deleteSelectedRecords = async () => {
    for (const rec of selectedRecords) {
      await service?.delete(rec);
    }
    setDeleteManyDialog(false);
    setSelectedRecords([]);
    toast.current?.show({
      severity: "success",
      summary: "Deleted",
      detail: "Selected records deleted",
      life: 3000,
    });
  };

  const leftToolbarTemplate = () => (
    <div className="flex flex-wrap gap-2">
      <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
      <Button
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        onClick={confirmDeleteSelected}
        disabled={!selectedRecords.length}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => {}} />
  );

  const actionBodyTemplate = (row: T) => (
    <React.Fragment>
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
        onClick={() => {
          setRecord(row);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => confirmDeleteRecord(row)}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable
          value={records}
          selection={selectedRecords}
          onSelectionChange={(e) => setSelectedRecords(e.value as T[])}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          selectionMode="multiple"
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          {columns.map((col, i) => (
            <Column
              key={i}
              field={col.field as string}
              header={col.header}
              sortable={col.sortable}
              body={col.body}
            />
          ))}
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
      </div>

      {/* Confirm delete single */}
      <Dialog
        visible={deleteDialog}
        style={{ width: "32rem" }}
        header="Confirm"
        modal
        footer={
          <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRecord} />
          </>
        }
        onHide={hideDeleteDialog}
      >
        <span>Are you sure you want to delete this {title}?</span>
      </Dialog>

      {/* Confirm delete multiple */}
      <Dialog
        visible={deleteManyDialog}
        style={{ width: "32rem" }}
        header="Confirm"
        modal
        footer={
          <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteManyDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedRecords} />
          </>
        }
        onHide={hideDeleteManyDialog}
      >
        <span>Are you sure you want to delete selected {title}?</span>
      </Dialog>
    </div>
  );
}
