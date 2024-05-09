import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { handleLoginUser } from "../redux/AuthSlice";
import { useEffect } from "react";
import {
  handleSuccess,
  loginAllTabsEventListener,
} from "../redux/GlobalStates";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, loading, token } = useSelector((state) => state.Auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);

  const SigninSchema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required."),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SigninSchema,
    onSubmit: (values) => {
      const response = dispatch(
        handleLoginUser({
          email: values.email,
          password: values.password,
          signal: AbortControllerRef,
        }),
      );

      if (response) {
        response.then((res) => {
          if (res?.payload?.status === "success") {
            dispatch(handleSuccess());
            navigate("/");
            setErrorMessage("");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.success("Sign In successfully.", { duration: 3000 });
          } else {
            setErrorMessage(res?.payload?.message);
          }
        });
      }
    },
  });

  const { getFieldProps, handleSubmit, resetForm } = formik;

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
      <Helmet title={t("Sign-in | Dollar Empire")} />
      <div className="p-4 mx-auto xl:w-2/5 lg:w-1/2 md:w-2/3 w-11/12 space-y-4 h-auto md:my-14 my-7 rounded-lg border border-BORDERGRAY">
        <h1 className="font-semibold md:text-3xl text-xl text-left">
          {t("Customer Login")}
        </h1>
        <hr />
        <p className="text-center w-full mx-auto md:text-xl text-lg text-red-600 font-semibold">
          {errorMessage !== "" && errorMessage}
        </p>
        <FormikProvider value={formik}>
          <Form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <label className="text-black font-medium block text-left text-lg">
              {t("Email address")}
            </label>
            <input
              type="email"
              className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
              placeholder={t("Email")}
              name="email"
              {...getFieldProps("email")}
            />
            <ErrorMessage name="email" component={TextError} />
            <div className="relative z-10 space-y-2">
              <label className="text-black font-medium block text-left text-lg">
                {t("Password")}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
                placeholder={t("Password")}
                name="password"
                {...getFieldProps("password")}
              />
              {showPassword ? (
                <BsEyeFill
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  className="absolute top-9 right-3 h-7 w-7"
                />
              ) : (
                <BsEyeSlashFill
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  className="absolute top-9 right-3 h-7 w-7"
                />
              )}

              <ErrorMessage name="password" component={TextError} />
            </div>
            <p>
              <Link
                to="/forgot-password"
                className="font-medium text-lg inline-block hover:underline"
              >
                {t("Forgot your password")}?
              </Link>
            </p>
            <button
              type="submit"
              className="bg-PRIMARY active:translate-y-2 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-300 p-3 min-w-[10rem] text-white text-center w-auto rounded-md uppercase font-bold"
              disabled={loading}
            >
              {loading ? t("Logging in...") : t("login")}
            </button>
          </Form>
        </FormikProvider>

        <p className="font-semibold text-center text-lg py-5">
          {t("New customer")}?{" "}
          <Link
            to="/sign-up"
            className="underline text-blue-400
        "
          >
            {t("Create new account")}
          </Link>
        </p>
      </div>
    </>
  );
};

export default Signin;

const TextError = styled.span`
  color: red !important;
  font-weight: 600;
  padding-top: 10px;
  font-size: 1rem;
`;
