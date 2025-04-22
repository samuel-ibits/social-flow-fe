// src/features/posts/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOCAL_URL } from '../constants';

// Create Post
export const createPost = createAsyncThunk('posts/create', async (data, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await axios.post(`${LOCAL_URL}posts`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Get Posts
export const getPosts = createAsyncThunk('posts/getAll', async (projectId, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await axios.get(`${LOCAL_URL}posts?projectId=${projectId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE POST
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET POSTS
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
