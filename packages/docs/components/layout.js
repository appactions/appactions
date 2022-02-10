import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Logo from 'components/logo';

export const siteTitle = 'App Actions Documentations';

export default function Layout({ children, home }) {
    return (
        <div className="max-w-xl px-4 py-0 mx-auto mt-4 mb-24">
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
            <main>{children}</main>
            {!home && (
                <div className="mx-0 mt-12 mb-0">
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
        </div>
    );
}