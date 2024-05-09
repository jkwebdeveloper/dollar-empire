import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  handleChangeActiveComponent,
  handleLogout,
} from "../../redux/GlobalStates";
import BaseUrl from "../../BaseUrl";
import {
  handleAddProductToCart,
  handleDecreaseQuantityAndAmount,
  handleRemoveItemFromCart,
  handleRemoveProductToCart,
  handleUpdateTotalQuantityAndAmount,
} from "../../redux/CartSlice";
import { toast } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";

const ShoppingCart = ({ summaryFixed }) => {
  const [showChangeField, setShowChangeField] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [productQuantity, setProductQuantity] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [productId, setProductId] = useState(null);

  const {
    grandTotal,
    subTotal,
    shipphingMethod,
    cartItems,
    loading,
    freightCharges,
    freightChargeLoading,
  } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.Auth);
  const { productListingPageLink } = useSelector((state) => state.globalStates);
  const { minOrderAmount } = useSelector((state) => state.getContent);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);

  const handleRemoveFromCart = (id, quantity, amount) => {
    setDeleteLoading(true);
    const response = dispatch(
      handleRemoveProductToCart({ token, id, signal: AbortControllerRef }),
    );
    if (response) {
      response
        .then((res) => {
          if (res?.payload.status === "success") {
            dispatch(handleRemoveItemFromCart(id));
            dispatch(handleDecreaseQuantityAndAmount({ quantity, amount }));
            setDeleteLoading(false);
          }
        })
        .catch((err) => {
          setDeleteLoading(false);
          toast.error("Someting went worng, Try again");
        });
    }
  };

  const handleUpdateProduct = (id, title, type, amount, quantity) => {
    toast.dismiss();
    if (productQuantity === quantity) {
      return toast.error(
        "Quantity should be increased or decreased, not be same",
      );
    } else if (productQuantity === "") {
      toast.error("Value not be empty");
      return true;
    } else if (productQuantity === 0) {
      toast.error("Minimum quantity should more than 0");
      return true;
    } else if (!/^\d+$/.test(productQuantity)) {
      setProductQuantity(quantity);
      return toast.error("Please enter valid value");
    }

    setUpdateLoading(true);
    const response = dispatch(
      handleAddProductToCart({
        token,
        id,
        signal: AbortControllerRef,
        type: type,
        quantity: productQuantity,
      }),
    );
    if (response) {
      response
        .then((res) => {
          if (res.payload.status === "success") {
            toast.success(`${title}'s quantity updated.`);
            dispatch(
              handleUpdateTotalQuantityAndAmount({
                quantity: productQuantity > 0 ? productQuantity : 0,
                amount,
                id,
              }),
            );
            setProductId(null);
          }
          setShowChangeField(false);
          setUpdateLoading(false);
          setProductQuantity(0);
        })
        .catch((err) => {
          toast.error(err.payload.message);
          setUpdateLoading(false);
        });
    }
  };

  const handleOnChangeProductQuantity = (e) => {
    toast.remove();
    setProductQuantity(parseFloat(e.target.value));
    if (!/^\d+$/.test(e.target.value) && e.target.value !== "") {
      toast.dismiss();
      return toast.error("Please enter valid value.");
    }
  };

  const handleChangeComonent = () => {
    toast.remove();
    if (cartItems?.length > 0) {
      dispatch(handleChangeActiveComponent("Check Out"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Your Cart is empty");
    }
  };

  return (
    <div className="relative w-full flex xl:flex-row flex-col items-start justify-start gap-4 pb-10 max-h-fit">
      {/* table */}
      <div className="xl:w-9/12 w-full overflow-x-scroll scrollbar xl:order-1 order-3">
        {/* for deskt & tablet */}
        <table className="w-full xl:inline-block hidden">
          <thead className="bg-PRIMARY text-white p-2 w-full">
            <tr>
              <th className="lg:min-w-[20rem] min-w-[23rem] lg:p-3 p-2 font-semibold text-left text-base">
                {t("Product")}
              </th>
              <th className="lg:w-32 min-w-[8rem] lg:p-3 p-2 font-semibold text-left text-base">
                {t("Item Number")}
              </th>
              <th className="lg:w-28 min-w-[7rem] lg:p-3 p-2 font-semibold text-left text-base">
                {t("Unit Price")}
              </th>
              <th className="lg:w-28 min-w-[10rem] lg:p-3 p-2 font-semibold text-left text-base">
                {t("Quantity")}
              </th>
              <th className="lg:w-28 min-w-[5rem] lg:p-3 p-2 font-semibold text-left text-base">
                {t("Subtotal")}
              </th>
              <th className="lg:w-28 min-w-[3rem] lg:p-3 p-2 font-semibold text-cneter text-base">
                {t("Remove")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && !updateLoading ? (
              <tr>
                <td
                  colSpan="100%"
                  className="text-center font-semibold md:text-2xl text-xl pt-10"
                >
                  {t("Fetching your cart")}...
                </td>
              </tr>
            ) : cartItems.length <= 0 ? (
              <>
                <tr>
                  <td
                    colSpan="100%"
                    className="text-center font-semibold text-xl p-2"
                  >
                    {t("No items in cart")}.
                  </td>
                </tr>
                <tr>
                  <td colSpan="100%" className="text-center mx-auto py-3">
                    <Link to="/product-listing/all-products">
                      <button
                        type="button"
                        className="font-semibold mx-auto w-60 bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY border border-PRIMARY duration-300 ease-in-out p-3 text-center"
                      >
                        {t("Go to products")}
                      </button>
                    </Link>
                  </td>
                </tr>
              </>
            ) : (
              cartItems.map((item) => (
                <tr
                  key={item?._id}
                  className="bg-white font-normal text-BLACK text-left"
                >
                  <td className="flex items-center gap-x-3 lg:p-5 p-3">
                    <img
                      src={BaseUrl.concat(item?.product?.images[0])}
                      alt={item?.product?.name}
                      className="min-w-[6rem] min-h-[6rem] max-w-[6rem] max-h-[6rem] object-contain object-center"
                    />
                    <p className="font-semibold md:text-lg text-left">
                      {item?.product?.name}
                    </p>
                  </td>
                  <td className="lg:p-5 p-3">#{item?.product?.number}</td>
                  <td className="lg:p-5 p-3">${item?.product?.price}</td>
                  {updateLoading && item?.product?._id === productId ? (
                    <td className="lg:p-5 p-3 ">{t("updating")}</td>
                  ) : (
                    <td className="whitespace-nowrap lg:p-5 p-3 uppercase">
                      {productId !== item?.product?._id ? (
                        item?.type === "pk" ? (
                          `${item?.quantity} ${item?.type} (${
                            item?.quantity * item?.product?.PK
                          }PC)`
                        ) : (
                          `${item?.quantity} ${item?.type} (${
                            item?.quantity * item?.product?.CTN
                          }PC)`
                        )
                      ) : (
                        <form
                          className="inline-block"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateProduct(
                              item?.product?._id,
                              item?.product?.name,
                              item.type,
                              item?.product?.price * productQuantity,
                              item?.quantity,
                            );
                          }}
                        >
                          <input
                            min="0"
                            type="number"
                            className="bg-gray-300 outline-none text-black placeholder:text-BLACK h-10 rounded-md w-16 p-1"
                            value={productQuantity}
                            max="999999"
                            onChange={(e) => {
                              if (e.target.value.length > 6) {
                                toast.remove();
                                toast.error("Can't add more than 6 numbers");
                                return true;
                              }
                              handleOnChangeProductQuantity(e);
                            }}
                          />
                        </form>
                      )}
                      {showChangeField && productId === item?.product?._id ? (
                        <>
                          <span className="text-xs">
                            (
                            {item?.type === "pk"
                              ? productQuantity * item?.product?.PK
                              : productQuantity * item?.product?.CTN}
                            PC)
                          </span>
                          <span
                            role="button"
                            className="text-PRIMARY underline ml-1 capitalize"
                            onClick={() =>
                              handleUpdateProduct(
                                item?.product?._id,
                                item?.product?.name,
                                item.type,
                                item?.product?.price * productQuantity,
                                item?.quantity,
                              )
                            }
                          >
                            {t("Update")}
                          </span>
                          <span
                            className="ml-2 cursor-pointer"
                            role="button"
                            onClick={() => {
                              setShowChangeField(false);
                              setProductId(null);
                            }}
                          >
                            x
                          </span>
                        </>
                      ) : (
                        <span
                          role="button"
                          className="text-PRIMARY underline ml-1 capitalize"
                          onClick={() => {
                            setShowChangeField(true);
                            setProductQuantity(item?.quantity);
                            setProductId(item?.product?._id);
                          }}
                        >
                          {t("Change")}
                        </span>
                      )}
                    </td>
                  )}
                  <td className="lg:p-5 p-3 uppercase">
                    {item?.type === "pk"
                      ? (
                          item?.product?.price *
                          item?.quantity *
                          item?.product?.PK
                        ).toFixed(2)
                      : (
                          item?.product?.price *
                          item?.quantity *
                          item?.product?.CTN
                        ).toFixed(2)}{" "}
                  </td>
                  <td className="lg:p-5 p-3">
                    {deleteLoading ? (
                      "..."
                    ) : (
                      <AiOutlineClose
                        role="button"
                        className="h-6 w-6 mx-auto"
                        color="red"
                        onClick={() => {
                          item?.type === "pk"
                            ? handleRemoveFromCart(
                                item?.product?._id,
                                item?.quantity * item?.product?.PK,
                                item?.product?.price *
                                  item?.quantity *
                                  item?.product?.PK,
                              )
                            : handleRemoveFromCart(
                                item?.product?._id,
                                item?.quantity * item?.product?.CTN,
                                item?.product?.price *
                                  item?.quantity *
                                  item?.product?.CTN,
                              );
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* for mobile */}
        <table className="w-full xl:hidden overflow-hidden ">
          <tbody>
            {loading && !updateLoading ? (
              <tr>
                <td
                  colSpan="100%"
                  className="text-center font-semibold md:text-2xl text-xl pt-10"
                >
                  {t("Fetching your cart")}...
                </td>
              </tr>
            ) : cartItems.length <= 0 ? (
              <>
                <tr>
                  <td
                    colSpan="100%"
                    className="text-center font-semibold text-xl p-2"
                  >
                    {t("No items in cart")}.
                  </td>
                </tr>
                <tr>
                  <td colSpan="100%" className="text-center mx-auto py-3">
                    <Link to="/product-listing/all-products">
                      <button
                        type="button"
                        className="font-semibold mx-auto w-60 bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY border border-PRIMARY duration-300 ease-in-out p-3 text-center"
                      >
                        {t("Go to products")}
                      </button>
                    </Link>
                  </td>
                </tr>
              </>
            ) : (
              cartItems.map((item) => (
                <tr className="flex flex-col w-full" key={item?._id}>
                  <tr className="bg-white font-normal text-BLACK text-center w-full flex flex-row">
                    <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                      {t("Product")}
                    </th>
                    <td className="flex items-center gap-x-3 lg:p-5 p-3 text-center w-full">
                      <img
                        src={BaseUrl.concat(item?.product?.images[0])}
                        alt={item?.product?.name}
                        className="min-w-[6rem] max-w-[6rem] object-contain object-center mx-auto"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                      {t("Name")}
                    </th>
                    <td className="font-semibold md:text-lg text-center w-full">
                      {item?.product?.name}
                    </td>{" "}
                  </tr>
                  <tr>
                    <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                      {t("Item Number")}
                    </th>
                    <td className="lg:p-5 p-3 text-center w-full">
                      #{item?.product?.number}
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                      {t("Unit Price")}
                    </th>
                    <td className="lg:p-5 p-3 text-center w-full">
                      ${item?.product?.price}
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                      {t("Quantity")}
                    </th>
                    {updateLoading && item?.product?._id === productId ? (
                      <td className="lg:p-5 p-3 text-center w-full">
                        {t("updating")}
                      </td>
                    ) : (
                      <td className="lg:p-5 p-3 text-center w-full uppercase">
                        {productId !== item?.product?._id ? (
                          item?.type === "pk" ? (
                            `${item?.quantity} ${item?.type} (${
                              item?.quantity * item?.product?.PK
                            }PC)`
                          ) : (
                            `${item?.quantity} ${item?.type} (${
                              item?.quantity * item?.product?.CTN
                            }PC)`
                          )
                        ) : (
                          <form
                            className="inline-block"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdateProduct(
                                item?.product?._id,
                                item?.product?.name,
                                item.type,
                                item?.product?.price * productQuantity,
                                item?.quantity,
                              );
                            }}
                          >
                            {" "}
                            <input
                              type="number"
                              className="bg-gray-300 outline-none text-black placeholder:text-BLACK h-10 rounded-md w-16 p-1"
                              value={productQuantity}
                              onChange={(e) => {
                                handleOnChangeProductQuantity(e);
                              }}
                              min="0"
                            />
                          </form>
                        )}
                        {showChangeField && productId === item?.product?._id ? (
                          <>
                            <span className="text-xs">
                              (
                              {item?.type === "pk"
                                ? productQuantity * item?.product?.PK
                                : productQuantity * item?.product?.CTN}
                              PC)
                            </span>
                            <span
                              role="button"
                              className="text-PRIMARY underline ml-1"
                              onClick={() =>
                                handleUpdateProduct(
                                  item?.product?._id,
                                  item?.product?.name,
                                  item.type,
                                  item?.product?.price * productQuantity,
                                  item?.quantity,
                                )
                              }
                            >
                              {t("Update")}
                            </span>
                            <span
                              className="ml-2 text-2xl cursor-pointer"
                              role="button"
                              onClick={() => {
                                setShowChangeField(false);
                                setProductId(null);
                              }}
                            >
                              x
                            </span>
                          </>
                        ) : (
                          <span
                            role="button"
                            className="text-PRIMARY underline ml-1"
                            onClick={() => {
                              setShowChangeField(true);
                              setProductQuantity(item?.quantity);
                              setProductId(item?.product?._id);
                            }}
                          >
                            {t("Change")}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>

                  <tr>
                    <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                      {t("Subtotal")}
                    </th>
                    <td className="lg:p-5 p-3  text-center w-full">
                      {item?.type === "pk"
                        ? (
                            item?.product?.price *
                            item?.quantity *
                            item?.product?.PK
                          ).toFixed(2)
                        : (
                            item?.product?.price *
                            item?.quantity *
                            item?.product?.CTN
                          ).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="">
                    <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                      {t("Remove")}
                    </th>
                    <td className="lg:p-5 p-3 text-center w-full">
                      {deleteLoading ? (
                        "..."
                      ) : (
                        <AiOutlineClose
                          role="button"
                          className="h-6 w-6 mx-auto"
                          color="red"
                          onClick={() => {
                            item?.type === "pk"
                              ? handleRemoveFromCart(
                                  item?.product?._id,
                                  item?.quantity * item?.product?.PK,
                                  item?.product?.price *
                                    item?.quantity *
                                    item?.product?.PK,
                                )
                              : handleRemoveFromCart(
                                  item?.product?._id,
                                  item?.quantity * item?.product?.CTN,
                                  item?.product?.price *
                                    item?.quantity *
                                    item?.product?.CTN,
                                );
                          }}
                        />
                      )}
                    </td>
                  </tr>
                  <hr className="my-1" />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <hr className="my-1 bg-black w-full order-2 xl:hidden" />

      {/* summary */}
      <div
        className={`xl:order-2 order-1 xl:w-3/12 lg:w-1/2 w-full space-y-3 bg-BACKGROUNDGRAY text-BLACK p-3 border border-gray-300 ml-auto ${
          summaryFixed ? "xl:sticky top-2 right-10" : "static"
        }`}
      >
        <p className="font-semibold text-xl">{t("Order Summary")}</p>
        <hr className="w-full" />
        <p className="w-full flex items-center justify-between text-base">
          <span className="font-normal">{t("Subtotal")}</span>
          <span className="ml-auto font-semibold text-base">
            ${parseFloat(subTotal).toFixed(2)}{" "}
          </span>
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
          </span>{" "}
        </p>
        <hr className="w-full" />
        <div className="w-full flex items-center justify-between gap-2 text-2xl font-bold">
          <p>{t("Grand Total")}</p>
          <p className="ml-auto">${parseFloat(grandTotal).toFixed(2)}</p>
        </div>
        <hr className="w-full" />
        {grandTotal < minOrderAmount && (
          <p className="text-DARKRED text-center font-semibold">
            Minimum Order Of ${minOrderAmount}.00
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            handleChangeComonent();
          }}
          className="font-semibold bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY border border-PRIMARY duration-300 ease-in-out w-full p-3 text-center"
          disabled={
            loading ||
            deleteLoading ||
            updateLoading ||
            grandTotal < minOrderAmount
          }
        >
          {t("Proceed to checkout")}
        </button>
        <p>
          <Link
            to={
              productListingPageLink === ""
                ? "/product-listing/all-products"
                : productListingPageLink
            }
            state={{ title: "all-products", price: null, searchQuery: "" }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <button
              type="button"
              className="font-semibold bg-black text-white hover:bg-white hover:text-black border border-black duration-300 ease-in-out w-full p-3 text-center"
              disabled={loading || deleteLoading || updateLoading}
            >
              {t("Continue to shopping")}
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ShoppingCart;
