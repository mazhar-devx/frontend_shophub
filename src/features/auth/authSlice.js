import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Validation helper function
const validateUserData = (userData) => {
  const errors = {};

  if (!userData.name || userData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = "Please provide a valid email address";
  }

  if (!userData.password || userData.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (userData.password !== userData.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Async thunks for authentication
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      // Validate user data
      const validationErrors = validateUserData(userData);
      if (validationErrors) {
        return rejectWithValue({ message: "Validation failed", errors: validationErrors });
      }

      const response = await api.post("/users/signup", userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Signup failed" });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Validate credentials
      if (!credentials.email || !credentials.password) {
        return rejectWithValue({ message: "Email and password are required" });
      }

      const response = await api.post("/users/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue({ message });
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.patch("/users/updateMe", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Profile update failed" });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("/users/logout");
      localStorage.removeItem("token");
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Logout failed" });
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  validationErrors: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = {};
    },
    setUser: (state, action) => {
      state.user = action.payload.data.user;
      state.isAuthenticated = true;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.validationErrors = {};
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.errors) {
          // Validation errors
          state.validationErrors = action.payload.errors;
        } else {
          // General error
          state.error = action.payload?.message || "Signup failed";
        }
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.validationErrors = {};
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.validationErrors = {};
      })
      .addCase(logout.rejected, (state, action) => {
        // Even if logout fails on the server, we should clear the client state
        state.user = null;
        state.isAuthenticated = false;
        state.validationErrors = {};
        state.error = action.payload?.message || "Logout failed";
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Profile update failed";
      });
  },
});

export const { clearError, setUser, clearValidationErrors } = authSlice.actions;
export default authSlice.reducer;
