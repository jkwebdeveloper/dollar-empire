import React, { Fragment, useRef, useState } from "react";
import ProductCard from "../ProductCard";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const NewArrivals = ({}) => {
  const { newArrivals, newArrivalProductLoading } = useSelector(
    (state) => state.products
  );
  const { t } = useTranslation();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <section
      id="New-Arrivals"
      className="md:space-y-5 space-y-3 relative z-0 w-full mx-auto container xl:px-0 md:px-10 px-3"
    >
      <div className="flex w-full items-center justify-between">
        <div />
        <h2 className="font-bold md:text-3xl text-xl uppercase text-center md:ml-48 ml-24">
          {t("new_arrivals")}
        </h2>
        <Link to={`/product-listing/new-arrivals`}>
          <button
            type="button"
            className="bg-PRIMARY text-white rounded-lg lg:w-40 md:w-32 w-20 md:h-10 h-8 float-right"
          >
            See All
          </button>
        </Link>
      </div>
      {newArrivals !== undefined &&
      newArrivals.length === 0 &&
      !newArrivalProductLoading ? (
        <p className="md:text-2xl text-lg mx-auto w-full text-center font-semibold">
          Unable to load products, please refresh the page
        </p>
      ) : (
        <>
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={5}
            direction={"horizontal"}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
              enabled: true,
            }}
            loop={false}
            observer={true}
            parallax={true}
            observeParents={true}
            onSwiper={(swiper) => {
              // Delay execution for the refs to be defined
              setTimeout(() => {
                // Override prevEl & nextEl now that refs are defined
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;

                // Re-init navigation
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
            breakpoints={{
              1280: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 3,
              },
              640: {
                slidesPerView: 2,
              },
              240: {
                slidesPerView: 1,
              },
            }}
            className="py-8"
          >
            {newArrivalProductLoading ? (
              <>
                <SwiperSlide>
                  <Skeleton
                    borderRadius="10px"
                    duration={0.5}
                    baseColor="lightgray"
                    highlightColor="white"
                    className="md:h-80 h-60 "
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Skeleton
                    borderRadius="10px"
                    duration={0.5}
                    baseColor="lightgray"
                    highlightColor="white"
                    className="md:h-80 h-60"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Skeleton
                    borderRadius="10px"
                    duration={0.5}
                    baseColor="lightgray"
                    highlightColor="white"
                    className="md:h-80 h-60 "
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Skeleton
                    borderRadius="10px"
                    duration={0.5}
                    baseColor="lightgray"
                    highlightColor="white"
                    className="md:h-80 h-60 "
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Skeleton
                    borderRadius="10px"
                    duration={0.5}
                    baseColor="lightgray"
                    highlightColor="white"
                    className="md:h-80 h-60 "
                  />
                </SwiperSlide>
              </>
            ) : (
              newArrivals.slice(0, 50).map((product) => (
                <SwiperSlide key={product?._id}>
                  <ProductCard
                    handleAddSelectedItem=""
                    product={product}
                    from="NewArrivals"
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
          <button
            type="button"
            ref={prevRef}
            className="rounded-full md:p-2 p-0.5 bg-white border border-black absolute top-1/2 -translate-y-1/2 xl:-left-4 md:left-4 left-0 z-20"
          >
            <AiOutlineLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            ref={nextRef}
            className="rounded-full md:p-2 p-0.5 bg-white border border-black absolute top-1/2 -translate-y-1/2 xl:-right-4 md:right-4 right-0 z-20"
          >
            <AiOutlineRight className="w-6 h-6" />
          </button>
        </>
      )}
    </section>
  );
};

export default NewArrivals;
