"use client";

import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfileImage } from "@/store/user/profileSlice";
import { getImageSrc } from "@/utils/getImageSrc";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

interface Props {
  userId: string;
  imageUrl: string;
}

export default function ProfileImageUploader({ userId, imageUrl }: Props) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.profile);
  const { t } = useTranslation("account");

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      dispatch(updateProfileImage({ userId, file }));
    }
  };

  return (
    <Wrapper>
      <Label>{t("profile.image.label")}</Label>
      <ImagePreview>
        <Image
          src={preview || getImageSrc(imageUrl)}
          alt="Profil"
          width={100}
          height={100}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      </ImagePreview>
      <FileInput type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <Loading>{t("profile.image.loading")}</Loading>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
`;

const ImagePreview = styled.div`
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  font-size: 0.9rem;
`;

const Loading = styled.p`
  color: orange;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;
