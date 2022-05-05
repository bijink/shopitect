import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counter.slice';
import shopDetailsReducer from './slices/shopDetails.slice';

export const store = configureStore({
   reducer: {
      counter: counterReducer,
      shopDetails: shopDetailsReducer,
   },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
