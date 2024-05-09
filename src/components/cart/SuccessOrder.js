import React from "react";
import success from "../../assets/animations/success.json";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const SuccessOrder = () => {
  const { orderId } = useSelector((state) => state.orders);

  const { t } = useTranslation();
  return (
    <div className="flex w-full items-center justify-center gap-5 flex-col py-10">
      <Lottie
        animationData={success}
        style={{ pointerEvents: "none", width: "300px", height: "300px" }}
      />

      <p className="font-bold text-2xl">{t("Thank you!")}</p>
      <p className="font-semibold text-lg">
        Order Number {orderId} has been confirmed
      </p>
      <Link to="/my-account">
        <button
          type="button"
          className="font-semibold border border-PRIMARY bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY w-48 text-center p-4 rounded-md"
        >
          {t("My Orders")}
        </button>
      </Link>
    </div>
  );
};

export default SuccessOrder;
