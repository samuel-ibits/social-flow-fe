// src/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOCAL_URL } from '../constants';

// Create Project
export const createProject = createAsyncThunk('projects/create', async (data, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await axios.post(`${LOCAL_URL}projects`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Get Projects
export const getProjects = createAsyncThunk('projects/getAll', async (_, thunkAPI) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await axios.get(`${LOCAL_URL}projects`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE PROJECT
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.currentProject = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET PROJECTS
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
