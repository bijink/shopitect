import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


const initialState: { value: string; } = {
   value: '',
};

const pageIdSlice = createSlice({
   name: 'page-id',
   initialState,

   reducers: {
      setAppPageId: (state, action: PayloadAction<string>) => {
         state.value = action.payload;
      },
   },
});


export const selectPageId = (state: RootState) => state.pageId.value;
export const { setAppPageId } = pageIdSlice.actions;

export default pageIdSlice.reducer;
