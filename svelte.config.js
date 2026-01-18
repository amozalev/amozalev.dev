import { mdsvex, escapeSvelte } from 'mdsvex';
import path from 'path';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import unwrapImages from 'rehype-unwrap-images';
import linkHeadings from 'rehype-autolink-headings';
import slugify from 'rehype-slug';
import { createHighlighter } from 'shiki';
import { fileURLToPath } from 'node:url';

const dirname = path.resolve(fileURLToPath(import.meta.url), '../');

const config = {
    kit: {
        adapter: adapter({
            fallback: '404.html'
        }),
        paths: {
            base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
        },
        prerender: {
            handleHttpError: 'warn',
            entries: ['*']
        }
    },
    preprocess: [
        vitePreprocess(),
        mdsvex({
            extensions: ['.md'],
            remarkPlugins: [unwrapImages],
            rehypePlugins: [slugify, [linkHeadings, { behavior: 'append' }]],
            layout: {
                _: path.join(dirname, `./src/components/PostLayout.svelte`)
            },
            highlight: {
                highlighter: async (code, lang = 'text') => {
                    const highlighter = await createHighlighter({
                        themes: ['vitesse-dark', 'monokai', 'material-theme-darker'],
                        langs: [
                            'javascript',
                            'typescript',
                            'python',
                            'sh',
                            'json',
                            'yml',
                            'dockerfile'
                        ]
                    });
                    await highlighter.loadLanguage('javascript', 'typescript');
                    const html = escapeSvelte(
                        highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' })
                    );
                    return `{@html \`${html}\` }`;
                }
            }
        })
    ],
    extensions: ['.svelte', '.md']
};

export default config;
