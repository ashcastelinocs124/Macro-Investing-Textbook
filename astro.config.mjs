// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
	site: 'https://ashcastelinocs124.github.io',
	base: '/Macro-Investing-Textbook',
	integrations: [
		starlight({
			title: 'Global Macro Cookbook',
			description: 'A free, interactive textbook on how the global economy moves markets.',
			customCss: ['@fontsource/lato/400.css', '@fontsource/lato/400-italic.css', '@fontsource/lato/700.css', './src/styles/custom.css'],
			plugins: [starlightLinksValidator()],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/ashcastelinocs124/Macro-Investing-Textbook' }],
			components: { SocialIcons: './src/components/SocialIcons.astro' },
			sidebar: [
				{ label: 'Start here', items: [{ autogenerate: { directory: 'start-here' } }] },
				{ label: 'Part I · How the economy works', items: [{ autogenerate: { directory: 'part-1-economy' } }] },
				{ label: 'Part II · Policy makers', items: [{ autogenerate: { directory: 'part-2-policy' } }] },
				{ label: 'Part III · The asset classes', items: [{ autogenerate: { directory: 'part-3-assets' } }] },
				{ label: 'Part IV · The global system', items: [{ autogenerate: { directory: 'part-4-global' } }] },
				{ label: 'Part V · Doing macro', items: [{ autogenerate: { directory: 'part-5-practice' } }] },
				{ label: 'Glossary', slug: 'glossary' },
			],
		}),
		react(),
	],
});
