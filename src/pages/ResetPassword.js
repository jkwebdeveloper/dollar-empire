import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { handleResetPassword } from "../redux/AuthSlice";
import { useEffect } from "react";
import { BsCheckCircle, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleSuccess } from "../redux/GlobalStates";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
    showNewPassword: false,
  });

  const { loading, user, token } = useSelector((state) => state.Auth);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const AbortControllerRef = useRef(null);

  const handleresetPassword = () => {
    toast.dismiss();
    if (passwords.newPassword === "" || passwords.confirmPassword === "") {
      return toast.error("Please Enter passwords");
    }
    if (passwords.confirmPassword !== passwords.newPassword) {
      return toast.error("NewPassword doesn't match with Confirmpassword");
    }
    if (!/^.{6,}$/.test(passwords.newPassword)) {
      return toast.error("New passwor Must Contain 6 Characters", {
        duration: "2000",
      });
    }
    const response = dispatch(
      handleResetPassword({
        password: passwords?.newPassword,
        token: window.location.href.split("=")[1],
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res.payload.status === "success") {
          toast.success("Sign in Successfully.");
          toast.success("Password Change Successfully.");
          dispatch(handleSuccess());
          return navigate("/");
        } else {
          toast.error(res.payload.message);
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
      <Helmet title={t("Rest-password | Dollar Empire")} />
      <div className="p-4 mx-auto xl:w-2/5 lg:w-1/2 md:w-2/3 w-11/12 h-auto space-y-4 md:my-14 my-7 rounded-lg border border-BORDERGRAY">
        <h1 className="font-semibold md:text-3xl text-xl text-left">
          {t("New Password")}
        </h1>
        <hr />
        <p className="font-medium">
          {t("The password should have atleast 6 characters.")}
        </p>

        <div className="relative z-0 space-y-3 w-full">
          <label className="text-black font-medium block text-left text-lg">
            {t("Password")}*
          </label>
          <input
            type={passwords?.showNewPassword ? "text" : "password"}
            className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
            placeholder={t("new password")}
            name="new password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            required
          />
          {passwords?.showNewPassword ? (
            <BsEyeFill
              role="button"
              className="h-7 w-7 absolute top-9 right-4"
              onClick={() =>
                setPasswords({ ...passwords, showNewPassword: false })
              }
            />
          ) : (
            <BsEyeSlashFill
              role="button"
              className="h-7 w-7 absolute top-9 right-4"
              onClick={() =>
                setPasswords({ ...passwords, showNewPassword: true })
              }
            />
          )}
        </div>
        <div className="relative z-0 space-y-3 w-full">
          <label className="text-black font-medium block text-left text-lg">
            {t("Confirm Password")}*
          </label>
          <input
            type="password"
            className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
            placeholder={t("Confirm Password")}
            name="confirm password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            required
          />
        </div>

        <button
          type="button"
          className="bg-PRIMARY active:scale-90 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-300 p-3 text-white text-center w-40 rounded-md uppercase font-bold"
          disabled={loading}
          onClick={() => handleresetPassword()}
        >
          {loading ? t("Submitting...") : t("submit")}
        </button>
      </div>
      {/* {success ? (
        <div className="p-4 mx-auto text-center xl:w-2/5 lg:w-1/2 md:w-2/3 w-11/12 h-auto space-y-4 md:my-14 my-7 rounded-lg border border-BORDERGRAY">
          <BsCheckCircle className="text-green-400 lg:h-40 h-28 lg:w-40 w-28 mx-auto" />
          <p className="font-semibold text-center md:text-lg text-base">
            {t("Password successfully changed.")}{" "}
          </p>
          <Link to="/sign-in">
            <button
              type="button"
              className="bg-PRIMARY my-2 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-500 p-3 text-white text-center w-40 rounded-md uppercase font-bold"
            >
              {t("login")}
            </button>{" "}
          </Link>
        </div>
      ) : (
        
      )} */}
    </>
  );
};

export default ResetPassword;
