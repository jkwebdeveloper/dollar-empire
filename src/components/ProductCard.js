import React, {
  Fragment,
  useRef,
  useState,
  memo,
  useEffect,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillHeart,
  AiOutlineClose,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEnlargeImagePopup,
  handleChangeActiveComponent,
  handleChangeEnlargeImageFrom,
  handleChangeEnlargeImageId,
  handleChangeSingleProductEnlargeImageId,
  handleLogout,
  handleSetSingelProductId,
  showEnlargeImagePopup,
  showPopup,
} from "../redux/GlobalStates";
import { useTranslation } from "react-i18next";
import BaseUrl from "../BaseUrl";
import {
  handleAddProductToFavourites,
  handleRemoveProductToFavourites,
} from "../redux/FavouriteSlice";
import { toast } from "react-hot-toast";
import {
  handleAddProductToCart,
  handleChangeAddProduct,
  handleRemoveFromTotalQuantityAndAmountOfmultipleProducts,
  handleRemoveItemFromCart,
  handleRemoveOneProductFromSelected,
  handleRemoveProductToCart,
  handleUpdateTotalQuantityAndAmount,
} from "../redux/CartSlice";
import "react-loading-skeleton/dist/skeleton.css";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";
import {
  handleChangeSingleProductId,
  handleGetProductById,
} from "../redux/ProductSlice";
import { motion, transform } from "framer-motion";
import { handleLogoutReducer } from "../redux/AuthSlice";
import ReactPlayer from "react-player";
import { IoIosPlayCircle } from "react-icons/io";

