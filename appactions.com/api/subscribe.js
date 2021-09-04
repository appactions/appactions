import fetch from 'node-fetch';
import Status from 'http-status-codes';

const CONVERTKIT_WAITLIST_ID = '2175355';

export default async (request, response) => {
    if (request.method !== 'POST') {
        return response.status(Status.BAD_REQUEST).end();
    }

    const { email } = request.body;

    if (!email) {
        return response.status(Status.BAD_REQUEST).end();
    }

    try {
        const res = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_WAITLIST_ID}/subscribe`, {
            method: 'POST',
            body: JSON.stringify({
                api_key: process.env.CONVERTKIT_API_KEY,
                email,
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });

        const json = await res.json();

        console.log('convertkit', json, { email });

        if (json.error) {
            throw new Error(json.error);
        }

        return response.status(Status.OK).json({ email }).end();
    } catch (error) {
        return response.status(Status.BAD_REQUEST).json({ error: 'Something went wrong with ConvertKit' }).end();
    }
};
