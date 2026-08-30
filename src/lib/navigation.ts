export function normalizePath(path: string) {
	const cleaned = path.replace(/\/+$/, '');
	return cleaned.length === 0 ? '/' : cleaned;
}

export function isCurrentPath(currentPath: string, href: string) {
	return normalizePath(currentPath) === normalizePath(href);
}
