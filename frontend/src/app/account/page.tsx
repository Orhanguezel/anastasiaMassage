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
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Message = styled.p<{ success?: boolean }>`
  color: ${({ success }) => (success ? "green" : "red")};
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const { profile, loading, error, successMessage } = useAppSelector(
    (state) => state.profile
  );
  const { t } = useTranslation("account");

  useEffect(() => {
    dispatch(getUserProfile());
    return () => {
      dispatch(clearProfileMessages());
    };
  }, [dispatch]);

  return (
    <Container>
      <Title>{t("account.title")}</Title>

      {error && <Message>{error}</Message>}
      {successMessage && <Message success>{successMessage}</Message>}
      {loading && <p>{t("account.loading")}</p>}

      {profile && (
        <>
          <ProfileImageUploader
            userId={profile._id}
            imageUrl={profile.profileImage}
          />
          <ProfileForm profile={profile} />
        </>
      )}
    </Container>
  );
}
