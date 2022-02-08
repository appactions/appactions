import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
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
                {/* <h1 className={utilStyles.headingXl}>{mainData.title}</h1> */}
                <div dangerouslySetInnerHTML={{ __html: mainData.contentHtml }} />

                <div className={utilStyles.lightText}>
                    Last changed: <Date dateString={mainData.date} />
                </div>
            </article>
            {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section> */}
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
