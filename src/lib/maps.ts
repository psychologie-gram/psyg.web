const googleMapsEmbedOrigin = 'https://www.google.com';
const googleMapsEmbedPath = '/maps/embed';

export function resolveGoogleMapsEmbedUrl(value?: string | null) {
	if (!value) {
		return undefined;
	}

	try {
		const url = new URL(value.trim());
		if (
			url.origin !== googleMapsEmbedOrigin ||
			url.pathname !== googleMapsEmbedPath ||
			!url.searchParams.has('pb')
		) {
			return undefined;
		}

		return url.toString();
	} catch {
		return undefined;
	}
}
