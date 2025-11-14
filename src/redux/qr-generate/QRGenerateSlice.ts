import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface qrGenerateUIState {
  filters: {
    search: string;
    sort_by: string;
    sort_order: "asc" | "desc";
    page: number;
    per_page: number;
    status?: number;
  };
  visibleColumns: string[];
}

const LS_KEY = "qr_generate_table_columns";

const initialState: qrGenerateUIState = {
  filters: {
    search: "",
    sort_by: "id",
    sort_order: "asc",
    page: 1,
    per_page: 10,
    status: undefined,
  },
  visibleColumns: JSON.parse(localStorage.getItem(LS_KEY) || "[]"),
};

const qrGenerateSlice = createSlice({
  name: "qrGenerateUI",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<qrGenerateUIState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
      localStorage.setItem(LS_KEY, JSON.stringify(action.payload));
    },
    resetColumns: (state) => {
      state.visibleColumns = [];
      localStorage.setItem(LS_KEY, JSON.stringify([]));
    },
  },
});

export const { setFilters, setVisibleColumns, resetColumns } =
  qrGenerateSlice.actions;

export default qrGenerateSlice.reducer;
