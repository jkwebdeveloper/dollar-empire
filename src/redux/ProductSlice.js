import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllProducts = createAsyncThunk(
  "products/handleGetAllProducts",
  async ({ token }, { rejectWithValue }) => {
    toast.dismiss();
    if (token === null) {
      const response = await GetUrl("product", {})
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.response.data;
        });
      return response;
    } else {
      const response = await GetUrl("product", {
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
  }
);

export const handleGetNewArrivals = createAsyncThunk(
  "products/handleGetNewArrivals",
  async ({ token }, { rejectWithValue }) => {
    toast.dismiss();
    if (token === null) {
      const response = await GetUrl("new-arrivals", {})
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.response.data;
        });
      return response;
    } else {
      const response = await GetUrl("new-arrivals", {
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
  }
);

export const handleGetTopSellers = createAsyncThunk(
  "products/handleGetTopSellers",
  async ({ token }, { rejectWithValue }) => {
    toast.dismiss();
    if (token === null) {
      const response = await GetUrl("top-sellers", {})
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.response.data;
        });
      return response;
    } else {
      const response = await GetUrl("top-sellers", {
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
  }
);

export const handleGetProductById = createAsyncThunk(
  "products/handleGetProductById",
  async ({ id, token }, { rejectWithValue }) => {
    toast.dismiss();
    if (token === null) {
      const response = await GetUrl(`product/${id}`, {})
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err.response.data;
        });
      return response;
    } else {
      const response = await GetUrl(`product/${id}`, {
        headers: { Authorization: token },
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
  }
);

const initialState = {
  allProductLoading: false,
  singleProductLoading: false,
  success: false,
  error: null,
  allProducts: [],
  newArrivals: [],
  topSellers: [],
  singleProduct: null,
  newArrivalProductLoading: false,
  topSellerProductLoading: false,
  singleProductId: null,
};

const ProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    handleClearSingleProduct: (state) => {
      state.singleProduct = null;
    },
  },
  extraReducers: (builder) => {
    // get new arrivals
    builder.addCase(handleGetNewArrivals.pending, (state) => {
      state.newArrivalProductLoading = true;
      state.success = false;
      state.error = null;
      state.newArrivals = [];
    });
    builder.addCase(handleGetNewArrivals.fulfilled, (state, { payload }) => {
      state.newArrivalProductLoading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.newArrivals = [];
      } else {
        state.error = null;
        state.newArrivals = payload?.products;
      }
    });
    builder.addCase(handleGetNewArrivals.rejected, (state, { error }) => {
      state.newArrivalProductLoading = false;
      state.success = false;
      state.error = error;
      state.newArrivals = [];
    });
    // get top sellers
    builder.addCase(handleGetTopSellers.pending, (state) => {
      state.topSellerProductLoading = true;
      state.success = false;
      state.error = null;
      state.topSellers = [];
    });
    builder.addCase(handleGetTopSellers.fulfilled, (state, { payload }) => {
      state.topSellerProductLoading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.topSellers = [];
      } else {
        state.error = null;
        state.topSellers = payload?.products;
      }
    });
    builder.addCase(handleGetTopSellers.rejected, (state, { error }) => {
      state.topSellerProductLoading = false;
      state.success = false;
      state.error = error;
      state.topSellers = [];
    });
    // get all products
    builder.addCase(handleGetAllProducts.pending, (state) => {
      state.allProductLoading = true;
      state.success = false;
      state.error = null;
      state.allProducts = [];
    });
    builder.addCase(handleGetAllProducts.fulfilled, (state, { payload }) => {
      state.allProductLoading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.allProducts = [];
      } else {
        state.error = null;
        state.allProducts = payload?.products;
      }
    });
    builder.addCase(handleGetAllProducts.rejected, (state, { error }) => {
      state.allProductLoading = false;
      state.success = false;
      state.error = error;
      state.allProducts = [];
    });
    // get product by id
    builder.addCase(handleGetProductById.pending, (state) => {
      state.singleProductLoading = true;
      state.success = false;
      state.error = null;
      state.singleProduct = null;
    });
    builder.addCase(handleGetProductById.fulfilled, (state, { payload }) => {
      state.singleProductLoading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.singleProduct = null;
      } else {
        state.error = null;
        state.singleProduct = payload?.product;
      }
    });
    builder.addCase(handleGetProductById.rejected, (state, { error }) => {
      state.singleProductLoading = false;
      state.success = false;
      state.error = error;
      state.singleProduct = null;
    });
  },
});

export const {
  handleClearSingleProduct,
} = ProductSlice.actions;

export default ProductSlice.reducer;
