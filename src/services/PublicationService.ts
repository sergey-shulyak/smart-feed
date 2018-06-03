import * as db from "../models";
import axios from 'axios';
import * as Twitter from 'twitter';

export async function findUserFavorites(user: any) {
    return await user.getPublications();
}

export async function addUserFavorite(user: any, publicationId: number) {
    const favorite = await db.Publication.findById(publicationId);

    return await user.addPublication(favorite);
}

export async function removeUserFavorite(user: any, publicationId: number) {
    const favorite = await db.Publication.findById(publicationId);

    return await user.removePublication(favorite);
}

async function fetchPublications(user: any, type: string, accessToken, accessTokenSecret) {
    // const twitterAccount = await user.getSocialIntegrations({where: {type: 'twitter'}});
    // console.log("TWITTER ACC", twitterAccount);

    const twitter = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret
    });

    switch (type) {
        case 'twitter':

            twitter.get('statuses/user_timeline', {}, async (error, tweets, response) => {
                if (!error) {
                    console.log(tweets);
                }

                console.log("TWEETS", tweets);
            });
            // return [{
            //     id: 1,
            //     text: "Java development test"
            // }];
        case 'facebook':
            break;
        case 'medium':
            break;
        default:
            break;
    }
}

export async function fetchAllPublications(user) {
    const socialIntegrations = await user.getSocialIntegrations();

    console.log("S INT", socialIntegrations);

    let publications: object[] = [];

    for (const integration of socialIntegrations) {
        publications = [...publications, ...await fetchPublications(user, integration.type, integration.accessToken)];
    }

    for (const publication of publications) {
        await db.Publication.create({...publication});
    }

    const data = {data: publications};

    const {data: classifiedData} = await axios.get("http://localhost:3005/classifyBulk", {
        data
    });

    for (const classifiedPublication of classifiedData) {
        const category = await db.Category.findById(classifiedPublication.categoryId);
        await db.Publication.findById(classifiedPublication.publicationId).addCategory(category);
    }

    return classifiedData;
}
