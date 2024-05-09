import React, { useEffect, useRef, useState } from "react";
import EditAddressPopup from "./EditAddressPopup";
import { handleChangeActiveComponent } from "../../redux/GlobalStates";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetFreightCharges,
  handleChangeShippingMethod,
  handleChangeTotal,
} from "../../redux/CartSlice";
import AddNewAddress from "./AddNewAddress";
import { toast } from "react-hot-toast";
import { handleChangeShippingAddress } from "../../redux/OrderSlice";
import { useTranslation } from "react-i18next";
import { handleDefaultSelecteAddress } from "../../redux/GetContentSlice";

const Checkout = ({ summaryFixed }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [showAddnewaddressPopup, setShowAddnewaddressPopup] = useState(false);

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);

  const {
    grandTotal,
    subTotal,
    shipphingMethod,
    freightCharges,
    freightChargeLoading,
  } = useSelector((state) => state.cart);
  const { shippingAddress } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.Auth);
  const { addressList, loading } = useSelector((state) => state.getContent);
  const dispatch = useDispatch();

  const handleCalculateFreightCharges = () => {
    if (
      shipphingMethod === "freight" &&
      shippingAddress !== "" &&
      addressList.length > 0
    ) {
      const response = dispatch(
        handleGetFreightCharges({
          state: shippingAddress?.state,
          total: subTotal,
          signal: AbortControllerRef,
        }),
      );
      if (response) {
        response.then((res) => {
          if (res.payload.status === "success") {
            dispatch(handleChangeTotal(subTotal));
          }
        });
      }
    }
  };

  useEffect(() => {
    handleCalculateFreightCharges();
    if (addressList.length > 0 && shippingAddress !== "") {
      const findSelectedAddress = addressList.find((add) => add.selected);
      if (shippingAddress?._id !== findSelectedAddress?._id) {
        dispatch(
          handleDefaultSelecteAddress({
            id: shippingAddress?._id,
            token,
            signal: AbortControllerRef,
          }),
        );
      }
    }
  }, [shipphingMethod, shippingAddress]);

  useEffect(() => {
    if (shipphingMethod === "pickup") {
      dispatch(handleChangeTotal(subTotal));
    }
  }, [shipphingMethod]);

  const handlechangeActiveComponent = () => {
    toast.dismiss();
    if (
      (shippingAddress?._id === "" || shippingAddress?._id === undefined) &&
      shipphingMethod === "freight"
    ) {
      document.getElementById("address").scrollIntoView({ behavior: "smooth" });
      return toast.error("Please select the shipping address.");
    } else {
      return dispatch(handleChangeActiveComponent("Payment Info"));
    }
  };

  useEffect(() => {
    if (addressList.length > 0 && shippingAddress === "") {
      if (shippingAddress === "") {
        const findSelectedAddress = addressList.find((add) => add.selected);
        dispatch(handleChangeShippingAddress(findSelectedAddress));
      } else if (addressList.length <= 1) {
        dispatch(handleChangeShippingAddress(addressList[0]));
      }
    }
  }, []);

  return (
    <div className="w-full flex xl:flex-row flex-col items-start justify-start md:gap-4 gap-2 md:pb-10 pb-5">
      {showPopup && (
        <EditAddressPopup
          addressId={addressId}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      )}
      {showAddnewaddressPopup && (
        <AddNewAddress
          setShowAddnewaddressPopup={setShowAddnewaddressPopup}
          showAddnewaddressPopup={showAddnewaddressPopup}
        />
      )}

      {/* left side div */}
      <div className="xl:w-9/12 w-full md:space-y-3 space-y-2 xl:order-1 order-2">
        <p className="bg-PRIMARY text-white p-4 w-full text-left font-semibold tracking-wide">
          {t("Shipping Method")}
        </p>
        <div className="w-full border border-gray-300 rounded-md md:p-5 p-2">
          <div className="w-full flex justify-start items-center gap-x-5 bg-white">
            <input
              name="checkout"
              onChange={() => {
                dispatch(handleChangeShippingMethod("pickup"));
              }}
              type="radio"
              id="pickup"
              className="w-6 h-6 cursor-pointer"
              checked={shipphingMethod === "pickup"}
            />
            <label htmlFor="pickup">
              <p>
                <span className="font-semibold md:text-xl block">
                  {t("Pickup")}
                </span>
              </p>
            </label>
          </div>
        </div>
        <div className="w-full border border-gray-300 rounded-md md:p-5 p-2">
          <div className="w-full flex justify-start items-center gap-x-5 bg-white">
            <input
              name="checkout"
              onChange={() => {
                dispatch(handleChangeShippingMethod("freight"));
              }}
              type="radio"
              className="w-6 h-6 cursor-pointer"
              checked={shipphingMethod === "freight"}
              id="freight"
            />
            <label htmlFor="freight">
              <p>
                <span className="font-semibold md:text-xl block">
                  {t("Freight")}
                </span>
              </p>
            </label>
          </div>
        </div>
        <ul className="w-full list-disc text-left font-normal space-y-3 pl-5 md:leading-relaxed leading-normal"></ul>
        <div className="md:pt-12 pt-6">
          <p className="bg-PRIMARY text-white p-4 w-full text-left font-semibold tracking-wide">
            {t("Shipping Address")}
          </p>
        </div>
        {loading ? (
          <p>{t("loading")}...</p>
        ) : (addressList.length > 0 || addressList !== undefined) &&
          addressList.length === 0 ? (
          <div
            id="address"
            className="w-full border border-gray-300 font-semibold rounded-md p-5 text-left space-y-3 text-[#282828]"
          >
            No address here!! You can also add new address from below.
          </div>
        ) : (
          addressList.map((address) => (
            <div
              id="address"
              key={address?._id}
              className={`${
                shippingAddress?._id === address?._id && "bg-gray-200"
              } relative w-full border border-gray-300 rounded-md md:p-5 p-2 font-normal text-left md:space-y-3 space-y-1 text-[#282828]`}
            >
              <div
                onClick={() => {
                  dispatch(handleChangeShippingAddress(address));
                }}
                className="cursor-pointer md:space-y-3 space-y-1"
              >
                <p className="font-semibold text-xl">{address?.fname}</p>
                <p>{address?.companyName}</p>
                <p className="w-4/12">
                  {address?.location}, {address?.city}, {address?.state}{" "}
                  {address?.postalCode} {address?.country}
                </p>
                <p>{address?.phone}</p>
              </div>

              <p
                role="button"
                onClick={() => {
                  setShowPopup(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setAddressId(address?._id);
                }}
                className="text-PRIMARY inline-block"
              >
                {t("Edit")}
              </p>
              {shippingAddress?._id === address?._id && (
                <>
                  <span
                    title="selected address"
                    className="absolute top-3 right-4 w-7 h-7 bg-blue-400 z-10 rounded-full"
                  ></span>
                  <span
                    title="selected address"
                    className="absolute top-2 right-3 w-9 h-9 bg-white z-0 rounded-full"
                  ></span>
                </>
              )}
              {shippingAddress?._id !== address?._id && (
                <span
                  title="selected address"
                  className="absolute top-2 right-3 w-9 h-9 border border-gray-400 z-0 rounded-full"
                ></span>
              )}
            </div>
          ))
        )}

        <button
          type="button"
          className="bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY duration-300 ease-in-out border border-PRIMARY w-60 rounded-md text-center p-4 font-semibold"
          onClick={() => {
            setShowAddnewaddressPopup(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {t("Add New Address")}
        </button>
      </div>
      {/* summary */}
      <div
        className={`xl:order-2 order-1 ${
          summaryFixed ? "xl:sticky top-2 right-10" : "static"
        } xl:w-3/12 lg:w-1/2 w-full space-y-3 bg-BACKGROUNDGRAY text-BLACK p-3 border border-gray-300 ml-auto`}
      >
        <p className="font-semibold text-xl">{t("Order Summary")}</p>
        <hr className="w-full" />
        <p className="w-full flex items-center justify-between text-base">
          <span className="font-normal">{t("Subtotal")}</span>
          <span className="ml-auto font-semibold text-base">
            ${parseFloat(subTotal).toFixed(2)}{" "}
          </span>{" "}
        </p>
        <p className="w-full flex items-center justify-between text-base">
          <span className="font-normal">{t("Freight")}</span>
          <span className="ml-auto font-semibold text-base">
            {freightChargeLoading
              ? "wait..."
              : shipphingMethod === "pickup"
              ? "$ 0.00"
              : freightCharges !== null
              ? ` $ ${parseFloat(freightCharges).toFixed(2)}`
              : "$ 0.00"}
          </span>
        </p>
        <hr className="w-full" />
        <div className="w-full flex items-center justify-between gap-2 text-2xl font-bold">
          <p>{t("Grand Total")}</p>
          <p className="ml-auto">${parseFloat(grandTotal).toFixed(2)}</p>
        </div>
        <hr className="w-full" />
        {shippingAddress === "" && shipphingMethod === "freight" && (
          <p className="text-DARKRED text-center font-semibold">
            Please select a shipping address
          </p>
        )}
        <button
          type="button"
          className="font-semibold bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY border border-PRIMARY duration-300 ease-in-out w-full p-3 text-center"
          onClick={() => {
            handlechangeActiveComponent();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={freightChargeLoading}
        >
          {t("Continue")}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
