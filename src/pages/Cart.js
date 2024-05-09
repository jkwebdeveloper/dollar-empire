import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ShoppingCart from "../components/cart/ShoppingCart";
import Checkout from "../components/cart/Checkout";
import PaymentInfo from "../components/cart/PaymentInfo";
import SuccessOrder from "../components/cart/SuccessOrder";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { handleGetCart, handleChangeShippingMethod } from "../redux/CartSlice";
import { handleGetAddresses } from "../redux/GetContentSlice";
import { useRef } from "react";
import {
  handleChangeActiveComponent,
  handleLogout,
} from "../redux/GlobalStates";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { handleLogoutReducer } from "../redux/AuthSlice";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [summaryFixed, setSummaryFixed] = useState(false);
  const [removeItems, setRemoveItems] = useState([]);

  const { activeComponentForCart } = useSelector((state) => state.globalStates);
  const { token } = useSelector((state) => state.Auth);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const AbortControllerRef = useRef(null);

  useEffect(() => {
    const response = dispatch(handleGetCart({ token }));
    if (response) {
      response.then((res) => {
        if (
          res.payload?.status === "fail" &&
          (res.payload?.message === "Please login first." ||
            res.payload?.message === "Please provide authentication token.")
        ) {
          dispatch(handleLogoutReducer());
          dispatch(handleLogout());
        } else if (res.payload?.status === "fail") {
          toast.error(res.payload?.message);
        } else if (res?.payload?.status === "success") {
          setRemoveItems(res?.payload?.removedItems);
        }
      });
    }
    dispatch(handleGetAddresses({ token }));
    dispatch(handleChangeShippingMethod("pickup"));
    dispatch(handleChangeActiveComponent("Shopping Cart"));
    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);

  // for sticky summary component
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 333) {
        setSummaryFixed(true);
      } else {
        setSummaryFixed(false);
      }
    });
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, [window.scrollY]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeComponentForCart]);

  return (
    <>
      <Helmet title={t("Cart | Dollar Empire")} />
      <section className="bg-white w-full lg:pb-20 lg:py-0 py-5">
        {removeItems.length > 0 &&
          removeItems.map((item, i) => (
            <div
              key={i}
              className="text-red-500 text-lg font-semibold container mx-auto"
            >
              {item}
            </div>
          ))}
        <div className="container mx-auto space_for_div space-y-5 w-full bg-white ">
          <h1 className="block font-semibold md:text-4xl text-2xl text-left py-1">
            {activeComponentForCart === "Check Out" ? (
              <ArrowLongLeftIcon
                className="h-8 w-8 inline-block mr-2"
                role="button"
                title="back ot previous section"
                onClick={() =>
                  dispatch(handleChangeActiveComponent("Shopping Cart"))
                }
              />
            ) : activeComponentForCart === "Payment Info" ? (
              <ArrowLongLeftIcon
                className="h-8 w-8 inline-block mr-2"
                role="button"
                title="back ot previous section"
                onClick={() =>
                  dispatch(handleChangeActiveComponent("Check Out"))
                }
              />
            ) : null}

            {activeComponentForCart === "Success"
              ? null
              : activeComponentForCart === "Shopping Cart"
                ? t("Shopping Cart")
                : activeComponentForCart === "Check Out"
                  ? t("Check Out")
                  : activeComponentForCart === "Payment Info"
                    ? t("Payment Info")
                    : "Success"}
          </h1>

          {activeComponentForCart === "Shopping Cart" && (
            <ShoppingCart summaryFixed={summaryFixed} />
          )}
          {activeComponentForCart === "Check Out" && (
            <Checkout summaryFixed={summaryFixed} />
          )}
          {activeComponentForCart === "Payment Info" && (
            <PaymentInfo summaryFixed={summaryFixed} />
          )}
          {activeComponentForCart === "Success" && <SuccessOrder />}
        </div>
      </section>
    </>
  );
};

export default Cart;
