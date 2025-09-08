import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { WECHAT_API } from "../../config/wechat";

// WeChat authentication thunk
export const authenticateWithWeChat = createAsyncThunk(
  "auth/authenticateWithWeChat",
  async (code, { rejectWithValue }) => {
    try {
      console.log("Starting WeChat authentication with code:", code);

      // Step 1: Get access token using authorization code
      const tokenResponse = await WECHAT_API.getAccessToken(code);
      console.log("WeChat token response:", tokenResponse);

      if (tokenResponse.errcode) {
        throw new Error(
          tokenResponse.errmsg || "Failed to get WeChat access token"
        );
      }

      const { access_token, openid } = tokenResponse;

      // Step 2: Get user information
      const userResponse = await WECHAT_API.getUserInfo(access_token, openid);
      console.log("WeChat user response:", userResponse);

      if (userResponse.errcode) {
        throw new Error(
          userResponse.errmsg || "Failed to get WeChat user info"
        );
      }

      // Step 3: Create user object
      const user = {
        id: `wechat_${openid}`,
        openid: openid,
        name: userResponse.nickname,
        displayName: userResponse.nickname,
        avatar: userResponse.headimgurl,
        country: userResponse.country,
        province: userResponse.province,
        city: userResponse.city,
        sex: userResponse.sex, // 1: male, 2: female, 0: unknown
        language: userResponse.language,
        isAuthenticated: true,
        authMethod: "wechat",
        wechatOpenId: openid,
        accessToken: access_token,
        createdAt: new Date().toISOString(),
      };

      console.log("✅ WeChat authentication successful:", user);
      return user;
    } catch (error) {
      console.error("❌ WeChat authentication failed:", error);
      return rejectWithValue(error.message || "WeChat authentication failed");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      console.log("User logged out");
      // Clear any stored tokens
      sessionStorage.removeItem("wechat_access_token");
      sessionStorage.removeItem("wechat_pending_cart_action");

      return { clearData: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // No dummy user - start unauthenticated
    isAuthenticated: false,
    loading: false,
    error: null,
    wechatAuthUrl: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      // Clear any stored tokens/session data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    },
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
    // TEMPORARY: Set WeChat user for bypassing WeChat auth
    setWeChatUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    // Clear all persisted data on logout
    clearAllData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.wechatAuthUrl = null;
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
      })
      .addCase(authenticateWithWeChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.wechatAuthUrl = null;
      })
      // Handle PURGE action from redux-persist
      .addCase(PURGE, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.wechatAuthUrl = null;
      });
  },
});

export const {
  clearError,
  updateUserProfile,
  setWeChatAuthUrl,
  clearAllData,
  logout,
  setWeChatUser,
} = authSlice.actions;

export default authSlice.reducer;
