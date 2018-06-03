import * as Router from "koa-router";

import {findAllCategories} from "../../services/CategoryService";

const categoriesController = new Router();

categoriesController.get("/", async (ctx) => {
    ctx.body = await findAllCategories();
});

export default categoriesController;
