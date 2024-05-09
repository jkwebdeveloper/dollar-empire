import React, { useRef } from "react";
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
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { handlePostNewAddress } from "../../redux/FeatureSlice";
import { handleGetAddresses } from "../../redux/GetContentSlice";
import { useState } from "react";
import { Country, State, City } from "country-state-city";
import { useTranslation } from "react-i18next";
import validator from "validator";

const AddNewAddress = ({ setShowNewAddress }) => {
  const [selectedData, setSelectedData] = useState({
    state: "",
    city: "",
  });
  const [allCountries, setAllCountries] = useState("");
  const [country, setCountry] = useState("");

  const { token } = useSelector((state) => state.Auth);
  const { loading } = useSelector((state) => state.features);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);

  const addNewAddressSchema = yup.object().shape({
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
    companyName: yup.string().required("companyName is required"),
    country: yup.string().required("country is required"),
    phone: yup
      .string()
      .required("A phone number is required")
      .trim("The contact name cannot include leading and trailing spaces"),
  });

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      location: "",
      companyName: "",
      phone: "",
      city: selectedData.city,
      state: selectedData.state,
      country: "United States",
      postalCode: "",
    },
    validationSchema: addNewAddressSchema,
    onSubmit: (values) => {
      if (
        isPossiblePhoneNumber(values.phone) &&
        isValidPhoneNumber(values.phone)
      ) {
        const response = dispatch(
          handlePostNewAddress({
            fname: values.fname,
            lname: values.lname,
            companyName: values.companyName,
            phone: values.phone,
            city: values.city,
            state: values.state,
            country: values.country,
            postalCode: values.postalCode,
            location: values.location,
            signal: AbortControllerRef,
            token,
          }),
        );
        if (response) {
          response.then((res) => {
            if (res?.meta?.arg?.signal?.current?.signal?.aborted) {
              toast.error("Request Cancelled.");
            }
            if (res.payload.status === "success") {
              toast.success("Address added successfully.");
              resetForm();
              setShowNewAddress(false);
              dispatch(handleGetAddresses({ token }));
            } else {
              toast.error(res.payload.message);
            }
          });
        }
      } else {
        toast.remove();
        toast.error("Phone number is invalid");
      }
    },
  });

  const { getFieldProps, handleSubmit, setFieldValue, resetForm, values } =
    formik;

  useEffect(() => {
    setAllCountries(Country.getAllCountries());

    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);
  // for country , state , city selection
  useEffect(() => {
    const country = Country.getAllCountries().find(
      (country) => country.name === values.country,
    );
    setCountry(country?.name);
    const states = State.getStatesOfCountry("US");
    setSelectedData({ ...selectedData, state: states });
  }, [values.country, values.state, values.city]);

  return (
    <FormikProvider value={formik}>
      <Form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white border border-BORDERGRAY space-y-4 p-5 w-full"
      >
        {/* name */}
        <div className="flex items-start w-full gap-x-3">
          <div className="lg:w-2/5 w-1/2 space-y-2">
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
          <div className="lg:w-2/5 w-1/2 space-y-2">
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
        {/* company name */}
        <>
          <label className="text-black font-medium block text-left text-lg">
            {t("Company name")}*
          </label>
          <input
            type="text"
            className="bg-LIGHTGRAY outline-none lg:w-[82%] w-full text-black placeholder:text-gray-400 rounded-md p-3"
            placeholder={t("Company name")}
            name="companyName"
            {...getFieldProps("companyName")}
          />
          <ErrorMessage
            name="companyName"
            className="block"
            component={TextError}
          />
        </>
        {/* Country */}
        <>
          <label className="text-black font-medium block text-left text-lg">
            {t("Country")}*
          </label>
          <select
            className=" outline-none bg-LIGHTGRAY lg:w-[82%] w-full text-black placeholder:text-gray-400 rounded-md p-3"
            onChange={(e) =>
              setSelectedData({ ...selectedData, country: e.target.value })
            }
            name="country"
            {...getFieldProps("country")}
          >
            <option value="United states">United states</option>
            {allCountries !== "" &&
              allCountries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country?.name}
                </option>
              ))}
          </select>
          <ErrorMessage
            name="country"
            className="block"
            component={TextError}
          />
        </>
        {/* location */}
        <>
          <label className="text-black font-medium block text-left text-lg">
            {t("Street Address")}*
          </label>
          <input
            type="text"
            className="bg-LIGHTGRAY outline-none lg:w-[82%] w-full text-black placeholder:text-gray-400 rounded-md p-3"
            name="location"
            placeholder={t("Street Address")}
            {...getFieldProps("location")}
          />
          <ErrorMessage
            name="location"
            className="block"
            component={TextError}
          />
        </>

        {/* city */}
        <div className="flex items-start w-full gap-x-3">
          <div className="lg:w-2/5 w-1/2 space-y-2">
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
            <ErrorMessage name="city" className="block" component={TextError} />
          </div>
          <div className="lg:w-2/5 w-1/2 space-y-2">
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
        </div>

        {/* phone, postal code */}
        <div className="flex items-start w-full gap-x-3">
          <div className="lg:w-2/5 w-full space-y-2">
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
              value={formik.values.phone}
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
          </div>
          <div className="lg:w-2/5 w-full space-y-2">
            <label className="text-black font-medium block text-left text-lg">
              {t("PostalCode")}*
            </label>
            <input
              type="text"
              className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
              placeholder={t("PostalCode")}
              name="postalCode"
              {...getFieldProps("postalCode")}
            />
            <ErrorMessage name="postalCode" component={TextError} />
          </div>
        </div>
        {/* btns */}
        <div className="flex w-full items-center gap-x-3">
          <button
            type="submit"
            className="w-40 font-semibold bg-PRIMARY text-white rounded-md text-center p-3 active:translate-y-2 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-300"
            disabled={loading}
          >
            {loading ? t("Submitting").concat("...") : t("Save")}
          </button>
          <button
            type="button"
            className="w-40 font-semibold bg-gray-200 text-black rounded-md text-center p-3 active:translate-y-2 hover:text-white hover:bg-black border border-gray-400 duration-300"
            onClick={() => {
              loading
                ? AbortControllerRef.current.abort()
                : setShowNewAddress(false);
            }}
          >
            {t("Cancel")}
          </button>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default AddNewAddress;
const TextError = styled.span`
  color: red !important;
  font-weight: 600;
  font-size: 1rem;
`;
