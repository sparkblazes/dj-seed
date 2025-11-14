import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ModuleList } from "./moduleTypes";

interface ModuleUIState {
  selectedModule: ModuleList | null;
  searchTerm: string;
}

const initialState: ModuleUIState = {
  selectedModule: null,
  searchTerm: "",
};

const moduleSlice = createSlice({
  name: "modulesUI",
  initialState,
  reducers: {
    setSelectedModule: (state, action: PayloadAction<ModuleList | null>) => {
      state.selectedModule = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSelectedModule, setSearchTerm } = moduleSlice.actions;
export default moduleSlice.reducer;
