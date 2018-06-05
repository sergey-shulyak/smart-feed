import * as Router from "koa-router";
import {findAllPublications, findPublication} from "../../services/PublicationService";

const categoriesController = new Router();

categoriesController.get("/", async (ctx) => {
    ctx.body = await findAllPublications();
});

categoriesController.get("/:publicationId", async (ctx) => {
    ctx.body = await findPublication(ctx.params.publicationId);
});


export default categoriesController;
