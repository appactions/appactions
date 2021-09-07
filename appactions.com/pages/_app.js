import Head from 'next/head';
import Header from 'components/header';
import Footer from 'components/footer';
import Main from 'components/main';
import './style.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>App Actions</title>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                {/* Hotjar Tracking Code for react-app-actions.com */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(h,o,t,j,a,r){
                                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                                h._hjSettings={hjid:2331826,hjsv:6};
                                a=o.getElementsByTagName('head')[0];
                                r=o.createElement('script');r.async=1;
                                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                                a.appendChild(r);
                            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
                    }}
                />
            </Head>

            <div className="flex flex-col justify-between min-h-screen">
                {/* <Header /> */}

                <Main>
                    <Component {...pageProps} />
                </Main>

                <Footer />
            </div>
        </>
    );
}

export default MyApp;
