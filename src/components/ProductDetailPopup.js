import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineLeft,
  AiOutlineRight,
  AiFillHeart,
} from "react-icons/ai";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEnlargeImagePopup,
  closePopup,
  handleChangeActiveComponent,
  handleChangeEnlargeImageFrom,
  handleChangeEnlargeImageId,
  showEnlargeImagePopup,
  showPopup,
} from "../redux/GlobalStates";
import { Link } from "react-router-dom";

import BaseUrl from "../BaseUrl";
import {
  handleAddProductToFavourites,
  handleRemoveProductToFavourites,
} from "../redux/FavouriteSlice";
import { Toaster, toast } from "react-hot-toast";
import {
  handleAddProductToCart,
  handleRemoveItemFromCart,
  handleRemoveProductToCart,
  handleUpdateTotalQuantityAndAmount,
} from "../redux/CartSlice";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { useCallback } from "react";
import { handleClearSingleProduct } from "../redux/ProductSlice";
import { IoIosPlayCircle } from "react-icons/io";
import ReactPlayer from "react-player";

const ProductDetailPopup = ({}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState();
  const [selectedItemType, setSelectedItemType] = useState("pk");
  const [pkitemsQuantity, setpkItemsQuantity] = useState("");
  const [ctnItemQuantity, setCtnItemQuantity] = useState("");
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [findInCart, setFindInCart] = useState(null);
  const [addProductToCartLoading, setAddProductToCartLoading] = useState(false);
  const [pkCount, setPkCount] = useState(null);
  const [ctnCount, setCtnCount] = useState(null);
  const [isFavorite, setIsFavourite] = useState(false);
  const [changeTo, setChangeTo] = useState(false);
  const [changingLoading, setChangingLoading] = useState(false);
  const [alreadyInCartPkCount, setAlreadyInCartPkCount] = useState(null);
  const [alreadyInCartCtnCount, setAlreadyInCartCtnCount] = useState(null);
  const [alreadyInCartPkItems, setAlreadyInCartPkItems] = useState("");
  const [alreadyInCartCtnItems, setAlreadyInCartCtnItems] = useState("");
  const [activeEnlargeImage, setActiveEnlargeImage] = useState(0);
  const [typeOfenlarge, setTypeOfenlarge] = useState("");

  const { user, token } = useSelector((state) => state.Auth);

  const { showProductDetailsPopup, showEnlargeImage, activeEnlargeImageId } =
    useSelector((state) => state.globalStates);

  const { singleProduct, singleProductLoading, allProducts } = useSelector(
    (state) => state.products
  );
  const { cart, cartItems, loading } = useSelector((state) => state.cart);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const popupRef = useRef(null);
  const AbortControllerRef = useRef(null);
  const pkRef = useRef(null);
  const ctnRef = useRef(null);
  const popImageRef = useRef(null);

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
          if (res?.payload?.status === "success") {
            setIsFavourite(!isFavorite);
            toast.success(res?.payload?.message);
          }
          setFavouriteLoading(false);
        })
        .catch((err) => {
          setFavouriteLoading(false);
        });
    }
  };

  const handleRemoveFromFavourties = (id) => {
    setFavouriteLoading(true);
    const response = dispatch(
      handleRemoveProductToFavourites({ token, id, signal: AbortControllerRef })
    );
    if (response) {
      response
        .then((res) => {
          if (res?.payload?.status === "success") {
            setIsFavourite(!isFavorite);
            toast.success(res?.payload?.message);
          }
          setFavouriteLoading(false);
        })
        .catch((err) => {
          setFavouriteLoading(false);
        });
    }
  };

  const handleAddProduct = (id, title, quantity, amount) => {
    toast.dismiss();
    if (pkitemsQuantity === "" && ctnItemQuantity === "") {
      return toast.error("Please add some quantity");
    } else if (selectedItemType === "pk" && ctnItemQuantity > 0) {
      toast.error("Please enter quantity in PK, you choose PK");
      setCtnItemQuantity("");
      setCtnCount(null);
      setAlreadyInCartCtnCount(null);
      setAlreadyInCartCtnItems("");
      return true;
    } else if (selectedItemType === "ctn" && pkitemsQuantity > 0) {
      toast.error("Please enter quantity in CTN, you choose CTN");
      setpkItemsQuantity("");
      setPkCount(0);
      setAlreadyInCartPkItems("");
      setAlreadyInCartPkCount(null);
      return true;
    } else if (
      !/^\d+$/.test(pkitemsQuantity !== "" ? pkitemsQuantity : ctnItemQuantity)
    ) {
      setCtnItemQuantity("");
      setpkItemsQuantity("");
      setPkCount(null);
      setCtnCount(null);
      setAlreadyInCartPkItems("");
      setAlreadyInCartPkCount(null);
      setAlreadyInCartCtnCount(null);
      setAlreadyInCartCtnItems("");
      return toast.error("Please enter valid value");
    }
    setSelectedProductId(singleProduct?._id);
    setAddProductToCartLoading(true);
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
            dispatch(handleUpdateTotalQuantityAndAmount({ quantity, amount }));
            setCtnItemQuantity("");
            setpkItemsQuantity("");
            setCtnCount(null);
            setPkCount(null);
            setSelectedItemType("pk");
            setSelectedProductId(null);
            setAlreadyInCartCtnCount(null);
            setAlreadyInCartCtnItems("");
            setAlreadyInCartPkCount(null);
            setAlreadyInCartPkItems("");
            setAddProductToCartLoading(false);
          }
        })
        .catch((err) => {
          toast.error(err.payload.message);
          setAddProductToCartLoading(false);
        });
    }
  };

  const handlePlusPkQuantity = (quantity, count, id) => {
    if (id === singleProduct?._id && findInCart?.type === "pk") {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
    }
    if (findInCart?.product?._id !== singleProduct?._id) {
      setSelectedItemType("pk");
      pkRef.current.checked = true;
      setPkCount(count);
      setpkItemsQuantity(quantity * count);
    }
  };

  const handleMinusPkQuantity = (quantity, count, id) => {
    if (id === singleProduct?._id && findInCart?.product?._id !== id) {
      pkRef.current.checked = true;
      setSelectedItemType("pk");
    }
    if (findInCart?.product?._id !== singleProduct?._id) {
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
    if (id === singleProduct?._id && findInCart?.product?._id !== id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
    }
    if (findInCart?.product?._id !== singleProduct?._id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
      setCtnCount(count);
      setCtnItemQuantity(quantity * count);
    }
  };

  const handleMinusCTNQuantity = (quantity, count, id) => {
    if (id === singleProduct?._id && findInCart?.product?._id !== id) {
      ctnRef.current.checked = true;
      setSelectedItemType("ctn");
    }
    if (findInCart?.product?._id !== singleProduct?._id) {
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
    if (
      findInCart !== null &&
      findInCart?.product?._id === singleProduct?._id
    ) {
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
    if (!loading && singleProduct?._id !== findInCart?.product?._id) {
      handleAddProduct(
        singleProduct?._id,
        singleProduct?.name,
        selectedItemType === "pk" ? pkitemsQuantity : ctnItemQuantity,
        selectedItemType === "pk"
          ? pkitemsQuantity * singleProduct?.price
          : ctnItemQuantity * singleProduct?.price
      );
    } else if (
      changeTo &&
      findInCart !== null &&
      singleProduct?._id === findInCart?.product?._id
    ) {
      if (alreadyInCartPkCount === 0 || alreadyInCartCtnCount === 0) {
        const response = dispatch(
          handleRemoveProductToCart({
            token,
            id: singleProduct?._id,
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
      setPkCount(0);
      setpkItemsQuantity("");
      setAlreadyInCartPkCount(0);
      setAlreadyInCartPkItems("");
      return true;
    }
    if (e.target.value.length > 6) {
      toast.remove();
      toast.error("Can't add more than 6 numbers");
      return true;
    }
    if (
      !addProductToCartLoading &&
      selectedProductId?._id !== singleProduct?._id &&
      findInCart?.product?._id !== singleProduct?._id
    ) {
      setPkCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setpkItemsQuantity(
        parseFloat(e.target.value.replace(/^0+/, "") * singleProduct?.PK)
      );
    }
    if (
      !addProductToCartLoading &&
      selectedProductId?._id !== singleProduct?._id &&
      findInCart?.product?._id === singleProduct?._id
    ) {
      setChangeTo(true);
      setAlreadyInCartPkCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setAlreadyInCartPkItems(
        parseFloat(e.target.value.replace(/^0+/, "") * singleProduct?.PK)
      );
    }
  };

  const handleOnchangeCtnCountField = (e) => {
    setSelectedItemType("ctn");
    ctnRef.current.checked = true;

    if (!/^(?=.*[1-9])\d{1,8}(?:\.\d\d?)?$/.test(e.target.value)) {
      toast.remove();
      toast.error("Please enter valid value and value can't be less than zero");
      setCtnCount(0);
      setCtnItemQuantity("");
      setAlreadyInCartCtnCount(0);
      setAlreadyInCartCtnItems("");
      return true;
    }
    if (e.target.value.length > 6) {
      toast.remove();
      toast.error("Can't add more than 6 numbers");
      return true;
    }
    if (
      !addProductToCartLoading &&
      selectedProductId?._id !== singleProduct?._id
    ) {
      setCtnCount(e.target.value.replace(/^0+/, ""));
      setCtnItemQuantity(
        e.target.value.replace(/^0+/, "") * singleProduct?.CTN
      );
    }
    if (
      !addProductToCartLoading &&
      selectedProductId?._id !== singleProduct?._id &&
      findInCart?.product?._id === singleProduct?._id
    ) {
      setChangeTo(true);
      setAlreadyInCartCtnCount(parseFloat(e.target.value.replace(/^0+/, "")));
      setAlreadyInCartCtnItems(
        parseFloat(e.target.value.replace(/^0+/, "") * singleProduct?.CTN)
      );
    }
  };

  const handleOnClickFieldForBoth = (action, type) => {
    if (type === "pk") {
      if (
        !loading &&
        selectedProductId !== singleProduct?._id &&
        findInCart?.product?._id !== singleProduct?._id
      ) {
        if (action === "minus") {
          handleMinusPkQuantity(
            parseFloat(singleProduct?.PK),
            parseFloat(pkCount - 1),
            singleProduct?._id
          );
        } else {
          if (pkCount !== null && pkCount.toString().length >= 6) {
            toast.remove();
            toast.error("Can't add more than 6 numbers");
            return true;
          }
          handlePlusPkQuantity(
            parseFloat(singleProduct?.PK),
            parseFloat(pkCount === null ? 1 : pkCount + 1),
            singleProduct?._id
          );
        }
      } else if (
        !loading &&
        selectedProductId !== singleProduct?._id &&
        findInCart?.product?._id === singleProduct?._id
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
                parseFloat(singleProduct?.PK) *
                  parseFloat(alreadyInCartPkCount - 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(alreadyInCartPkCount) - 1
              );
            } else {
              setAlreadyInCartPkCount(parseFloat(findInCart?.quantity) - 1);
              setAlreadyInCartPkItems(
                parseFloat(singleProduct?.PK) *
                  parseFloat(findInCart?.quantity - 1)
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
              toast.error("Can't add more than 6 numbers");
              return true;
            }
            if (alreadyInCartPkCount !== null) {
              setAlreadyInCartPkCount(parseFloat(alreadyInCartPkCount) + 1);
              setAlreadyInCartPkItems(
                parseFloat(singleProduct?.PK) *
                  parseFloat(alreadyInCartPkCount + 1)
              );
              handleChangeAddedItemInCart(
                null,
                "pk",
                parseFloat(alreadyInCartPkCount) + 1
              );
            } else {
              setAlreadyInCartPkCount(parseFloat(findInCart?.quantity) + 1);
              setAlreadyInCartPkItems(
                parseFloat(singleProduct?.PK) *
                  parseFloat(findInCart?.quantity + 1)
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
        selectedProductId !== singleProduct?._id &&
        findInCart?.product?._id !== singleProduct?._id
      ) {
        if (action === "minus") {
          handleMinusCTNQuantity(
            parseFloat(singleProduct?.CTN),
            parseFloat(ctnCount !== null && ctnCount - 1),
            singleProduct?._id
          );
        } else {
          if (ctnCount !== null && ctnCount.toString().length >= 6) {
            toast.remove();
            toast.error("Can't add more than 6 numbers");
            return true;
          }
          handlePlusCTNQuantity(
            parseFloat(singleProduct?.CTN),
            parseFloat(ctnCount === null ? 1 : ctnCount + 1),
            singleProduct?._id
          );
        }
      } else if (
        !loading &&
        selectedProductId !== singleProduct?._id &&
        findInCart?.product?._id === singleProduct?._id &&
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
                parseFloat(singleProduct?.CTN) *
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
                parseFloat(singleProduct?.CTN) *
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
              toast.error("Can't add more than 6 numbers");
              return true;
            }
            if (alreadyInCartCtnCount !== null) {
              setAlreadyInCartCtnCount(parseFloat(alreadyInCartCtnCount) + 1);
              setAlreadyInCartCtnItems(
                parseFloat(singleProduct?.CTN) *
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
                parseFloat(singleProduct?.CTN) *
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

  function handleShowEnlargeImage(index) {
    dispatch(handleChangeEnlargeImageId(""));
    dispatch(handleChangeEnlargeImageFrom(""));
    if (index > 0) {
      setActiveEnlargeImage(index);
      dispatch(handleChangeEnlargeImageId(singleProduct?._id));
    } else {
      setActiveEnlargeImage(0);
      dispatch(handleChangeEnlargeImageId(singleProduct?._id));
    }
  }

  useEffect(() => {
    setIsFavourite(singleProduct?.isFavourite);
  }, [singleProductLoading]);

  // find item in cart
  useEffect(() => {
    if (cart !== null && cartItems.length > 0 && !changingLoading) {
      const findItemInCart = cartItems.find(
        (i) => i.product?._id === singleProduct?._id
      );
      if (findItemInCart !== undefined) {
        setFindInCart(findItemInCart);
        setCtnCount(null);
        setPkCount(null);
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
  }, [changingLoading, loading, singleProductLoading, addProductToCartLoading]);

  useEffect(() => {
    if (showProductDetailsPopup === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showProductDetailsPopup]);

  // set checked if already in cart
  const findItems = useCallback(async () => {
    if (
      findInCart?.product?._id === singleProduct?._id &&
      findInCart?.type === "pk" &&
      pkRef.current
    ) {
      pkRef.current.checked = await true;
      setSelectedItemType("pk");
    } else if (
      findInCart?.product?._id === singleProduct?._id &&
      findInCart?.type === "ctn" &&
      ctnRef.current
    ) {
      ctnRef.current.checked = await true;
      setSelectedItemType("ctn");
    } else if (
      findInCart?.product?._id !== singleProduct?._id &&
      pkRef.current
    ) {
      pkRef.current.defaultChecked = await true;
    }
  }, [findInCart, singleProductLoading, addProductToCartLoading]);

  useEffect(() => {
    findItems();
  });

  // outside click close pop image
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event?.target)) {
        dispatch(closePopup());
        dispatch(handleChangeEnlargeImageId(""));
        dispatch(closeEnlargeImagePopup());
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    dispatch(closePopup());
    dispatch(handleChangeEnlargeImageId(""));
    dispatch(closeEnlargeImagePopup());
  }

  // outside click for pop image
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

  useEffect(() => {
    return () => {
      dispatch(handleClearSingleProduct());
    };
  }, []);

  // const findCheckDigit = (keyWoCD) => {
  //   /* Check that input string conveys number of digits that correspond to a given GS1 key */
  //   if (
  //     /(^\d{7}$)|(^\d{11}$)|(^\d{12}$)|(^\d{13}$)|(^\d{16}$)|(^\d{17}$)/.test(
  //       keyWoCD
  //     ) === false
  //   ) {
  //     return null;
  //   } else {
  //     /* Reverse string */
  //     keyWoCD = [...keyWoCD].reverse().join("");
  //     /* Alternatively fetch digits, multiply them by 3 or 1, and sum them up */
  //     let sum = 0;
  //     for (let i = keyWoCD.length - 1; i >= 0; i--) {
  //       if (parseInt(keyWoCD[i]) === 0) {
  //         continue;
  //       } else {
  //         if (i % 2 !== 0) {
  //           sum += parseInt(keyWoCD[i]) * 1;
  //         } else {
  //           sum += parseInt(keyWoCD[i]) * 3;
  //         }
  //       }
  //     }
  //     /* Subtract sum from nearest equal or higher multiple of ten */
  //     let checkDigit = Math.ceil(sum / 10) * 10 - sum;
  //     return checkDigit;
  //   }
  // };

  // const checkDigitNumber = () => {
  //   const regExp = /[a-zA-Z]/g;
  //   let checkDigitnum = "";
  //   if (regExp.test(singleProduct?.number)) {
  //     checkDigitnum = "-";
  //   } else {
  //     checkDigitnum = `827680`
  //       .toString()
  //       .concat(singleProduct?.number)
  //       .concat(findCheckDigit("827680".concat(singleProduct?.number)));
  //   }
  //   return checkDigitnum;
  // };

  return (
    <ReactModal
      className={`fixed overflow-hidden scrollbar bg-black/30 z-50 w-full min-h-screen max-h-screen inset-0 backdrop-blur-sm`}
      appElement={document.getElementById("root")}
      isOpen={showProductDetailsPopup}
      onRequestClose={() => {
        dispatch(closePopup());
        dispatch(handleChangeEnlargeImageId(""));
        dispatch(closeEnlargeImagePopup());
      }}
      preventScroll={true}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      style={{ content: { zIndex: 999 } }}
    >
      <Toaster />
      {singleProductLoading ? (
        <div className="absolute overflow-scroll scrollbar top-5 left-1/2 -translate-x-1/2 z-50 md:p-5 py-10 px-5 bg-white md:text-2xl font-semibold text-lg text-black flex md:flex-row flex-col items-center justify-center gap-x-3 xl:w-2/3 lg:w-10/12 w-11/12 min-h-[95%] text-center max-h-[95%]">
          <AiOutlineClose
            role="button"
            onClick={() => {
              dispatch(closePopup());
              dispatch(handleChangeEnlargeImageId(""));
              dispatch(closeEnlargeImagePopup());
            }}
            className="absolute md:top-6 top-2 md:left-[94%] left-[90%] w-7 h-7 text-black z-40"
          />
          Loading...
        </div>
      ) : (
        <div
          ref={popupRef}
          className="absolute overflow-scroll scrollbar top-5 bottom-3 left-1/2 -translate-x-1/2 z-30 md:p-5 py-10 px-5 bg-white text-black flex md:flex-row flex-col items-start gap-x-3 xl:w-2/3 lg:w-10/12 w-11/12 max-h-[95%]"
        >
          <AiOutlineClose
            role="button"
            onClick={() => {
              dispatch(closePopup());
              dispatch(handleChangeEnlargeImageId(""));
              dispatch(closeEnlargeImagePopup());
            }}
            className="absolute md:top-6 top-2 md:left-[94%] left-[90%] w-7 h-7 text-black z-40"
          />
          {/* images */}
          <div className="md:w-5/12 w-full relative z-40">
            <div className="w-full space-y-4 relative z-0">
              <Swiper
                modules={[Navigation, FreeMode, Thumbs]}
                spaceBetween={0}
                slidesPerView={1}
                direction={"horizontal"}
                grabCursor={true}
                navigation={{
                  prevEl: prevRef?.current,
                  nextEl: nextRef?.current,
                }}
                freeMode={true}
                centeredSlides={true}
                thumbs={{ swiper: thumbsSwiper }}
                speed={500}
                onSwiper={(swiper) => {
                  // Delay execution for the refs to be defined
                  setTimeout(() => {
                    // Override prevEl & nextEl now that refs are defined
                    if (swiper.params) {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;

                      // Re-init navigation
                      swiper.navigation.destroy();
                      swiper.navigation.init();
                      swiper.navigation.update();
                    }
                  });
                }}
                className="border border-gray-400 p-3 relative z-0"
              >
                {singleProductLoading ? (
                  <p>Loading...</p>
                ) : (
                  singleProduct?.images.map((image, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={BaseUrl.concat(image)}
                        alt={singleProduct?.title}
                        className="h-fit w-full object-contain object-center"
                        loading="lazy"
                        onClick={() => {
                          dispatch(showEnlargeImagePopup());
                          handleShowEnlargeImage(i);
                        }}
                      />
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
              {/* prev btn */}
              <button
                type="button"
                ref={prevRef}
                className="rounded-full h-8 w-8 p-2 bg-gray-400 absolute top-1/3 -translate-y-1/2 xl:-left-4 -left-3 z-10"
              >
                <AiOutlineLeft className="w-4 h-4 text-white" />
              </button>
              {/* next btn */}
              <button
                type="button"
                ref={nextRef}
                className="rounded-full h-8 w-8 p-2 bg-gray-400 absolute top-1/3 -translate-y-1/2 xl:-right-4 -right-3 z-10"
              >
                <AiOutlineRight className="w-4 h-4 text-white" />
              </button>
              {singleProduct?.images !== undefined &&
                singleProduct?.images.length > 0 && (
                  <div className="w-full flex flex-wrap gap-2 items-center">
                    {singleProduct?.images.map((image, i) => (
                      <img
                        src={BaseUrl.concat(image)}
                        alt=""
                        className="w-14 h-14 cursor-pointer border p-1 border-gray-400 rounded-lg object-contain object-center"
                        onClick={() => {
                          dispatch(showEnlargeImagePopup());
                          handleShowEnlargeImage(i);
                          setTypeOfenlarge("image");
                        }}
                      />
                    ))}
                    {singleProduct?.videos.map((video, index) => (
                      <IoIosPlayCircle
                        key={index}
                        className="w-14 h-14 text-PRIMARY cursor-pointer border p-2 border-gray-400 rounded-lg object-contain object-center"
                        onClick={() => {
                          dispatch(showEnlargeImagePopup());
                          handleShowEnlargeImage(index);
                          setTypeOfenlarge("video");
                        }}
                      />
                    ))}
                  </div>
                )}
            </div>
            {/* show enlarge */}
            {activeEnlargeImageId === singleProduct?._id &&
              showEnlargeImage && (
                <div
                  ref={popImageRef}
                  className="absolute bg-black/30 z-30 md:w-[200%] w-[110%] xl:min-h-[30rem] md:min-h-[28rem] min-h-[26rem] max-h-screen md:-top-3 -top-8 -left-4 md:-right-5 right-0 backdrop-blur-sm"
                >
                  <AiOutlineClose
                    role="button"
                    onClick={() => {
                      dispatch(closeEnlargeImagePopup());
                    }}
                    className="absolute top-1 right-2 w-7 h-7 text-white  z-50 bg-black/20"
                  />
                  {typeOfenlarge === "video" ? (
                    <ReactPlayer
                      url={singleProduct?.videos[activeEnlargeImage]}
                      style={{
                        maxWidth: "100%",
                        minWidth: "100%",
                        maxHeight: "100%",
                        minHeight: "100%",
                        position: "absolute",
                        inset: 0,
                        padding: "0.3rem 0.3rem 0.3rem 0.3rem",
                        zIndex:0
                      }}
                      controls
                      playing
                    />
                  ) : (
                    <img
                      src={BaseUrl.concat(
                        singleProduct?.images[activeEnlargeImage]
                      )}
                      alt={singleProduct?.name}
                      className="h-full w-full rounded-none object-contain object-center absolute top-0 p-2"
                      title={singleProduct?.name}
                      loading="lazy"
                    />
                  )}
                </div>
              )}
          </div>
          <hr className="md:hidden block my-3 bg-black w-full" />
          {/* details */}
          {user === null ? (
            <div className="md:w-7/12 w-full space-y-2">
              <p className="text-black font-semibold">
                {singleProduct?.number}
              </p>

              <p className="font-bold text-2xl">{singleProduct?.name}</p>
              <p
                className="font-medium text-lg whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: singleProduct?.longDesc }}
              ></p>
              <p className="flex items-center gap-x-3">
                <Link to="/sign-in">
                  <button
                    type="button"
                    className="bg-DARKRED text-white w-60 p-3 rounded-md hover:text-DARKRED hover:bg-white border border-DARKRED duration-300 ease-linear"
                    onClick={() => {
                      dispatch(closePopup());
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Login to order
                  </button>
                </Link>
              </p>
            </div>
          ) : (
            <div className="md:w-7/12 w-full space-y-2">
              <p className="text-black font-semibold">
                {singleProduct?.number}
              </p>{" "}
              <p className="font-bold text-2xl">{singleProduct?.name}</p>
              <p
                className="font-medium text-lg whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: singleProduct?.longDesc }}
              ></p>
              <p className="font-medium"> {singleProduct?.package}</p>
              <p className="text-black font-semibold text-base">
                {singleProduct?.PK} PC / PK | {singleProduct?.CTN} PC / CTN
              </p>
              <p className="text-PRIMARY font-semibold text-lg pb-3">
                ${singleProduct?.price}/PC | $
                {(singleProduct?.price * singleProduct?.PK).toFixed(2)}/PK | $
                {(singleProduct?.price * singleProduct?.CTN).toFixed(2)}/CTN
              </p>
              <hr className="pt-3" />
              <p className="flex items-center gap-x-4">
                <input
                  name="quantity"
                  type="radio"
                  className="h-5 w-5 inline-block"
                  onChange={(e) => setSelectedItemType(e.target.value)}
                  value="pk"
                  ref={pkRef}
                  disabled={
                    (addProductToCartLoading &&
                      selectedProductId === singleProduct?._id) ||
                    findInCart?.product?._id === singleProduct?._id
                  }
                />
                <span>Order By PK*</span>
              </p>
              {/* pk */}
              <div className="flex w-full items-center gap-x-4">
                <button
                  type="button"
                  disabled={
                    (!addProductToCartLoading &&
                      selectedProductId === singleProduct?._id) ||
                    findInCart?.type === "ctn"
                  }
                >
                  <AiOutlineMinus
                    onClick={() => {
                      handleOnClickFieldForBoth("minus", "pk");
                    }}
                    className="w-7 h-7"
                  />
                </button>
                <p className={`lg:w-1/3 md:w-1/2 w-10/12 relative  `}>
                  <span
                    className={`absolute  top-1/2 w-full max-w-[4rem] text-sm ${
                      pkitemsQuantity === "" && alreadyInCartPkItems === ""
                        ? "text-gray-400 font-normal"
                        : "text-BLACK font-semibold"
                    }
                    -translate-y-1/2 left-2`}
                  >
                    {`${
                      pkitemsQuantity === "" && alreadyInCartPkItems === ""
                        ? singleProduct?.PK
                        : findInCart?.product?._id === singleProduct?._id
                        ? alreadyInCartPkItems
                        : pkitemsQuantity
                    } PC`}
                  </span>
                  <input
                    className={`w-full font-semibold text-right p-3 pr-7 pl-16 placeholder:text-black rounded-md border outline-none border-BORDERGRAY text-black`}
                    type="number"
                    placeholder="0"
                    max="999999"
                    min="0"
                    value={
                      findInCart?.product?._id === singleProduct?._id &&
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
                      (addProductToCartLoading &&
                        selectedProductId === singleProduct?._id) ||
                      findInCart?.type === "ctn"
                    }
                  />
                  <span className="absolute font-semibold right-2 top-1/2 -translate-y-1/2">
                    PK
                  </span>
                </p>
                <button
                  type="button"
                  disabled={
                    (!addProductToCartLoading &&
                      selectedProductId === singleProduct?._id) ||
                    findInCart?.type === "ctn"
                  }
                >
                  <AiOutlinePlus
                    onClick={() => {
                      handleOnClickFieldForBoth("plus", "pk");
                    }}
                    className="w-7 h-7"
                  />
                </button>
              </div>
              {/* ctn */}
              <p className="flex items-center gap-x-4">
                <input
                  name="quantity"
                  type="radio"
                  className="h-5 w-5 inline-block"
                  onChange={(e) => setSelectedItemType(e.target.value)}
                  ref={ctnRef}
                  value="ctn"
                  disabled={
                    (addProductToCartLoading &&
                      selectedProductId === singleProduct?._id) ||
                    findInCart?.product?._id === singleProduct?._id
                  }
                />
                <span>Order By CTN*</span>
              </p>
              <div className="flex w-full items-center gap-x-4 ">
                <button
                  type="button"
                  disabled={
                    (!addProductToCartLoading &&
                      selectedProductId === singleProduct?._id) ||
                    findInCart?.type === "pk"
                  }
                >
                  <AiOutlineMinus
                    onClick={() => {
                      handleOnClickFieldForBoth("minus", "ctn");
                    }}
                    className="w-7 h-7"
                  />
                </button>
                <p className={`lg:w-1/3 md:w-1/2 w-10/12 relative`}>
                  <span
                    className={`absolute  top-1/2 w-full max-w-[4rem] text-sm ${
                      ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                        ? "text-gray-400 font-normal"
                        : "text-BLACK font-semibold"
                    } 
                    -translate-y-1/2 left-2`}
                  >
                    {`${
                      ctnItemQuantity === "" && alreadyInCartCtnItems === ""
                        ? singleProduct?.CTN
                        : findInCart?.product?._id === singleProduct?._id
                        ? alreadyInCartCtnItems
                        : ctnItemQuantity
                    } PC`}
                  </span>
                  <input
                    className={`w-full font-semibold text-right p-3 pr-9 pl-16 placeholder:text-black rounded-md border outline-none border-BORDERGRAY text-black`}
                    placeholder="0"
                    type="number"
                    min="0"
                    max="999999"
                    value={
                      findInCart?.product?._id === singleProduct?._id &&
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
                      (addProductToCartLoading &&
                        selectedProductId === singleProduct?._id) ||
                      findInCart?.type === "pk"
                    }
                  />
                  <span className="absolute font-semibold right-1 top-1/2 -translate-y-1/2">
                    CTN
                  </span>
                </p>
                <button
                  type="button"
                  disabled={
                    (!addProductToCartLoading &&
                      selectedProductId === singleProduct?._id) ||
                    findInCart?.type === "pk"
                  }
                >
                  <AiOutlinePlus
                    onClick={() => {
                      handleOnClickFieldForBoth("plus", "ctn");
                    }}
                    disabled={
                      (!addProductToCartLoading &&
                        selectedProductId === singleProduct?._id) ||
                      findInCart?.type === "pk"
                    }
                    className="w-7 h-7"
                  />
                </button>
              </div>
              {/* cart btn */}
              <p className="flex items-center gap-x-3 pb-3">
                <Link
                  to={
                    user === null
                      ? "/sign-in"
                      : findInCart !== null &&
                        singleProduct?._id === findInCart?.product?._id &&
                        !changeTo
                      ? "/cart"
                      : null
                  }
                >
                  {changingLoading && findInCart?.quantity !== 0 && changeTo ? (
                    <button
                      type="button"
                      className={` ${
                        findInCart?.product?._id === singleProduct?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      } text-center w-60 p-3 rounded-lg`}
                      disabled={
                        (loading && selectedProductId === singleProduct?._id) ||
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
                        findInCart?.product?._id === singleProduct?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      }  text-center w-60 p-3 rounded-lg`}
                      disabled={
                        loading && selectedProductId === singleProduct?._id
                      }
                      onClick={() => {
                        handleSubmitAddProduct();
                      }}
                    >
                      {loading && selectedProductId === singleProduct?._id
                        ? t("Removing").concat("...")
                        : findInCart !== null &&
                          singleProduct?._id === findInCart?.product?._id &&
                          t("Remove from cart")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={` ${
                        findInCart?.product?._id === singleProduct?._id
                          ? "bg-REDPALE text-black"
                          : "bg-DARKRED text-white"
                      } text-center rounded-lg w-60 p-3 `}
                      onClick={() => handleSubmitAddProduct()}
                      disabled={
                        loading && selectedProductId === singleProduct?._id
                      }
                    >
                      {loading && selectedProductId === singleProduct?._id ? (
                        t("Adding").concat("...")
                      ) : findInCart !== null &&
                        singleProduct?._id === findInCart?.product?._id ? (
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
                ) : isFavorite ? (
                  <AiFillHeart
                    className="w-10 h-10 text-DARKRED"
                    role="button"
                    onClick={() =>
                      handleRemoveFromFavourties(singleProduct?._id)
                    }
                  />
                ) : (
                  <AiOutlineHeart
                    className="w-10 h-10 text-DARKRED"
                    role="button"
                    onClick={() => handleAddtoFavourties(singleProduct?._id)}
                  />
                )}{" "}
              </p>
              <hr className="pt-3" />
              <p className="text-2xl font-bold">Specification</p>
              {singleProduct?.UPC !== "" && (
                <p className="flex items-center justify-between w-full">
                  <span className="font-normal">UPC Code</span>
                  <span className="font-semibold">
                    {singleProduct?.UPC ?? "-"}
                  </span>
                </p>
              )}
              <p className="flex items-center justify-between w-full">
                <span className="font-normal">PK</span>
                <span className="font-semibold">{singleProduct?.PK}</span>
              </p>
              <p className="flex items-center justify-between w-full">
                <span className="font-normal">CTN</span>
                <span className="font-semibold">{singleProduct?.CTN}</span>
              </p>
              <p className="flex items-center justify-between w-full">
                <span className="font-normal">CTN Dimensions</span>
                <span className="font-semibold">
                  {singleProduct?.length}{" "}
                  {singleProduct?.UoM === "Feet" ? "ft" : "inch"} x{" "}
                  {singleProduct?.width}{" "}
                  {singleProduct?.UoM === "Feet" ? "ft" : "inch"} x{" "}
                  {singleProduct?.height}{" "}
                  {singleProduct?.UoM === "Feet" ? "ft" : "inch"}
                </span>
              </p>
              <p className="flex items-center justify-between w-full">
                <span className="font-normal">PK Volume</span>
                <span className="font-semibold">
                  {singleProduct?.PKVolume} CUFT
                </span>
              </p>
              <p className="flex items-center justify-between w-full">
                <span className="font-normal">CTN Volume</span>
                <span className="font-semibold">
                  {singleProduct?.CTNVolume} CUFT
                </span>
              </p>
              <p className="flex items-center justify-between w-full">
                <span className="font-normal">PK Weight</span>
                <span className="font-semibold">
                  {singleProduct?.PKWeight} LBS
                </span>
              </p>
              <p className="flex items-center justify-between w-full">
                <span className="font-normal">CTN Weight</span>
                <span className="font-semibold">
                  {singleProduct?.CTNWeight} LBS
                </span>
              </p>
              {singleProduct?.category.length > 0 && (
                <p className="flex items-center justify-between w-full">
                  <span className="font-normal">Category</span>
                  <span className="font-semibold">
                    {singleProduct?.category}
                  </span>
                </p>
              )}
              {singleProduct?.madeIn !== "" && (
                <p className="flex items-center justify-between w-full">
                  <span className="font-normal">Made in</span>
                  <span className="font-semibold">{singleProduct?.madeIn}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </ReactModal>
  );
};

export default ProductDetailPopup;
