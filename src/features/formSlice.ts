import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

// declaring the types for our state
export type ColorPaletteState = {
  value: string;
};

export interface IFormData {
  companyName: string;
  corporateDate: string | null;
  street: string;
  city: string;
  state: string;
  zipcode: number | null;
  file: string | null;
}

const initialState: IFormData = {
  companyName: "",
  corporateDate: null,
  street: "",
  city: "",
  state: "",
  zipcode: null,
  file: null,
};

export const formInputSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<IFormData>) => {
      Object.assign(state, action.payload);
    },
    updateCorporateDate: (state, action: PayloadAction<string>) => {
      state.corporateDate = action.payload;
    },
    updateFile: (state, action: PayloadAction<string>) => {
      state.file = action.payload;
    },
  },
});

// Here we are just exporting the actions from this slice, so that we can call them anywhere in our app.
export const { updateFormData,updateCorporateDate, updateFile } = formInputSlice.actions;

// calling the above actions would be useless if we could not access the data in the state. So, we use something called a selector which allows us to select a value from the state.
export const selectFormData = (state: RootState) => state.formData;

export default formInputSlice.reducer;
