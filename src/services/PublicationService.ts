import * as db from "../models";
import axios from 'axios';
import * as Twitter from 'twitter';

export async function findUserFavorites(user: any) {
    return await user.getPublications();
}

export async function findAllPublications() {
    return await db.Publication.findAll();
}

export async function findPublication(id: number) {
    return await db.Publication.findById(id);
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
    switch (type) {
        case 'twitter':
            const twitter = new Twitter({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: accessToken,
                access_token_secret: accessTokenSecret
            });

            const {statuses} = await twitter.get('search/tweets', {q: 'node.js'});
            return statuses;

        case 'facebook':
            break;
        case 'medium':
            break;
        default:
            break;
    }
}

export async function fetchAllPublications(user: any) {
    const socialIntegrations = await user.getSocialIntegrations();

    let publications: object[] = [];


    for (const integration of socialIntegrations) {
        publications = [
            ...publications,
            ...await fetchPublications(user, integration.type, integration.accessToken, integration.accessTokenSecret)];
    }


    for (const publication of publications) {
        await db.Publication.findOrCreate({
            where: {id: publication.id_str},
            defaults: {text: publication.text, url: ''}
        });
    }

    const data = {data: publications.map(pub => ({id: pub.id_str, text: pub.text}))};

    const {data: respData} = await axios.get("http://localhost:3005/classifyBulk", {
        data
    });

    for (const classifiedPublication of respData.classifiedData) {
        const category = await db.Category.findById(classifiedPublication.categoryId);
        await (await db.Publication.findById(classifiedPublication.publicationId)).addCategory(category);
    }

    return respData.classifiedData;
}
