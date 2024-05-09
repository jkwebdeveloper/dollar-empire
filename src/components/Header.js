import React, { useCallback, useRef } from "react";
import { TiArrowBack } from "react-icons/ti";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import {
  BsCurrencyDollar,
  BsSearch,
  BsChevronDown,
  BsChevronRight,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeActiveCategory,
  handleChangeActiveComponent,
  handleChangeActiveSubcategory,
  handleChangeProductListingError,
  handleChangeSearchActiveCategory,
  handleChangeSearchProducts,
  handleChangeSearchTitle,
} from "../redux/GlobalStates";
import { useTranslation } from "react-i18next";
import { handleChangeUserLanguage } from "../redux/AuthSlice";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { toast } from "react-hot-toast";
import { useMemo } from "react";
import { handleChangeTotal } from "../redux/CartSlice";

const Header = () => {
  const [activeCategoryForHover, setActiveCategory] = useState("");
  const [searchActiveCategoryForHover, setSearchActiveCategory] = useState("");
  const [subCategoryProducts, setSubCategoryProducts] = useState([]);
  const [showCategoryDropdown, setshowCategoryDropdown] = useState(false);
  const [showSecondCategoryDropDown, setshowSecondCategoryDropDown] =
    useState(false);
  const [dynamicTop, setDynamicTop] = useState(1);
  const [serachKeyword, setSerachKeyword] = useState("");

  const { user, userLanguage } = useSelector((state) => state.Auth);
  const { activeSubcategory, activeCategory, searchActiveCategory } =
    useSelector((state) => state.globalStates);
  const { cartItems } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const { categories, loading, subCategories, minOrderAmount, filters } =
    useSelector((state) => state.getContent);

  const { t } = useTranslation();

  const searchRef = useRef(null);
  const dropDownRef = useRef(null);
  const secondDropDownRef = useRef(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (showCategoryDropdown || showSecondCategoryDropDown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showCategoryDropdown, showSecondCategoryDropDown]);

  // set active subcategory
  useEffect(() => {
    if (activeCategoryForHover !== "" && searchActiveCategoryForHover === "") {
      setSubCategoryProducts(subCategories[activeCategoryForHover]);
    } else {
      setSubCategoryProducts(subCategories[searchActiveCategoryForHover]);
    }
  }, [activeCategoryForHover, searchActiveCategoryForHover]);

  const handleSearchProducts = (e) => {
    dispatch(handleChangeProductListingError(""));
    e.preventDefault();
    if (serachKeyword === "") {
      toast.remove();
      searchRef.current.focus();
      dispatch(handleChangeProductListingError("Please enter a search term"));
      return toast.error("Please enter a search term");
    }

    const filteredProducts = allProducts.filter((entry) =>
      Object.values(entry).some((val) => {
        if (typeof val === "string") {
          if (searchActiveCategory === "All Categories") {
            const keyWords = serachKeyword.split(" ");
            for (let i = 0; i < keyWords.length; i++) {
              return (
                val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                val.toLocaleLowerCase().includes(keyWords[i]) ||
                val.toLocaleLowerCase().includes(serachKeyword)
              );
            }
          } else {
            const keyWords = serachKeyword.split(" ");
            for (let i = 0; i < keyWords.length; i++) {
              return (
                entry?.category.includes(searchActiveCategory) &&
                (val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                  val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                  val.toLocaleLowerCase().includes(keyWords[i]) ||
                  val.toLocaleLowerCase().includes(serachKeyword))
              );
            }
            // return (
            //   entry?.category.includes(searchActiveCategory) &&
            //   val.toLocaleLowerCase().includes(serachKeyword)
            // );
          }
        }
      }),
    );
    if (filteredProducts.length === 0) {
      dispatch(
        handleChangeProductListingError(
          `No results found: "${serachKeyword}" in ${
            searchActiveCategory ?? ""
          } .`,
        ),
      );
      dispatch(handleChangeActiveCategory("All Categories"));
      dispatch(handleChangeSearchActiveCategory("All Categories"));
      dispatch(handleChangeSearchTitle(""));
      dispatch(handleChangeSearchProducts([]));
      setSerachKeyword("");
      navigate(`/product-listing/all-products`);
      return toast.error(
        `No results found: "${serachKeyword}" in ${
          searchActiveCategory ?? ""
        } .`,
        {
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        },
      );
    } else {
      dispatch(handleChangeSearchProducts(filteredProducts));
      dispatch(handleChangeActiveCategory("All Categories"));
      dispatch(handleChangeSearchActiveCategory("All Categories"));
      navigate(`/product-listing/search`);
      dispatch(handleChangeProductListingError(""));
      handleChangeSearch(serachKeyword);
      setSerachKeyword("");
      searchRef.current.blur();
    }
  };

  const handlechangeuserlanguage = () => {
    if (userLanguage === "en") {
      window.localStorage.setItem("user_lang", JSON.stringify("es"));
      dispatch(handleChangeUserLanguage(userLanguage === "en" ? "es" : "en"));
      window.location.reload();
    } else {
      window.localStorage.setItem("user_lang", JSON.stringify("en"));
      dispatch(handleChangeUserLanguage(userLanguage === "es" ? "en" : "es"));
      window.location.reload();
    }
  };

  // outside click for first dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        onClickOutsideForFirstDropdown && onClickOutsideForFirstDropdown();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutsideForFirstDropdown]);

  // outside click for second dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        secondDropDownRef.current &&
        !secondDropDownRef.current.contains(event.target)
      ) {
        onClickOutsideForSecondDropdown && onClickOutsideForSecondDropdown();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutsideForSecondDropdown]);

  function onClickOutsideForFirstDropdown() {
    setshowCategoryDropdown(false);
  }

  function onClickOutsideForSecondDropdown() {
    setshowSecondCategoryDropDown(false);
  }

  function handleDynamicTop(index, from) {
    if (window.screen.width > 600) {
      if (index <= 3) {
        setDynamicTop(index + 2);
      } else if (index >= 4 && index <= 7) {
        setDynamicTop(index + 5);
      } else if (index >= 8 && index < 11) {
        setDynamicTop(index + 10);
      } else if (index >= 11) {
        setDynamicTop(index + 25);
      }
    } else {
      if (from !== "second") {
        if (index <= 3) {
          setDynamicTop(index + 2);
        } else if (index >= 4 && index <= 7) {
          setDynamicTop(index + 9);
        } else if (index >= 8 && index < 11) {
          setDynamicTop(index + 17);
        } else if (index >= 11) {
          setDynamicTop(index + 38);
        }
      } else {
        if (index <= 3) {
          setDynamicTop(index + 2);
        } else if (index >= 4 && index <= 7) {
          setDynamicTop(index + 5);
        } else if (index >= 8 && index < 11) {
          setDynamicTop(index + 10);
        } else if (index >= 11) {
          setDynamicTop(index + 25);
        }
      }
    }
  }

  const calculateTotalQuantity = () => {
    const value = cartItems.reduce((acc, current) => {
      if (current?.type === "pk") {
        return (
          acc + parseInt(current?.quantity) * parseInt(current?.product?.PK)
        );
      } else if (current?.type === "ctn") {
        return (
          acc + parseInt(current?.quantity) * parseInt(current?.product?.CTN)
        );
      }
    }, 0);
    return value;
  };

  const calculateTotalAmount = () => {
    const value = cartItems.reduce((acc, current) => {
      if (current?.type === "pk") {
        return (
          acc +
          current?.product?.price *
            parseInt(current?.quantity) *
            parseInt(current?.product?.PK)
        );
      } else if (current?.type === "ctn") {
        return (
          acc +
          current?.product?.price *
            parseInt(current?.quantity) *
            parseInt(current?.product?.CTN)
        );
      }
    }, 0);
    dispatch(handleChangeTotal(value));
    return value;
  };

  const totalQty = useMemo(calculateTotalQuantity, [cartItems]);
  const totalAmount = useMemo(calculateTotalAmount, [cartItems]);

  // for search typing debouce
  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  // for dispatch serachterm
  const handleChangeSearch = (value) => {
    dispatch(handleChangeSearchTitle(value.toLocaleLowerCase().trim()));
  };

  const optimizedFn = useCallback(debounce(handleChangeSearch), []);

  const handleChangeKeyword = (e) => {
    if (e.target.value.length > 200) {
      toast.remove();
      toast.error("maximum 200 character allowed.");
      return true;
    } else {
      setSerachKeyword(e.target.value.toLocaleLowerCase());
      optimizedFn(e.target.value);
    }
  };

  return (
    <div className="h-auto w-auto">
      {(showCategoryDropdown || showSecondCategoryDropDown) && (
        <div className="absolute z-30 inset-0 bg-black bg-opacity-20 backdrop-blur-sm max-w-[100%] h-full" />
      )}
      {/* first section */}
      <div className="flex relative z-20 w-full justify-stretch items-center md:h-auto h-14 md:py-2 xl:px-20 md:px-10 px-3 md:gap-x-0 gap-x-1">
        {/* first logo */}
        <div className="flex-grow">
          <Link to="/" className="inline-block">
            <img
              src={require("../assets/images/dollar-empire-logo 1.png")}
              alt="logo"
              className="md:h-fit md:w-fit w-20 h-20 object-contain object-center"
            />
          </Link>
        </div>
        {/* second logo */}
        <div className="flex-grow">
          {" "}
          <Link to="/" className="inline-block">
            <img
              src={require("../assets/images/familymaid 1.png")}
              alt="logo"
              className="md:h-fit md:w-fit w-24 h-24 object-contain object-center"
            />
          </Link>
        </div>
        {/* language + login /register */}
        <div className="flex items-center md:gap-x-8 gap-x-1 md:text-lg font-semibold ">
          <p
            className="text-sm text-PRIMARY"
            role="button"
            onClick={() => handlechangeuserlanguage()}
          >
            <span className="flex items-center">
              SP <TiArrowBack className="h-5 w-5 inline-block" color="blue" />
            </span>
            <span className="flex items-center">
              <TiArrowBack
                className="h-5 w-5 inline-block rotate-180"
                color="blue"
              />
              EN
            </span>
          </p>

          {user === null ? (
            <>
              <button type="button" className="">
                <Link to="/sign-in">{t("login")}</Link>
                <Link to="/sign-up" className="md:inline-block hidden">
                  / {t("register")}
                </Link>
              </button>
            </>
          ) : (
            <>
              <Link to="/my-account" className="md:block hidden">
                <div className="flex items-center gap-x-2">
                  <AiOutlineUser className="w-8 h-8" />
                  <p className="text-left">
                    <span className="text-gray-400 font-semibold text-sm block capitalize">
                      {t("hello")}, {user?.fname}
                    </span>
                    <span className="text-BLACK md:text-base text-sm font-bold block">
                      {t("my_account")}
                    </span>
                  </p>
                </div>
              </Link>
              <Link to="/my-account" className="md:hidden block">
                <AiOutlineUser
                  role="button"
                  className="h-8 w-8 block md:hidden"
                />
              </Link>
            </>
          )}
        </div>

        {/* sidebar for mobile */}
        {/* <div
          className={`absolute z-40 top-0 right-0 text-center transform duration-300 ease-in origin-top-right ${
            openSidebar ? "scale-100" : "scale-0"
          } font-semibold text-xl bg-white w-full h-screen p-3 text-PRIMARY space-y-3`}
        >
          <p className="pt-4">
            <HiXMark
              role="button"
              onClick={() => setOpenSidebar(false)}
              className="h-6 w-6 float-right"
            />
          </p>
          {user === null ? (
            <>
              <p className="pt-5" onClick={() => setOpenSidebar(false)}>
                <Link to="/sign-in">{t("login")}</Link>
              </p>
              <p className="pt-5" onClick={() => setOpenSidebar(false)}>
                <Link to="/sign-up">{t("register")}</Link>
              </p>
            </>
          ) : (
            <p className="pt-5" onClick={() => setOpenSidebar(false)}>
              <Link to="/my-account">{t("my_account")}</Link>
            </p>
          )}
        </div> */}
      </div>
      {/* second section */}
      <div className="bg-PRIMARY text-white w-full flex lg:flex-row flex-col justify-between lg:items-center items-start gap-5 lg:gap-0 md:py-5 py-2 xl:px-20 md:px-10 px-3">
        {/* left side div */}
        <div className="lg:w-1/2 w-full text-black">
          <div
            className={`capitalize font-semibold relative ${
              showCategoryDropdown ? "z-30" : "z-20"
            } flex items-center w-full bg-white rounded-md p-1`}
          >
            {/* menu */}
            <div ref={dropDownRef} className="relative z-0 w-fit">
              <p
                onClick={() => setshowCategoryDropdown(true)}
                className="cursor-pointer hover:border-[3px] w-full transition rounded-lg border-dotted md:p-2 p-1 border-black flex items-center justify-between flex-row text-black font-normal "
              >
                <span className="md:text-base text-sm whitespace-nowrap w-fit">
                  {searchActiveCategory}
                </span>
                <BsChevronDown className="md:min-h-[1rem] md:min-w-[1rem] mx-1" />
              </p>
              {/* menu */}
              {showCategoryDropdown && (
                <div className="text-left md:p-2 p-0.5 absolute top-11 -left-1 z-20 bg-white md:min-w-[14rem] min-w-[12rem] rounded-md transform duration-300 ease-in origin-top-left">
                  <div className="pl-3 text-base font-normal text-gray-400 capitalize space-y-1 w-full">
                    {loading ? (
                      <SkeletonTheme
                        baseColor="lightgray"
                        highlightColor="white"
                        duration={0.5}
                        borderRadius="5px"
                      >
                        <Skeleton className=" h-4" />
                        <Skeleton className=" h-4" />
                        <Skeleton className=" h-4" />
                        <Skeleton className=" h-4" />
                        <Skeleton className=" h-4" />
                        <Skeleton className=" h-4" />
                      </SkeletonTheme>
                    ) : (
                      <>
                        <Link
                          onClick={() => {
                            dispatch(
                              handleChangeSearchActiveCategory(
                                "All Categories",
                              ),
                            );
                            setshowCategoryDropdown(false);
                          }}
                          to={`/product-listing/all-products`}
                        >
                          <span className="cursor-pointer hover:font-bold hover:bg-gray-200 py-1 text-BLACK font-semibold whitespace-nowrap block">
                            {t("all_categories")}
                          </span>
                        </Link>
                        {categories.map((category, i) => (
                          <div
                            className={`z-30 cursor-pointer hover:font-bold ${
                              activeCategory === category.name && "bg-gray-200"
                            } hover:bg-gray-200 py-1 text-BLACK font-semibold flex items-center gap-x-2`}
                            key={category?._id}
                            onMouseOver={() => {
                              setSearchActiveCategory(category.name);
                              setActiveCategory("");
                              handleDynamicTop(i, "second");
                            }}
                            onClick={() => {
                              setSearchActiveCategory(category.name);
                              handleDynamicTop(i, "second");
                            }}
                          >
                            <Link
                              key={category?._id}
                              to={`/product-listing/${category.name}`}
                              onClick={() => {
                                dispatch(handleChangeActiveSubcategory(""));
                                dispatch(
                                  handleChangeSearchActiveCategory(
                                    category?.name,
                                  ),
                                );
                                setshowCategoryDropdown(false);
                              }}
                            >
                              {category.name} ({category?.productCount})
                            </Link>
                            <BsChevronRight
                              onClick={() => {
                                setSearchActiveCategory(category.name);
                              }}
                              className="inline-block ml-auto h-5 w-5 text-gray-400 bg-gray-100"
                            />
                          </div>
                        ))}
                      </>
                    )}

                    <div
                      className={`text-left space-y-2 p-3 absolute left-full z-40 bg-white md:min-w-[10rem] min-w-[3rem]`}
                      style={{ top: `${dynamicTop}rem` }}
                    >
                      <span className="font-semibold text-black text-xl mb-1">
                        {searchActiveCategoryForHover}
                      </span>

                      {subCategoryProducts?.subcategories !== undefined &&
                        subCategoryProducts?.subcategories.map((item) => (
                          <Link
                            key={item?._id}
                            to={`/product-listing/${searchActiveCategoryForHover}`}
                            state={{
                              title: searchActiveCategoryForHover,
                              price: null,
                              searchQuery: "",
                            }}
                            onClick={() => {
                              dispatch(
                                handleChangeActiveSubcategory(item?.name),
                              );
                              dispatch(
                                handleChangeSearchActiveCategory(
                                  searchActiveCategoryForHover,
                                ),
                              );
                              setshowCategoryDropdown(false);
                            }}
                          >
                            <span
                              className={`font-normal text-black mb-1 md:whitespace-nowrap block hover:font-semibold ${
                                activeSubcategory === item?.name &&
                                "bg-gray-200"
                              } `}
                            >
                              {item.name} ({item?.productCount})
                            </span>
                          </Link>
                        ))}

                      {/* L to H for category */}
                      <Link
                        onClick={() => {
                          dispatch(
                            handleChangeActiveSubcategory("low_to_high"),
                          );
                          dispatch(
                            handleChangeActiveCategory(
                              searchActiveCategoryForHover,
                            ),
                          );
                          setshowCategoryDropdown(false);
                        }}
                        to={`/product-listing/${searchActiveCategoryForHover}`}
                      >
                        <span className="font-normal mb-1 text-black whitespace-nowrap block hover:font-semibold">
                          {t("View all")} ({t("Low to high")})
                        </span>
                      </Link>
                      {/*  H to L for category */}
                      <Link
                        onClick={() => {
                          dispatch(
                            handleChangeActiveSubcategory("high_to_low"),
                          );
                          dispatch(
                            handleChangeActiveCategory(
                              searchActiveCategoryForHover,
                            ),
                          );
                          setshowCategoryDropdown(false);
                        }}
                        to={`/product-listing/${searchActiveCategoryForHover}`}
                      >
                        <span className="font-normal mb-1 text-black whitespace-nowrap block hover:font-semibold">
                          {t("View all")} ({t("High to low")})
                        </span>
                      </Link>
                    </div>
                    {/* low to high */}
                    <div
                      className={` z-50 cursor-pointer hover:font-bold hover:bg-BACKGROUNDGRAY py-1 text-BLACK font-semibold flex items-center gap-x-2`}
                    >
                      <Link
                        onClick={() => {
                          setshowCategoryDropdown(false);
                        }}
                        to={`/product-listing/low-to-high`}
                      >
                        View all (Low to high)
                        {/* View all (Low to high) */}
                      </Link>
                    </div>
                    {/* high to low */}
                    <div
                      className={`z-50 cursor-pointer hover:font-bold hover:bg-BACKGROUNDGRAY py-1 text-BLACK font-semibold flex items-center gap-x-2`}
                    >
                      <Link
                        onClick={() => {
                          setshowCategoryDropdown(false);
                        }}
                        to={`/product-listing/high-to-low`}
                      >
                        View all (High to low)
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className="px-2 text-gray-400">|</span>
            {/* input field */}
            <form onSubmit={(e) => handleSearchProducts(e)} className="w-full">
              <input
                ref={searchRef}
                type="text"
                className="rounded-tr-lg z-0 rounded-br-lg outline-none w-full text-black pr-10 md:text-base text-sm"
                placeholder={t("search_products").concat("...")}
                value={serachKeyword}
                onChange={(e) => {
                  handleChangeKeyword(e);
                }}
              />
              <button type="submit">
                <BsSearch
                  className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-3 z-10 text-black"
                  onClick={(e) => {
                    handleSearchProducts(e);
                    setshowCategoryDropdown(false);
                  }}
                />
              </button>
            </form>
          </div>
        </div>
        {/* cart + amount */}
        <Link
          to="/cart"
          onClick={() => dispatch(handleChangeActiveComponent("Shopping Cart"))}
        >
          <div className="flex items-center gap-x-2 flex-wrap">
            <AiOutlineShoppingCart className="w-7 h-7" />
            <p>
              <span className="md:mr-2 mr-1">{t("shopping_cart")}:</span>
              <input
                type="number"
                className="max-w-[5rem] inline-block text-black h-9 p-1 text-center rounded-md outline-none placeholder:text-black"
                placeholder="0"
                value={totalQty}
                readOnly={true}
              />
              <span className="md:ml-2 ml-1">PC</span>
            </p>
            <p>|</p>
            <p>
              <BsCurrencyDollar className="h-5 w-5 md:mr-2 inline-block" />
              <input
                type="number"
                className="lg:max-w-[5rem] max-w-[6rem] h-9 text-black p-1 text-center rounded-md outline-none placeholder:text-black"
                placeholder="0"
                value={parseFloat(totalAmount).toFixed(2)}
                readOnly={true}
              />
            </p>
          </div>
        </Link>
      </div>
      {/* third section */}
      <div
        className={`xl:px-20 md:px-10 w-full flex flex-wrap md:gap-5 gap-3 items-center justify-start md:py-5 py-2 font-semibold md:text-lg px-3 ${
          (window.location.pathname.includes("my-account") ||
            window.location.pathname.includes("product-listing") ||
            window.location.pathname.includes("favourites")) &&
          "bg-BACKGROUNDGRAY"
        }`}
      >
        {/* all categories */}
        <div
          className={`capitalize font-semibold relative ${
            showSecondCategoryDropDown ? "z-30" : "z-20"
          } md:min-w-[14rem]`}
        >
          <p
            onClick={() => setshowSecondCategoryDropDown(true)}
            className="cursor-pointer flex items-center justify-between flex-row w-auto md:p-3 p-2 bg-black text-white "
          >
            <span className="md:text-xl text-lg whitespace-nowrap">
              {activeCategory}
            </span>
            <BsChevronDown className="h-4 w-4 ml-2" />
          </p>
          {/* menu */}
          {showSecondCategoryDropDown && (
            <div
              ref={secondDropDownRef}
              className="text-left md:p-2 p-1 h-auto absolute md:top-[52px] top-11 left-0 bg-white md:min-w-[14rem] sm:min-w-[6rem] md:max-w-none max-w-[12rem] rounded-md transform duration-300 ease-in origin-top-left"
            >
              <div className="pl-3 text-base font-normal text-gray-400 capitalize space-y-1 w-full">
                {loading ? (
                  <SkeletonTheme
                    baseColor="lightgray"
                    highlightColor="white"
                    duration={0.5}
                    borderRadius="5px"
                  >
                    <Skeleton className=" h-4" />
                    <Skeleton className=" h-4" />
                    <Skeleton className=" h-4" />
                    <Skeleton className=" h-4" />
                    <Skeleton className=" h-4" />
                    <Skeleton className=" h-4" />
                  </SkeletonTheme>
                ) : (
                  <>
                    <Link
                      onClick={() => {
                        setshowSecondCategoryDropDown(false);
                        dispatch(handleChangeActiveCategory("All Categories"));
                      }}
                      to={`/product-listing/all-products`}
                    >
                      <span className="cursor-pointer hover:font-bold hover:bg-gray-200 py-1 text-BLACK font-semibold whitespace-nowrap block">
                        {t("all_categories")}
                      </span>
                    </Link>
                    {categories.map((category, i) => (
                      <div
                        className={`z-30 cursor-pointer hover:font-bold ${
                          activeCategory === category.name && "bg-gray-200"
                        } hover:bg-gray-200 py-1 text-BLACK font-semibold flex items-center gap-x-2`}
                        key={category?._id}
                        onMouseOver={() => {
                          setActiveCategory(category.name);
                          handleDynamicTop(i);
                          setSearchActiveCategory("");
                        }}
                        onClick={() => {
                          setActiveCategory(category.name);
                          handleDynamicTop(i);
                          setSearchActiveCategory("");
                        }}
                      >
                        <Link
                          key={category?._id}
                          to={`/product-listing/${category.name}`}
                          onClick={() => {
                            dispatch(handleChangeActiveSubcategory(""));
                            dispatch(
                              handleChangeActiveCategory(category?.name),
                            );
                            setshowSecondCategoryDropDown(false);
                          }}
                        >
                          {category.name} ({category?.productCount})
                        </Link>
                        <BsChevronRight
                          onClick={() => {
                            setActiveCategory(category.name);
                          }}
                          className="inline-block ml-auto min-h-[20px] min-w-[20px] text-gray-400 bg-gray-100"
                        />
                        {/* side dropdown */}
                      </div>
                    ))}
                  </>
                )}

                <div
                  className={`text-left space-y-2 p-3 absolute left-full z-40 bg-white md:min-w-[10rem] min-w-[3rem]`}
                  style={{ top: `${dynamicTop}rem` }}
                >
                  <span className="font-semibold text-black text-xl mb-1">
                    {activeCategoryForHover}
                  </span>
                  {subCategoryProducts?.subcategories !== undefined &&
                    subCategoryProducts?.subcategories.map((item) => (
                      <>
                        <Link
                          key={item?._id}
                          to={`/product-listing/${activeCategoryForHover}`}
                          state={{
                            title: activeCategoryForHover,
                            price: null,
                            searchQuery: "",
                          }}
                          onClick={() => {
                            dispatch(handleChangeActiveSubcategory(item?.name));
                            dispatch(
                              handleChangeActiveCategory(
                                activeCategoryForHover,
                              ),
                            );
                            setshowSecondCategoryDropDown(false);
                          }}
                        >
                          <span
                            className={`font-normal text-black mb-1 md:whitespace-nowrap block hover:font-semibold ${
                              activeSubcategory === item?.name && "bg-gray-200"
                            } `}
                          >
                            {item.name} ({item?.productCount})
                          </span>
                        </Link>
                      </>
                    ))}
                  {/* L to H for category */}
                  <Link
                    onClick={() => {
                      setshowSecondCategoryDropDown(false);
                      dispatch(handleChangeActiveSubcategory("low_to_high"));
                      dispatch(
                        handleChangeActiveCategory(activeCategoryForHover),
                      );
                    }}
                    to={`/product-listing/${activeCategoryForHover}`}
                  >
                    <span className="font-normal mb-1 text-black whitespace-nowrap block hover:font-semibold">
                      {t("View all")} ({t("Low to high")})
                    </span>
                  </Link>
                  {/*  H to L for category */}
                  <Link
                    onClick={() => {
                      setshowSecondCategoryDropDown(false);
                      dispatch(handleChangeActiveSubcategory("high_to_low"));
                      dispatch(
                        handleChangeActiveCategory(activeCategoryForHover),
                      );
                    }}
                    to={`/product-listing/${activeCategoryForHover}`}
                  >
                    <span className="font-normal mb-1 text-black whitespace-nowrap block hover:font-semibold">
                      {t("View all")} ({t("High to low")})
                    </span>
                  </Link>
                </div>
                {/* low to high */}
                <div
                  className={` z-50 cursor-pointer hover:font-bold hover:bg-BACKGROUNDGRAY py-1 text-BLACK font-semibold flex items-center gap-x-2`}
                >
                  <Link
                    onClick={() => {
                      setshowSecondCategoryDropDown(false);
                    }}
                    to={`/product-listing/low-to-high`}
                  >
                    View all (Low to high)
                  </Link>
                </div>
                {/* high to low */}
                <div
                  className={`z-50 cursor-pointer hover:font-bold hover:bg-BACKGROUNDGRAY py-1 text-BLACK font-semibold flex items-center gap-x-2`}
                >
                  <Link
                    onClick={() => {
                      setshowSecondCategoryDropDown(false);
                    }}
                    to={`/product-listing/high-to-low`}
                  >
                    View all (High to low)
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* new arrivals */}
        <p>
          <Link
            to={`/product-listing/new-arrivals`}
            state={{ title: "new-arrivals", price: null, searchQuery: "" }}
          >
            {t("new_arrivals")}
          </Link>
        </p>
        {/* top sellers */}
        <p>
          <Link
            to={`/product-listing/top-sellers`}
            state={{ title: "Top Sellers", price: null, searchQuery: "" }}
          >
            {t("top_sellers")}
          </Link>
        </p>
        {/* by price */}
        <div role="button" className="group relative z-10">
          {t("by_price")}
          <div className="text-left p-2 shadow-md absolute top-8 left-0 z-10 bg-white w-48 rounded-md group-hover:scale-100 scale-0 transform duration-300 ease-in origin-top-left">
            <ul className="pl-3 text-lg font-normal text-gray-400 capitalize space-y-2">
              <li
                className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
              >
                <Link to={`/product-listing/all-products`}>{t("any")}</Link>
              </li>
              {filters.length > 0 ? (
                filters.map((filter, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
                  >
                    <Link to={`/product-listing/${filter}`}>{filter}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li
                    className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
                  >
                    <Link to={`/product-listing/Below $0.49`}>Below $0.49</Link>
                  </li>
                  <li
                    className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
                  >
                    <Link to={`/product-listing/$0.50 - $0.79`}>
                      $0.50 - $0.79
                    </Link>
                  </li>
                  <li
                    className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
                  >
                    <Link to={`/product-listing/$0.80 - $0.99`}>
                      $0.80 - $0.99
                    </Link>
                  </li>
                  <li
                    className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
                  >
                    <Link to={`/product-listing/$1.00 - $1.49`}>
                      $1.00 - $1.49
                    </Link>
                  </li>
                  <li
                    className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
                  >
                    <Link to={`/product-listing/$1.50 - $1.99`}>
                      $1.50 - $1.99
                    </Link>
                  </li>
                  <li
                    className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
                  >
                    <Link
                      to={`/product-listing/$2.00 And Above
`}
                    >
                      $2.00 And {t("Above")}
                    </Link>
                  </li>
                </>
              )}
              <li
                className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
              >
                <Link to={`/product-listing/low-to-high`}>
                  {t("Low to high")}
                </Link>
              </li>
              <li
                className={`cursor-pointer hover:font-bold text-BLACK font-semibold flex items-center gap-x-2`}
              >
                <Link to={`/product-listing/high-to-low`}>
                  {t("High to low")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* favourites */}
        <p role="button">
          <Link to="/favourites">{t("your_favourites")}</Link>
        </p>
        <p className="bg-DARKYELLOW text-black p-2 whitespace-nowrap">
          {t("minimum_order")} ${minOrderAmount}
        </p>
      </div>
    </div>
  );
};

export default Header;
