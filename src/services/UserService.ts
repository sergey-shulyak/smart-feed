import {omit, pick} from "lodash";
import {sign} from "jsonwebtoken";

import {hashPassword, verifyPassword} from "../utils/encryptionUtils";
import * as db from "../models";

interface IUserData {
    email: string,
    password: string,
    fullName: string
}

export async function createUser(userData: IUserData) {
    const passwordHash = await hashPassword(userData.password);
    console.log('HASH', passwordHash)

    try {
        return await db.User.create({...userData, passwordHash});
    } catch (error) {
        return error;
    }
}

export async function findByEmailAndPassword(email: string, password: string) {
    const user = await db.User.findOne({
        attributes: ["id", "email", "fullName", "passwordHash"],
        where: {email}
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
    const user = await db.User.findOne({
        attributes: ["id", "email", "fullName", "passwordHash"],
        where: {email}
    });

    if (!user) {
        throw new Error("Unable to find user by email and password");
    }

    return user;
}

export async function authorizeUser(user: any) {
    const payload = pick(user, 'id', 'email', 'fullName');
    const accessToken = await sign(payload, process.env.JWT_PASSPHRASE, {expiresIn: "1d"});

    await user.update({accessToken});

    return user;
}

export async function findByAccessToken(accessToken: string) {
    return await db.User.findOne({
        where: {accessToken},
        attributes: {exclude: ["passwordHash", "salt"]}
    });
}

export async function findById(id: number) {
    return await db.User.findById(id);
}

export async function getSocialIntegrations(user: any) {
    return await user.getSocialIntegrations();
}


export async function updateUser(user, update) {
    return await user.update({...update});
}