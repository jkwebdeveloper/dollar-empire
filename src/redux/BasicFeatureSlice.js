import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { PostUrl } from "../BaseUrl";

export const handlePostContactUs = createAsyncThunk(
  "basicFeature/handlePostContactUs",
  async (
    { fname, lname, email, comments, phone, signal },
    { rejectWithValue }
  ) => {
    signal.current = new AbortController();

    const response = await PostUrl("contact", {
      data: {
        fname,
        lname,
        email,
        comments,
        phone,
      },
      signal: signal.current.signal,
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

export const handleChangePassword = createAsyncThunk(
  "basicFeature/handleChangePassword",
  async ({ oldPassword, newPassword, token, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();

    const response = await PostUrl("change-password", {
      data: {
        oldPassword,
        newPassword,
      },
      signal: signal.current.signal,
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

export const handleForgotPassword = createAsyncThunk(
  "basicFeature/handleForgotPassword",
  async ({ email, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();

    const response = await PostUrl("forgot-password", {
      data: {
        email,
      },
      signal: signal.current.signal,
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

export const handleEditProfile = createAsyncThunk(
  "basicFeature/handleEditProfile",
  async (
    {
      fname,
      lname,
      companyName,
      location,
      country,
      phone,
      postalCode,
      city,
      state,
      signal,
      token,
    },
    { rejectWithValue }
  ) => {
    signal.current = new AbortController();

    const response = await PostUrl("profile", {
      data: {
        fname,
        lname,
        companyName,
        location,
        country,
        phone,
        postalCode,
        city,
        state,
      },
      signal: signal.current.signal,
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

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const BasicFeatureSlice = createSlice({
  name: "basicFeature",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // contact us
    builder.addCase(handlePostContactUs.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handlePostContactUs.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(handlePostContactUs.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
    });
    // change password
    builder.addCase(handleChangePassword.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleChangePassword.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(handleChangePassword.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
    });
    // forgot password
    builder.addCase(handleForgotPassword.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleForgotPassword.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(handleForgotPassword.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });
    // edit profile
    builder.addCase(handleEditProfile.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditProfile.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(handleEditProfile.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
    });
  },
});

export const {} = BasicFeatureSlice.actions;

export default BasicFeatureSlice.reducer;
