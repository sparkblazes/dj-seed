// src/redux/slices/roles.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Role } from "./rolesTypes";

interface RolesUIState {
  selectedRole: Role | null;
  filterStatus: string | null;
  searchTerm: string;
}

const initialState: RolesUIState = {
  selectedRole: null,
  filterStatus: null,
  searchTerm: "",
};

const rolesSlice = createSlice({
  name: "rolesUI",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSelectedRole, setFilterStatus, setSearchTerm } = rolesSlice.actions;

export default rolesSlice.reducer;
