import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../../config/firebase.config";


interface shopDeatilsState {
   value: {
      data: {
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
      length: number | null;
   };
   status: 'idle' | 'loading' | 'failed';
}


function fetchShopDetails(shopAppUrl: string | string[] | undefined) {
   return new Promise<{ data: DocumentData | null, length: number | null; }>((resolve) => {
      onSnapshot(query(collection(database, 'shops'), where('urlName', '==', shopAppUrl)), (snapshot) => {
         let docsLength = null;
         let doc = null;

         if (snapshot.docs.length === 0) docsLength = 0;
         else if (snapshot.docs.length === 1) docsLength = 1;

         snapshot.forEach(obj => (doc = obj.data()));

         const shopDetails = {
            data: doc,
            length: docsLength,
         };

         resolve(shopDetails);
      });
   });
}


const initialState: shopDeatilsState = {
   value: {
      data: null,
      length: null
   },
   status: 'idle',
};

export const setAppShopDetailsAsync = createAsyncThunk(
   'shop-details/fetchshopDetails',
   async (shopAppUrl: string | string[] | undefined) => {
      // const response = await fetchShopDetails(shopAppUrl);

      let response;
      let details = sessionStorage.getItem('shop-details');
      let parseDetails = JSON.parse(details!);

      if (!details || !(parseDetails.data)) {
         const details = await fetchShopDetails(shopAppUrl);
         response = details;

         sessionStorage.setItem('shop-details', JSON.stringify(details));
      } else {
         if (parseDetails.data.urlName === shopAppUrl) {
            response = parseDetails;
         } else {
            const details = await fetchShopDetails(shopAppUrl);
            response = details;

            sessionStorage.setItem('shop-details', JSON.stringify(details));
         }
      }

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
