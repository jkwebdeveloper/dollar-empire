import React, { Fragment } from "react";
import { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import BaseUrl from "../../BaseUrl";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Herosection = () => {
  const swiperRef = useRef(null);

  const { banners, featured, loading } = useSelector(
    (state) => state.getContent
  );

  return (
    <div className="mx-auto container xl:px-0 md:px-10 px-3 w-full space-y-3">
      {loading ? (
        <div className="overflow-hidden min-h-screen w-auto md:text-3xl text-xl flex justify-center items-center text-center font-semibold mx-auto container xl:px-0 md:px-10 px-3">
          Loading...
        </div>
      ) : (
        <>
          <Swiper
            modules={[Pagination, Autoplay]}
            speed={2000}
            autoplay={{
              pauseOnMouseEnter: true,
              delay: 5000,
              disableOnInteraction: false,
              waitForTransition: true,
            }}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            direction={"horizontal"}
            pagination={{ clickable: true }}
            className="w-full z-0 relative"
            ref={swiperRef}
          >
            {banners.map((banner, index) => (
              <SwiperSlide className="relative z-0 w-full" key={index}>
                <Link to={banner?.link} target="_blank">
                  <img
                    src={BaseUrl.concat(banner?.image)}
                    alt={banner?.imageAlt}
                    className="w-screen md:h-96 h-60 object-fill object-center"
                    loading="lazy"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="grid place-items-start justify-items-start lg:grid-cols-4 sm:grid-cols-2 w-full md:gap-3 gap-2">
            {featured.map((img, i) => (
              <Link
                key={i}
                to={img?.link}
                className="w-full"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img
                  src={BaseUrl.concat(img.image)}
                  alt={img?.imageAlt}
                  className="min-w-full md:min-h-[10rem] md:max-h-[10rem] min-h-[10rem] max-h-[10rem] object-fill object-center"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Herosection;
