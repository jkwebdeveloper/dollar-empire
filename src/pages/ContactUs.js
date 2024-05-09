import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import TItleSection from "../components/TItleSection";
import bgImg from "../assets/images/contactus.jpg";
import { MdCall, MdLocationOn } from "react-icons/md";
import { GrMail } from "react-icons/gr";
import ReCAPTCHA from "react-google-recaptcha";
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
import { handlePostContactUs } from "../redux/BasicFeatureSlice";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { handleGetContactUsDetails } from "../redux/GetContentSlice";

const ContactUs = () => {
  function handlChange(value) {
    setFieldValue("captcha", value);
  }
  const { loading } = useSelector((state) => state.basicFeatures);
  const Content = useSelector((state) => state.getContent);

  const dispatch = useDispatch();

  const AbortControllerRef = useRef(null);
  const captchaRef = useRef(null);

  const { t } = useTranslation();

  const SignupSchema = yup.object().shape({
    email: yup.string().required("email is required").email(),
    fname: yup
      .string()
      .trim("The contact name cannot include leading and trailing spaces")
      .required("firstname is required")
      .min(3, "too short")
      .max(30, "too long")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters."
      ),
    lname: yup
      .string()
      .trim("The contact name cannot include leading and trailing spaces")
      .required("lastname is required")
      .min(2, "too short")
      .max(30, "too long")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "only contain Latin letters."
      ),
    comments: yup
      .string()
      .required("Comment is required")
      .matches(/^[A-Za-z\s\-]+$/g, "That doesn't look Comment")
      .trim("The contact name cannot include leading and trailing spaces"),
    phone: yup.number().required("A phone number is required"),
    captcha: yup.string().required("Check the captcha."),
  });

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      comments: "",
      captcha: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      if (
        isPossiblePhoneNumber(values.phone) &&
        isValidPhoneNumber(values.phone)
      ) {
        const response = dispatch(
          handlePostContactUs({
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            phone: values.phone,
            comments: values.comments,
            signal: AbortControllerRef,
          })
        );
        if (response) {
          response.then((res) => {
            if (res.payload.status === "success") {
              toast.success("Message sent successfully.");
              captchaRef.current.props.grecaptcha.reset();
              resetForm();
            } else {
              toast.error(res.payload.message);
            }
          });
        }
      } else {
        toast.error("Phone number is invalid!!!");
      }
    },
  });

  const { getFieldProps, handleSubmit, setFieldValue, resetForm } = formik;

  useEffect(() => {
    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);

  return (
    <>
      <Helmet title={t("Contact us | Dollar Empire")} />
      <TItleSection title={t("contact_us")} image={bgImg} />
      <section className="xl:w-2/3 lg:w-4/5 w-full lg:px-0 px-3 mx-auto flex md:flex-row flex-col items-start justify-center gap-5 py-5">
        {/* left side div */}
        <div className="md:w-1/3 w-full space-y-5 rounded-lg border border-gray-200">
          <img
            src={require("../assets/images/contact.jpg")}
            alt=""
            className="h-fit w-full object-contain object-center"
          />
          <div className="space-y-5 xl:px-10 px-3 relative">
            {/* address */}
            <div className="flex items-start gap-x-2">
              <p>
                <MdLocationOn className="h-5 w-5 text-PRIMARY inline-block" />
              </p>
              <p>
                <span className="font-semibold inline-block">
                  {t("Address")}:
                </span>
                <span className="font-semibold inline-block">
                  {Content?.contact?.address}
                </span>
              </p>
            </div>
            {/* call */}
            <div className="flex items-start gap-x-2">
              <p>
                <MdCall className="h-5 w-5 text-PRIMARY inline-block" />
              </p>
              <p>
                <span className="font-semibold block">
                  {t("Phone number")}:
                </span>
                <a href="tel:323-268-8999" className="font-semibold block">
                  {Content?.contact?.phone}
                </a>
              </p>
            </div>
            {/* mail */}
            <div className="flex items-start gap-x-2 pb-10">
              <p>
                <GrMail className="h-5 w-5 text-PRIMARY block" />
              </p>
              <p>
                <span className="font-semibold block">{t("Email")}:</span>
                <a
                  href="mailto:sales@dollarempirellc.com"
                  className="font-semibold block text-PRIMARY"
                >
                  {Content?.contact?.email}
                </a>
              </p>
            </div>
            <hr className="py-2 bg-PRIMARY absolute bottom-0 left-0 w-full rounded-bl-lg rounded-br-lg" />
          </div>
        </div>
        {/* right side div */}
        <div className="md:w-2/3 w-full p-4 rounded-lg border border-BORDERGRAY space-y-4">
          <h1 className="font-semibold text-PRIMARY md:text-3xl text-xl text-left">
            {t("Get In Tocuh")}
          </h1>
          <hr />
          <FormikProvider value={formik}>
            <Form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-4"
            >
              {/* name */}
              <div className="flex items-start w-full gap-x-3">
                <div className="w-1/2">
                  <label className="text-black font-medium block text-left text-lg">
                    {t("First name")}*
                  </label>
                  <input
                    type="text"
                    className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
                    placeholder={t("First name")}
                    name="fname"
                    {...getFieldProps("fname")}
                  />
                  <ErrorMessage name="fname" component={TextError} />
                </div>
                <div className="w-1/2">
                  <label className="text-black font-medium block text-left text-lg">
                    {t("Last name")}*
                  </label>
                  <input
                    type="text"
                    className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
                    placeholder={t("Last name")}
                    name="lname"
                    {...getFieldProps("lname")}
                  />
                  <ErrorMessage name="lname" component={TextError} />
                </div>
              </div>
              {/* email , phone */}
              <div className="flex items-start w-full lg:flex-row flex-col gap-3">
                <div className="lg:w-1/2 w-full">
                  <label className="text-black font-medium block text-left text-lg">
                    {t("Email address")}*
                  </label>
                  <input
                    type="email"
                    className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3"
                    placeholder="abc@gmail.com"
                    name="email"
                    {...getFieldProps("email")}
                  />
                  <ErrorMessage name="email" component={TextError} />
                </div>
                <div className="lg:w-1/2 w-full">
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
                      value={formik.values.phone}
                      inputStyle={{
                        width: "100%",
                        background: "#F5F5F5",
                        borderRadius: "6px",
                        border: "0px",
                        padding: "1.6rem 0 1.6rem 3rem",
                      }}
                      disabled={loading}
                      jumpCursorToEnd={true}
                      dropdownStyle={{ background: "lightgray" }}
                      buttonStyle={{ border: "0px" }}
                    />
                    <ErrorMessage name="phone" component={TextError} />
                  </>
                </div>
              </div>
              {/* message */}
              <label className="text-black font-medium block text-left text-lg">
                {t("Comments")}*
              </label>
              <textarea
                className="bg-LIGHTGRAY outline-none w-full text-black placeholder:text-gray-400 rounded-md p-3 min-h-[8rem] max-h-[10rem]"
                placeholder="message..."
                name="comments"
                {...getFieldProps("comments")}
              />
              <ErrorMessage
                className="pb-2"
                name="comments"
                component={TextError}
              />
              <p>{t("Please check the box below to proceed")}.</p>
              <div>
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                  onChange={handlChange}
                  ref={captchaRef}
                />{" "}
                <ErrorMessage
                  className="block"
                  name="captcha"
                  component={TextError}
                />
              </div>
              <button
                type="submit"
                className="bg-PRIMARY active:translate-y-2 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-500 p-3 text-white text-center w-40 rounded-md uppercase font-bold"
                disabled={loading}
              >
                {loading ? t("Submitting").concat("...") : t("Send")}
              </button>
            </Form>
          </FormikProvider>
        </div>
      </section>
    </>
  );
};

export default ContactUs;

const TextError = styled.span`
  color: red !important;
  font-weight: 600;
  padding-top: 10px;
  font-size: 1rem;
`;
