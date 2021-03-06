import * as db from "../models";
import axios from 'axios';
import * as Twitter from 'twitter';
import * as moment from 'moment'
import {uniqWith} from 'lodash';

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

            const { statuses: tweets } = await twitter.get('search/tweets', { q: 'node.js' });
            return tweets.map(tweet => ({
                ...tweet,
                createdAt: moment(tweet.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY").valueOf(),
                title: tweet.text.substr(0, 20),
                id: tweet.id_str,
                url: tweet.urls ? tweet.urls[0].url : null
            }));
        case 'facebook':
            break;
        case 'medium':
            const {data: publications} = await axios.get("http://localhost:3010/Medium");
            return publications
        default:
            break;
    }
}

interface IPublication {
    id: number,
    title: string,
    url: string,
    createdAt: Date,
    text: string
}

const CLASSIFICATION_ENDPOINT = "http://localhost:3005/classifyBulk";

export async function fetchAllPublications(user: any) {
    const socialIntegrations = await user.getSocialIntegrations();

    let publications: IPublication[] = [];

    for (const integration of socialIntegrations) {
        publications = [
            ...publications,
            ...await fetchPublications(user, integration.type, integration.accessToken, integration.accessTokenSecret)];
    }

    for (const publication of publications) {
        await db.Publication.findOrCreate({
            where: { id: publication.id },
            defaults: {
                title: publication.title,
                url: publication.url,
                createdAt: publication.createdAt,
                text: publication.text
            }
        });
    }


    const noDuplicatesPublications = uniqWith(publications, (publication, other) => publication.id === other.id);
    const data = { data: noDuplicatesPublications };

    const { data: responseData } = await axios.get(CLASSIFICATION_ENDPOINT, {
        data
    });

    for (const classifiedPublication of responseData.classifiedData) {
        const category = await db.Category.findById(classifiedPublication.categoryId);
        await (await db.Publication.findById(classifiedPublication.publicationId)).addCategory(category);
    }

    return responseData.classifiedData;
}
