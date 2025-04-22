// src/slices/socialSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOCAL_URL } from '../constants';

// Add Social Account
export const addSocialAccount = createAsyncThunk('socials/add', async (data, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      throw new Error('No authentication token found');
    }
    const response = await axios.post(`${LOCAL_URL}social-accounts`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Get Social Accounts
export const getSocialAccounts = createAsyncThunk('socials/getAll', async (projectId, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${LOCAL_URL}social-accounts?projectId=${projectId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const socialSlice = createSlice({
  name: 'socials',
  initialState: {
    socialAccounts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD SOCIAL ACCOUNT
      .addCase(addSocialAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSocialAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.socialAccounts.push(action.payload);
      })
      .addCase(addSocialAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET SOCIAL ACCOUNTS
      .addCase(getSocialAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSocialAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.socialAccounts = action.payload;
      })
      .addCase(getSocialAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default socialSlice.reducer;
