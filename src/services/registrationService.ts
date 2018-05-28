import {omit} from "lodash";

import {User} from "../models";
import { hashPassword, verifyPassword } from "../utils/encryptionUtils";

interface IUserData {
  email: string,
  password: string,
  fullName: string
}

export async function createUser(userData: IUserData) {
  const passwordHash = hashPassword(userData.password);

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

  if (isPasswordCorrect) {
    return user;
  } else {
    throw new Error("Unable to find user by email and password");
  }
}
