import Logo from 'components/logo';
import Link from 'next/link';
import '../styles/global.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Link href="/">
                <a className="block p-2 w-52 text-white">
                    <span className="inline-block w-9 h-6">
                        <Logo />
                    </span>
                    App Actions
                </a>
            </Link>
            <Component {...pageProps} />
        </>
    );
}
