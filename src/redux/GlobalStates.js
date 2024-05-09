import { createSlice } from "@reduxjs/toolkit";
import { BroadcastChannel } from "broadcast-channel";

const initialState = {
  showProductDetailsPopup: false,
  showEnlargeImage: false,
  activeEnlargeImageId: "",
  activeEnlargeImageFrom: "",
  singleProductEnlargeImageId: "",
  searchProducts: [],
  searchTitle: "",
  activeComponentForCart: "Shopping Cart",
  singleProductId: null,
  perPageItemView: window.localStorage.getItem("persist:globalStates")
    ? JSON.parse(window.localStorage.getItem("persist:globalStates"))
        .perPageItemView
    : "128",
  productListingPageLink: "",
  pagination: 0,
  activeSubcategory: "",
  searchActiveCategory: "All Categories",
  activeCategory: "All Categories",
  productListingError: "",
  aprice: "Any",
};
const logoutChannel = new BroadcastChannel("handleLogout");
const loginChannel = new BroadcastChannel("handleSuccess");

const GlobalStates = createSlice({
  name: "globalstates",
  initialState,
  reducers: {
    showPopup: (state) => {
      state.showProductDetailsPopup = true;
    },
    closePopup: (state) => {
      state.showProductDetailsPopup = false;
      state.singleProductId = null;
    },
    handleChangeActiveComponent: (state, { payload }) => {
      state.activeComponentForCart = payload;
    },
    handleChangeProductListingError: (state, { payload }) => {
      state.productListingError = payload;
    },
    handleChangePrice: (state, { payload }) => {
      state.aprice = payload;
    },
    handleSuccess: () => {
      loginChannel.postMessage("");
      loginChannel.onmessage = (event) => {
        loginChannel.close();
      };
    },
    handleLogout: () => {
      logoutChannel.postMessage("");
      logoutChannel.onmessage = (event) => {
        logoutChannel.close();
      };
    },

    logoutAllTabsEventListener: () => {
      logoutChannel.onmessage = (event) => {
        logoutChannel.close();
        window.location.reload();
      };
    },
    loginAllTabsEventListener: () => {
      loginChannel.onmessage = (event) => {
        window.location.reload();
        loginChannel.close();
      };
    },
    handleSetSingelProductId: (state, { payload }) => {
      state.singleProductId = payload;
    },
    handleChangePagePerView: (state, { payload }) => {
      state.perPageItemView = payload;
    },
    handleChangeProductListingPageLink: (state, { payload }) => {
      state.productListingPageLink = payload?.link;
      state.pagination = payload?.pagination;
    },
    showEnlargeImagePopup: (state) => {
      state.showEnlargeImage = true;
    },
    closeEnlargeImagePopup: (state) => {
      state.showEnlargeImage = false;
    },
    handleChangeEnlargeImageId: (state, { payload }) => {
      state.activeEnlargeImageId = payload;
    },
    handleChangeEnlargeImageFrom: (state, { payload }) => {
      state.activeEnlargeImageFrom = payload;
    },
    handleChangeSingleProductEnlargeImageId: (state, { payload }) => {
      state.singleProductEnlargeImageId = payload;
    },
    handleChangeSearchProducts: (state, { payload }) => {
      state.searchProducts = payload;
    },

    handleChangeSearchTitle: (state, { payload }) => {
      state.searchTitle = payload;
    },
    handleChangeActiveSubcategory: (state, { payload }) => {
      state.activeSubcategory = payload;
    },
    handleChangeActiveCategory: (state, { payload }) => {
      state.activeCategory = payload;
    },
    handleChangeSearchActiveCategory: (state, { payload }) => {
      state.searchActiveCategory = payload;
    },
  },
});

export const {
  closePopup,
  showPopup,
  handleChangeActiveComponent,
  loginAllTabsEventListener,
  logoutAllTabsEventListener,
  handleSuccess,
  handleLogout,
  handleChangeProductListingPageLink,
  handleSetSingelProductId,
  handleChangePagePerView,
  showEnlargeImagePopup,
  closeEnlargeImagePopup,
  handleChangeEnlargeImageId,
  handleChangeEnlargeImageFrom,
  handleChangeSingleProductEnlargeImageId,
  handleChangeSearchProducts,
  handleChangeActiveSubcategory,
  handleChangeActiveCategory,
  handleChangeSearchTitle,
  handleChangeProductListingError,
  handleChangeSearchActiveCategory,
  handleChangePrice,
} = GlobalStates.actions;

export default GlobalStates.reducer;
