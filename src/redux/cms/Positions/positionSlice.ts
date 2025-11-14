import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PositionUIState {
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

const initialState: PositionUIState = {
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
    localStorage.getItem("Positions_table_columns") || "[]"
  ).length
    ? JSON.parse(localStorage.getItem("Positions_table_columns") as string)
    : [],
};

const PositionSlice = createSlice({
  name: "PositionUI",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<PositionUIState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
      localStorage.setItem(
        "Positions_table_columns",
        JSON.stringify(action.payload)
      );
    },
    resetColumns: (state) => {
      state.visibleColumns = [];
      localStorage.setItem("Positions_table_columns", JSON.stringify([]));
    },
  },
});

export const { setFilters, setVisibleColumns, resetColumns } = PositionSlice.actions;
export default PositionSlice.reducer;
