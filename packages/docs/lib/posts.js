import path from 'path';
import { read } from 'to-vfile';
// import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import remarkNormalizeHeadings from 'remark-normalize-headings';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeTableOfContent from '@jsdevtools/rehype-toc';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import yaml from 'js-yaml';

const docsDirectory = path.join(process.cwd(), 'pages');

export async function getMainDocsData() {
    const id = 'index';
    const fullPath = path.join(docsDirectory, `${id}.md`);
    let frontMatter = null;

    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])
        .use(() => tree => {
            if (tree.children[0].type === 'yaml') {
                frontMatter = tree.children[0].value;
            }
        })
        .use(remarkGfm)
        .use(remarkRehype)
        .use(remarkNormalizeHeadings)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, {
            // behavior: 'before',
            // content(node) {
            //     return anchorIcon;
            //     // return h('span.anchor-link', 'Read the “', toString(node), '” section');
            //     return h('span.anchor-link', anchorIcon);
            //     // return [
            //     //     h('span.visually-hidden', 'Read the “', toString(node), '” section'),
            //     //     h('span.icon.icon-link', { ariaHidden: 'true' }),
            //     // ];
            // },
        })
        .use(rehypeHighlight)
        .use(rehypeTableOfContent, {
            headings: ['h2', 'h3'],
        })
        .use(rehypeStringify)
        .process(await read(fullPath));

    if (!frontMatter) {
        throw new Error(`Front matter not found in ${fullPath}`);
    }

    const matter = yaml.load(frontMatter);

    console.log(matter)

    return {
        id,
        contentHtml: String(file),
        ...matter,
    };
}
