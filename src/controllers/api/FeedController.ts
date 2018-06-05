import * as Router from "koa-router";
import {findByAccessToken, findById} from "../../services/UserService";
import {getFeed, getFeedByCategory} from "../../services/FeedService";
import {fetchAllPublications} from "../../services/PublicationService";

const feedController = new Router({prefix: "/user/:userId/feed"});

feedController.get("/", async (ctx) => {
    const user = await findById(ctx.params.userId);

    await fetchAllPublications(user);
    ctx.body = await getFeed(user);
});

feedController.get("/:categoryTitle", async (ctx) => {
    const {categoryTitle} = ctx.params;

    ctx.body = await getFeedByCategory(categoryTitle);
});

export default feedController;
