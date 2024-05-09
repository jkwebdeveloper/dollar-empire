import React from "react";
import Lottie from "lottie-react";
import Error404 from "../assets/animations/404.json";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-screen">
      <Lottie
        animationData={Error404}
        style={{
          cursor: "default",
          width: "fit-content",
          height: "fit-content",
        }}
      />
      <Link to="/">
        <button
          type="button"
          className="w-44 h-12 rounded-lg font-bold text-center text-white bg-GREEN"
        >
          {t("Go To Home")}
        </button>
      </Link>
    </div>
  );
};

export default PageNotFound;
