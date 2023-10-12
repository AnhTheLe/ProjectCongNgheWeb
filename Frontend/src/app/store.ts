import { configureStore } from '@reduxjs/toolkit';
// Import reducers

// root reducer
const rootReducer = {};

// app store
const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.VITE_DEV_TOOLS == 1 ? true : false,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
