// src/redux/slices/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../user/userTypes";

interface UsersUIState {
  selectedUser: User | null;
  filterStatus: string | null;
  searchTerm: string;
}

const initialState: UsersUIState = {
  selectedUser: null,
  filterStatus: null,
  searchTerm: "",
};

const userSlice = createSlice({
  name: "usersUI",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSelectedUser, setFilterStatus, setSearchTerm } = userSlice.actions;
export default userSlice.reducer;
