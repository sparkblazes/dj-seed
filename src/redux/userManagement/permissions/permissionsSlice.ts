import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Permission } from "../permissions/permissionsTypes";

interface PermissionsUIState {
  selectedPermission: Permission | null;
  searchTerm: string;
}

const initialState: PermissionsUIState = {
  selectedPermission: null,
  searchTerm: "",
};

const permissionsSlice = createSlice({
  name: "permissionsUI",
  initialState,
  reducers: {
    setSelectedPermission: (
      state,
      action: PayloadAction<Permission | null>
    ) => {
      state.selectedPermission = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSelectedPermission, setSearchTerm } =
  permissionsSlice.actions;

export default permissionsSlice.reducer;
