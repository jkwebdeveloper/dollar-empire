import React, { useState } from "react";
import EditAddress from "./EditAddress";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import AddNewAddress from "./AddNewAddress";
import { handlePostDeleteAddress } from "../../redux/FeatureSlice";
import { useRef } from "react";
import { useEffect } from "react";
import {
  handleDefaultSelecteAddress,
  handleGetAddresses,
} from "../../redux/GetContentSlice";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { handleChangeShippingAddress } from "../../redux/OrderSlice";

const Address = () => {
  const [showEditAddres, setShowEditAddres] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addressList, loading, DefaultAddresLoading } = useSelector(
    (state) => state.getContent
  );
  const { shippingAddress } = useSelector((state) => state.orders);

  const { token } = useSelector((state) => state.Auth);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const AbortControllerRef = useRef(null);

  const handleDeleteAddress = (id) => {
    if (loading || deleteLoading) return true;
    setDeleteLoading(true);
    const response = dispatch(
      handlePostDeleteAddress({ id, token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res.payload.status === "success") {
          toast.success("Address deleted successfully.");
          setDeleteLoading(false);
          dispatch(handleGetAddresses({ token }));
        } else {
          toast.error(res.payload.message);
          setDeleteLoading(false);
        }
      });
    }
  };

  const handleSelectDefaultAddress = (id) => {
    if (loading || DefaultAddresLoading) return true;
    const response = dispatch(
      handleDefaultSelecteAddress({ id, token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res?.payload?.status === "success") {
          toast.success("Selected as default shipping address.");
          dispatch(handleChangeShippingAddress(res?.payload?.address));
          setDeleteLoading(false);
        } else {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (
      addressList.length > 0 &&
      addressList.length <= 1 &&
      shippingAddress?._id !== addressList[0]?._id
    ) {
      dispatch(handleChangeShippingAddress(addressList[0]));
      handleSelectDefaultAddress(addressList[0]?._id);
    }
  }, [addressList]);

  return (
    <>
      {loading ? (
        <p className="font-semibold md:text-3xl text-lg text-center w-full">
          {t("loading")}...
        </p>
      ) : showEditAddres ? (
        <EditAddress
          addressId={addressId}
          setShowEditAddres={setShowEditAddres}
        />
      ) : showNewAddress && !showEditAddres ? (
        <AddNewAddress setShowNewAddress={setShowNewAddress} />
      ) : (
        <div className="bg-white border border-BORDERGRAY p-5 w-full flex flex-wrap md:flex-row flex-col items-start md:gap-x-5 gap-y-4 md:gap-y-4">
          {addressList.length > 0 &&
            addressList.map((address) => (
              <div
                key={address?._id}
                className={`  ${
                  address?.selected && "bg-gray-100"
                } capitalize relative border border-BORDERGRAY rounded-md p-3 text-BLACK space-y-2 text-left md:w-2/5 w-full min-h-[13rem]`}
              >
                {/* default address */}
                <div
                  className={`space-y-2 ${
                    DefaultAddresLoading
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  title={address?.selected ? "Default selected address" : ""}
                  onClick={() => {
                    toast.remove();
                    address?.selected
                      ? toast.error("Address is already selected as default.")
                      : handleSelectDefaultAddress(address?._id);
                  }}
                >
                  {address?.selected && (
                    <CheckCircleIcon
                      title="selected address"
                      className="absolute top-2 right-3 w-8 h-8 text-green-500 bg-white rounded-full p-1"
                    ></CheckCircleIcon>
                  )}
                  <p className="font-semibold text-lg capitalize">
                    {address?.fname} {address?.lname}
                  </p>
                  <p className="font-normal capitalize">
                    {address?.companyName}
                  </p>
                  <p className="font-normal">
                    <span>{address?.location},</span>
                    <span>{address?.state},</span>{" "}
                    <span>{address?.postalCode},</span>{" "}
                    <span>{address?.country}</span>
                  </p>
                  <p className="font-normal">{address?.phone}</p>
                </div>

                <p className="flex items-center gap-x-3">
                  <span
                    role="button"
                    className="text-PRIMARY"
                    onClick={() => {
                      setShowEditAddres(true);
                      setAddressId(address?._id);
                    }}
                  >
                    {t("Edit")}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteAddress(address?._id);
                      setAddressId(address?._id);
                    }}
                    className="text-red-400"
                    disabled={loading || deleteLoading}
                  >
                    {deleteLoading && address?._id === addressId
                      ? t("Deleting").concat("...")
                      : t("Delete")}
                  </button>
                </p>
              </div>
            ))}
          <div
            onClick={() => setShowNewAddress(true)}
            className="border cursor-pointer border-BORDERGRAY rounded-md text-BLACK gap-y-2 text-center md:w-2/5 w-full min-h-[13rem] flex flex-col items-center justify-center"
          >
            <AiOutlinePlusCircle className="h-10 w-10 text-TEXTGRAY block" />
            <p className="font-semibold text-TEXTGRAY">
              {t("Add new address")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Address;
