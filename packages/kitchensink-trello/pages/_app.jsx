import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <div className="min-h-screen">
            <Head>
                <title>Trello Kitchensink</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp;
