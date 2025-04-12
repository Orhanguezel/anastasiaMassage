"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getUserProfile,
  clearProfileMessages,
} from "@/store/user/profileSlice";
import ProfileForm from "@/components/visitor/account/ProfileForm";
import ProfileImageUploader from "@/components/visitor/account/ProfileImageUploader";
import { useTranslation } from "react-i18next";

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const { profile, loading, error, successMessage } = useAppSelector(
    (state) => state.profile
  );
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getUserProfile());
    return () => {
      dispatch(clearProfileMessages());
    };
  }, [dispatch]);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>{t("account.title")}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {loading && <p>{t("account.loading")}</p>}
      {profile && (
        <>
          <ProfileImageUploader
            userId={profile!._id}
            imageUrl={profile!.profileImage}
          />
          <ProfileForm profile={profile!} />
        </>
      )}
    </div>
  );
}
