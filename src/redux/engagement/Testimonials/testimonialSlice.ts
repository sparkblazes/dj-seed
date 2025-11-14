import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface testimonialUIState {
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

const DEFAULT_COLUMNS = ["id", "title", "department", "location", "status"];

const initialState: testimonialUIState = {
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
    localStorage.getItem("testimonials_table_columns") || "[]"
  ).length
    ? JSON.parse(localStorage.getItem("testimonials_table_columns") as string)
    : DEFAULT_COLUMNS,
};

const testimonialSlice = createSlice({
  name: "testimonialUI",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<testimonialUIState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
      localStorage.setItem(
        "testimonials_table_columns",
        JSON.stringify(action.payload)
      );
    },
    resetColumns: (state) => {
      state.visibleColumns = DEFAULT_COLUMNS;
      localStorage.setItem("testimonials_table_columns", JSON.stringify(DEFAULT_COLUMNS));
    },
  },
});

export const { setFilters, setVisibleColumns, resetColumns } = testimonialSlice.actions;
export default testimonialSlice.reducer;
