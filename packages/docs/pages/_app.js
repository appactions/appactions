import Head from 'next/head';
import Link from 'next/link';
import Logo from 'components/logo';
import 'styles/global.css';
import 'styles/custom-markdown-light.css';
import 'styles/table-of-content.css';
import 'styles/anchor-link.css';
import 'styles/customization.css';
import 'highlight.js/styles/github.css';

const siteTitle = 'App Actions Documentations';

export default function App({ Component, pageProps }) {
    return (
        <div className="max-w-xl px-4 py-0 mx-auto mt-4 mb-4">
            <Head>
                <link rel="icon" href="/favicon.svg" />
                <meta name="description" content="Learn how to build a personal website using Next.js" />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle,
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <header className="flex flex-col items-center mb-12">
                <Link href="https://appactions.com">
                    <a className="p-2 text-xl font-medium">
                        <span className="inline-block h-6 mr-2 align-middle w-9">
                            <Logo stroke="currentColor" />
                        </span>
                        App Actions
                    </a>
                </Link>
            </header>
            <Component {...pageProps} />
            <div className="flex flex-col px-4 py-4 mx-auto max-w-7xl sm:flex-row sm:justify-around sm:px-8 sm:py-8">
                {/* <p className="mt-4 sm:mt-0">
                    Made in Amsterdam{' '}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        fill="#86BA90"
                        viewBox="0 0 256 256"
                        className="inline-block"
                    >
                        <rect width={256} height={256} fill="none" />
                        <path d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z" />
                    </svg>
                </p> */}
                <p> © 2022 App Actions. All rights reserved.</p>
            </div>
        </div>
    );
}
