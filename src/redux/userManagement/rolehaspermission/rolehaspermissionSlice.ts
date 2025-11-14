// src/redux/userManagement/rolehaspermission/rolehaspermissionSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import type {  PayloadAction } from "@reduxjs/toolkit";
import type { RoleHasPermission } from "./rolehaspermissionTypes";

interface RoleHasPermissionUIState {
  selectedRolePermission: RoleHasPermission | null;
  searchTerm: string;
}

const initialState: RoleHasPermissionUIState = {
  selectedRolePermission: null,
  searchTerm: "",
};

const roleHasPermissionSlice = createSlice({
  name: "roleHasPermissionUI",
  initialState,
  reducers: {
    setSelectedRolePermission: (
      state,
      action: PayloadAction<RoleHasPermission | null>
    ) => {
      state.selectedRolePermission = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSelectedRolePermission, setSearchTerm } =
  roleHasPermissionSlice.actions;
export default roleHasPermissionSlice.reducer;
