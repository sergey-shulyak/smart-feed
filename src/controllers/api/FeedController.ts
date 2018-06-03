import * as Router from "koa-router";
import {findByAccessToken} from "../../services/UserService";
import {getFeed, getFeedByCategory} from "../../services/FeedService";
import {fetchAllPublications} from "../../services/PublicationService";

const feedController = new Router();

feedController.get("/", async (ctx) => {
    const user = await findByAccessToken(ctx.cookies.get("accessToken"));
    // console.log('TOKEN FROM API', ctx.cookies.get('accessToken'));

    await fetchAllPublications(user);
    ctx.body = await getFeed(user);
});

feedController.get("/:categoryTitle", async (ctx) => {
    ctx.body = await getFeedByCategory(ctx.params.categoryTitle);
});

export default feedController;
