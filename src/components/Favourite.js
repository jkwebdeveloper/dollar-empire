import React, { useEffect, useRef, useState } from "react";
import BaseUrl from "../BaseUrl";
import { useTranslation } from "react-i18next";
import {
  handleGetUserFavourites,
  handleRemoveProductToFavourites,
} from "../redux/FavouriteSlice";
import {
  handleAddProductToCart,
  handleChangeAddProduct,
  handleRemoveItemFromCart,
  handleRemoveProductToCart,
  handleUpdateTotalQuantityAndAmount,
} from "../redux/CartSlice";
import { toast } from "react-hot-toast";
import {
  AiOutlineClose,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleChangeActiveComponent } from "../redux/GlobalStates";
import { useCallback } from "react";

const Favourite = ({ favourite, handleAddSelectedItem }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState("pk");
  const [pkitemsQuantity, setpkItemsQuantity] = useState("");
  const [ctnItemQuantity, setCtnItemQuantity] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [findInCart, setFindInCart] = useState(null);
  const [pkCount, setPkCount] = useState(null);
  const [ctnCount, setCtnCount] = useState(null);
  const [changeTo, setChangeTo] = useState(false);
  const [changingLoading, setChangingLoading] = useState(false);
  const [alreadyInCartPkCount, setAlreadyInCartPkCount] = useState(null);
  const [alreadyInCartCtnCount, setAlreadyInCartCtnCount] = useState(null);
  const [alreadyInCartPkItems, setAlreadyInCartPkItems] = useState("");
  const [alreadyInCartCtnItems, setAlreadyInCartCtnItems] = useState("");

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);
  const pkRef = useRef(null);
  const ctnRef = useRef(null);

  const { token, user } = useSelector((state) => state.Auth);

  const { favourites } = useSelector((state) => state.favourite);
  const { cartItems, loading, selectedItems } = useSelector(
    (state) => state.cart
  );

  const dispatch = useDispatch();

  const handleRemoveFromFavourties = (id) => {
    setDeleteLoading(true);
    setDeleteProductId(id);
    const response = dispatch(
      handleRemoveProductToFavourites({ token, id, signal: AbortControllerRef })
    );
    if (response) {
      response
        .then((res) => {
          dispatch(handleGetUserFavourites({ token }));
          toast.success(res.payload.message);
          setDeleteLoading(false);
        })
        .catch((err) => {
          toast.error(err.payload.message);
          setDeleteLoading(false);
        });
    }
  };

  const handleAddProduct = (id, title, quantity, amount) => {
    if (
      (pkitemsQuantity === "" || pkCount === 0) &&
      (ctnItemQuantity === "" || ctnCount === 0)
    ) {
      toast.dismiss();
      setCtnItemQuantity("");
      setpkItemsQuantity("");
      setPkCount(null);
      setCtnCount(null);
      setAlreadyInCartCtnCount(null);
      setAlreadyInCartPkCount(null);
      setAlreadyInCartCtnItems("");
      setAlreadyInCartPkItems("");
      return toast.error("Please add some quantity And enter valid value.");
    } else if (selectedItemType === "pk" && ctnItemQuantity > 0) {
      toast.dismiss();
      toast.error("Please enter quantity in PK, you choose PK");
      setCtnItemQuantity("");
      setCtnCount(0);
      setAlreadyInCartCtnCount(null);
      setAlreadyInCartCtnItems("");
      return true;
    } else if (selectedItemType === "ctn" && pkitemsQuantity > 0) {
      toast.dismiss();
      toast.error("Please enter quantity in CTN, you choose CTN");
      setpkItemsQuantity("");
      setPkCount(0);
      setAlreadyInCartPkCount(null);
      setAlreadyInCartPkItems("");
      return true;
    } else if (
      !/^\d+$/.test(pkitemsQuantity !== "" ? pkitemsQuantity : ctnItemQuantity)
    ) {
      toast.dismiss();
      setpkItemsQuantity("");
      setCtnItemQuantity("");
      setPkCount(null);
      setCtnCount(null);
      setAlreadyInCartCtnCount(null);
      setAlreadyInCartPkCount(null);
      setAlreadyInCartCtnItems("");
      setAlreadyInCartPkItems("");
      return toast.error("Please enter valid value");
    }
    setSelectedProductId(favourite?._id);
    const response = dispatch(
      handleAddProductToCart({
        token,
        id,
        signal: AbortControllerRef,
        type: selectedItemType,
        quantity: selectedItemType === "pk" ? pkCount : ctnCount,
      })
    );
    if (response) {
      response
        .then((res) => {
          if (res.payload.status === "success") {
            setCtnItemQuantity("");
            setpkItemsQuantity("");
            setSelectedItemType("pk");
            setSelectedProductId(null);
            setPkCount(null);
            setCtnCount(null);
            setAlreadyInCartCtnCount(null);
            setAlreadyInCartPkCount(null);
            setAlreadyInCartCtnItems("");
            setAlreadyInCartPkItems("");
            toast.success(`${title} added to cart successfully.`);
            dispatch(handleChangeAddProduct({ quantity, amount }));
          }
        })
        .catch((err) => {
          toast.error(err.payload.message);
        });
    }
  };

  const handlePlusPkQuantity = (quantity, count, id) => {
    if (id === favourite?._id && findInCart?.type === "pk") {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
    }
    if (findInCart?.product?._id !== favourite?._id) {
      setSelectedItemType("pk");
      pkRef.current.checked = true;
      setPkCount(count);
      setpkItemsQuantity(quantity * count);
    }
  };

  const handleMinusPkQuantity = (quantity, count, id) => {
    if (id === favourite?._id && findInCart?.product?._id !== id) {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
    }
    if (findInCart?.product?._id !== favourite?._id) {
      setSelectedItemType("pk");
      pkRef.current.checked = true;
      if (pkCount === 0 || pkCount == null) {
        setPkCount(0);
      } else {
        setPkCount(count);
        setpkItemsQuantity(quantity * count);
      }
    }
  };

  const handlePlusCTNQuantity = (quantity, count, id) => {
    if (id === favourite?._id && findInCart?.product?._id !== id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
    }
    if (findInCart?.product?._id !== favourite?._id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
      setCtnCount(count);
      setCtnItemQuantity(quantity * count);
    }
  };

  const handleMinusCTNQuantity = (quantity, count, id) => {
    if (id === favourite?._id && findInCart?.product?._id !== id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
    }
    if (findInCart?.product?._id !== favourite?._id) {
      setSelectedItemType("ctn");
      ctnRef.current.checked = true;
      if (ctnCount === 0 || ctnCount === null) {
        setCtnCount(0);
      } else {
        setCtnCount(count);
        setCtnItemQuantity(quantity * count);
      }
    }
  };

  const handleChangeAddedItemInCart = (action, type, value) => {
    if (findInCart !== null && findInCart?.product?._id === favourite?._id) {
      if (findInCart?.type === type) {
        setChangeTo(true);
        setFindInCart({
          ...findInCart,
          quantity: value,
        });
      } else {
        toast.remove();
        toast.error(`Please change quantity in ${findInCart?.type}`);
        return true;
      }
    }
  };

  const handleSubmitAddProduct = () => {
    if (!loading && favourite?._id !== findInCart?.product?._id) {
      handleAddProduct(
        favourite?._id,
        favourite?.name,
        selectedItemType === "pk" ? pkitemsQuantity : ctnItemQuantity,
        selectedItemType === "pk"
          ? pkitemsQuantity * favourite?.price
          : ctnItemQuantity * favourite?.price
      );
    } else if (
      changeTo &&
      findInCart !== null &&
      favourite?._id === findInCart?.product?._id
    ) {
      if (alreadyInCartPkCount === 0 || alreadyInCartCtnCount === 0) {
        const response = dispatch(
          handleRemoveProductToCart({
            token,
            id: favourite?._id,
            signal: AbortControllerRef,
          })
        );
        setChangingLoading(true);
        if (response) {
          response
            .then((res) => {
              if (res.payload.status === "success") {
                toast.success(
                  `${findInCart?.product?.name} removed from cart.`
                );
                dispatch(handleRemoveItemFromCart(findInCart?.product?._id));
                setAlreadyInCartPkCount(null);
                setAlreadyInCartCtnCount(null);
                setAlreadyInCartPkItems("");
                setAlreadyInCartCtnItems("");
                setPkCount(null);
                setCtnCount(null);
                setChangeTo(false);
              }
              setChangingLoading(false);
            })
            .catch((err) => {
              toast.error(err.payload.message);
              setChangingLoading(false);
              setChangeTo(false);
            });
        }
      } else {
        const response = dispatch(
          handleAddProductToCart({
            token,
            id: findInCart?.product?._id,
            signal: AbortControllerRef,
            type: findInCart?.type,
            quantity:
              findInCart?.type === "pk"
                ? alreadyInCartPkCount
                : alreadyInCartCtnCount,
          })
        );
        setChangingLoading(true);

        if (response) {
          response
            .then((res) => {
              if (res.payload.status === "success") {
                toast.success(
                  `${findInCart?.product?.name}'s quantity updated.`
                );
                dispatch(
                  handleUpdateTotalQuantityAndAmount({
                    quantity:
                      findInCart?.type === "pk"
                        ? alreadyInCartPkCount
                        : alreadyInCartCtnCount,
                    id: findInCart?.product?._id,
                  })
                );
                setChangingLoading(false);
                setChangeTo(false);
                setAlreadyInCartPkCount(null);
                setAlreadyInCartCtnCount(null);
                setAlreadyInCartPkItems("");
                setAlreadyInCartCtnItems("");
                setPkCount(null);
                setCtnCount(null);
              }
            })
            .catch((err) => {
              toast.error(err.payload.message);
              setChangingLoading(false);
              setChangeTo(false);
            });
        }
      }
    } else {
      dispatch(handleChangeActiveComponent("Shopping Cart"));
    }
  };

  const handleOnchangePkCountField = (e) => {
    setSelectedItemType("pk");
    pkRef.current.checked = true;

    if (!/^(?=.*[1-9])\d{1,8}(?:\.\d\d?)?$/.test(e.target.value)) {
      toast.remove();
      toast.error("Please enter valid value and value can't be less than zero");
      setPkCount(null);
      setpkItemsQuantity("");
      setAlreadyInCartPkCount(null);
      setAlreadyInCartPkItems("");
      return true;
    }
    if (e.target.value.length > 6) {
      toast.remove();
      toast.error("Can't add more than 6 numbers ");
      return true;
    }
    if (
      !loading &&
      selectedProductId?._id !== favourite?._id &&
      findInCart?.product?._id !== favourite?._id
    ) {
      setPkCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setpkItemsQuantity(
        parseFloat(e.target.value.replace(/^0+/, "") * favourite?.PK)
      );
    }
    if (
      !loading &&
      selectedProductId?._id !== favourite?._id &&
      findInCart?.product?._id === favourite?._id
    ) {
      setChangeTo(true);
      setAlreadyInCartPkCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setAlreadyInCartPkItems(
        parseFloat(e.target.value.replace(/^0+/, "") * favourite?.PK)
      );
    }
  };

  const handleOnchangeCtnCountField = (e) => {
    setSelectedItemType("ctn");
    ctnRef.current.checked = true;

    if (!/^(?=.*[1-9])\d{1,8}(?:\.\d\d?)?$/.test(e.target.value)) {
      toast.remove();
      toast.error("Please enter valid value and value can't be less than zero");
      setCtnCount(null);
      setCtnItemQuantity("");
      setAlreadyInCartCtnCount(null);
      setAlreadyInCartCtnItems("");
      return true;
    }
    if (e.target.value.length > 6) {
      toast.remove();
      toast.error("Can't add more than 6 numbers ");
      return true;
    }
    if (!loading && selectedProductId?._id !== favourite?._id) {
      setCtnCount(e.target.value.replace(/^0+/, ""));
      setCtnItemQuantity(e.target.value.replace(/^0+/, "") * favourite?.CTN);
    }
    if (
      !loading &&
      selectedProductId?._id !== favourite?._id &&
      findInCart?.product?._id === favourite?._id
    ) {
      setChangeTo(true);
      setAlreadyInCartCtnCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setAlreadyInCartCtnItems(
        parseFloat(e.target.value.replace(/^0+/, "") * favourite?.CTN)
      );
    }
  };

  const handleOnClickFieldForBoth = (action, type) => {
    if (type === "pk") {
      if (
        !loading &&
        selectedProductId !== favourite?._id &&
        findInCart?.product?._id !== favourite?._id
      ) {
        if (action === "minus") {
          handleMinusPkQuantity(
            parseFloat(favourite?.PK),
            parseFloat(pkCount - 1),
            favourite?._id
          );
        } else {
          if (pkCount !== null && pkCount.toString().length >= 6) {
            toast.remove();
            toast.error("Can't add more than 6 numbers ");
            return true;
          }
          handlePlusPkQuantity(
            parseFloat(favourite?.PK),
            parseFloat(pkCount === null ? 1 : pkCount + 1),
            favourite?._id
          );
        }
      } else if (
        !loading &&
        selectedProductId !== favourite?._id &&
        findInCart?.product?._id === favourite?._id
      ) {
        if (findInCart?.type !== type) {
          toast.remove();
          toast.error("Please change in ctn quantity");
          return true;
        } else {
          setChangeTo(true);
          if (action === "minus") {
            if (alreadyInCartPkCount === 0 && alreadyInCartPkCount !== null) {
              return true;
            }
            if (alreadyInCartPkCount !== null) {
              setAlreadyInCartPkCount(parseFloat(alreadyInCartPkCount) - 1);
              setAlreadyInCartPkItems(
                parseFloat(favourite?.PK) * parseFloat(alreadyInCartPkCount - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(alreadyInCartPkCount) - 1
              );
            } else {
              setAlreadyInCartPkCount(parseFloat(findInCart?.quantity) - 1);
              setAlreadyInCartPkItems(
                parseFloat(favourite?.PK) * parseFloat(findInCart?.quantity - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(findInCart?.quantity) - 1
              );
            }
          } else if (action === "plus") {
            if (
              alreadyInCartPkCount !== null &&
              alreadyInCartPkCount.toString().length >= 6
            ) {
              toast.remove();
              toast.error("Can't add more than 6 numbers ");
              return true;
            }
            if (alreadyInCartPkCount !== null) {
              setAlreadyInCartPkCount(parseFloat(alreadyInCartPkCount) + 1);
              setAlreadyInCartPkItems(
                parseFloat(favourite?.PK) * parseFloat(alreadyInCartPkCount + 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(alreadyInCartPkCount) + 1
              );
            } else {
              setAlreadyInCartPkCount(parseFloat(findInCart?.quantity) + 1);
              setAlreadyInCartPkItems(
                parseFloat(favourite?.PK) * parseFloat(findInCart?.quantity + 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(findInCart?.quantity) + 1
              );
            }
          }
        }
      }
    } else if (type === "ctn") {
      if (
        !loading &&
        selectedProductId !== favourite?._id &&
        findInCart?.product?._id !== favourite?._id
      ) {
        if (action === "minus") {
          handleMinusCTNQuantity(
            parseFloat(favourite?.CTN),
            parseFloat(ctnCount !== null && ctnCount - 1),
            favourite?._id
          );
        } else {
          if (ctnCount !== null && ctnCount.toString().length >= 6) {
            toast.remove();
            toast.error("Can't add more than 6 numbers ");
            return true;
          }
          handlePlusCTNQuantity(
            parseFloat(favourite?.CTN),
            parseFloat(ctnCount === null ? 1 : ctnCount + 1),
            favourite?._id
          );
        }
      } else if (
        !loading &&
        selectedProductId !== favourite?._id &&
        findInCart?.product?._id === favourite?._id &&
        type === "ctn"
      ) {
        if (findInCart?.type !== type) {
          toast.remove();
          toast.error("Please change in pk quantity");
          return true;
        } else {
          setChangeTo(true);
          if (action === "minus") {
            if (alreadyInCartCtnCount === 0 && alreadyInCartCtnCount !== null) {
              return true;
            }
            if (alreadyInCartCtnCount !== null) {
              setAlreadyInCartCtnCount(parseFloat(alreadyInCartCtnCount) - 1);
              setAlreadyInCartCtnItems(
                parseFloat(favourite?.CTN) *
                  parseFloat(alreadyInCartCtnCount - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "ctn",
                parseFloat(alreadyInCartCtnCount) - 1
              );
            } else {
              setAlreadyInCartCtnCount(parseFloat(findInCart?.quantity) - 1);
              setAlreadyInCartCtnItems(
                parseFloat(favourite?.CTN) *
                  parseFloat(findInCart?.quantity - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "ctn",
                parseFloat(findInCart?.quantity) - 1
              );
            }
          } else {
            if (
              alreadyInCartCtnCount !== null &&
              alreadyInCartCtnCount.toString().length >= 6
            ) {
              toast.remove();
              toast.error("Can't add more than 6 numbers ");
              return true;
            }
            if (alreadyInCartCtnCount !== null) {
              setAlreadyInCartCtnCount(parseFloat(alreadyInCartCtnCount) + 1);
              setAlreadyInCartCtnItems(
                parseFloat(favourite?.CTN) *
                  parseFloat(alreadyInCartCtnCount + 1)
              );
              handleChangeAddedItemInCart(
                null,
                "ctn",
                parseFloat(alreadyInCartCtnCount) + 1
              );
            } else {
              setAlreadyInCartCtnCount(parseFloat(findInCart?.quantity) + 1);
              setAlreadyInCartCtnItems(
                parseFloat(favourite?.CTN) *
                  parseFloat(findInCart?.quantity + 1)
              );
              handleChangeAddedItemInCart(
                null,
                "ctn",
                parseFloat(findInCart?.quantity) + 1
              );
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    if (handleAddSelectedItem !== "") {
      handleAddSelectedItem(
        pkitemsQuantity,
        ctnItemQuantity,
        favourite?._id,
        selectedItemType,
        pkCount,
        ctnCount,
        favourite?.price
      );
    }
  }, [pkitemsQuantity, ctnItemQuantity, selectedItemType]);

  // find in cart
  useEffect(() => {
    if (
      favourites.length !== 0 &&
      cartItems.length > 0 &&
      !changingLoading &&
      !loading
    ) {
      const findItemInCart = cartItems.find(
        (i) => i.product?._id === favourite?._id
      );
      if (findItemInCart !== undefined) {
        setFindInCart(findItemInCart);
        setPkCount(null);
        setCtnCount(null);
        setpkItemsQuantity("");
        setCtnItemQuantity("");
        if (findItemInCart?.type === "pk") {
          setAlreadyInCartPkItems(
            findItemInCart?.quantity * findItemInCart?.product?.PK
          );
          setAlreadyInCartPkCount(findItemInCart?.quantity);
        } else {
          setAlreadyInCartCtnItems(
            findItemInCart?.quantity * findItemInCart?.product?.CTN
          );
          setAlreadyInCartCtnCount(findItemInCart?.quantity);
        }
      }
    } else {
      setFindInCart(null);
    }
  }, [favourites, selectedItems, changingLoading]);

  // set checked if already in cart
  const findItems = useCallback(() => {
    if (
      findInCart?.product?._id === favourite?._id &&
      findInCart?.type === "pk"
    ) {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
    } else if (
      findInCart?.product?._id === favourite?._id &&
      findInCart?.type === "ctn"
    ) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
    } else if (
      findInCart?.product?._id !== favourite?._id &&
      pkRef.current !== null
    ) {
      pkRef.current.defaultChecked = true;
    }
  }, [findInCart]);

  useEffect(() => {
    findItems();
  });

  return (
    <>
      <td className="lg:p-3 p-2">
        <img
          src={BaseUrl.concat(favourite?.images[0])}
          alt={favourite.name}
          className="min-h-[6rem] min-w-[6rem] object-contain object-center"
        />
      </td>
      <td className="font-semibold lg:p-3 p-2 whitespace-nowrap">
        {favourite.name}
      </td>
      <td className="lg:p-3 p-2 ">#{favourite?.number}</td>
      <td className="lg:p-3 p-2 text-right">
        <div className="text-right w-full flex items-center justify-start gap-x-6">
          <p className="xl:w-4/12 w-3/12 whitespace-nowrap text-center">
            {favourite?.PK} PC/PK , {favourite?.CTN} PC/CTN
          </p>
          <div className="xl:w-7/12 w-8/12 space-y-3 text-right">
            <p className="font-bold text-sm text-right">
              {favourite?.PK} PC / PK, {favourite?.CTN} PC / CTN
            </p>
            <p className="font-bold text-sm text-right">
              ${favourite?.price}/PC, $
              {parseFloat(favourite?.price * favourite?.PK).toFixed(2)}
              /PK, $ {parseFloat(favourite?.price * favourite?.CTN).toFixed(2)}
              /CTN
            </p>
            {/* pk */}
            <div className="flex w-64 items-center gap-x-2 relative z-0 ml-auto">
              <input
                name={favourite?.name}
                type="radio"
                className="w-5 h-5"
                onChange={(e) => setSelectedItemType(e.target.value)}
                value="pk"
                ref={pkRef}
                disabled={
                  (loading && selectedProductId === favourite?._id) ||
                  findInCart?.product?._id === favourite?._id
                }
              />
              <span className="font-semibold text-xs whitespace-nowrap pr-2">
                PC
              </span>
              <div className="w-full relative z-0">
                <span
                  className={`absolute text-left top-1/2 w-full max-w-[4rem] text-sm ${
                    pkitemsQuantity === "" && alreadyInCartPkItems === ""
                      ? "text-gray-400 font-normal"
                      : "text-BLACK font-semibold"
                  } 
                    -translate-y-1/2 left-8`}
                >
                  {`${
                    pkitemsQuantity === "" && alreadyInCartPkItems === ""
                      ? favourite?.PK
                      : findInCart?.product?._id === favourite?._id
                      ? alreadyInCartPkItems
                      : pkitemsQuantity
                  } PC`}
                </span>
                <input
                  type="number"
                  className={`w-full text-right h-10 text-sm pr-12 pl-10 rounded-md outline-none border border-BORDERGRAY`}
                  placeholder="0"
                  value={
                    findInCart?.product?._id === favourite?._id &&
                    alreadyInCartPkCount !== null
                      ? alreadyInCartPkCount
                      : pkCount !== null && pkCount
                  }
                  min="0"
                  max="999999"
                  onChange={(e) => {
                    if (e.target.value.length > 6) {
                      toast.remove();
                      toast.error("Can't add more than 6 numbers");
                      return true;
                    }
                    handleOnchangePkCountField(e);
                  }}
                  disabled={
                    (loading && selectedProductId === favourite?._id) ||
                    findInCart?.type === "ctn"
                  }
                />
                <span className="font-semibold text-BLACK text-xs absolute top-1/2 -translate-y-1/2 right-8">
                  PK
                </span>
                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === favourite?._id) ||
                    findInCart?.type === "ctn"
                  }
                  className={`text-BLACK bg-blue-500 md:w-7 w-8 text-center h-full rounded-md absolute top-1/2 -translate-y-1/2 left-0`}
                  onClick={() => {
                    handleOnClickFieldForBoth("minus", "pk");
                  }}
                >
                  <AiOutlineMinus
                    disabled={
                      (!loading && selectedProductId === favourite?._id) ||
                      findInCart?.type === "ctn"
                    }
                    className="mx-auto"
                  />
                </button>
                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === favourite?._id) ||
                    findInCart?.type === "ctn"
                  }
                  className={`text-BLACK bg-blue-500 md:w-7 w-8 text-center h-full rounded-md absolute top-1/2 -translate-y-1/2 right-0`}
                  onClick={() => {
                    handleOnClickFieldForBoth("plus", "pk");
                  }}
                >
                  <AiOutlinePlus
                    disabled={
                      (!loading && selectedProductId === favourite?._id) ||
                      findInCart?.type === "ctn"
                    }
                    className="mx-auto"
                  />
                </button>
              </div>
            </div>
            {/* ctn */}
            <div className="flex w-64 items-center gap-x-2 relative z-0 ml-auto">
              <input
                name={favourite?.name}
                type="radio"
                className="w-5 h-5"
                onChange={(e) => setSelectedItemType(e.target.value)}
                value="ctn"
                ref={ctnRef}
                disabled={
                  (loading && selectedProductId === favourite?._id) ||
                  findInCart?.product?._id === favourite?._id
                }
              />
              <span className="font-semibold text-xs whitespace-nowrap">
                CTN
              </span>
              <div className="w-full relative z-0">
                <span
                  className={`absolute text-left top-1/2 w-full max-w-[4rem] text-sm ${
                    ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                      ? "text-gray-400 font-normal"
                      : "text-BLACK font-semibold"
                  }
                    -translate-y-1/2 left-8`}
                >
                  {`${
                    ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                      ? favourite?.CTN
                      : findInCart?.product?._id === favourite?._id
                      ? alreadyInCartCtnItems
                      : ctnItemQuantity
                  } PC`}
                </span>
                <input
                  type="number"
                  className={`w-full text-right h-10 text-sm pr-14 pl-10 rounded-md outline-none border border-BORDERGRAY`}
                  placeholder="0"
                  min="0"
                  max="999999"
                  value={
                    findInCart?.product?._id === favourite?._id &&
                    alreadyInCartCtnCount !== null
                      ? alreadyInCartCtnCount
                      : ctnCount !== null && ctnCount
                  }
                  onChange={(e) => {
                    if (e.target.value.length > 6) {
                      toast.remove();
                      toast.error("Can't add more than 6 numbers");
                      return true;
                    }
                    handleOnchangeCtnCountField(e);
                  }}
                  disabled={
                    (loading && selectedProductId === favourite?._id) ||
                    findInCart?.type === "pk"
                  }
                />
                <span className="font-semibold text-BLACK text-xs absolute top-1/2 -translate-y-1/2 right-8">
                  CTN
                </span>
                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === favourite?._id) ||
                    findInCart?.type === "pk"
                  }
                  className={`text-BLACK bg-blue-500 md:w-7 w-8 text-center h-full rounded-md absolute top-1/2 -translate-y-1/2 left-0`}
                  onClick={() => {
                    handleOnClickFieldForBoth("minus", "ctn");
                  }}
                >
                  <AiOutlineMinus
                    disabled={
                      (!loading && selectedProductId === favourite?._id) ||
                      findInCart?.type === "pk"
                    }
                    className="mx-auto"
                  />
                </button>
                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === favourite?._id) ||
                    findInCart?.type === "pk"
                  }
                  className={`text-BLACK bg-blue-500 md:w-7 w-8 text-center h-full rounded-md absolute top-1/2 -translate-y-1/2 right-0`}
                  onClick={() => {
                    handleOnClickFieldForBoth("plus", "ctn");
                  }}
                >
                  <AiOutlinePlus
                    disabled={
                      (!loading && selectedProductId === favourite?._id) ||
                      findInCart?.type === "pk"
                    }
                    className="mx-auto"
                  />
                </button>
              </div>
            </div>
            {/* btn */}
            <p className="md:w-8/12 w-full h-auto ml-auto">
              <Link
                to={
                  user === null
                    ? "/sign-in"
                    : findInCart !== null &&
                      favourite?._id === findInCart?.product?._id &&
                      !changeTo
                    ? "/cart"
                    : null
                }
                className="w-full"
              >
                {changingLoading && findInCart?.quantity !== 0 && changeTo ? (
                  <button
                    type="button"
                    className={` ${
                      findInCart?.product?._id === favourite?._id
                        ? "bg-REDPALE text-black"
                        : "bg-DARKRED text-white"
                    } text-center w-full p-2 rounded-lg`}
                    disabled={
                      (loading && selectedProductId === favourite?._id) ||
                      changingLoading
                    }
                  >
                    {t("Changing").concat("...")}
                  </button>
                ) : (changeTo &&
                    (alreadyInCartPkCount === 0 ||
                      alreadyInCartCtnCount === 0)) ||
                  changingLoading ? (
                  <button
                    type="button"
                    className={` ${
                      findInCart?.product?._id === favourite?._id
                        ? "bg-REDPALE text-black"
                        : "bg-DARKRED text-white"
                    } text-center w-full p-2 rounded-lg`}
                    disabled={loading && selectedProductId === favourite?._id}
                    onClick={() => {
                      handleSubmitAddProduct();
                    }}
                  >
                    {loading && selectedProductId === favourite?._id
                      ? t("Removing").concat("...")
                      : findInCart !== null &&
                        favourite?._id === findInCart?.product?._id &&
                        t("Remove from cart")}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={` ${
                      findInCart?.product?._id === favourite?._id
                        ? "bg-REDPALE text-black"
                        : "bg-DARKRED text-white"
                    } text-center w-full p-2 rounded-lg`}
                    onClick={() => handleSubmitAddProduct()}
                    disabled={loading && selectedProductId === favourite?._id}
                  >
                    {loading && selectedProductId === favourite?._id ? (
                      t("Adding").concat("...")
                    ) : findInCart !== null &&
                      favourite?._id === findInCart?.product?._id ? (
                      `${changeTo ? t("Change to") : t("Added")} ${
                        findInCart?.type === "pk"
                          ? alreadyInCartPkCount === null
                            ? findInCart?.quantity
                            : alreadyInCartPkCount
                          : alreadyInCartCtnCount === null
                          ? findInCart?.quantity
                          : alreadyInCartCtnCount
                      } ${findInCart?.type}`
                    ) : (
                      <>
                        {t("add_to_cart")}
                        <AiOutlineShoppingCart className="w-6 h-6 ml-1 inline-block" />
                      </>
                    )}
                  </button>
                )}
              </Link>
            </p>
          </div>
        </div>
      </td>
      {deleteLoading && deleteProductId === favourite?._id ? (
        <td className="text-center mx-auto text-3xl">...</td>
      ) : (
        <td>
          <AiOutlineClose
            role="button"
            className="h-6 w-6 mx-auto"
            onClick={() => handleRemoveFromFavourties(favourite?._id)}
          />
        </td>
      )}
    </>
  );
};

export default Favourite;
