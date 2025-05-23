import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOCAL_URL } from '../constants';

// Generate Text
export const generateText = createAsyncThunk('ai/generateText', async ({ prompt, provider }, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) throw new Error('No authentication token found');

    const response = await axios.post(`${LOCAL_URL}ai/generate-text`, { prompt, provider }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Generate Image
export const generateImage = createAsyncThunk('ai/generateImage', async ({ prompt, provider }, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) throw new Error('No authentication token found');

    const response = await axios.post(`${LOCAL_URL}ai/generate-image`, { prompt, provider }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    textResult: null,
    imageResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAIState: (state) => {
      state.textResult = null;
      state.imageResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Text generation
      .addCase(generateText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateText.fulfilled, (state, action) => {
        state.loading = false;
        state.textResult = action.payload;
      })
      .addCase(generateText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Image generation
      .addCase(generateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageResult = action.payload;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAIState } = aiSlice.actions;
export default aiSlice.reducer;
