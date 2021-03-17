import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { db } from 'utils/endpoint';

let authProvider = Providers.Auth0({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN,
});

if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    authProvider = Providers.Credentials({
        name: 'TestLogin',
        credentials: {
            email: { label: 'Email', type: 'text' },
        },
        async authorize(credentials) {
            return {
                id: credentials.email,
                email: credentials.email,
            };
        },
    });
}

export default NextAuth({
    providers: [authProvider],
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            if (!token.sub && profile) {
                token.sub = profile.id;
            }
            return token;
        },
        async session(session, token) {
            const id = token.sub;
            const item = {
                id,
                email: session.user.email,
                role: 'onboarding',
            };

            try {
                await db.users.put({
                    Item: item,
                    ConditionExpression: 'attribute_not_exists(id)',
                });
            } catch (error) {
                if (error.code !== 'ConditionalCheckFailedException') {
                    throw error;
                }
            }

            const {
                Item: { role },
            } = await db.users.get({
                Key: {
                    id,
                },
            });

            session.user.id = id;
            session.user.role = role;

            return session;
        },
    },
    pages: {
        error: '/auth/error',
    },
});
