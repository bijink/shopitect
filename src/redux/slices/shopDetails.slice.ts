import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, database } from '../../config/firebase.config';
import { RootState } from '../store';


export interface shopDeatilsState {
   // value: {
   //    shopAddress: string,
   //    shopAuthId: string,
   //    shopCategory: string,
   //    shopEmail: string,
   //    shopName: string,
   //    shopOwnerName: string,
   //    shopUrlName: string,
   //    createdAt: {
   //       nanoseconds: number,
   //       seconds: number,
   //    };
   // };
   value: any;
   // status: 'idle' | 'loading' | 'failed';
}

const initialState: shopDeatilsState = {
   value: {},
};

const shopDetailsSlice = createSlice({
   name: 'shop-details',
   initialState,

   reducers: {
      setAppShopDetails: (state, action) => {
         state.value = action.payload;
      },
   },
});


export const selectShopDetails = (state: RootState) => state.shopDetails.value;
export const { setAppShopDetails } = shopDetailsSlice.actions;

export default shopDetailsSlice.reducer;
