import Head from 'next/head';
import Layout from '../components/layout';
import { getMainDocsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';

export default function Home({ mainData }) {
    return (
        <Layout home>
            <Head>
                <title>{mainData.title}</title>
            </Head>
            <article>
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: mainData.contentHtml }} />

                <div className="mt-6 text-gray-600">
                    Last changed: <Date dateString={mainData.date} />
                </div>
            </article>
        </Layout>
    );
}

export async function getStaticProps() {
    const mainData = await getMainDocsData();
    return {
        props: {
            mainData,
        },
    };
}
