// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import projectReducer from '../slices/projectSlice';
import postReducer from '../slices/postSlice';
import socialReducer from '../slices/socialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    posts: postReducer,
    social: socialReducer
  },
});
