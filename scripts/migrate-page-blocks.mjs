import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const pagesDir = new URL('../src/data/pages/', import.meta.url);
const block = (_template, value) => ({ _template, visible: true, ...value });
const richTextBody = (paragraphs) => ({
	type: 'root',
	children: paragraphs.map((text) => ({
		type: 'p',
		children: [{ type: 'text', text }]
	}))
});

for (const filename of (await readdir(pagesDir)).filter((name) => name.endsWith('.json')).sort()) {
	const path = join(pagesDir.pathname, filename);
	const page = JSON.parse(await readFile(path, 'utf8'));
	if (Array.isArray(page.blocks)) continue;

	const heroVariant = page.route === '/über-mich' ? 'portrait-tall' : page.route === '/' ? 'portrait' : 'standard';
	const blocks = [block('hero', { variant: heroVariant, ...page.hero })];
	for (const section of page.sections ?? []) blocks.push(block('focus', section));
	if ((page.cards ?? []).length) blocks.push(block('services', { title: '', variant: 'grid', cards: page.cards }));
	if ((page.bodyParagraphs ?? []).length) blocks.push(block('content', { title: '', body: richTextBody(page.bodyParagraphs) }));
	if ((page.timeline ?? []).length) blocks.push(block('timeline', { title: '', entries: page.timeline }));
	if ((page.pricing ?? []).length) blocks.push(block('pricing', { title: '', entries: page.pricing }));
	if ((page.callouts ?? []).length) blocks.push(block('callout', { title: '', notices: page.callouts }));
	if (page.contact) blocks.push(block('contact', { mode: page.route === '/kontakt' ? 'form' : 'links', ...page.contact }));
	if ((page.contentSections ?? []).length) blocks.push(block('legal', { sections: page.contentSections }));

	const migrated = {
		order: page.order,
		route: page.route,
		title: page.title,
		navTitle: page.navTitle,
		description: page.description,
		showInNavigation: page.showInNavigation,
		blocks
	};
	await writeFile(path, `${JSON.stringify(migrated, null, 2)}\n`);
	console.log(`Migrated ${filename}`);
}
