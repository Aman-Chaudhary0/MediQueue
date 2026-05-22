import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (plainTextPassword) => {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
};

export const verifyPassword = async (plainTextPassword, hashedPassword) => {
  if (!plainTextPassword || !hashedPassword) {
    return false;
  }

  return bcrypt.compare(plainTextPassword, hashedPassword);
};

export const isPasswordHash = (value) => {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
};
