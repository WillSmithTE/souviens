import type { LoaderFunction } from '@remix-run/cloudflare'

export let loader: LoaderFunction = () => {
	return {
		name: 'Souviens',
		short_name: 'Souviens',
		description: 'A personal reminder app to help you remember important things for the future',
		start_url: '/',
		display: 'standalone',
		background_color: '#1f2937', // Dark gray background
		theme_color: '#ea580c', // Orange theme color
		orientation: 'portrait',
		scope: '/',
		icons: [
			{
				src: '/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
		categories: ['productivity', 'lifestyle', 'utilities'],
		lang: 'en',
		dir: 'ltr',
	}
}