import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleGetUserFavourites } from "../redux/FavouriteSlice";
import Favourite from "../components/Favourite";
import FavouriteForMobile from "../components/FavouriteForMobile";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  handleAddMultipleProductToCart,
  handleAddMultipleProducts,
  handleChangeAddProduct,
  handleRemoveAllProducts,
  handleRemoveAllTotalQuantityAndTotalAmount,
  handlechangeTotalQuantityAndAmountOfmultipleProducts,
} from "../redux/CartSlice";
import { toast } from "react-hot-toast";
import { handleLogoutReducer } from "../redux/AuthSlice";
import { handleLogout } from "../redux/GlobalStates";

const Favourites = () => {
  const [countTotalQuantity, setCountTotalQuantity] = useState([]);

  const { t } = useTranslation();

  const { token } = useSelector((state) => state.Auth);

  const { productListingPageLink } = useSelector((state) => state.globalStates);

  const favourites = useSelector((state) => state.favourite);

  const {
    multipleLoading,
    loading,
    cartItems,
    cart,
    selectedItems,
    totalQuantityMultipleProducts,
    totalAmountMultipleProducts,
  } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const AbortControllerRef = useRef(null);

  useEffect(() => {
    const response = dispatch(handleGetUserFavourites({ token }));
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
        }
      });
    }
    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);

  // selected multiple items to cart
  const handleAddSelectedItem = async (
    pkQuantity,
    ctnQuantity,
    id,
    itemType,
    pkCount,
    ctnCount,
    amount
  ) => {
    if (pkQuantity !== "" || ctnQuantity !== "") {
      const item = {};
      const itemForQuantity = {};
      if (pkQuantity !== "" || ctnQuantity !== "") {
        item.id = id;
        item.quantity = itemType === "pk" ? pkCount : ctnCount;
        item.type = itemType;
        itemForQuantity.id = id;
        itemForQuantity.quantity = itemType === "pk" ? pkQuantity : ctnQuantity;
        itemForQuantity.type = itemType;
        itemForQuantity.amount = itemForQuantity.quantity * amount;
      }
      // for filter same id product with max quantity
      const selectedItemProducts = [...selectedItems, item];
      let arr = [];
      arr.push(selectedItemProducts);
      const result = Object.values(
        arr.flat(1).reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {})
      );
      dispatch(
        handleAddMultipleProducts(result.filter((i) => i.quantity !== 0))
      );

      // for count total quanitty
      const countTotalQuantityOfProducts = [
        ...countTotalQuantity,
        itemForQuantity,
      ];
      let arr2 = [];
      arr2.push(countTotalQuantityOfProducts);
      const result2 = Object.values(
        arr2.flat(1).reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {})
      );

      const filteredQuantityAndAmount = result2.filter((i) => i.quantity !== 0);

      const totalQuantity = filteredQuantityAndAmount.reduce((acc, curr) => {
        return acc + curr?.quantity;
      }, 0);
      const totalAmount = filteredQuantityAndAmount.reduce((acc, curr) => {
        return acc + curr?.amount;
      }, 0);
      dispatch(
        handlechangeTotalQuantityAndAmountOfmultipleProducts({
          totalQuantity,
          totalAmount,
        })
      );
      setCountTotalQuantity(result2.filter((i) => i.quantity !== 0));
    }
  };

  // add multiple product api handle
  const handleSubmitMulitpleProductToCart = () => {
    if (selectedItems.length === 0) {
      toast.dismiss();
      return toast.error("Please add some quantity to products");
    } else {
      const response = dispatch(
        handleAddMultipleProductToCart({
          token,
          signal: AbortControllerRef,
          products: selectedItems,
        })
      );
      if (response) {
        response
          .then((res) => {
            if (res.payload.status === "success") {
              toast.success("Products Added to cart.");
              dispatch(
                handleChangeAddProduct({
                  quantity: totalQuantityMultipleProducts,
                  amount: totalAmountMultipleProducts,
                })
              );
              setCountTotalQuantity([]);
              dispatch(handleAddMultipleProducts([]));
              dispatch(handleRemoveAllProducts());
              dispatch(handleRemoveAllTotalQuantityAndTotalAmount());
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <>
      <Helmet title={t("Favorites | Dollar Empire")} />
      <section className="bg-BACKGROUNDGRAY w-full lg:pb-20 pb-10">
        <div className="container mx-auto space_for_div space-y-5 w-full bg-BACKGROUNDGRAY lg:pb-20 pb-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="block font-semibold md:text-4xl text-2xl text-left py-1">
              {t("Your Favourites")}
            </h1>
            <button
              type="button"
              className="w-48 text-sm px-1 bg-PRIMARY text-white text-center xl:h-14 h-12 ml-auto"
              disabled={multipleLoading}
              onClick={() => {
                handleSubmitMulitpleProductToCart();
              }}
            >
              {multipleLoading ? (
                t("loading").concat("...")
              ) : (
                <>
                  <BsPlus className="w-6 h-6 inline-block" />
                  {t("Add Selected items to")}
                  <AiOutlineShoppingCart className="h-5 w-5 inline-block" />
                </>
              )}
            </button>
          </div>

          {/* table  desk & tablet*/}
          <div
            key="forDesk"
            className="w-full hidden lg:inline-block xl:overflow-hidden overflow-x-scroll scrollbar"
          >
            <table className="w-full">
              <thead className="bg-PRIMARY text-white p-2 w-full">
                <tr>
                  <th className="w-40 lg:p-3 p-2 font-semibold text-left text-base">
                    {t("Image")}
                  </th>
                  <th className="lg:min-w-[20rem] min-w-[10rem] lg:p-3 p-2 font-semibold text-left text-base">
                    {t("Product")}
                  </th>
                  <th className="xl:min-w-[5rem] md:min-w-[8rem] min-w-[5rem] lg:p-3 p-2 font-semibold text-left text-base">
                    {t("Item no")}.
                  </th>
                  <th className="lg:p-3 p-2 font-semibold text-left text-base">
                    {t("Packing")}
                  </th>
                  <th className="text-left min-w-[5rem]">{t("Remove")}</th>
                </tr>
              </thead>
              <tbody>
                {favourites?.loading ? (
                  <tr>
                    <td
                      className="font-semibold md:text-3xl text-xl text-center mx-auto p-3 w-full"
                      colSpan="100%"
                    >
                      <Skeleton
                        className="w-full md:h-40 h-28 mb-2"
                        baseColor="lightgray"
                        highlightColor="white"
                        borderRadius="10px"
                        duration={0.8}
                      />
                      <Skeleton
                        className="w-full md:h-40 h-28 mb-2"
                        baseColor="lightgray"
                        highlightColor="white"
                        borderRadius="10px"
                        duration={0.8}
                      />
                      <Skeleton
                        className="w-full md:h-40 h-28"
                        baseColor="lightgray"
                        highlightColor="white"
                        borderRadius="10px"
                        duration={0.8}
                      />
                    </td>
                  </tr>
                ) : favourites?.favourites.length === 0 ? (
                  <tr>
                    <td
                      className="font-semibold md:text-3xl text-xl text-center mx-auto p-3 w-full"
                      colSpan="100%"
                    >
                      {t("No Favourites here")}.
                    </td>
                  </tr>
                ) : (
                  favourites?.favourites.map((favourite) => (
                    <tr
                      className="bg-white font-normal text-base border-b border-gray-200"
                      key={favourite?._id}
                    >
                      <Favourite
                        handleAddSelectedItem={handleAddSelectedItem}
                        favourite={favourite}
                      />
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* for mobile table */}
          <div key="forMobile" className="w-full overflow-hidden lg:hidden wf">
            <table className="flex flex-row bg-white w-full">
              <tbody className="flex flex-col w-full">
                {favourites?.loading ? (
                  <tr>
                    <td
                      className="font-semibold md:text-3xl text-xl text-center mx-auto p-3 w-full"
                      colSpan="100%"
                    >
                      {t("loading").concat("...")}
                    </td>
                  </tr>
                ) : favourites?.favourites.length === 0 ? (
                  <tr>
                    <td
                      className="font-semibold md:text-3xl text-xl text-center mx-auto p-3 w-full"
                      colSpan="100%"
                    >
                      {t("No Favourites here")}.
                    </td>
                  </tr>
                ) : (
                  favourites?.favourites.map((favourite) => (
                    <FavouriteForMobile
                      handleAddSelectedItem={handleAddSelectedItem}
                      key={favourite?._id}
                      favourite={favourite}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* btns */}
          <div className="flex flex-row gap-y-2 items-center justify-end">
            <div className="flex gap-x-2">
              <Link
                to={
                  productListingPageLink === ""
                    ? "/product-listing/all-products"
                    : productListingPageLink
                }
                state={{ title: "all-products", price: null, searchQuery: "" }}
                className="ml-auto"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <button
                  type="button"
                  className="font-semibold px-2 bg-black text-white hover:bg-white hover:text-black border border-black duration-300 ease-in-out w-full xl:h-14 h-12 text-center"
                  disabled={loading}
                >
                  {t("Continue to shopping")}
                </button>
              </Link>
              <button
                type="button"
                className="w-48 float-right text-sm px-1 bg-PRIMARY text-white text-center xl:h-14 h-12 ml-auto"
                disabled={multipleLoading}
                onClick={() => {
                  handleSubmitMulitpleProductToCart();
                }}
              >
                {multipleLoading ? (
                  t("loading").concat("...")
                ) : (
                  <>
                    <BsPlus className="w-6 h-6 inline-block" />
                    {t("Add Selected items to")}
                    <AiOutlineShoppingCart className="h-5 w-5 inline-block" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Favourites;
