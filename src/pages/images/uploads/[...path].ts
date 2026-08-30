import { extname, isAbsolute, relative, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import type { APIRoute } from 'astro';

export const prerender = false;

const mediaRoot = fileURLToPath(new URL('../../../assets/images/uploads/', import.meta.url));
const contentTypes: Record<string, string> = {
	'.avif': 'image/avif',
	'.gif': 'image/gif',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.tif': 'image/tiff',
	'.tiff': 'image/tiff',
	'.webp': 'image/webp'
};

function isMissingFile(error: unknown) {
	return (
		error !== null &&
		typeof error === 'object' &&
		'code' in error &&
		(error.code === 'ENOENT' || error.code === 'EISDIR')
	);
}

export const GET: APIRoute = async ({ params }) => {
	const requestedPath = params.path;
	if (!requestedPath) {
		return new Response('Not Found', { status: 404 });
	}

	const filePath = resolve(mediaRoot, requestedPath);
	const relativePath = relative(mediaRoot, filePath);
	if (!relativePath || relativePath.startsWith('..') || isAbsolute(relativePath)) {
		return new Response('Forbidden', { status: 403 });
	}

	let contents: Buffer;
	try {
		contents = await readFile(filePath);
	} catch (error) {
		if (isMissingFile(error)) {
			return new Response('Not Found', { status: 404 });
		}
		throw error;
	}

	const body = new Uint8Array(contents.length);
	body.set(contents);

	return new Response(body, {
		headers: {
			'Cache-Control': 'public, max-age=31536000, immutable',
			'Content-Type': contentTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
		}
	});
};
