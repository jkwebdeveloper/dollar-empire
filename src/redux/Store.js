import { configureStore } from "@reduxjs/toolkit";
import GlobalStates from "./GlobalStates";
import AuthSlice from "./AuthSlice";
import BasicFeatureSlice from "./BasicFeatureSlice";
import GetContentSlice from "./GetContentSlice";
import FeatureSlice from "./FeatureSlice";
import CartSlice from "./CartSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import OrderSlice from "./OrderSlice";
import FavouriteSlice from "./FavouriteSlice";
import ProductSlice from "./ProductSlice";

const persistConfigForGlobalStates = {
  key: "globalStates",
  storage,
  blacklist: [
    "showEnlargeImage",
    "activeEnlargeImageId",
    "activeEnlargeImageFrom",
    "showProductDetailsPopup",
    "singleProductEnlargeImageId",
    "singleProductId",
  ],
};

const persisteGlobalStates = persistReducer(
  persistConfigForGlobalStates,
  GlobalStates,
);

export const store = configureStore({
  reducer: {
    globalStates: persisteGlobalStates,
    Auth: AuthSlice,
    basicFeatures: BasicFeatureSlice,
    getContent: GetContentSlice,
    features: FeatureSlice,
    orders: OrderSlice,
    cart: CartSlice,
    favourite: FavouriteSlice,
    products: ProductSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
