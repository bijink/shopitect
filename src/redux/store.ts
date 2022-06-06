import { configureStore } from '@reduxjs/toolkit';
import shopDetailsReducer from './slices/shopDetails.slice';
import pageIdReducer from './slices/pageId.slice';
import prodSearchInputReducer from './slices/prodSearchInput.slice';
import prodTableCloseCollapseReducer from './slices/prodTableCollapse.slice';

export const store = configureStore({
   reducer: {
      shopDetails: shopDetailsReducer,
      pageId: pageIdReducer,
      prodSearchInput: prodSearchInputReducer,
      prodTableCloseCollapse: prodTableCloseCollapseReducer,
   },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
