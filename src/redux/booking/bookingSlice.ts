import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BookingUIState {
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

const initialState: BookingUIState = {
  filters: {
    search: "",
    sort_by: "id",
    sort_order: "asc",
    page: 1,
    per_page: 10,
    status: undefined,
  },
  visibleColumns: JSON.parse(
    localStorage.getItem("bookings_table_columns") || "[]"
  ).length
    ? JSON.parse(localStorage.getItem("bookings_table_columns") as string)
    : [],
};

const bookingSlice = createSlice({
  name: "bookingsUI",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<BookingUIState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
      localStorage.setItem(
        "bookings_table_columns",
        JSON.stringify(action.payload)
      );
    },
    resetColumns: (state) => {
      state.visibleColumns = [];
      localStorage.setItem("bookings_table_columns", JSON.stringify([]));
    },
  },
});

export const { setFilters, setVisibleColumns, resetColumns } =
  bookingSlice.actions;
export default bookingSlice.reducer;
