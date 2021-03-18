import Status from 'http-status-codes';

export default function Logout() {
    return null;
}

export async function getServerSideProps({ res }) {
    const returnTo = encodeURI(process.env.NEXT_PUBLIC_DOMAIN);

    let redirect = `https://${process.env.AUTH0_DOMAIN}/v2/logout?federated&returnTo=${returnTo}`;

    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
        redirect = process.env.NEXT_PUBLIC_DOMAIN;
    }

    res.writeHead(Status.MOVED_TEMPORARILY, {
        Location: redirect,
    });
    res.end();

    return { props: {} };
}
