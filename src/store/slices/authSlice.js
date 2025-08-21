import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dummy user for development
const dummyUser = {
  id: "dummy-user-001",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://via.placeholder.com/150",
  phone: "+1234567890",
  isAuthenticated: true,
  authMethod: "dummy", // Will be 'wechat' when implemented
  wechatOpenId: null, // Will store WeChat OpenID when available
  preferences: {
    language: "en",
    currency: "USD",
    notifications: true,
  },
  addresses: [
    {
      id: "addr-001",
      type: "home",
      address: "123 Main St, San Francisco, CA",
      isDefault: true,
    },
  ],
  createdAt: new Date().toISOString(),
};

// Async thunk for WeChat authentication (placeholder)
export const authenticateWithWeChat = createAsyncThunk(
  "auth/authenticateWithWeChat",
  async (wechatCode, { rejectWithValue }) => {
    try {
      // TODO: Implement WeChat authentication
      console.log("WeChat authentication code:", wechatCode);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, return dummy user with WeChat integration
      return {
        ...dummyUser,
        authMethod: "wechat",
        wechatOpenId: `wechat_${wechatCode}_dummy`,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement actual logout logic
      console.log("User logged out");
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Generate WeChat Auth URL (placeholder)
export const generateWeChatAuthUrl = createAsyncThunk(
  "auth/generateWeChatAuthUrl",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual WeChat app credentials
      const appId = "YOUR_WECHAT_APP_ID"; // Will be replaced when you have credentials
      const redirectUri = encodeURIComponent(
        window.location.origin + "/wechat/callback"
      );
      const state = Math.random().toString(36).substring(7);

      const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;

      return authUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: dummyUser, // Start with dummy user for development
    isAuthenticated: true,
    loading: false,
    error: null,
    wechatAuthUrl: null,
    isDevelopmentMode: true, // Flag to indicate we're using dummy user
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setWeChatAuthUrl: (state, action) => {
      state.wechatAuthUrl = action.payload;
    },
    // For development: toggle between dummy user and no user
    toggleDummyAuth: (state) => {
      if (state.isAuthenticated) {
        state.user = null;
        state.isAuthenticated = false;
        console.log("Logged out dummy user");
      } else {
        state.user = dummyUser;
        state.isAuthenticated = true;
        console.log("Logged in dummy user");
      }
    },
    // Switch to production mode (when WeChat is ready)
    setProductionMode: (state) => {
      state.isDevelopmentMode = false;
      if (state.user?.authMethod === "dummy") {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateWithWeChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateWithWeChat.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.isDevelopmentMode = false;
      })
      .addCase(authenticateWithWeChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        // Reset to dummy user in development mode
        if (state.isDevelopmentMode) {
          state.user = dummyUser;
          state.isAuthenticated = true;
        }
      })
      .addCase(generateWeChatAuthUrl.fulfilled, (state, action) => {
        state.wechatAuthUrl = action.payload;
      });
  },
});

export const {
  clearError,
  updateUserProfile,
  setWeChatAuthUrl,
  toggleDummyAuth,
  setProductionMode,
} = authSlice.actions;

export default authSlice.reducer;
