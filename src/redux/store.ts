import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counter.slice';
import shopDetailsReducer from './slices/shopDetails.slice';
import pageIdReducer from './slices/pageId.slice';

export const store = configureStore({
   reducer: {
      counter: counterReducer,
      shopDetails: shopDetailsReducer,
      pageId: pageIdReducer,
   },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
