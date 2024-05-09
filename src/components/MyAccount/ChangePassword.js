import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { handleChangePassword } from "../../redux/BasicFeatureSlice";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { handleLogout } from "../../redux/GlobalStates";
import { handleLogoutReducer } from "../../redux/AuthSlice";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    ConfirmPassword: "",
    showOldPassword: false,
    showNewPassword: false,
  });

  const { loading } = useSelector((state) => state.basicFeatures);
  const { token } = useSelector((state) => state.Auth);

  const dispatch = useDispatch();

  const AbortControllerRef = useRef(null);

  const { t } = useTranslation();

  const changePassword = (e) => {
    e.preventDefault();
    toast.dismiss();
    if (
      Object.values(passwords)
        .map((v) => v === "")
        .includes(true)
    ) {
      return toast.error("All fields required", { duration: "5000" });
    }
    if (passwords.ConfirmPassword !== passwords.newPassword) {
      return toast.error("NewPassword doesn't match with Confirmpassword");
    }

    const response = dispatch(
      handleChangePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        token,
        signal: AbortControllerRef,
      })
    );
    if (response) {
      response.then((res) => {
        if (res.payload?.status === "success") {
          toast.success("Password Change Successfully.");
          setPasswords({
            ConfirmPassword: "",
            newPassword: "",
            oldPassword: "",
          });
        } else if (res.payload?.message === "Password incorrect.") {
          toast.error("Old Password is incorrect!!!");
        } else {
          if (
            res.payload?.status === "fail" &&
            (res.payload?.message === "Please login first." ||
              res.payload?.message === "Please provide authentication token.")
          ) {
            dispatch(handleLogoutReducer());
            dispatch(handleLogout());
          } else if (res.payload?.status === "fail") {
            toast.error(res.payload?.message);
          }
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      AbortControllerRef.current !== null && AbortControllerRef.current.abort();
    };
  }, []);

  return (
    <form
      onSubmit={(e) => changePassword(e)}
      className="bg-white border border-BORDERGRAY space-y-4 p-5 w-full"
    >
      {/* current password */}
      <div className="relative z-0 space-y-3">
        <label className="text-black font-medium block text-left text-lg">
          {t("Current Password")}
        </label>
        <input
          type={passwords?.showOldPassword ? "text" : "password"}
          className="bg-LIGHTGRAY outline-none lg:w-[82%] w-full text-black placeholder:text-gray-400 rounded-md p-3"
          placeholder={t("old password")}
          name="old password"
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, oldPassword: e.target.value })
          }
        />
        {passwords?.showOldPassword ? (
          <BsEyeFill
            role="button"
            className="h-7 w-7 absolute top-9 xl:right-44 lg:right-32 right-4"
            onClick={() =>
              setPasswords({ ...passwords, showOldPassword: false })
            }
          />
        ) : (
          <BsEyeSlashFill
            role="button"
            className="h-7 w-7 absolute top-9 xl:right-44 lg:right-32 right-4"
            onClick={() =>
              setPasswords({ ...passwords, showOldPassword: true })
            }
          />
        )}
      </div>

      {/* new password */}
      <div className="space-y-3 relative z-0">
        <label className="text-black font-medium block text-left text-lg">
          {t("New Password")}
        </label>
        <input
          type={passwords?.showNewPassword ? "text" : "password"}
          className="bg-LIGHTGRAY outline-none lg:w-[82%] w-full text-black placeholder:text-gray-400 rounded-md p-3"
          placeholder={t("New Password")}
          name="new password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />
        {passwords?.showNewPassword ? (
          <BsEyeFill
            role="button"
            className="h-7 w-7 absolute top-9 xl:right-44 lg:right-32 right-4"
            onClick={() =>
              setPasswords({ ...passwords, showNewPassword: false })
            }
          />
        ) : (
          <BsEyeSlashFill
            role="button"
            className="h-7 w-7 absolute top-9 xl:right-44 lg:right-32 right-4"
            onClick={() =>
              setPasswords({ ...passwords, showNewPassword: true })
            }
          />
        )}
      </div>
      {/* Confirm New Password */}
      <>
        <label className="text-black font-medium block text-left text-lg">
          {t("Confirm New Password")}
        </label>
        <input
          type="password"
          className="bg-LIGHTGRAY outline-none lg:w-[82%] w-full text-black placeholder:text-gray-400 rounded-md p-3"
          placeholder={t("Confirm New Password")}
          name="confirm password"
          value={passwords.ConfirmPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, ConfirmPassword: e.target.value })
          }
        />
      </>

      {/* btns */}
      <div className="flex w-full items-center gap-x-3">
        <button
          type="submit"
          className="w-40 font-semibold bg-PRIMARY text-white rounded-md text-center p-3 active:scale-90 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-300"
          disabled={loading}
        >
          {loading ? t("Processing").concat("...") : t("Save")}
        </button>
        <button
          type="button"
          className="w-40 font-semibold bg-gray-200 text-black rounded-md text-center p-3 active:scale-90 hover:text-white hover:bg-black border border-gray-400 duration-300"
          onClick={() =>
            setPasswords({
              ConfirmPassword: "",
              newPassword: "",
              oldPassword: "",
            })
          }
        >
          {t("Cancel")}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
