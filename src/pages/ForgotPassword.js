import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { handleForgotPassword } from "../redux/BasicFeatureSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useRef } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  

  const { loading } = useSelector((state) => state.basicFeatures);
  const { user, token } = useSelector((state) => state.Auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);

  const handleforgotPassword = () => {
    toast.dismiss();
    if (email === "") {
      return toast.error("Please Enter email");
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return toast.error("Please Enter valid email");
    }
    const response = dispatch(
      handleForgotPassword({ email, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (res.payload.status === "success") {
          setSuccess(true);
          setErrorMessage(false)
      } else if(res.payload.status==="fail"&&res.payload.message==="The email provided is not registered."){
          setErrorMessage(true)
        }
      
      });
    }
  };

  useEffect(() => {
    if (user !== null && token !== null) {
      navigate("/");
      toast.success("Already Logged in.");
    }
    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);
  return (
    <>
      <Helmet title={t("Forgot-password | Dollar Empire")} />
      {success ? (
        <div className="p-4 mx-auto xl:w-2/5 lg:w-1/2 md:w-2/3 w-11/12 h-auto space-y-4 md:my-14 my-7 rounded-lg border border-BORDERGRAY">
          <FaTelegramPlane className="text-green-400 lg:h-60 h-28 lg:w-60 w-28 mx-auto" />
          <p className="font-semibold text-center md:text-lg text-base px-5">
            {t(
              "We have e-mailed your password reset link! please check your inbox."
            )}{" "}
          </p>
        </div>
      ) : (
        <div className="p-4 mx-auto xl:w-2/5 lg:w-1/2 md:w-2/3 w-11/12 h-auto space-y-4 md:my-14 my-7 rounded-lg border border-BORDERGRAY">
          <h1 className="font-semibold md:text-3xl text-xl text-left">
            {t("Forgot Password")}
          </h1>
          <hr />
          <p className="font-medium">
            {t("Enter your email address to reset your account password.")}
          </p>
          <label className="text-black font-medium block text-left text-lg">
            {t("Email")}*
          </label>
          <input
            type="email"
            className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
            placeholder={t("Email")}
            required
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className="bg-PRIMARY hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-500 p-3 text-white text-center w-40 rounded-md uppercase font-bold"
            disabled={loading}
            onClick={() => handleforgotPassword()}
          >
            {loading ? t("Verifying...") : t("send")}
          </button>
          {errorMessage && <div className="text-red-500 font-semibold text-center">
            The email provided is not registered. Please <Link to="/sign-up" className="text-blue-500 hover:underline">sign up here.</Link>
          </div> }
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
