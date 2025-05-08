import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOCAL_URL } from '../constants';

// Create Post
export const createPost = createAsyncThunk('posts/create', async (data, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await axios.post(`${LOCAL_URL}posts`, data, {
      headers: { Authorization: `Bearer ${userToken}` }
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
      headers: { Authorization: `Bearer ${userToken}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Upload Post Content
export const uploadPostContent = createAsyncThunk('posts/upload', async (data, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    
    // Create form data for file upload
    const formData = new FormData();
    
    // If data contains a file and other post information
    if (data.file) {
      formData.append('file', data.file);
    }
    
    // Add any additional data
    if (data.postId) {
      formData.append('postId', data.postId);
    }
    
    if (data.projectId) {
      formData.append('projectId', data.projectId);
    }
    
    // Add any other fields from data
    Object.keys(data).forEach(key => {
      if (key !== 'file' && key !== 'postId' && key !== 'projectId') {
        formData.append(key, data[key]);
      }
    });
    
    const response = await axios.post(`${LOCAL_URL}posts/upload`, formData, {
      headers: { 
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'multipart/form-data'
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
    uploadLoading: false,
    error: null,
    uploadError: null,
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
      })
      
      // UPLOAD POST CONTENT
      .addCase(uploadPostContent.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadPostContent.fulfilled, (state, action) => {
        state.uploadLoading = false;
        
        // Find and update the post if it exists
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          // If it's a new post with upload, add it
          state.posts.push(action.payload);
        }
      })
      .addCase(uploadPostContent.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload;
      });
  },
});

export default postSlice.reducer;