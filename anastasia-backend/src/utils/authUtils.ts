import bcrypt from "bcrypt";

/**
 * Şifreyi hashle
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Şifre karşılaştırması yap
 */
export const comparePasswords = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

/**
 * Şifre zaten hashlenmiş mi kontrol et
 */
export const isPasswordHashed = (password: string): boolean => {
  return password.startsWith("$2b$10$"); // bcrypt hash formatı
};
