import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { GetUrl, PostUrl } from "../BaseUrl";
import i18next from "i18next";

export const handleLoginUser = createAsyncThunk(
  "auth/handleLoginUser",
  async ({ password, email, signal }, { rejectWithValue }) => {
    toast.dismiss();
    signal.current = new AbortController();
    const response = await PostUrl("login", {
      data: {
        email: email,
        password: password,
      },
      signal: signal.current.signal,
    })
      .then((res) => {
        window.localStorage.setItem("user", JSON.stringify(res.data.user));
        window.localStorage.setItem("token", JSON.stringify(res.data.token));
        return res.data;
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        return rejectWithValue(err?.response?.data);
      });
    return response;
  }
);

export const handleRegisterUser = createAsyncThunk(
  "auth/handleRegisterUser",
  async (
    {
      fname,
      lname,
      email,
      password,
      phone,
      companyName,
      location,
      city,
      state,
      country,
      postalCode,
      signal,
    },
    { rejectWithValue }
  ) => {
    toast.dismiss();
    signal.current = new AbortController();

    const response = await PostUrl("register", {
      data: {
        fname,
        lname,
        email,
        password,
        phone,
        companyName,
        location,
        city,
        state,
        country,
        postalCode,
      },
      signal: signal.current.signal,
    })
      .then((res) => {
        window.localStorage.setItem("user", JSON.stringify(res.data.user));
        window.localStorage.setItem("token", JSON.stringify(res.data.token));
        return res.data;
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        return rejectWithValue(err?.response?.data);
      });
    return response;
  }
);

export const handleGetVisitCount = createAsyncThunk(
  "auth/handleGetVisitCount",
  async ({ token }, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl("visit-count", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        return rejectWithValue(err?.response?.data);
      });
    return response;
  }
);

export const handleResetPassword = createAsyncThunk(
  "auth/handleResetPassword",
  async ({ password, signal, token }, { rejectWithValue }) => {
    toast.dismiss();
    signal.current = new AbortController();

    const response = await PostUrl("reset-password", {
      data: {
        password,
        token,
      },
      signal: signal.current.signal,
    })
      .then((res) => {
        window.localStorage.setItem("user", JSON.stringify(res.data.user));
        window.localStorage.setItem("token", JSON.stringify(res.data.token));
        return res.data;
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        return rejectWithValue(err?.response?.data);
      });
    return response;
  }
);

const initialState = {
  user: window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : null,
  token: window.localStorage.getItem("token")
    ? JSON.parse(window.localStorage.getItem("token"))
    : null,
  userLanguage: window.localStorage.getItem("user_lang")
    ? JSON.parse(window.localStorage.getItem("user_lang"))
    : "en",
  loading: false,
  error: null,
  success: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleLogoutReducer: (state) => {
      state.loading = true;
      state.user = null;
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("token");
      window.location.href = window.location.origin.concat("/sign-in");
      toast.success("Logout Successfully.", { duration: 3000 });
      state.loading = false;
    },
    handleChangeUserLanguage: (state, { payload }) => {
      state.userLanguage = i18next.changeLanguage(payload);
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(handleLoginUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleLoginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.user = null;
        state.token = null;
      } else {
        state.error = null;
        state.user = payload?.user;
        state.token = payload?.token;
      }
    });
    builder.addCase(handleLoginUser.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.user = null;
      state.token = null;
    });
    // reset password
    builder.addCase(handleResetPassword.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleResetPassword.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.user = null;
        state.token = null;
      } else {
        state.error = null;
        state.user = payload?.user;
        state.token = payload?.token;
      }
    });
    builder.addCase(handleResetPassword.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.user = null;
      state.token = null;
    });
    // register
    builder.addCase(handleRegisterUser.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleRegisterUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.user = null;
        state.token = null;
      } else {
        state.error = null;
        state.user = payload?.user;
        state.token = payload?.token;
      }
    });
    builder.addCase(handleRegisterUser.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.user = null;
      state.token = null;
    });
    // visit count
    builder.addCase(handleGetVisitCount.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetVisitCount.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
      } else {
        state.error = null;
      }
    });
    builder.addCase(handleGetVisitCount.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
    });
  },
});

export const { handleLogoutReducer, handleChangeUserLanguage } =
  AuthSlice.actions;

export default AuthSlice.reducer;
