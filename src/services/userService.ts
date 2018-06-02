import { omit, pick } from "lodash";
import { sign } from "jsonwebtoken";

import { hashPassword, verifyPassword } from "../utils/encryptionUtils";
import { User } from "../models";

interface IUserData {
  email: string,
  password: string,
  fullName: string
}

export async function createUser(userData: IUserData) {
  const passwordHash = await hashPassword(userData.password);
  console.log('HASH', passwordHash)

  try {
    return await User.create({ ...userData, passwordHash });
  } catch (error) {
    return error;
  }
}

export async function findByEmailAndPassword(email: string, password: string) {
  const user = await User.findOne({
    attributes: ["id", "email", "fullName", "passwordHash"],
    where: { email }
  });

  if (!user) {
    throw new Error("Unable to find user by email and password");
  }

  const isPasswordCorrect = await verifyPassword(password, user.passwordHash);

  if (!isPasswordCorrect) {
    throw new Error("Unable to find user by email and password");
  }

  return user;
}

export async function findByEmail(email: string) {
  const user = await User.findOne({
    attributes: ["id", "email", "fullName", "passwordHash"],
    where: { email }
  });

  if (!user) {
    throw new Error("Unable to find user by email and password");
  }

  return user;
}

export async function authorizeUser(user: any) {
  const payload = pick(user, 'id', 'email', 'fullName');
  const accessToken = await sign(payload, process.env.JWT_PASSPHRASE, { expiresIn: "1d" });

  await user.update({ accessToken });

  return accessToken;
}

export async function findByAccessToken(accessToken: string) {
  return await User.findOne({
    where: { accessToken }
  });
}