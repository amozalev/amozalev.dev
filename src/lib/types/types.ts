import type { SvelteComponent } from 'svelte';

export type PostModule = {
	metadata: {
		title: string;
		datetime: string;
		description?: string;
		slug: string;
		tags?: string[];
		materials?: string[];
		pinned?: boolean;
	};
	default: typeof SvelteComponent;
};

export type PageMetaType = 'website' | 'article' | 'video.movie' | 'book' | 'profile';
