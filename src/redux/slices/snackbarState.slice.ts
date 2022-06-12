import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';


interface snackbarStateType {
   id: string;
   open: boolean;
   message: string;
}

const initialState: snackbarStateType = {
   id: '',
   open: false,
   message: '',
};

const snackbarStateSlice = createSlice({
   name: 'snackbar-state',
   initialState,

   reducers: {
      setSnackbarState: (state, action: PayloadAction<snackbarStateType>) => {
         state.id = action.payload.id;
         state.open = action.payload.open;
         state.message = action.payload.message;
      },
   },
});


export const selectSnackbarState = (state: RootState) => state.snackbarState;
export const { setSnackbarState } = snackbarStateSlice.actions;

export default snackbarStateSlice.reducer;
