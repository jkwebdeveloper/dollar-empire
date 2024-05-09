import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { GetUrl } from "../BaseUrl";

export const handleGetAddresses = createAsyncThunk(
  "getContent/handleGetAddresses",
  async ({ token }, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl("address", {
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

export const handleGetUserProfile = createAsyncThunk(
  "getContent/handleGetUserProfile",
  async ({ token }, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl("profile", {
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

export const handleGetCategory = createAsyncThunk(
  "getContent/handleGetCategory",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl("category", {})
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

export const handleGetSubCategory = createAsyncThunk(
  "getContent/handleGetSubCategory",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl("subcategory", {})
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

export const handleGetBanners = createAsyncThunk(
  "getContent/handleGetBanners",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl(`banner`, {})
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

export const handleGetAboutusContent = createAsyncThunk(
  "getContent/handleGetAboutusContent",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl(`about`, {})
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

export const handleGetPrivacyContent = createAsyncThunk(
  "getContent/handleGetPrivacyContent",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl(`privacy`, {})
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

export const handleGetShippingAndFreightContent = createAsyncThunk(
  "getContent/handleGetShippingAndFreightContent",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl(`shipping-freight`, {})
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

export const handleGetSpecialOrders = createAsyncThunk(
  "getContent/handleGetSpecialOrders",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl(`special-orders`, {})
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

export const handleGetContactUsDetails = createAsyncThunk(
  "getContent/handleGetContactUsDetails",
  async (_, { rejectWithValue }) => {
    toast.dismiss();
    const response = await GetUrl(`contact`, {})
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

export const handleDefaultSelecteAddress = createAsyncThunk(
  "features/handleDefaultSelecteAddress",
  async ({ signal, token, id }, { rejectWithValue }) => {
    signal.current = new AbortController();

    const response = await GetUrl(`/address/select/${id}`, {
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
  addressList: [],
  user: null,
  categories: [],
  subCategories: [],
  banners: [],
  featured: [],
  privacyNotice: null,
  shippingAndFreight: null,
  aboutUs: null,
  specialOrders: null,
  contact: null,
  DefaultAddresLoading: false,
  minOrderAmount: null,
  filters: [],
};

const GetContentSlice = createSlice({
  name: "getContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get adderss list
    builder.addCase(handleGetAddresses.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAddresses.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.addressList = [];
      } else {
        state.error = null;
        state.addressList = payload?.addresses;
      }
    });
    builder.addCase(handleGetAddresses.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
    });
    // get user profile
    builder.addCase(handleGetUserProfile.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetUserProfile.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.user = null;
      } else {
        state.error = null;
        state.user = payload?.user;
      }
    });
    builder.addCase(handleGetUserProfile.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
    });
    // get categories
    builder.addCase(handleGetCategory.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.categories = [];
    });
    builder.addCase(handleGetCategory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.categories = [];
      } else {
        state.error = null;
        state.categories = payload?.categories;
      }
    });
    builder.addCase(handleGetCategory.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.categories = [];
    });
    // get sub categories
    builder.addCase(handleGetSubCategory.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.subCategories = [];
    });
    builder.addCase(handleGetSubCategory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.subCategories = [];
      } else {
        state.error = null;
        state.subCategories = payload?.categories;
      }
    });
    builder.addCase(handleGetSubCategory.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.subCategories = [];
    });
    // get banners
    builder.addCase(handleGetBanners.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.banners = [];
    });
    builder.addCase(handleGetBanners.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.banners = [];
        state.featured = [];
      } else {
        state.error = null;
        state.banners = payload?.banners;
        state.featured = payload?.featured;
        state.minOrderAmount = payload?.minOrderAmount;
        state.filters = payload?.filter;
      }
    });
    builder.addCase(handleGetBanners.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.banners = [];
    });
    // get aboutus content
    builder.addCase(handleGetAboutusContent.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.aboutUs = null;
    });
    builder.addCase(handleGetAboutusContent.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.aboutUs = null;
      } else {
        state.error = null;
        state.aboutUs = payload?.page;
      }
    });
    builder.addCase(handleGetAboutusContent.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.aboutUs = null;
    });
    // get privacy content
    builder.addCase(handleGetPrivacyContent.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.privacyNotice = null;
    });
    builder.addCase(handleGetPrivacyContent.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.privacyNotice = null;
      } else {
        state.error = null;
        state.privacyNotice = payload?.page;
      }
    });
    builder.addCase(handleGetPrivacyContent.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.privacyNotice = null;
    });
    // get shipping&freight content
    builder.addCase(handleGetShippingAndFreightContent.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.shippingAndFreight = null;
    });
    builder.addCase(
      handleGetShippingAndFreightContent.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.success = true;
        if (payload.status === "fail") {
          state.error = payload;
          state.shippingAndFreight = null;
        } else {
          state.error = null;
          state.shippingAndFreight = payload?.page;
        }
      }
    );
    builder.addCase(
      handleGetShippingAndFreightContent.rejected,
      (state, { error }) => {
        state.loading = false;
        state.success = false;
        state.error = error;
        state.shippingAndFreight = null;
      }
    );
    // get special orders
    builder.addCase(handleGetSpecialOrders.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.specialOrders = null;
    });
    builder.addCase(handleGetSpecialOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      if (payload.status === "fail") {
        state.error = payload;
        state.specialOrders = null;
      } else {
        state.error = null;
        state.specialOrders = payload?.page;
      }
    });
    builder.addCase(handleGetSpecialOrders.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.specialOrders = null;
    });
    // get contact us details
    builder.addCase(handleGetContactUsDetails.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.contact = null;
    });
    builder.addCase(
      handleGetContactUsDetails.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.success = true;
        if (payload.status === "fail") {
          state.error = payload;
          state.contact = null;
        } else {
          state.error = null;
          state.contact = payload?.contact;
        }
      }
    );
    builder.addCase(handleGetContactUsDetails.rejected, (state, { error }) => {
      state.loading = false;
      state.success = false;
      state.error = error;
      state.contact = null;
    });

    // set default address
    builder.addCase(handleDefaultSelecteAddress.pending, (state) => {
      state.DefaultAddresLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(
      handleDefaultSelecteAddress.fulfilled,
      (state, { payload }) => {
        state.DefaultAddresLoading = false;
        state.success = true;
        state.error = null;
        state.addressList = state.addressList.map((address) =>
          address?._id === payload?.address?._id
            ? { ...address, selected: true }
            : { ...address, selected: false }
        );
      }
    );
    builder.addCase(
      handleDefaultSelecteAddress.rejected,
      (state, { error }) => {
        state.DefaultAddresLoading = false;
        state.success = false;
        state.error = error;
      }
    );
  },
});

export const {} = GetContentSlice.actions;

export default GetContentSlice.reducer;
