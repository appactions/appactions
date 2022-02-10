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
import { h, s } from 'hastscript';
// import { toString } from 'mdast-util-to-string';

const docsDirectory = path.join(process.cwd(), 'pages');

const anchor = s(
    'svg',
    {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '100%',
        height: '100%',
        fill: 'currentColor',
        viewBox: '0 0 256 256',
    },
    s('rect', {
        width: 256,
        height: 256,
        fill: 'none',
    }),
    s('line', {
        x1: 128,
        y1: 232,
        x2: 128,
        y2: 72,
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
    s('circle', {
        cx: 128,
        cy: 52,
        r: 20,
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
    s('line', {
        x1: 88,
        y1: 112,
        x2: 168,
        y2: 112,
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
    s('path', {
        d: 'M40,144a48,48,0,0,0,48,48,40,40,0,0,1,40,40,40,40,0,0,1,40-40,48,48,0,0,0,48-48',
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
);

const lock = s(
    'svg',
    {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 192,
        height: 192,
        fill: '#000000',
        viewBox: '0 0 256 256',
    },
    s('rect', {
        width: 256,
        height: 256,
        fill: 'none',
    }),
    s('circle', {
        cx: 128,
        cy: 140,
        r: 20,
        fill: 'none',
        stroke: '#000000',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
    s('line', {
        x1: 128,
        y1: 160,
        x2: 128,
        y2: 184,
        fill: 'none',
        stroke: '#000000',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
    s('rect', {
        x: 40,
        y: 88,
        width: 176,
        height: 128,
        rx: 8,
        fill: 'none',
        stroke: '#000000',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
    s('path', {
        d: 'M92,88V52a36,36,0,0,1,72,0V88',
        fill: 'none',
        stroke: '#000000',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 16,
    }),
);

export async function getMainDocsData() {
    const about = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(await read(path.join(docsDirectory, 'about.md')));

    const id = 'getting-started';
    const fullPath = path.join(docsDirectory, `${id}.md`);
    let frontMatter = null;

    const content = await unified()
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
            content() {
                return h('span.anchor-link', anchor);
            },
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

    const getLockedHtml = (messagge = '') => `
    <div class="w-full my-12 p-4 text-gray-700">
        <p class="text-center align-middle absolute left-0 right-0 mt-16">
            <br />Locked section.<br /><br />This part is only available for early access participants.
        </p>
        <div class="inline-block w-full">
            <span class="blur-md ml-2">lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
        </div>
    </div>`;

    const contentHtml = String(content).replace(/\[LOCKED\]/g, getLockedHtml());

    return {
        aboutHtml: String(about),
        contentHtml,
        ...matter,
    };
}
