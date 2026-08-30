import type { ImageMetadata } from 'astro';
import { sanitizeImageSrc } from '@tinacms/astro/sanitize';

const rasterAssetModules = import.meta.glob<ImageMetadata>(
	'/src/assets/images/uploads/**/*.{jpg,jpeg,png,webp,avif}',
	{ import: 'default' }
);
const sourceAssetModules = import.meta.glob<string>(
	'/src/assets/images/uploads/**/*.{gif,tif,tiff,svg}',
	{ import: 'default', query: '?url' }
);

export type MediaAsset =
	| { kind: 'optimized'; source: ImageMetadata; path: string }
	| { kind: 'source'; source: string; path: string };

export function resolveMediaPath(value?: string | null) {
	if (!value) {
		return undefined;
	}

	const trimmed = value.trim();
	const normalized = /^[a-z][a-z\d+.-]*:/i.test(trimmed) || trimmed.startsWith('/')
		? trimmed
		: `/${trimmed}`;
	const safePath = sanitizeImageSrc(normalized);

	return safePath || undefined;
}

function sourceAssetKey(path: string) {
	return path.startsWith('/images/uploads/') ? `/src/assets${path}` : undefined;
}

export async function resolveMediaAsset(value?: string | null): Promise<MediaAsset | undefined> {
	const safePath = resolveMediaPath(value);
	if (!safePath) {
		return undefined;
	}

	const key = sourceAssetKey(safePath);
	if (key) {
		const rasterModule = rasterAssetModules[key];
		if (rasterModule) {
			return { kind: 'optimized', source: await rasterModule(), path: safePath };
		}

		const sourceModule = sourceAssetModules[key];
		if (sourceModule) {
			return { kind: 'source', source: await sourceModule(), path: safePath };
		}
	}

	return { kind: 'source', source: safePath, path: safePath };
}
