import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import userEditSlice from "./user/userEditSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Importing storage correctly

// Combine reducers (in case you add more in the future)
const rootReducer = combineReducers({
  user: userReducer,
  userEdit: userEditSlice,// Use the correct userReducer here
});

// Persistence configuration
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for persistence
    }),
});

// Create the persistor object
export const persistor = persistStore(store);
