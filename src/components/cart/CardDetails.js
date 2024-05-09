import React, { useRef, useState } from "react";
import {
  useFormik,
  Form,
  FormikProvider,
  ErrorMessage,
  validateYupSchema,
} from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Country, State, City } from "country-state-city";
import valid from "card-validator";
import {
  OrderCreated,
  handleCreateOrUpdateCard,
  handleCreateOrder,
  handleGetCard,
} from "../../redux/OrderSlice";
import { useNavigate } from "react-router-dom";
import { handleChangeActiveComponent } from "../../redux/GlobalStates";
import { handleClearCart } from "../../redux/CartSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const CardDetails = ({ summaryFixed, additionalNotes }) => {
  const [selectedData, setSelectedData] = useState({
    state: "",
    city: "",
  });
  const [allCountries, setAllCountries] = useState("");
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const [country, setCountry] = useState("");

  const { token, user } = useSelector((state) => state.Auth);
  const { grandTotal, subTotal, shipphingMethod, freightCharges } = useSelector(
    (state) => state.cart,
  );
  const { cardDetails, loading, paymentOption, shippingAddress } = useSelector(
    (state) => state.orders,
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const AbortControllerRef = useRef(null);

  const creditCardSchema = yup.object().shape({
    nameOnCard: yup
      .string()
      .trim("The contact name cannot include leading and trailing spaces")
      .required("firstname is required")
      .min(2, "too short")
      .max(40, "too long")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters.",
      ),
    street: yup
      .string()
      .required("address is required")
      .matches(/^[0-9A-Za-z\s\-\,\.]+$/g, "That doesn't look Address")
      .trim("The contact name cannot include leading and trailing spaces"),
    postalCode: yup
      .string()
      .typeError("That doesn't look like a postal code")
      .when("country", {
        is: "United States",
        then: () => yup.string().required("postal code is required"),
      }),
    city: yup
      .string()
      .when("country", {
        is: "United States",
        then: () => yup.string().required("city is required"),
      })
      .trim("The contact name cannot include leading and trailing spaces")
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
      )
      .typeError("State contain only string And it's required"),
    country: yup
      .string()
      .required("country is required")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters.",
      ),
    expiry: yup
      .string()
      .required("Expiration date is required")
      .test(
        "test-date",
        "Expiration Date is invalid",
        (value) =>
          valid.expirationDate(
            `${moment(values.expiry).year().toString()}-${(
              moment(values.expiry).month() + 1
            ).toString()}`,
          ).isValid,
      ),
    cardNumber: yup
      .number()
      .test(
        "test-number",
        "Credit Card number is invalid",
        (value) => valid.number(value).isValid,
      )
      .required("Card number is required"),
    cvv: yup
      .string()
      .test("test-cvv", "CVV is invalid", (value) => valid.cvv(value).isValid)
      .required("CVV is required"),
  });

  const formik = useFormik({
    initialValues: {
      nameOnCard: cardDetails === null ? user?.fname : cardDetails?.nameOnCard,
      street: cardDetails === null ? user?.location : cardDetails?.street,
      city: cardDetails === null ? user?.city : cardDetails?.city,
      state:
        cardDetails === null
          ? user?.state
          : cardDetails?.state !== ""
          ? cardDetails?.state
          : selectedData.state,
      country:
        cardDetails === null
          ? user?.country
          : cardDetails?.country !== ""
          ? cardDetails?.country
          : country === ""
          ? "United States"
          : country,
      postalCode:
        cardDetails === null ? user?.postalCode : cardDetails?.postalCode,
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
    validationSchema: creditCardSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setConfirmOrderLoading(true);
      if (shippingAddress === "" && shipphingMethod === "freight") {
        toast.dismiss();
        return toast.error("Please select the shipping address");
      } else if (shipphingMethod === "") {
        toast.dismiss();
        return toast.error("Please select the shipping method");
      } else if (paymentOption === "") {
        toast.dismiss();
        return toast.error("Please choose the Payment option");
      }

      const response = dispatch(
        handleCreateOrUpdateCard({
          nameOnCard: values.nameOnCard,
          street: values.street,
          city: values.city,
          state: values.state,
          country: values.country,
          cardNumber: values.cardNumber,
          expiry: values.expiry,
          cvv: values.cvv,
          postalCode: values.postalCode,
          signal: AbortControllerRef,
          token,
        }),
      );
      if (response) {
        response
          .then((res) => {
            if (res?.meta?.arg?.signal?.current?.signal?.aborted) {
              toast.dismiss();
              toast.error("Request Cancelled.");
            }
            if (res.payload.status === "success") {
              return true;
            } else {
              return toast.error(res.payload.message);
            }
          })
          .then(() => {
            const response = dispatch(
              handleCreateOrder({
                token,
                signal: AbortControllerRef,
                shippingMethod: shipphingMethod,
                shippingAddress: shippingAddress?._id,
                paymentMethod: paymentOption,
                additionalNotes,
              }),
            );
            if (response) {
              response.then((res) => {
                if (res?.meta?.arg?.signal?.current?.signal?.aborted) {
                  toast.dismiss();
                  return toast.error("Request Cancelled.");
                }
                if (res.payload.status === "success") {
                  setConfirmOrderLoading(false);
                  toast.success("Order Submitted successfully.");
                  dispatch(handleChangeActiveComponent("Success"));
                  dispatch(handleClearCart());
                  dispatch(OrderCreated());
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  setConfirmOrderLoading(false);
                  return toast.error(res.payload.message);
                }
              });
            }
          });
      }
    },
  });
  const { getFieldProps, handleSubmit, setFieldValue, values, resetForm } =
    formik;

  useEffect(() => {
    setAllCountries(Country.getAllCountries());
    dispatch(handleGetCard({ token }));

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

    setSelectedData({ ...selectedData, state: states.map((s) => s.name) });
  }, [values.country]);

  const aTenYearFromNow = new Date();
  aTenYearFromNow.setFullYear(aTenYearFromNow.getFullYear() + 10);

  return (
    <>
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          onSubmit={handleSubmit}
          className="w-full flex xl:flex-row flex-col items-start justify-start gap-4 pb-10"
        >
          {loading && !confirmOrderLoading ? (
            <p className="text-2xl text-center font-semibold mx-auto">
              {t("loading")}...
            </p>
          ) : (
            <div className="xl:w-9/12 w-full space-y-3 xl:order-1 order-2">
              <p className="bg-PRIMARY text-white p-4 w-full text-left font-semibold tracking-wide">
                {t("Card details")}
              </p>

              {/* name */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("Name on card")}*
                </label>
                <input
                  type="text"
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder={t("Name")}
                  name="nameOnCard"
                  {...getFieldProps("nameOnCard")}
                />
                <ErrorMessage name="nameOnCard" component={TextError} />
              </>
              {/* country*/}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("Country")}*
                </label>
                <select
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  name="country"
                  {...getFieldProps("country")}
                  // onChange={(e) => setCountry(e.target.value.trim())}
                >
                  <option label="United States"></option>
                  {allCountries !== "" &&
                    allCountries.map((country, index) => (
                      <option key={index} value={country.name}>
                        {country?.name}
                      </option>
                    ))}
                </select>

                <ErrorMessage name="country" component={TextError} />
              </>
              {/* states */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("State")}*
                </label>
                {values.country === "United States" ? (
                  <select
                    className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                    name="state"
                    {...getFieldProps("state")}
                  >
                    <option value={values?.state}>{values?.state}</option>
                    <option label="Select state"></option>
                    {selectedData?.state.length > 0 &&
                      selectedData.state.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="outline-none bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                    placeholder={t("State")}
                    name="state"
                    {...getFieldProps("state")}
                  />
                )}

                <ErrorMessage name="state" component={TextError} />
              </>
              {/* city */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("City")}*
                </label>
                <input
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  name="city"
                  type="text"
                  {...getFieldProps("city")}
                ></input>
                <ErrorMessage name="city" component={TextError} />
              </>

              {/* zip code  */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("Postal code")}*
                </label>
                <input
                  type="number"
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder={t("Postal code")}
                  name="postalCode"
                  {...getFieldProps("postalCode")}
                />
                <ErrorMessage name="postalCode" component={TextError} />
              </>
              {/* street adress */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("Street Address")}*
                </label>
                <input
                  type="text"
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder="Type here..."
                  name="street"
                  {...getFieldProps("street")}
                />
                <ErrorMessage name="street" component={TextError} />
              </>
              {/* card number */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("Card number")}*
                </label>
                <input
                  type="number"
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder={t("Card number")}
                  name="cardNumber"
                  {...getFieldProps("cardNumber")}
                  onInput={(e) => {
                    if (e.target.value.length > 19) {
                      return e.target.value.slice(0, 19);
                    }
                  }}
                />
                <ErrorMessage name="cardNumber" component={TextError} />
              </>
              {/* date */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("Expiration Date")}*
                </label>
                <DatePicker
                  adjustDateOnChange={true}
                  selected={values.expiry}
                  onChange={(date) => {
                    setFieldValue("expiry", date);
                  }}
                  closeOnScroll={true}
                  dateFormat="MM/yy"
                  showMonthYearPicker
                  maxDate={aTenYearFromNow}
                  minDate={new Date()}
                  name="expiry"
                  placeholderText="mm/yy"
                  dropdownMode="scroll"
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                />
                <ErrorMessage name="expiry" component={TextError} />
              </>
              {/* cvv */}
              <>
                <label className="text-black font-medium block text-left text-lg">
                  {t("CVV")}*
                </label>
                <input
                  type="number"
                  className="bg-LIGHTGRAY xl:w-1/2 w-full text-black placeholder:text-gray-400 rounded-md p-3"
                  placeholder="***"
                  {...getFieldProps("cvv")}
                  name="cvv"
                />
                <ErrorMessage name="cvv" component={TextError} />
              </>
            </div>
          )}
          {/* summary */}
          <div
            className={`xl:order-2 order-1 xl:w-3/12 lg:w-1/2 w-full space-y-3 bg-BACKGROUNDGRAY text-BLACK p-3 border border-gray-300 ml-auto ${
              summaryFixed ? "xl:sticky top-2 right-10" : "static"
            }`}
          >
            <p className="font-semibold text-xl">{t("Order Summary")}</p>
            <hr className="w-full" />
            <p className="w-full flex items-center justify-between text-base">
              <span className="font-normal">{t("Subtotal")}</span>
              <span className="ml-auto font-semibold text-base">
                ${parseFloat(subTotal).toFixed(2)}{" "}
              </span>{" "}
            </p>
            <p className="w-full flex items-center justify-between text-base">
              <span className="font-normal">{t("Freight")}</span>
              <span className="ml-auto font-semibold text-base">
                ${" "}
                {shipphingMethod === "pickup"
                  ? "0.00"
                  : freightCharges !== null
                  ? `${parseFloat(freightCharges).toFixed(2)}`
                  : "0.00"}
              </span>
            </p>
            <hr className="w-full" />
            <p className="w-full flex items-center justify-between text-2xl font-bold">
              <span>{t("Grand Total")}</span>
              <span className="ml-auto">
                ${parseFloat(grandTotal).toFixed(2)}
              </span>{" "}
            </p>
            <hr className="w-full" />

            <button
              type="submit"
              className="font-semibold bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY border border-PRIMARY duration-300 ease-in-out w-full p-3 text-center"
              disabled={confirmOrderLoading || loading}
            >
              {confirmOrderLoading
                ? t("Submitting Order").concat("...")
                : t("Confirm Order")}
            </button>
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default CardDetails;

const TextError = styled.span`
  color: red !important;
  font-weight: 600;
  font-size: 1rem;
  display: block;
`;
