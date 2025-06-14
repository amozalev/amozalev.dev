import { mdsvex, escapeSvelte } from 'mdsvex';
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import unwrapImages from 'rehype-unwrap-images';
import linkHeadings from 'rehype-autolink-headings';
import slugify from 'rehype-slug';
import { createHighlighter } from 'shiki';

const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		},
		prerender: {
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
				_: './src/components/PostLayout.svelte'
			},
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const highlighter = await createHighlighter({
						themes: ['vitesse-dark', 'monokai', 'material-theme-darker'],
						langs: ['javascript', 'typescript', 'python', 'sh', 'json']
					});
					await highlighter.loadLanguage('javascript', 'typescript');
					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' }));
					return `{@html \`${html}\` }`;
				}
			}
		})
	],
	extensions: ['.svelte', '.md']
};

export default config;
