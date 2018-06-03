import axios from 'axios';

import * as db from "../models";

export async function classifyPublication(publication: any) {
    const {data: categoryData} = await axios.get("http://localhost:3005", {
        data: {
            text: publication.text
        }
    });

    const category = await db.Category.findById(categoryData.id);
    return await publication.addCategory(category);
}
