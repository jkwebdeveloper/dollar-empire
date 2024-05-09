import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/Store";
import "./i18next";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import ProductDetailPopup from "./components/ProductDetailPopup";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const modal = ReactDOM.createRoot(document.getElementById("modal"));
// modal.render(<ProductDetailPopup />);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Toaster toastOptions={{ duration: 5000 }} />
      <App />
    </PersistGate>
  </Provider>
);