const ProductCard = ({
  product,
  title,
  selectedView,
  from,
  handleAddSelectedItem,
}) => {
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState("pk");
  const [pkitemsQuantity, setpkItemsQuantity] = useState("");
  const [ctnItemQuantity, setCtnItemQuantity] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [findInCart, setFindInCart] = useState(null);
  const [pkCount, setPkCount] = useState(null);
  const [ctnCount, setCtnCount] = useState(null);
  const [isFavourite, setisFavourite] = useState(false);
  const [activeEnlargeImage, setActiveEnlargeImage] = useState(0);
  const [changeTo, setChangeTo] = useState(false);
  const [changingLoading, setChangingLoading] = useState(false);
  const [alreadyInCartPkCount, setAlreadyInCartPkCount] = useState(null);
  const [alreadyInCartCtnCount, setAlreadyInCartCtnCount] = useState(null);
  const [alreadyInCartPkItems, setAlreadyInCartPkItems] = useState("");
  const [alreadyInCartCtnItems, setAlreadyInCartCtnItems] = useState("");
  const [typeOfenlarge, setTypeOfenlarge] = useState("");

  const { user, token } = useSelector((state) => state.Auth);

  const { allProductLoading, newArrivals } = useSelector(
    (state) => state.products
  );
  const {
    showProductDetailsPopup,
    showEnlargeImage,
    activeEnlargeImageId,
    activeEnlargeImageFrom,
    singleProductEnlargeImageId,
  } = useSelector((state) => state.globalStates);

  const { loading, cartItems, cart, selectedItems, success } = useSelector(
    (state) => state.cart
  );
  const AbortControllerRef = useRef(null);
  const popImageRef = useRef(null);
  const pkRef = useRef(null);
  const ctnRef = useRef(null);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleAddtoFavourties = (id) => {
    setFavouriteLoading(true);
    const response = dispatch(
      handleAddProductToFavourites({ token, id, signal: AbortControllerRef })
    );
    if (response) {
      response
        .then((res) => {
          if (res.payload.status === "success") {
            setisFavourite(!isFavourite);
            toast.success(`${product?.name} Added to favorites.`);
          } else if (res.payload.status === "fail") {
            toast.error(res.payload.message);
          }
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
          setFavouriteLoading(false);
        })
        .catch((err) => {
          toast.error(err.payload.message);
          setFavouriteLoading(false);
        });
    }
  };

  const handleRemoveFromFavourties = (id) => {
    setFavouriteLoading(true);
    const response = dispatch(
      handleRemoveProductToFavourites({
        token,
        id,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response
        .then((res) => {
          if (res.payload.status === "success") {
            setisFavourite(!isFavourite);
            toast.success(`${product?.name} Removed from favorites.`);
          } else {
            toast.error(res.payload.message);
          }
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
          setFavouriteLoading(false);
        })
        .catch((err) => {
          toast.error(err.payload.message);
          setFavouriteLoading(false);
        });
    }
  };

  const handleAddProduct = (id, title, quantity, amount) => {
    if (
      (pkitemsQuantity === "" || pkitemsQuantity === 0) &&
      (ctnItemQuantity === "" || ctnItemQuantity === 0)
    ) {
      toast.remove();
      setpkItemsQuantity("");
      setCtnItemQuantity("");
      setPkCount(null);
      setCtnCount(null);
      return toast.error(
        "Minimum Quantity should be more than 0 And enter a valid value."
      );
    } else if (selectedItemType === "pk" && ctnItemQuantity > 0) {
      toast.remove();
      toast.error("Please enter quantity in PK, you choose PK");
      setCtnItemQuantity("");
      setCtnCount(null);
      return true;
    } else if (selectedItemType === "ctn" && pkitemsQuantity > 0) {
      toast.remove();
      toast.error("Please enter quantity in CTN, you choose CTN");
      setpkItemsQuantity("");
      setPkCount(null);
      return true;
    } else if (
      !/^\d+$/.test(pkitemsQuantity !== "" ? pkitemsQuantity : ctnItemQuantity)
    ) {
      toast.remove();
      setpkItemsQuantity("");
      setCtnItemQuantity("");
      setPkCount(null);
      setCtnCount(null);
      return toast.error("Please enter valid value");
    }
    setSelectedProductId(id);
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
            toast.success(`${title} added to cart successfully.`);
            // dispatch(handleChangeAddProduct({ quantity, amount }));
            dispatch(
              handleRemoveFromTotalQuantityAndAmountOfmultipleProducts({
                quantity,
                amount,
              })
            );
            dispatch(handleRemoveOneProductFromSelected(product?._id));
            setCtnItemQuantity("");
            setpkItemsQuantity("");
            setPkCount(null);
            setCtnCount(null);
            setSelectedProductId(null);
          }
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
        })
        .catch((err) => {
          toast.error(err.payload.message);
        });
    }
  };

  function handleShowEnlargeImage(index) {
    dispatch(handleChangeEnlargeImageId(""));
    dispatch(handleChangeEnlargeImageFrom(""));
    if (index > 0) {
      setActiveEnlargeImage(index);
      dispatch(handleChangeEnlargeImageId(product?._id));
      dispatch(handleChangeEnlargeImageFrom(from));
    } else {
      setActiveEnlargeImage(0);
      dispatch(handleChangeEnlargeImageId(product?._id));
      dispatch(handleChangeEnlargeImageFrom(from));
    }
  }

  function handleShowSingleProductEnlargeImage(index) {
    dispatch(handleChangeSingleProductEnlargeImageId(""));
    if (index > 0) {
      setActiveEnlargeImage(index);
      dispatch(handleChangeSingleProductEnlargeImageId(product?._id));
    } else {
      setActiveEnlargeImage(0);
      dispatch(handleChangeSingleProductEnlargeImageId(product?._id));
    }
  }

  const handlePlusPkQuantity = (quantity, count, id) => {
    if (id === product?._id && findInCart?.product?._id !== id) {
      pkRef.current.checked = true;
      setSelectedItemType("ctn");
    }
    if (findInCart?.product?._id !== product?._id) {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
      setPkCount(count);
      setpkItemsQuantity(quantity * count);
    }
  };

  const handleMinusPkQuantity = (quantity, count, id) => {
    if (id === product?._id && findInCart?.product?._id !== id) {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
    }
    if (findInCart?.product?._id !== product?._id) {
      setSelectedItemType("pk");
      pkRef.current.checked = true;
      if (pkCount === 0 || pkCount == null) {
        setPkCount(0);
      } else {
        setPkCount(count);
        setpkItemsQuantity(quantity * count);
      }
    }
    if (id === product?._id && findInCart?.product?._id !== id) {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
    }
    if (findInCart?.product?._id !== product?._id) {
      setSelectedItemType("pk");
      pkRef.current.checked = true;
      if (pkCount === 0 || pkCount === null) {
        setPkCount(0);
      } else {
        setPkCount(count);
        setpkItemsQuantity(quantity * count);
      }
    }
  };

  const handlePlusCTNQuantity = (quantity, count, id) => {
    if (id === product?._id && findInCart?.product?._id !== id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
    }
    if (findInCart?.product?._id !== product?._id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
      setCtnCount(count);
      setCtnItemQuantity(quantity * count);
    }
  };

  const handleMinusCTNQuantity = (quantity, count, id) => {
    if (id === product?._id && findInCart?.product?._id !== id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
    }
    if (findInCart?.product?._id !== product?._id) {
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
    if (findInCart !== null && findInCart?.product?._id === product?._id) {
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
    if (!loading && product?._id !== findInCart?.product?._id) {
      handleAddProduct(
        product?._id,
        product?.name,
        selectedItemType === "pk" ? pkitemsQuantity : ctnItemQuantity,
        selectedItemType === "pk"
          ? pkitemsQuantity * product?.price
          : ctnItemQuantity * product?.price
      );
    } else if (
      changeTo &&
      findInCart !== null &&
      product?._id === findInCart?.product?._id
    ) {
      if (alreadyInCartPkCount === 0 || alreadyInCartCtnCount === 0) {
        const response = dispatch(
          handleRemoveProductToCart({
            token,
            id: product?._id,
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
      toast.error("Can't add more than 6 numbers");
      return true;
    }
    if (
      !loading &&
      selectedProductId?._id !== product?._id &&
      findInCart?.product?._id !== product?._id
    ) {
      setPkCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setpkItemsQuantity(
        parseFloat(e.target.value.replace(/^0+/, "") * product?.PK)
      );
    }
    if (
      !loading &&
      selectedProductId?._id !== product?._id &&
      findInCart?.product?._id === product?._id
    ) {
      setChangeTo(true);
      setAlreadyInCartPkCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setAlreadyInCartPkItems(
        parseFloat(e.target.value.replace(/^0+/, "") * product?.PK)
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
      toast.error("Can't add more than 6 numbers");
      return true;
    }
    if (
      !loading &&
      selectedProductId?._id !== product?._id &&
      findInCart?.product?._id !== product?._id
    ) {
      setCtnCount(e.target.value.replace(/^0+/, ""));
      setCtnItemQuantity(e.target.value.replace(/^0+/, "") * product?.CTN);
    }
    if (
      !loading &&
      selectedProductId?._id !== product?._id &&
      findInCart?.product?._id === product?._id
    ) {
      setChangeTo(true);
      setAlreadyInCartCtnCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setAlreadyInCartCtnItems(
        parseFloat(e.target.value.replace(/^0+/, "") * product?.CTN)
      );
    }
  };

  const handleOnClickFieldForBoth = (action, type) => {
    if (type === "pk") {
      if (
        !loading &&
        selectedProductId !== product?._id &&
        findInCart?.product?._id !== product?._id
      ) {
        if (action === "minus") {
          handleMinusPkQuantity(
            parseFloat(product?.PK),
            parseFloat(pkCount !== null && pkCount - 1),
            product?._id
          );
        } else {
          if (pkCount !== null && pkCount.toString().length >= 6) {
            toast.remove();
            toast.error("Can't add more than 6 numbers !!!");
            return true;
          }
          handlePlusPkQuantity(
            parseFloat(product?.PK),
            parseFloat(pkCount === null ? 1 : pkCount + 1),
            product?._id
          );
        }
      } else if (
        !loading &&
        selectedProductId !== product?._id &&
        findInCart?.product?._id === product?._id &&
        type === "pk"
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
                parseFloat(product?.PK) * parseFloat(alreadyInCartPkCount - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(alreadyInCartPkCount) - 1
              );
            } else {
              setAlreadyInCartPkCount(parseFloat(findInCart?.quantity) - 1);
              setAlreadyInCartCtnItems(
                parseFloat(product?.PK) * parseFloat(findInCart?.quantity - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(findInCart?.quantity) - 1
              );
            }
          } else {
            if (
              alreadyInCartPkCount !== null &&
              alreadyInCartPkCount.toString().length >= 6
            ) {
              toast.remove();
              toast.error("Can't add more than 6 numbers ");
              return true;
            }
            if (alreadyInCartCtnCount !== null) {
              setAlreadyInCartPkCount(parseFloat(alreadyInCartPkCount) + 1);
              setAlreadyInCartPkItems(
                parseFloat(product?.PK) * parseFloat(alreadyInCartPkCount + 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(alreadyInCartPkCount) + 1
              );
            } else {
              setAlreadyInCartPkCount(parseFloat(findInCart?.quantity) + 1);
              setAlreadyInCartPkItems(
                parseFloat(product?.PK) * parseFloat(findInCart?.quantity + 1)
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
        selectedProductId !== product?._id &&
        findInCart?.product?._id !== product?._id
      ) {
        if (action === "minus") {
          handleMinusCTNQuantity(
            parseFloat(product?.CTN),
            parseFloat(ctnCount !== null && ctnCount - 1),
            product?._id
          );
        } else {
          if (ctnCount !== null && ctnCount.toString().length >= 6) {
            toast.remove();
            toast.error("Can't add more than 6 numbers !!!");
            return true;
          }
          handlePlusCTNQuantity(
            parseFloat(product?.CTN),
            parseFloat(ctnCount === null ? 1 : ctnCount + 1),
            product?._id
          );
        }
      } else if (
        !loading &&
        selectedProductId !== product?._id &&
        findInCart?.product?._id === product?._id &&
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
                parseFloat(product?.CTN) * parseFloat(alreadyInCartCtnCount - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "ctn",
                parseFloat(alreadyInCartCtnCount) - 1
              );
            } else {
              setAlreadyInCartCtnCount(parseFloat(findInCart?.quantity) - 1);
              setAlreadyInCartCtnItems(
                parseFloat(product?.CTN) * parseFloat(findInCart?.quantity - 1)
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
                parseFloat(product?.CTN) * parseFloat(alreadyInCartCtnCount + 1)
              );
              handleChangeAddedItemInCart(
                null,
                "ctn",
                parseFloat(alreadyInCartCtnCount) + 1
              );
            } else {
              setAlreadyInCartCtnCount(parseFloat(findInCart?.quantity) + 1);
              setAlreadyInCartCtnItems(
                parseFloat(product?.CTN) * parseFloat(findInCart?.quantity + 1)
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

  const handleOpenPopup = () => {
    dispatch(showPopup());
    dispatch(handleGetProductById({ id: product?._id, token }));
  };

  // outside click close pop image
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popImageRef.current && !popImageRef.current.contains(event?.target)) {
        dispatch(closeEnlargeImagePopup());
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    dispatch(closeEnlargeImagePopup());
  }

  // find items already in cart
  useEffect(() => {
    if (cart !== null && cartItems.length > 0 && !changingLoading) {
      const findItemInCart = cartItems.find(
        (i) => i.product?._id === product?._id
      );
      if (findItemInCart !== undefined) {
        setFindInCart(findItemInCart);
        setPkCount(null);
        setpkItemsQuantity("");
        setCtnCount(null);
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
  }, [
    showProductDetailsPopup,
    selectedItems,
    changingLoading,
    allProductLoading,
  ]);

  // set product to favourite item
  useEffect(() => {
    setisFavourite(product?.isFavourite);
  }, [allProductLoading]);

  // add multiple items to cart handler
  useEffect(() => {
    if (handleAddSelectedItem !== "") {
      handleAddSelectedItem(
        pkitemsQuantity,
        ctnItemQuantity,
        product?._id,
        selectedItemType,
        pkCount,
        ctnCount,
        product?.price
      );
    }
  }, [
    pkitemsQuantity,
    ctnItemQuantity,
    selectedItemType,
    changingLoading,
    findInCart,
  ]);

  // clear input field after add to cart
  useEffect(() => {
    if (success && selectedProductId === product?._id) {
      setCtnItemQuantity("");
      setpkItemsQuantity("");
      setPkCount(0);
      setCtnCount(0);
    }
  }, [success]);

  // set checked if already in cart
  const findItems = useCallback(async () => {
    if (
      findInCart?.product?._id === product?._id &&
      findInCart?.type === "pk"
    ) {
      pkRef.current.checked = await true;
      setSelectedItemType("pk");
    } else if (
      findInCart?.product?._id === product?._id &&
      findInCart?.type === "ctn"
    ) {
      ctnRef.current.checked = await true;
      setSelectedItemType("ctn");
    } else if (
      findInCart?.product?._id === product?._id &&
      pkRef.current !== null
    ) {
      pkRef.current.defaultChecked = await true;
    }
  }, [findInCart]);

  useEffect(() => {
    findItems();
  }, [findInCart]);

  return (
    <>
      {selectedView === "gridsingle" ? (
        // single product grid view
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "keyframes",
            duration: 0.5,
          }}
          className={`lg:space-y-3 relative ${
            showEnlargeImage && product?._id === singleProductEnlargeImageId
              ? "z-40"
              : "z-0"
          } space-y-2 w-full xl:p-3 md:p-5 p-3 bg-white font-semibold md:text-lg border rounded-lg border-[#EAEAEA] flex xl:flex-row flex-col items-start justify-between`}
        >
          {showEnlargeImage && product?._id === singleProductEnlargeImageId && (
            <div className="absolute z-30 inset-0 bg-black bg-opacity-20 backdrop-blur-sm max-w-[100%] h-full" />
          )}
          {/* top seller label */}
          {title === "top-sellers" && (
            <p className="bg-PRIMARY text-white h-8 w-40 leading-8 align-middle text-center text-sm rounded-tl-lg absolute z-20 top-0 left-0">
              {t("Top Seller")}
            </p>
          )}

          {/* left side */}
          <div
            className={`h-auto xl:w-2/3 w-full relative ${
              showEnlargeImage && product?._id === singleProductEnlargeImageId
                ? "z-40"
                : "z-0"
            } flex md:flex-row flex-col md:items-start items-center justify-start xl:gap-5 gap-3`}
          >
            {/* img */}
            <img
              src={BaseUrl.concat(product?.images[0])}
              alt={product?.name}
              className="xl:w-48 md:h-60 md:w-1/2 w-full h-40 pb-10 cursor-pointer xl:object-fill object-contain object-center"
              title={product?.name}
              onClick={() => {
                handleOpenPopup();
              }}
              loading="lazy"
            />
            <div className="flex flex-wrap items-center gap-1 absolute md:bottom-0 bottom-[220px] left-9">
              {product?.images.map((image, index) => (
                <img
                  key={index}
                  src={BaseUrl.concat(image)}
                  className="h-10 w-10 border-2 border-PRIMARY p-2 rounded-lg cursor-pointer"
                  onClick={() => {
                    dispatch(showEnlargeImagePopup());
                    handleShowSingleProductEnlargeImage(index);
                    setTypeOfenlarge("image");
                  }}
                />
              ))}
              {product?.videos.map((video, index) => (
                <IoIosPlayCircle
                  key={index}
                  className="h-10 w-10 border-2 text-PRIMARY border-PRIMARY p-1 rounded-lg cursor-pointer"
                  onClick={() => {
                    dispatch(showEnlargeImagePopup());
                    handleShowSingleProductEnlargeImage(index);
                    setTypeOfenlarge("video");
                  }}
                />
              ))}
            </div>
            <MagnifyingGlassPlusIcon
              role="button"
              onClick={() => {
                dispatch(showEnlargeImagePopup());
                handleShowEnlargeImage();
              }}
              className="h-6 w-6 bg-white/40 absolute left-0 md:bottom-0 bottom-56 text-PRIMARY"
            />
            {singleProductEnlargeImageId === product?._id &&
              showEnlargeImage && (
                <div
                  ref={popImageRef}
                  className="absolute bg-black/30 z-50 xl:w-[30rem] md:w-[30rem] w-full md:min-h-[22rem] md:max-h-[22rem] min-h-[24rem] max-h-[24rem] xl:-top-32 md:-top-20 top-0 md:left-0 -left-2 backdrop-blur-sm"
                >
                  <AiOutlineClose
                    role="button"
                    onClick={() => {
                      dispatch(closeEnlargeImagePopup());
                    }}
                    className="absolute top-1 right-2 w-7 h-7 text-white z-50 bg-black/20"
                  />
                  {typeOfenlarge === "video" ? (
                    <ReactPlayer
                      url={product?.videos[activeEnlargeImage]}
                      style={{
                        maxWidth: "100%",
                        minWidth: "100%",
                        maxHeight: "100%",
                        minHeight: "100%",
                        position: "absolute",
                        inset: 0,
                        padding: "0.3rem 0.3rem 0.3rem 0.3rem",
                      }}
                      controls
                      playing
                    />
                  ) : (
                    <img
                      src={BaseUrl.concat(product?.images[activeEnlargeImage])}
                      alt={product?.name}
                      className="w-full h-full rounded-none object-contain object-center absolute top-0 p-2"
                      title={product?.name}
                      loading="lazy"
                    />
                  )}
                </div>
              )}
            {/* details */}
            {user === null ? (
              <div className="space-y-1 font-medium text-black w-full">
                <p className="text-PRIMARY font-semibold">
                  {t("ITEM NO")}.{product?.number}
                </p>
                <p
                  className="font-bold tracking-normal py-1"
                  title={product?.name}
                >
                  {product?.name}
                </p>
                <p className="font-normal tracking-normal pt-1">
                  {product?.shortDesc}
                </p>
                <p className="w-7/12">
                  <Link to="/sign-in" className="w-full">
                    <button
                      type="button"
                      className="bg-DARKRED text-white text-center w-full p-2 rounded-lg"
                    >
                      {t("login_to_order")}
                    </button>
                  </Link>
                </p>
              </div>
            ) : (
              <ul className="space-y-1 font-medium text-black w-full">
                <li className="text-PRIMARY font-semibold">
                  {t("ITEM NO")}.{product?.number}
                </li>
                <li
                  className="font-bold tracking-normal pt-1"
                  title={product?.name}
                >
                  {product?.name}
                </li>
                <li className="font-normal tracking-normal">
                  {product?.shortDesc}
                </li>
                <li className="text-BLACK md:text-sm text-base">
                  {product?.package}
                </li>
                <li className="text-BLACK md:text-sm text-base">
                  PK {t("volume")} : {product?.PKVolume} cu ft{" "}
                </li>
                <li className="text-BLACK md:text-sm text-base">
                  CTN {t("volume")} : {product?.CTNVolume} cu ft{" "}
                </li>
                <li className="text-BLACK md:text-sm text-base">
                  PK weight : {product?.PKWeight} Lbs{" "}
                </li>
                <li className="text-BLACK md:text-sm text-base">
                  CTN weight : {product?.CTNWeight} Lbs{" "}
                </li>
              </ul>
            )}
          </div>
          {/* right side */}
          {user !== null && (
            <div className="h-auto xl:w-auto w-full space-y-3 xl:text-right text-left">
              <p className="font-bold">
                {product?.PK} PC / PK,
                {product?.CTN} PC / CTN{" "}
              </p>
              <p className="font-bold md:text-lg">
                ${product?.price}/PC, $
                {(product?.price * product?.PK).toFixed(2)}
                /PK, ${(product?.price * product?.CTN).toFixed(2)}/CTN
              </p>
              {/* new pk */}
              <div className="flex xl:w-11/12 w-full items-center gap-x-2 relative z-0 ml-auto">
                <input
                  name={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  type="radio"
                  ref={pkRef}
                  className="md:w-6 md:h-6 w-7 h-7"
                  onChange={(e) => setSelectedItemType(e.target.value)}
                  defaultChecked={true}
                  value="pk"
                  id={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  disabled={
                    (loading && selectedProductId?._id === product?._id) ||
                    findInCart?.product?._id === product?._id
                  }
                />{" "}
                <span className="font-semibold text-sm whitespace-nowrap pr-2">
                  PK
                </span>
                <div className="w-full relative z-0">
                  <span
                    className={`absolute text-left top-1/2 w-fit sm:text-sm text-xs ${
                      pkitemsQuantity === "" && alreadyInCartPkItems === ""
                        ? "text-gray-400 font-normal"
                        : "text-BLACK font-semibold"
                    }
                    -translate-y-1/2 md:left-12 left-9`}
                  >
                    {`${
                      pkitemsQuantity === "" && alreadyInCartPkItems === ""
                        ? product?.PK
                        : findInCart?.product?._id === product?._id
                        ? alreadyInCartPkItems
                        : pkitemsQuantity
                    } PC`}
                  </span>
                  <input
                    type="number"
                    className={`w-full text-right h-10 sm:text-sm text-xs md:pr-16 pr-14 pl-12 rounded-md outline-none border border-BORDERGRAY`}
                    placeholder="0"
                    value={
                      findInCart?.product?._id === product?._id &&
                      alreadyInCartPkCount !== null
                        ? alreadyInCartPkCount
                        : pkCount !== null && pkCount
                    }
                    onChange={(e) => {
                      handleOnchangePkCountField(e);
                    }}
                    disabled={
                      (loading && selectedProductId === product?._id) ||
                      findInCart?.type === "ctn"
                    }
                  />
                  <span className="font-semibold text-BLACK text-xs absolute top-1/2 -translate-y-1/2 md:right-12 right-10">
                    PK
                  </span>
                  <button
                    type="button"
                    disabled={
                      (!loading && selectedProductId === product?._id) ||
                      findInCart?.type === "ctn"
                    }
                    className={`text-BLACK md:w-10 w-8 bg-blue-500 rounded-md h-full absolute top-1/2 -translate-y-1/2 left-0`}
                    onClick={() => {
                      handleOnClickFieldForBoth("minus", "pk");
                    }}
                  >
                    <AiOutlineMinus className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    type="button"
                    disabled={
                      (!loading && selectedProductId === product?._id) ||
                      findInCart?.type === "ctn"
                    }
                    className={`text-BLACK md:w-10 w-8 bg-blue-500 rounded-md h-full absolute top-1/2 -translate-y-1/2 right-0`}
                    onClick={() => {
                      handleOnClickFieldForBoth("plus", "pk");
                    }}
                  >
                    <AiOutlinePlus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
              {/* new ctn */}
              <div className="flex xl:w-11/12 w-full items-center gap-x-2 relative z-0 ml-auto">
                <input
                  name={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  type="radio"
                  ref={ctnRef}
                  className="md:w-6 md:h-6 w-7 h-7"
                  onChange={(e) => setSelectedItemType(e.target.value)}
                  value="ctn"
                  id={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  disabled={
                    (loading && selectedProductId?._id === product?._id) ||
                    findInCart?.product._id === product?._id
                  }
                />{" "}
                <span className="font-semibold text-sm whitespace-nowrap">
                  CTN
                </span>
                <div className="w-full relative z-0">
                  <span
                    className={`absolute text-left top-1/2 w-fit sm:text-sm text-xs ${
                      ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                        ? "text-gray-400 font-normal"
                        : "text-BLACK font-semibold"
                    }
                    -translate-y-1/2 md:left-12 left-9`}
                  >
                    {`${
                      ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                        ? product?.CTN
                        : findInCart?.product?._id === product?._id
                        ? alreadyInCartCtnItems
                        : ctnItemQuantity
                    } PC`}
                  </span>
                  <input
                    type="number"
                    className={`w-full h-10 text-right sm:text-sm text-xs md:pr-[68px] pr-16 pl-12 rounded-md outline-none border border-BORDERGRAY`}
                    placeholder="0"
                    value={
                      findInCart?.product?._id === product?._id &&
                      alreadyInCartCtnCount !== null
                        ? alreadyInCartCtnCount
                        : ctnCount !== null && ctnCount
                    }
                    onChange={(e) => {
                      handleOnchangeCtnCountField(e);
                    }}
                    disabled={
                      (loading && selectedProductId === product?._id) ||
                      findInCart?.type === "pk"
                    }
                  />
                  <span className="font-semibold text-BLACK text-xs absolute top-1/2 -translate-y-1/2 md:right-11 right-9">
                    CTN
                  </span>
                  <button
                    type="button"
                    disabled={
                      (!loading && selectedProductId === product?._id) ||
                      findInCart?.type === "pk"
                    }
                    className={`text-BLACK md:w-10 w-8 bg-blue-500 rounded-md h-full absolute top-1/2 -translate-y-1/2 left-0`}
                    onClick={() => {
                      handleOnClickFieldForBoth("minus", "ctn");
                    }}
                  >
                    <AiOutlineMinus className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    type="button"
                    disabled={
                      (!loading && selectedProductId === product?._id) ||
                      findInCart?.type === "pk"
                    }
                    className={`text-BLACK md:w-10 w-8 bg-blue-500 rounded-md h-full absolute top-1/2 -translate-y-1/2 right-0`}
                    onClick={() => {
                      handleOnClickFieldForBoth("plus", "ctn");
                    }}
                  >
                    <AiOutlinePlus className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* btn */}
              <p className="flex items-center gap-x-2">
                <Link
                  to={
                    user === null
                      ? "/sign-in"
                      : findInCart !== null &&
                        product?._id === findInCart?.product?._id &&
                        !changeTo
                      ? "/cart"
                      : null
                  }
                  className="w-11/12"
                >
                  {changingLoading && findInCart?.quantity !== 0 && changeTo ? (
                    <button
                      type="button"
                      className={` ${
                        findInCart?.product?._id === product?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      }  text-center w-full p-2 rounded-lg`}
                      disabled={
                        (loading && selectedProductId === product?._id) ||
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
                        findInCart?.product?._id === product?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      }  text-center w-full p-2 rounded-lg`}
                      disabled={loading && selectedProductId === product?._id}
                      onClick={() => {
                        handleSubmitAddProduct();
                      }}
                    >
                      {loading && selectedProductId === product?._id
                        ? t("Removing").concat("...")
                        : findInCart !== null &&
                          product?._id === findInCart?.product?._id &&
                          t("Remove from cart")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={` ${
                        findInCart?.product?._id === product?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      } text-center w-full p-2 rounded-lg`}
                      onClick={() => handleSubmitAddProduct()}
                      disabled={loading && selectedProductId === product?._id}
                    >
                      {loading && selectedProductId === product?._id ? (
                        t("Adding").concat("...")
                      ) : findInCart !== null &&
                        product?._id === findInCart?.product?._id ? (
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
                {favouriteLoading ? (
                  "..."
                ) : isFavourite ? (
                  <AiFillHeart
                    className="w-10 h-10 text-DARKRED"
                    role="button"
                    onClick={() => handleRemoveFromFavourties(product?._id)}
                  />
                ) : (
                  <AiOutlineHeart
                    className="w-10 h-10 text-DARKRED"
                    role="button"
                    onClick={() => handleAddtoFavourties(product?._id)}
                  />
                )}
              </p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "keyframes",
            duration: 0.5,
          }}
          className={`md:space-y-2 space-y-3 relative ${
            showEnlargeImage && product?._id === activeEnlargeImageId
              ? "z-40"
              : "z-0"
          } md:w-full w-auto md:p-3 p-4 bg-white lg:min-h-[27rem] md:min-h-[21rem] min-h-[19rem] font-semibold md:text-lg border rounded-lg border-gray-300`}
        >
          {/* top seller label */}
          {showEnlargeImage && product?._id === activeEnlargeImageId && (
            <div className="absolute z-30 inset-0 bg-black bg-opacity-20 backdrop-blur-sm max-w-[100%] h-full" />
          )}
          {title === "top-sellers" && (
            <p className="bg-PRIMARY text-white h-8 w-40 leading-8 align-middle text-center text-sm rounded-tl-lg absolute top-0 left-0">
              {t("top_seller")}
            </p>
          )}
          {/* product img enlarge*/}
          <div
            className={`relative ${
              showEnlargeImage && product?._id === activeEnlargeImageId
                ? "z-40"
                : "z-0"
            } w-auto pt-3`}
          >
            <img
              src={BaseUrl.concat(product?.images[0])}
              alt={product?.name}
              className="lg:h-64 md:h-40 relative z-50 h-32 cursor-pointer w-fit mx-auto object-contain object-center"
              title={product?.name}
              onClick={() => {
                handleOpenPopup();
              }}
              loading="lazy"
            />
            <MagnifyingGlassPlusIcon
              role="button"
              onClick={() => {
                dispatch(showEnlargeImagePopup());
                handleShowEnlargeImage();
              }}
              className="h-6 w-6 bg-white/40 absolute z-50 bottom-0 md:right-0 right-2 text-PRIMARY"
            />
            {activeEnlargeImageId === product?._id &&
              activeEnlargeImageFrom === from &&
              showEnlargeImage && (
                <div
                  ref={popImageRef}
                  className="absolute bg-black/30 z-50 md:w-[200%] w-full md:min-h-[30rem] min-h-[22rem] max-h-screen top-0 lg:-right-14 md:-right-44 right-0 backdrop-blur-sm"
                >
                  <AiOutlineClose
                    role="button"
                    onClick={() => {
                      dispatch(closeEnlargeImagePopup());
                    }}
                    className="absolute top-1 right-2 w-7 h-7 text-white z-50 bg-black/20"
                  />
                  {typeOfenlarge === "video" ? (
                    <ReactPlayer
                      url={product?.videos[activeEnlargeImage]}
                      style={{
                        maxWidth: "100%",
                        minWidth: "100%",
                        maxHeight: "100%",
                        minHeight: "100%",
                        position: "absolute",
                        inset: 0,
                        padding: "0.3rem 0.3rem 0.3rem 0.3rem",
                      }}
                      controls
                      playing
                    />
                  ) : (
                    <img
                      src={BaseUrl.concat(product?.images[activeEnlargeImage])}
                      alt={product?.name}
                      className="h-full w-full rounded-none object-contain object-center absolute top-0 p-2"
                      title={product?.name}
                      loading="lazy"
                    />
                  )}
                </div>
              )}
          </div>
          {/* mulitple images */}
          <div className="flex flex-wrap items-center gap-1 h-10">
            {product?.images.map((image, index) => (
              <img
                key={index}
                src={BaseUrl.concat(image)}
                className="h-10 w-10 border-2 border-PRIMARY p-1 rounded-lg cursor-pointer"
                onClick={() => {
                  dispatch(showEnlargeImagePopup());
                  handleShowEnlargeImage(index);
                  setTypeOfenlarge("image");
                }}
              />
            ))}

            {product?.videos.map((video, index) => (
              <IoIosPlayCircle
                key={index}
                className="h-10 w-10 border-2 text-PRIMARY border-PRIMARY p-1 rounded-lg cursor-pointer"
                onClick={() => {
                  dispatch(showEnlargeImagePopup());
                  handleShowEnlargeImage(index);
                  setTypeOfenlarge("video");
                }}
              />
            ))}
          </div>
          <p className="text-PRIMARY font-semibold">
            ITEM NO.{product?.number}
          </p>
          <p
            className="font-bold tracking-normal text-base break-words line_camp max-h-12 md:min-h-[3rem] min-h-[1rem] "
            title={product?.name}
          >
            {product?.name}
          </p>
          <p className="tracking-normal text-sm font-bold">
            {`${product?.PK} PC / PK | ${product?.CTN} PC / CTN`}
          </p>
          {user !== null ? (
            <Fragment>
              <p className="lg:text-[13px] md:text-xs text-sm font-bold whitespace-nowrap text-left">
                ${product?.price}/PC | $
                {(product?.price * product?.PK).toFixed(2)}
                /PK | $ {(product?.price * product?.CTN).toFixed(2)}/CTN
              </p>
              {selectedView === "grid3" && (
                <ul>
                  <li className="text-BLACK sm:text-sm md:text-lg">
                    {product?.package}
                  </li>
                  <li className="text-BLACK md:text-sm text-base">
                    PK volume : {product?.PKVolume} cu ft{" "}
                  </li>
                  <li className="text-BLACK md:text-sm text-base">
                    CTN volume : {product?.CTNVolume} cu ft{" "}
                  </li>
                  <li className="text-BLACK md:text-sm text-base">
                    PK weight : {product?.PKWeight} Lbs{" "}
                  </li>
                  <li className="text-BLACK md:text-sm text-base">
                    CTN weight : {product?.CTNWeight} Lbs{" "}
                  </li>
                </ul>
              )}
              {/* pk */}
              <div className="flex w-full h-full items-center md:gap-x-1 gap-x-2 relative z-0">
                <input
                  name={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  type="radio"
                  ref={pkRef}
                  className="md:w-6 md:h-6 w-7 h-7"
                  onChange={(e) => setSelectedItemType(e.target.value)}
                  value="pk"
                  style={{ backgroundColor: "red", color: "red" }}
                  id={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  disabled={
                    (loading && selectedProductId === product?._id) ||
                    findInCart?.product?._id === product?._id
                  }
                />
                <span className="font-semibold text-xs whitespace-nowrap mr-0.5">
                  PK
                </span>
                <div className="relative h-full w-[90%]">
                  <span
                    className={`absolute top-1/2 text-xs sm:text-sm ${
                      selectedView === "grid3"
                        ? "w-fit"
                        : "md:max-w-[3rem] w-fit"
                    } text-sm ${
                      pkitemsQuantity === "" && alreadyInCartPkItems === ""
                        ? "text-gray-400 font-normal"
                        : "text-BLACK font-semibold"
                    } 
                    -translate-y-1/2 lg:left-8 md:left-7 left-10`}
                  >
                    {`${
                      pkitemsQuantity === "" && alreadyInCartPkItems === ""
                        ? product?.PK
                        : findInCart?.product?._id === product?._id
                        ? alreadyInCartPkItems
                        : pkitemsQuantity
                    } PC`}
                  </span>
                  <input
                    type="number"
                    className={`w-full text-right h-11 sm:text-sm text-xs lg:pr-[52px] md:pr-12 pr-14 pl-12 rounded-md outline-none border border-BORDERGRAY`}
                    placeholder="0"
                    min="0"
                    max="999999"
                    value={
                      findInCart?.product?._id === product?._id &&
                      alreadyInCartPkCount !== null
                        ? alreadyInCartPkCount
                        : pkCount !== null && pkCount
                    }
                    onChange={(e) => {
                      if (e.target.value.length > 6) {
                        toast.remove();
                        toast.error("Can't add more than 6 numbers");
                        return true;
                      }
                      handleOnchangePkCountField(e);
                    }}
                    disabled={
                      (loading && selectedProductId === product?._id) ||
                      findInCart?.type === "ctn"
                    }
                  />
                  <span className="font-semibold text-BLACK text-xs absolute top-1/2 -translate-y-1/2 lg:right-9 md:right-8 right-10">
                    PK
                  </span>
                </div>

                {/* minus pk btn */}
                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === product?._id) ||
                    findInCart?.type === "ctn"
                  }
                  className={`text-BLACK h-full bg-blue-500 md:w-7 w-8 text-center rounded-md absolute top-1/2 -translate-y-1/2 md:left-11 left-14`}
                  onClick={() => {
                    handleOnClickFieldForBoth("minus", "pk");
                  }}
                >
                  <AiOutlineMinus className="h-5 w-5 mx-auto" />
                </button>
                {/* plus pk btn */}
                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === product?._id) ||
                    findInCart?.type === "ctn"
                  }
                  className={`text-BLACK h-full rounded-md bg-blue-500 md:w-7 w-8 absolute top-1/2 -translate-y-1/2 right-0 `}
                  onClick={() => {
                    handleOnClickFieldForBoth("plus", "pk");
                  }}
                >
                  <AiOutlinePlus className="h-4 w-4 mx-auto" />
                </button>
              </div>
              {/* ctn */}
              <div
                className={`flex w-full items-center ${
                  selectedView === "grid3" ? "md:gap-x-1" : "md:gap-x-0.5"
                } gap-x-1 relative z-0`}
              >
                <input
                  name={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  type="radio"
                  ref={ctnRef}
                  className="md:w-6 md:h-6 w-7 h-7"
                  onChange={(e) => setSelectedItemType(e.target.value)}
                  value="ctn"
                  defaultChecked={findInCart?.type === "ctn"}
                  id={
                    from === "TopSellers"
                      ? product?.name.concat(from)
                      : product?.name
                  }
                  disabled={
                    (loading && selectedProductId === product?._id) ||
                    findInCart?.product?._id === product?._id
                  }
                />
                <span className="font-semibold text-xs whitespace-nowrap">
                  CTN
                </span>
                <div className="relative w-full">
                  <span
                    className={`absolute top-1/2 sm:text-sm text-xs ${
                      selectedView === "grid3"
                        ? "w-fit lg:left-9 md:left-8 left-10"
                        : "md:max-w-[3rem] w-fit lg:left-9 md:left-7 left-10"
                    } text-sm ${
                      ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                        ? "text-gray-400 font-normal"
                        : "text-BLACK font-semibold"
                    }
                    -translate-y-1/2 `}
                  >
                    {`${
                      ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                        ? product?.CTN
                        : findInCart?.product?._id === product?._id
                        ? alreadyInCartCtnItems
                        : ctnItemQuantity
                    } PC`}
                  </span>
                  <input
                    type="number"
                    className={`w-full text-right h-11 sm:text-sm text-xs lg:pr-[60px] md:pr-14 pr-16 pl-12 rounded-md outline-none border border-BORDERGRAY`}
                    placeholder="0"
                    value={
                      findInCart?.product?._id === product?._id &&
                      alreadyInCartCtnCount !== null
                        ? alreadyInCartCtnCount
                        : ctnCount !== null && ctnCount
                    }
                    onChange={(e) => {
                      handleOnchangeCtnCountField(e);
                    }}
                    disabled={
                      (loading && selectedProductId === product?._id) ||
                      findInCart?.type === "pk"
                    }
                  />
                  <span className="font-semibold text-BLACK text-xs absolute top-1/2 -translate-y-1/2 lg:right-9 md:right-8 right-10">
                    CTN
                  </span>
                </div>
                {/* minus ctn btn */}

                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === product?._id) ||
                    findInCart?.type === "pk"
                  }
                  className={`text-BLACK h-full bg-blue-500 md:w-7 w-8 text-center rounded-md absolute top-1/2 -translate-y-1/2 ${
                    selectedView === "grid3"
                      ? "lg:left-[48px] md:left-12 left-14"
                      : "lg:left-[48px] md:left-11 left-14"
                  } `}
                  onClick={() => {
                    handleOnClickFieldForBoth("minus", "ctn");
                  }}
                >
                  <AiOutlineMinus className="w-5 h-5 mx-auto" />
                </button>
                {/* plus ctn btn */}

                <button
                  type="button"
                  disabled={
                    (!loading && selectedProductId === product?._id) ||
                    findInCart?.type === "pk"
                  }
                  className={`text-BLACK h-full rounded-md bg-blue-500 md:w-7 w-8 absolute top-1/2 -translate-y-1/2 right-0`}
                  onClick={() => {
                    handleOnClickFieldForBoth("plus", "ctn");
                  }}
                >
                  <AiOutlinePlus className="h-4 w-4 mx-auto" />
                </button>
              </div>
              {/* add to cart btn */}
              <p className="flex items-center gap-x-2">
                <Link
                  to={
                    user === null
                      ? "/sign-in"
                      : findInCart !== null &&
                        product?._id === findInCart?.product?._id &&
                        !changeTo
                      ? "/cart"
                      : null
                  }
                  className="w-11/12"
                >
                  {changingLoading && findInCart?.quantity !== 0 && changeTo ? (
                    <button
                      type="button"
                      className={` ${
                        findInCart?.product?._id === product?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      } text-center w-full p-2 rounded-lg`}
                      disabled={
                        (loading && selectedProductId === product?._id) ||
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
                        findInCart?.product?._id === product?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      }  text-center w-full p-2 rounded-lg`}
                      disabled={loading && selectedProductId === product?._id}
                      onClick={() => {
                        handleSubmitAddProduct();
                      }}
                    >
                      {loading && selectedProductId === product?._id
                        ? t("Removing").concat("...")
                        : findInCart !== null &&
                          product?._id === findInCart?.product?._id &&
                          t("Remove from cart")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={` ${
                        findInCart?.product?._id === product?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      } text-center w-full p-2 rounded-lg`}
                      onClick={() => handleSubmitAddProduct()}
                      disabled={loading && selectedProductId === product?._id}
                    >
                      {loading && selectedProductId === product?._id ? (
                        t("Adding").concat("...")
                      ) : findInCart !== null &&
                        product?._id === findInCart?.product?._id ? (
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
                {favouriteLoading ? (
                  "..."
                ) : isFavourite ? (
                  <AiFillHeart
                    className="w-10 h-10 text-DARKRED"
                    role="button"
                    onClick={() => {
                      handleRemoveFromFavourties(product?._id, from);
                    }}
                  />
                ) : (
                  <AiOutlineHeart
                    className="w-10 h-10 text-DARKRED"
                    role="button"
                    onClick={() => handleAddtoFavourties(product?._id, from)}
                  />
                )}
              </p>
            </Fragment>
          ) : (
            <Link to="/sign-in" className="mt-2">
              <button
                type="button"
                className="bg-DARKRED text-white text-center w-full mt-3 p-2 rounded-lg"
              >
                {t("login_to_order")}
              </button>
            </Link>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ProductCard;
