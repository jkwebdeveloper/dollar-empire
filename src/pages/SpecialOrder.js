import React from "react";
import { Helmet } from "react-helmet";
import TItleSection from "../components/TItleSection";
import bgImg from "../assets/images/special-order.jpg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { handleGetSpecialOrders } from "../redux/GetContentSlice";

const SpecialOrder = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { specialOrders, loading } = useSelector((state) => state.getContent);

  useEffect(() => {
    dispatch(handleGetSpecialOrders());
  }, []);

  return (
    <>
      <Helmet title={t("Special orders | Dollar Empire")} />
      {loading ? (
        <div className="text-center h-screen w-screen mx-auto font-semibold flex items-center justify-center md:text-3xl text-xl">
          {t("loading")}...
        </div>
      ) : (
        <div className="w-full space-y-5 md:pb-20 pb-10 ">
          <TItleSection
            title={specialOrders?.title}
            dynamicImage={specialOrders?.image}
          />
          <section
            className="container mx-auto md:space-y-5 space-y-3 space_for_div"
            dangerouslySetInnerHTML={{ __html: specialOrders?.content }}
          ></section>
          {/* <section className="container mx-auto md:space-y-10 space-y-5 w-full">
            <p className="text-TEXTGRAY font-normal tracking-normal leading-normal text-center lg:text-base text-sm lg:w-9/12 md:w-10/12 w-11/12 mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proiden.
            </p>
            <div className="mx-auto lg:w-1/3 md:w-1/2 w-3/4 rounded-md border border-BORDERGRAY p-3 text-center space-y-5">
              <p className="md:text-3xl text-xl font-bold text-center uppercase">
                Catalogs & Special
              </p>
              <p className="text-red-400 text-center">
                Call Kelly at 323-268-8999 to inquire about special orders and
                private labeling.
              </p>
              <p>
                <Link to="/contact-us">
                  <button
                    type="button"
                    className="bg-PRIMARY active:translate-y-2 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-300 p-3 text-white text-center w-40 rounded-md font-semibold"
                  >
                    Contact us
                  </button>
                </Link>
              </p>
            </div>
          </section> */}
        </div>
      )}{" "}
    </>
  );
};

export default SpecialOrder;
