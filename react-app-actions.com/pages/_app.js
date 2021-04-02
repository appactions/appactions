import Head from 'next/head';
import Header from 'components/header';
import Footer from 'components/footer';
import './style.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>React App Actions</title>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            </Head>

            <Header />

            <Component {...pageProps} />

            <Footer />
        </>
    );
}

export default MyApp;
