import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';


export const fetchUserData = createAsyncThunk(
  'userData/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:3000/api/userData/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const userDataSlice = createSlice({
  name: 'userData',
  initialState:{
    profileImage: null,
    userName: 'UserName',
    status: 'idle',
    error: null,
  },
  reducers:{},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profileImage = action.payload.profileimage;
        state.userName = action.payload.username;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  },
});

export const userDataActions = userDataSlice.actions;

export default userDataSlice.reducer;