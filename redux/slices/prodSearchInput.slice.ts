import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


const initialState: { value: string; } = {
   value: '',
};

const prodSearchInputSlice = createSlice({
   name: 'product-search-input',
   initialState,

   reducers: {
      setProdSearchInput: (state, action: PayloadAction<string>) => {
         state.value = action.payload;
      },
   },
});


export const selectProdSearchInput = (state: RootState) => state.prodSearchInput.value;
export const { setProdSearchInput } = prodSearchInputSlice.actions;

export default prodSearchInputSlice.reducer;
