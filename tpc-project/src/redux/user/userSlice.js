// import { createSlice } from "@reduxjs/toolkit";

// // Initial state
// const initialState = {
//   currentUser: null,
//   error: null,
//   loading: false,
// };

// // Create the user slice
// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     signInStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     signInSuccess: (state, action) => {
//       state.currentUser = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     signInFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//   },
// });

// // Export the actions and the reducer
// export const { signInFailure, signInStart, signInSuccess } = userSlice.actions;
// export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Ensure this contains { id, name, image }
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload; // New action to set current user
    },
  },
});

// Export the actions and the reducer
export const { signInFailure, signInStart, signInSuccess, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
// userSlice.js
// 
// src/redux/user/userSlice.js
