import type { TinaRichTextContent, TinaRichTextNode } from '@tinacms/astro/types';

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isRichTextNode(value: unknown): value is TinaRichTextNode {
	return isRecord(value) && typeof value.type === 'string';
}

export function isTinaRichTextContent(value: unknown): value is TinaRichTextContent {
	if (value == null) return true;
	if (Array.isArray(value)) return value.every(isRichTextNode);
	return isRecord(value) && value.type === 'root' && Array.isArray(value.children) && value.children.every(isRichTextNode);
}
