import { flatMap, uniqWith, isEqual } from "lodash";

import * as db from '../models'

interface IPublication {
    id: number
}

export async function getFeed(user: any) {
    const userCategories = await user.getCategories();

    const allPublications = flatMap(await Promise.all(
        userCategories.map(async (category: any) => await category.getPublications())
    ));

    const noDuplicatesPublications = uniqWith(allPublications,
        (publication: IPublication, other: IPublication) => publication.id === other.id);

    return noDuplicatesPublications;
}

export async function getFeedByCategory(categoryTitle: string) {
    console.log("TITLE", categoryTitle);
    const category = await db.Category.findOne({ where: { title: categoryTitle } });
    return await category.getPublications();
}