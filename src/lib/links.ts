import { sanitizeHref } from '@tinacms/astro/sanitize';

export function resolveCmsHref(value?: string | null) {
	if (!value) {
		return undefined;
	}

	const trimmed = value.trim();
	if (/^tel:\+?[0-9().\s-]+$/i.test(trimmed)) {
		return trimmed;
	}

	const safeHref = sanitizeHref(trimmed, '');
	return safeHref || undefined;
}
