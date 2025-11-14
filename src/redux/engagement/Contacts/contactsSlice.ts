import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ContactsUIState {
  filters: {
    search: string;
    sort_by: string;
    sort_order: "asc" | "desc";
    page: number;
    per_page: number;
    department?: string;
    location?: string;
    status?: number;
  };
  visibleColumns: string[];
}

// const DEFAULT_COLUMNS = ["id", "title", "department", "location", "status"];

const initialState: ContactsUIState = {
  filters: {
    search: "",
    sort_by: "id",
    sort_order: "asc",
    page: 1,
    per_page: 10,
    department: undefined,
    location: undefined,
    status: undefined,
  },
  visibleColumns: JSON.parse(
    localStorage.getItem("contacts_table_columns") || "[]"
  ).length
    ? JSON.parse(localStorage.getItem("contacts_table_columns") as string)
    : [],
};

const contactsSlice = createSlice({
  name: "contactsUI",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<ContactsUIState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
      localStorage.setItem(
        "contacts_table_columns",
        JSON.stringify(action.payload)
      );
    },
    resetColumns: (state) => {
      state.visibleColumns = [];
      localStorage.setItem("contacts_table_columns", JSON.stringify([]));
    },
  },
});

export const { setFilters, setVisibleColumns, resetColumns } = contactsSlice.actions;
export default contactsSlice.reducer;
