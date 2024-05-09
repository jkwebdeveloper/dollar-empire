import React, { useState } from "react";
import EditProfile from "./EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { user, loading } = useSelector((state) => state.getContent);

  const { t } = useTranslation();
  return (
    <>
      {showEditProfile ? (
        <EditProfile setShowEditProfile={setShowEditProfile} />
      ) : loading ? (
        <p className="font-semibold text-center md:text-3xl text-lg">
          {t("loading")}...
        </p>
      ) : (
        <div className="bg-white w-full border border-BORDERGRAY p-5 md:space-y-5 space-y-3 ">
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("First name")}:</span>{" "}
            <span className="font-normal capitalize">{user?.fname}</span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("Last name")}:</span>{" "}
            <span className="font-normal capitalize">{user?.lname}</span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("Email")}:</span>{" "}
            <span className="font-normal ">{user?.email}</span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("Company name")}:</span>{" "}
            <span className="font-normal capitalize">{user?.companyName}</span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">
              {t("Street Address")}:
            </span>{" "}
            <span className="font-normal capitalize">{user?.location}</span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("City")}:</span>{" "}
            <span className="font-normal capitalize">
              {user?.city ? user?.city : "-"}
            </span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("State")}:</span>{" "}
            <span className="font-normal capitalize">
              {user?.state ? user?.state : "-"}
            </span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("Country")}:</span>{" "}
            <span className="font-normal capitalize">{user?.country}</span>
          </p>
          <p className="flex items-center w-full text-lg">
            <span className="font-bold md:w-60 w-40">{t("Phone")}:</span>{" "}
            <span className="font-normal">{user?.phone}</span>
          </p>
          <button
            type="button"
            className="bg-PRIMARY active:translate-y-2 hover:text-PRIMARY hover:bg-white border border-PRIMARY duration-300 p-3 text-white text-center w-60 rounded-md capitalize font-bold"
            onClick={() => setShowEditProfile(true)}
          >
            {t("Edit Profile")}
          </button>
        </div>
      )}
    </>
  );
};

export default Profile;
