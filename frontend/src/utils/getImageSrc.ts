
export const getImageSrc = (url?: string, folder: string = "profile-images"): string => {
  // Eğer URL geçerli değilse local default-avatar kullan
  if (!url || url.includes("placeholder.com") || url.trim() === "") {
    return "/user/default-avatar.png";
  }

  if (url.startsWith("http")) return url;

  return `/uploads/${folder}/${url}`;
};
