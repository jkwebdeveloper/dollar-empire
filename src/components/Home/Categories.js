import React from "react";
import { useDispatch, useSelector } from "react-redux";
import baseUrl from "../../BaseUrl";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import { handleChangeActiveCategory } from "../../redux/GlobalStates";

const Categories = () => {
  const { categories, loading } = useSelector((state) => state.getContent);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <section className=" w-full md:pt-5 pb-20 py-2 md:space-y-5 space-y-3 mx-auto container xl:px-0 md:px-10 px-3">
      <p className="font-bold text-center md:text-3xl text-xl uppercase">
        {t("Categories")}
      </p>
      {categories !== undefined && categories.length === 0 && !loading ? (
        <p className="md:text-2xl text-lg mx-auto w-full text-center font-semibold">
          {t("Categories Not Found, Try again sometimes")}.
        </p>
      ) : (
        <div className=" w-full grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 items-center md:gap-8 gap-5">
          {loading ? (
            <SkeletonTheme
              baseColor="lightgray"
              highlightColor="white"
              borderRadius="10px"
              duration={0.5}
            >
              <Skeleton className="w-full md:h-60 h-40" />
              <Skeleton className="w-full md:h-60 h-40" />
              <Skeleton className="w-full md:h-60 h-40" />
              <Skeleton className="w-full md:h-60 h-40" />
              <Skeleton className="w-full md:h-60 h-40 md:col-span-1 col-span-full" />
            </SkeletonTheme>
          ) : (
            categories.map((category) => (
              <Link
                to={`/product-listing/${category.name}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  dispatch(handleChangeActiveCategory(category?.name));
                }}
                key={category?._id}
                className={`space-y-3 w-full text-center ${
                  category.id === 9 &&
                  "xl:col-span-1 lg:col-span-2 lg:w-1/2 xl:w-full"
                } ${
                  category.id === 10 &&
                  "xl:col-span-1 lg:col-span-2 md:col-span-3 lg:w-1/2 md:w-1/3 xl:w-full"
                } `}
              >
                <img
                  src={baseUrl.concat(category.image)}
                  alt={category.name}
                  className="w-fit h-fit object-contain object-center rounded-lg "
                />
                <p className="capitalize md:text-lg font-bold">
                  {category.name}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default Categories;
