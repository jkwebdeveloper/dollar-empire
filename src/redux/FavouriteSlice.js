import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetUserFavourites = createAsyncThunk(
  "favourite/handleGetUserFavourites",
  async ({ token }, { rejectWithValue }) => {
    const response = await GetUrl(`favourite`, {
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

export const handleAddProductToFavourites = createAsyncThunk(
  "features/handleAddProductToFavourites",
  async ({ signal, token, id }, { rejectWithValue }) => {
    signal.current = new AbortController();

    const response = await GetUrl(`/favourite/add/${id}`, {
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

export const handleRemoveProductToFavourites = createAsyncThunk(
  "features/handleRemoveProductToFavourites",
  async ({ signal, token, id }, { rejectWithValue }) => {
    signal.current = new AbortController();

    const response = await GetUrl(`/favourite/remove/${id}`, {
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
  favourites: [],
};

const FavouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get users favourites
    builder.addCase(handleGetUserFavourites.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.favourites = [];
    });
    builder.addCase(handleGetUserFavourites.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.favourites = [];
      } else {
        state.error = null;
        state.favourites = payload?.favourites;
      }
    });
    builder.addCase(handleGetUserFavourites.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.favourites = [];
    });
    // add favourties
    builder.addCase(handleAddProductToFavourites.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddProductToFavourites.fulfilled, (state, {}) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(
      handleAddProductToFavourites.rejected,
      (state, { error }) => {
        state.loading = false;
        state.success = false;
        state.error = error;
      }
    );
    // remove favourties
    builder.addCase(handleRemoveProductToFavourites.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleRemoveProductToFavourites.fulfilled, (state, {}) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(
      handleRemoveProductToFavourites.rejected,
      (state, { error }) => {
        state.loading = false;
        state.success = false;
        state.error = error;
      }
    );
  },
});

export const {} = FavouriteSlice.actions;

export default FavouriteSlice.reducer;
