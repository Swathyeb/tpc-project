import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching user by email
export const fetchUserByEmail = createAsyncThunk(
  'userEdit/fetchUserByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${email}`);
      if (!response.ok) throw new Error('User not found');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user
export const updateUser = createAsyncThunk(
  'userEdit/updateUser',
  async ({ userId, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userEditSlice = createSlice({
  name: 'userEdit',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByEmail.pending, (state) => { state.loading = true; })
      .addCase(fetchUserByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => { state.loading = true; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userEditSlice.reducer;
