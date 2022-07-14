import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';


const initialState: { value: boolean; } = {
   value: false,
};

const prodTableCloseCollapseSlice = createSlice({
   name: 'product-table-close-collapse',
   initialState,

   reducers: {
      changeProdTableCollapse: (state) => {
         state.value = !state.value;
      },
   },
});


export const selectProdTableCloseCollapse = (state: RootState) => state.prodTableCloseCollapse.value;
export const { changeProdTableCollapse } = prodTableCloseCollapseSlice.actions;

export default prodTableCloseCollapseSlice.reducer;
