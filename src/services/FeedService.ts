import {flatMap} from "lodash";

import * as db from '../models'

export async function getFeed(user: any) {
    const userCategories = await user.getCategories();

    return flatMap(await Promise.all(
        userCategories.map(async (category: any) => await category.getPublications())
    ));
}

export async function getFeedByCategory(categoryTitle: string) {
    const category = await db.Category.findOne({where: {title: categoryTitle}});
    return await category.getPublications();
}