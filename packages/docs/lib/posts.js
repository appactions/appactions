import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { read } from 'to-vfile';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

const docsDirectory = path.join(process.cwd(), 'pages');

export async function getMainDocsData() {
    const id = 'index';
    const fullPath = path.join(docsDirectory, `${id}.md`);

    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])
        .use(remarkGfm)
        // .use(() => tree => {
        //     console.dir(tree);
        // })
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(await read(fullPath));

    console.log(file.data);

    console.error(reporter(file));

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
        id,
        contentHtml: String(file),
        ...matterResult.data,
    };
}
