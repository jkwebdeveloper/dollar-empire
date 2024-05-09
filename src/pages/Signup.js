import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { useFormik, Form, FormikProvider, ErrorMessage } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { handleRegisterUser } from "../redux/AuthSlice";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { handleSuccess } from "../redux/GlobalStates";
import { useTranslation } from "react-i18next";
import { Country, State, City } from "country-state-city";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import validator from "validator";

const Signup = () => {
  const [selectedData, setSelectedData] = useState({
    state: "",
    city: "",
  });
  const [allCountries, setAllCountries] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");

  const { user, loading, token } = useSelector((state) => state.Auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);

  const SignupSchema = yup.object().shape({
    email: yup.string().required("email is required").email(),
    fname: yup
      .string()
      .trim("The contact name cannot include leading and trailing spaces")
      .required("firstname is required")
      .min(2, "too short")
      .max(30, "too long")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters.",
      ),
    lname: yup
      .string()
      .trim("The contact name cannot include leading and trailing spaces")
      .required("lastname is required")
      .min(2, "too short")
      .max(30, "too long")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters.",
      ),
    location: yup.string().required("address is required"),
    postalCode: yup
      .string()
      .typeError("postalcode is required")
      .when("country", {
        is: "United States",
        then: () => yup.string().required("postalcode is required"),
      }),
    city: yup
      .string()
      .when("country", {
        is: "United States",
        then: () => yup.string().required("city is required"),
      })
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters.",
      ),
    state: yup
      .string()
      .when("country", {
        is: "United States",
        then: () => yup.string().required("state is required"),
      })
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters.",
      ),
    country: yup.string().required("country is required"),
    companyName: yup.string().required("companyName is required"),
    password: yup
      .string()
      .required("password is required")
      .min(6, "Must Contain 6 Characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    phone: yup
      .string()
      .required("A phone number is required")
      .trim("The contact name cannot include leading and trailing spaces"),
    checkBox: yup.bool().oneOf([true], "Please Check the box."),
  });

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      companyName: "",
      password: "",
      confirmPassword: "",
      phone: "",
      location: "",
      city: "",
      state: selectedData.state,
      country: "United States",
      postalCode: "",
      checkBox: false,
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      if (
        isPossiblePhoneNumber(values.phone) &&
        isValidPhoneNumber(values.phone)
      ) {
        const response = dispatch(
          handleRegisterUser({
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            companyName: values.companyName,
            password: values.password,
            phone: values.phone,
            location: values.location,
            city: values.city,
            state: values.state,
            country: values.country,
            postalCode: values.postalCode,
            signal: AbortControllerRef,
          }),
        );
        if (response) {
          response
            .then((res) => {
              if (res.payload.status === "success") {
                dispatch(handleSuccess());
                toast.success("Sign up successfully.");
                navigate("/");
              } else {
                if (res.payload.message) {
                  if (
                    res.payload.message === "Email is already registerd." ||
                    res.payload.message ===
                      "El correo electrónico ya está registrado."
                  ) {
                    setMessage(res.payload.message);
                    toast.error(res.payload.message);
                  } else {
                    toast.error(res.payload.message);
                  }
                }
              }
            })
            .catch((err) => {});
        }
      } else {
        toast.remove();
        toast.error("Phone number is invalid");
      }
    },
  });

  const { getFieldProps, handleSubmit, setFieldValue, values } = formik;

  useEffect(() => {
    if (user !== null && token !== null) {
      navigate("/");
      toast.success("Already Logged in.");
    }

    setAllCountries(Country.getAllCountries());

    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);

  // for country , state , city selection
  useEffect(() => {
    if (values.country !== "") {
      const country = Country.getAllCountries().find(
        (country) => country.name === values.country,
      );
      setCountry(country?.name);
      const states = State.getStatesOfCountry("US");

      setSelectedData({ ...selectedData, state: states });
    }
  }, [values.country, values.state]);

  return (
    <>
      <Helmet title={t("Sign-up | Dollar Empire")} />
      <div className="p-4 mx-auto xl:w-2/5 lg:w-1/2 md:w-2/3 w-11/12 h-auto space-y-4 md:my-14 my-7 rounded-lg border border-BORDERGRAY">
        <h1 className="font-semibold md:text-3xl text-xl text-left">
          {t("Customer Register")}
        </h1>
        {/* <hr /> */}
        {/* btn signin */}
        <p className="font-semibold text-center text-lg">
          {t("Already have an account")}?&nbsp;
          <Link to="/sign-in" className="underline text-blue-400">
            {t("login")}
          </Link>
        </p>
        {message !== "" && (
          <p className="font-semibold text-center text-lg ">
            <span className="text-red-500">{message}</span>&nbsp;
            <Link to="/sign-in" className="underline text-blue-400">
              {t("login")}
            </Link>
            &nbsp;OR&nbsp;
            <Link to="/forgot-password" className="underline text-blue-400">
              {t("Forgot-password")}
            </Link>
          </p>
        )}
        <hr />
        <FormikProvider value={formik}>
          <Form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* first & last name */}
            <div className="flex items-start w-full gap-x-3">
              <div className="w-1/2 space-y-3">
                <label className="text-black font-medium block text-left text-lg">
                  {t("First name")}*
                </label>
                <input
                  type="text"
                  className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder={t("First name")}
                  name="fname"
                  {...getFieldProps("fname")}
                />
                <ErrorMessage name="fname" component={TextError} />
              </div>
              <div className="w-1/2 space-y-3">
                <label className="text-black font-medium block text-left text-lg">
                  {t("Last name")}*
                </label>
                <input
                  type="text"
                  className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder={t("Last name")}
                  name="lname"
                  {...getFieldProps("lname")}
                />
                <ErrorMessage name="lname" component={TextError} />
              </div>
            </div>
            {/* country */}
            <>
              <label className="text-black font-medium block text-left text-lg">
                {t("Country")}*
              </label>
              <select
                className=" outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                onChange={(e) =>
                  setSelectedData({ ...selectedData, country: e.target.value })
                }
                name="country"
                {...getFieldProps("country")}
              >
                <option value="United States">United States</option>
                {allCountries !== "" &&
                  allCountries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country?.name}
                    </option>
                  ))}
              </select>
              {/* <input
                type="text"
                className=" outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                placeholder="United states"
                name="country"
                {...getFieldProps("country")}
              /> */}
              <ErrorMessage name="country" component={TextError} />
            </>
            {/* company name */}
            <>
              <label className="text-black font-medium block text-left text-lg">
                {t("Company name")}*
              </label>
              <input
                type="text"
                className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                placeholder={t("Company name")}
                name="companyName"
                {...getFieldProps("companyName")}
              />
              <ErrorMessage name="companyName" component={TextError} />
            </>
            {/* address */}
            <>
              <label className="text-black font-medium block text-left text-lg">
                {t("Address")}*
              </label>
              <input
                type="text"
                className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                placeholder={t("Address")}
                name="location"
                {...getFieldProps("location")}
              />
              <ErrorMessage name="location" component={TextError} />
            </>
            {/* states */}
            <>
              <label className="text-black font-medium block text-left text-lg">
                {t("City")}*
              </label>
              <input
                type="text"
                className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                placeholder={t("City")}
                name="city"
                {...getFieldProps("city")}
              />

              <ErrorMessage name="city" component={TextError} />
            </>
            {/* city & postal code */}
            <div className="flex items-start w-full gap-x-3">
              <div className="w-1/2">
                <label className="text-black font-medium block text-left text-lg">
                  {t("State")}*
                </label>
                {values.country === "United States" ? (
                  <select
                    className=" outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                    name="state"
                    {...getFieldProps("state")}
                  >
                    <option label="Select state"></option>
                    {selectedData?.state.length > 0 &&
                      selectedData.state.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state?.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                    placeholder={t("State")}
                    name="state"
                    {...getFieldProps("state")}
                  />
                )}

                <ErrorMessage name="state" component={TextError} />
              </div>
              <div className="w-1/2">
                <label className="text-black font-medium block text-left text-lg">
                  {t("Postal code")}*
                </label>
                <input
                  type="text"
                  className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder={t("Postal code")}
                  name="postalCode"
                  {...getFieldProps("postalCode")}
                />
                <ErrorMessage name="postalCode" component={TextError} />
              </div>
            </div>
            {/* phone */}
            <>
              <label className="text-black font-medium block text-left text-lg">
                {t("Phone")}*
              </label>
              <PhoneInput
                country={"us"}
                countryCodeEditable={false}
                enableSearch={true}
                inputProps={{
                  name: "phone",
                }}
                onChange={(value) =>
                  setFieldValue("phone", "+".concat(value).trim())
                }
                inputStyle={{
                  width: "100%",
                  background: "#F5F5F5",
                  borderRadius: "6px",
                  border: "0px",
                  padding: "1.6rem 0 1.6rem 3rem",
                }}
                dropdownStyle={{ background: "lightgray" }}
                buttonStyle={{ border: "0px" }}
              />
              <ErrorMessage name="phone" component={TextError} />
            </>
            {/* email */}
            <>
              <label className="text-black font-medium block text-left text-lg">
                {t("Email")}*
              </label>
              <input
                type="email"
                className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                placeholder={t("Email")}
                name="email"
                {...getFieldProps("email")}
              />
              <ErrorMessage name="email" component={TextError} />
            </>
            {/*password  */}
            <div className="relative z-10 space-y-2">
              <label className="text-black font-medium block text-left text-lg">
                {t("Password")}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
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
            {/*reconfirm password  */}
            <>
              <label className="text-black font-medium block text-left text-lg">
                {t("Confirm Password")}
              </label>
              <input
                type="password"
                className="outline-none bg-LIGHTGRAY w-full text-black placeholder:text-gray-400 rounded-md p-3"
                placeholder={t("Confirm Password")}
                name="confirmPassword"
                {...getFieldProps("confirmPassword")}
              />
              <ErrorMessage name="confirmPassword" component={TextError} />
            </>
            {/* checkbox */}
            <div>
              <p className="flex items-start gap-x-2">
                <input
                  type="checkbox"
                  className="outline-none w-8 h-8 rounded-md border inline-block mt-1"
                  id="check_box"
                  {...getFieldProps("checkBox")}
                  onChange={(e) => {
                    setFieldValue("checkBox", e.target.checked);
                  }}
                />
                <label htmlFor="check_box">
                  <span>
                    By clicking here, I state that I have read and understood
                    the terms and conditions.
                  </span>
                </label>
              </p>
              {formik.errors.checkBox && (
                <ErrorMessage name="checkBox" component={TextError} />
              )}
            </div>
            {message !== "" && (
              <p className="font-semibold text-center text-lg ">
                <span className="text-red-500">{message}</span>&nbsp;
                <Link to="/sign-in" className="underline text-blue-400">
                  {t("login")}
                </Link>
                &nbsp;OR&nbsp;
                <Link to="/forgot-password" className="underline text-blue-400">
                  {t("Forgot-password")}
                </Link>
              </p>
            )}
            {/* btn */}
            <button
              type="submit"
              className="bg-PRIMARY active:translate-y-2 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-300 p-3 text-white text-center w-40 rounded-md font-semibold"
              disabled={loading}
            >
              {loading ? t("Registering...") : t("register")}
            </button>
          </Form>
        </FormikProvider>
      </div>
    </>
  );
};

export default Signup;

const TextError = styled.span`
  color: red !important;
  font-weight: 600;
  padding-top: 10px;
  font-size: 1rem;
`;
