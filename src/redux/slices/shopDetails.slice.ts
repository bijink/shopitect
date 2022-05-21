import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";


interface shopDeatilsState {
   value: {
      address: string,
      providerID: string,
      accountID: string,
      category: string,
      email: string,
      name: string,
      ownerName: string,
      urlName: string,
      createdAt: {
         nanoseconds: number,
         seconds: number,
      };
   } | DocumentData | null;
   status: 'idle' | 'loading' | 'failed';
}


function fetchShopDetails(shopAppId: string | string[] | undefined) {
   return new Promise<DocumentData>((resolve) => {
      onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppId)), (snapshot) => {
         snapshot.forEach(obj => {
            resolve(obj.data());
         });
      });
   });
}


const initialState: shopDeatilsState = {
   value: null,
   status: 'idle',
};

export const setAppShopDetailsAsync = createAsyncThunk(
   'shop-details/fetchshopDetails',
   async (shopAppId: string | string[] | undefined) => {
      const response = await fetchShopDetails(shopAppId);

      return response;
   }
);

const shopDetailsSlice = createSlice({
   name: 'shop-details',
   initialState,

   reducers: {
      setAppShopDetails: (state, action) => {
         state.value = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(setAppShopDetailsAsync.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(setAppShopDetailsAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.value = action.payload;
         })
         .addCase(setAppShopDetailsAsync.rejected, (state) => {
            state.status = 'failed';
         });
   },
});


export const { setAppShopDetails } = shopDetailsSlice.actions;
export const selectShopDetails = (state: RootState) => state.shopDetails.value;

export default shopDetailsSlice.reducer;
