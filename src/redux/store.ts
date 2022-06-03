import { configureStore } from '@reduxjs/toolkit';
import shopDetailsReducer from './slices/shopDetails.slice';
import pageIdReducer from './slices/pageId.slice';
import prodSearchInputReducer from './slices/prodSearchInput.slice';

export const store = configureStore({
   reducer: {
      shopDetails: shopDetailsReducer,
      pageId: pageIdReducer,
      prodSearchInput: prodSearchInputReducer,
   },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
