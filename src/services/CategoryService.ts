import * as db from "../models";

export async function findAllCategories() {
    return await db.Category.findAll({ raw: true });
}

export async function findUserCategories(user: any) {
    return await user.getCategories();
}

export async function addUserCategory(user: any, categoryId: number) {
    const category = await db.Category.findById(categoryId);

    return await user.addCategory(category);
}

export async function removeUserCategory(user: any, categoryId: number) {
    const category = await db.Category.findById(categoryId);

    return await user.removeCategory(category);
}

