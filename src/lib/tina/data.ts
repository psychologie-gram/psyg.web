import { requestWithMetadata } from '@tinacms/astro/data';
import { createClient } from 'tinacms/dist/client';

import client from '../../../tina/__generated__/client';
import { queries } from '../../../tina/__generated__/types';
import { allPages as staticAllPages, type PageData, type SiteSettings } from '../site-data';
import { isTinaRichTextContent } from '../rich-text';

const pageRouteByFilename: Record<string, string> = {
	'start.json': '/',
	'ueber-mich.json': '/über-mich',
	'angebot.json': '/angebot',
	'ablauf-kosten.json': '/ablauf-kosten',
	'kontakt.json': '/kontakt',
	'ausbildungen-berufserfahrung.json': '/ausbildungen-berufserfahrung',
	'impressum-datenschutz.json': '/impressum-datenschutz'
};

type MaybeArray<T> = Array<T | null> | null | undefined;
type RawRecord = Record<string, unknown>;
type TinaQueryClient = typeof client;

// Static page rendering runs inside Cloudflare's prerenderer, where the
// TINA_LOCAL_URL environment variable from `tinacms build --content=local`
// is not available.
const localClient: TinaQueryClient = createClient({
	url: 'http://localhost:4001/graphql',
	queries
});

export type IndexedItem<T> = { value: T; index: number };

export function indexedList<T>(items: MaybeArray<T>): IndexedItem<T>[] {
	return (items ?? []).flatMap((value, index) => (value == null ? [] : [{ value, index }]));
}

export function indexedStringList(items: unknown): IndexedItem<string>[] {
	return Array.isArray(items)
		? items.flatMap((value, index) => (typeof value === 'string' ? [{ value, index }] : []))
		: [];
}

function isRecord(value: unknown): value is RawRecord {
	return value !== null && typeof value === 'object';
}

export function indexedRecordList(items: unknown): IndexedItem<TinaPageBlockDocument>[] {
	return Array.isArray(items)
		? items.flatMap((value, index) =>
				isRecord(value)
					? [{ value, index }]
					: []
			)
		: [];
}

function compactRecords(items: unknown): RawRecord[] {
	return Array.isArray(items) ? items.flatMap((item) => (isRecord(item) ? [item] : [])) : [];
}

function normalizeStringArray(items: unknown): string[] {
	return indexedStringList(items).map(({ value }) => value);
}

function normalizePricingDurations(value: unknown): string[] {
	return typeof value === 'string' ? (value ? [value] : []) : normalizeStringArray(value);
}

function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function stringValue(value: unknown, fallback = ''): string {
	return optionalString(value) ?? fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
	return typeof value === 'boolean' ? value : fallback;
}

export function asTinaRecord(value: unknown): TinaPageBlockDocument | undefined {
	return isRecord(value) ? value : undefined;
}

function normalizeLink(link: unknown) {
	const record = asTinaRecord(link);
	const label = optionalString(record?.label);
	const href = optionalString(record?.href);

	if (!label || !href) return undefined;
	return { label, href };
}

export const getSiteDocument = (queryClient: TinaQueryClient = client) =>
	requestWithMetadata(queryClient.queries.site({ relativePath: 'site.json' }));
export const getPageDocument = (filename: string, queryClient: TinaQueryClient = client) =>
	requestWithMetadata(queryClient.queries.page({ relativePath: filename }), { priority: 'primary' });
export const getPageDocuments = (queryClient: TinaQueryClient = client) =>
	requestWithMetadata(queryClient.queries.pageConnection({ first: 100 }));

export type TinaSiteDocument = NonNullable<Awaited<ReturnType<typeof getSiteDocument>>['data']['site']>;
export type TinaPageBlockDocument = RawRecord;
export type TinaPageDocument = NonNullable<
	Awaited<ReturnType<typeof getPageDocument>>['data']['page']
> & { blocks?: Array<TinaPageBlockDocument | null> };
type TinaPageListEdges = NonNullable<
	Awaited<ReturnType<typeof getPageDocuments>>['data']['pageConnection']['edges']
>;
export type TinaPageListEdge = NonNullable<TinaPageListEdges[number]>;
export type TinaPageListDocument = NonNullable<TinaPageListEdge['node']> & {
	blocks?: Array<TinaPageBlockDocument | null>;
};
export type TinaSiteUiDocument = NonNullable<TinaSiteDocument['ui']>;

export function normalizeSiteDocument(siteDocument: TinaSiteDocument): SiteSettings {
	const ui = siteDocument.ui;
	return {
		name: siteDocument.name ?? '',
		lang: siteDocument.lang ?? 'de-AT',
		siteUrl: siteDocument.siteUrl ?? 'https://www.psychologie-gram.at',
		description: siteDocument.description ?? '',
		owner: siteDocument.owner ?? '',
		jobTitle: siteDocument.jobTitle ?? '',
		email: siteDocument.email ?? '',
		phone: siteDocument.phone ?? '',
		phoneDisplay: siteDocument.phoneDisplay ?? '',
		addressLines: normalizeStringArray(siteDocument.addressLines),
		officeHours: normalizeStringArray(siteDocument.officeHours),
		ui: {
			skipLinkLabel: ui?.skipLinkLabel ?? 'Zum Inhalt springen',
			menuLabel: ui?.menuLabel ?? 'Menü',
			headerCta: normalizeLink(ui?.headerCta) ?? { label: 'Erstgespräch vereinbaren', href: '/kontakt' },
			formSubject: ui?.formSubject ?? 'Kontaktanfrage',
			formNamePlaceholder: ui?.formNamePlaceholder ?? 'Name',
			formEmailPlaceholder: ui?.formEmailPlaceholder ?? 'E-Mail-Adresse',
			formMessagePlaceholder: ui?.formMessagePlaceholder ?? 'Nachricht',
			formSubmitLabel: ui?.formSubmitLabel ?? 'Absenden',
			footerCopyright: ui?.footerCopyright ?? '2026'
		}
	};
}

function normalizeBlock(block: TinaPageBlockDocument): PageData['blocks'][number] | undefined {
	const value = block;
	const template =
		optionalString(value._template) ??
		optionalString(value.__typename)
			?.replace(/^PageBlocks/, '')
			.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
			.toLowerCase();
	if (template === 'hero') {
		return {
			_template: 'hero',
			visible: booleanValue(value.visible, true),
			variant:
				value.variant === 'portrait-tall'
					? 'portrait-tall'
					: value.variant === 'portrait'
						? 'portrait'
						: 'standard',
			eyebrow: optionalString(value.eyebrow),
			title: stringValue(value.title),
			subtitle: optionalString(value.subtitle),
			intro: stringValue(value.intro),
			image: optionalString(value.image),
			imageAlt: optionalString(value.imageAlt),
			primaryCta: normalizeLink(value.primaryCta),
			secondaryCta: normalizeLink(value.secondaryCta)
		};
	}
	if (template === 'focus') {
		return {
			_template: 'focus',
			visible: booleanValue(value.visible, true),
			title: stringValue(value.title),
			intro: optionalString(value.intro),
			points: normalizeStringArray(value.points)
		};
	}
	if (template === 'services') {
		return {
			_template: 'services',
			visible: booleanValue(value.visible, true),
			variant: value.variant === 'compact' ? 'compact' : 'grid',
			title: stringValue(value.title),
			cards: compactRecords(value.cards).map((card) => ({
				title: stringValue(card.title),
				image: optionalString(card.image),
				imageAlt: optionalString(card.imageAlt),
				description: optionalString(card.description),
				items: normalizeStringArray(card.items),
				hrefLabel: optionalString(card.hrefLabel),
				href: optionalString(card.href)
			}))
		};
	}
	if (template === 'content') {
		return {
			_template: 'content',
			visible: booleanValue(value.visible, true),
			title: stringValue(value.title),
			body: isTinaRichTextContent(value.body) && value.body ? value.body : undefined,
			paragraphs: normalizeStringArray(value.paragraphs),
			links: compactRecords(value.links).map((item) => ({
				label: optionalString(item.label),
				text: stringValue(item.text),
				href: optionalString(item.href)
			}))
		};
	}
	if (template === 'timeline') {
		return {
			_template: 'timeline',
			visible: booleanValue(value.visible, true),
			title: stringValue(value.title),
			entries: compactRecords(value.entries).map((entry) => ({
				period: stringValue(entry.period),
				title: stringValue(entry.title),
				organization: optionalString(entry.organization),
				details: normalizeStringArray(entry.details)
			}))
		};
	}
	if (template === 'pricing') {
		return {
			_template: 'pricing',
			visible: booleanValue(value.visible, true),
			title: stringValue(value.title),
			info: optionalString(value.info),
			entries: compactRecords(value.entries).map((entry) => ({
				title: stringValue(entry.title),
				price: optionalString(entry.price),
				duration: normalizePricingDurations(entry.duration),
				description: stringValue(entry.description),
				note: optionalString(entry.note)
			}))
		};
	}
	if (template === 'callout') {
		return {
			_template: 'callout',
			visible: booleanValue(value.visible, true),
			title: stringValue(value.title),
			notices: compactRecords(value.notices).map((entry) => ({
				title: stringValue(entry.title),
				text: stringValue(entry.text),
				hrefLabel: optionalString(entry.hrefLabel),
				href: optionalString(entry.href)
			}))
		};
	}
	if (template === 'contact') {
		const notice = asTinaRecord(value.notice);
		return {
			_template: 'contact',
			visible: booleanValue(value.visible, true),
			mode: value.mode === 'form' ? 'form' : 'links',
			body: isTinaRichTextContent(value.body) && value.body ? value.body : undefined,
			image: optionalString(value.image),
			imageAlt: optionalString(value.imageAlt),
			mapEmbedUrl: optionalString(value.mapEmbedUrl),
			notice: notice
				? {
						title: stringValue(notice.title),
						text: stringValue(notice.text)
					}
				: undefined
		};
	}
	if (template === 'legal') {
		return {
			_template: 'legal',
			visible: booleanValue(value.visible, true),
			sections: compactRecords(value.sections).map((section) => ({
				title: stringValue(section.title),
				paragraphs: normalizeStringArray(section.paragraphs),
				items: compactRecords(section.items).map((item) => ({
					label: optionalString(item.label),
					text: stringValue(item.text),
					href: optionalString(item.href)
				})),
				subsections: compactRecords(section.subsections).map((subsection) => ({
					title: stringValue(subsection.title),
					paragraphs: normalizeStringArray(subsection.paragraphs),
					items: compactRecords(subsection.items).map((item) => ({
						label: optionalString(item.label),
						text: stringValue(item.text),
						href: optionalString(item.href)
					}))
				}))
			}))
		};
	}
	return undefined;
}

export function normalizePageDocument(pageDocument: TinaPageDocument): PageData {
	return {
		order: pageDocument.order ?? 0,
		route: pageDocument.route ?? '/',
		title: pageDocument.title ?? '',
		navTitle: pageDocument.navTitle ?? '',
		description: pageDocument.description ?? '',
		showInNavigation: pageDocument.showInNavigation ?? true,
		blocks: indexedList(pageDocument.blocks).map(({ value: block, index }) => {
			const normalized = normalizeBlock(block);
			if (!normalized) {
				throw new Error(`Unsupported Tina page block at source index ${index}.`);
			}

			return normalized;
		})
	};
}

function mergePreviewPage(filename: string, page: PageData, pageDocuments: TinaPageListDocument[]) {
	const originalRoute = pageRouteByFilename[filename] ?? page.route;
	const dynamicPages = pageDocuments.map(normalizePageDocument);
	const basePages = dynamicPages.length > 0 ? dynamicPages : staticAllPages;
	const nextPages = basePages.filter((entry) => entry.route !== originalRoute && entry.route !== page.route);
	return [...nextPages, page].sort((left, right) => left.order - right.order);
}

export async function loadTinaPage(filename: string, queryClient: TinaQueryClient = client) {
	const [siteResult, pageResult, pageDocumentsResult] = await Promise.all([
		getSiteDocument(queryClient),
		getPageDocument(filename, queryClient),
		getPageDocuments(queryClient)
	]);
	const siteDocument = siteResult.data?.site;
	const pageDocument = pageResult.data?.page as TinaPageDocument | null | undefined;
	const pageDocuments = (pageDocumentsResult.data?.pageConnection?.edges ?? []).flatMap((edge) =>
		edge?.node ? [edge.node as TinaPageListDocument] : []
	);
	if (!siteDocument) throw new Error('Missing Tina site document.');
	if (!pageDocument) throw new Error(`Missing Tina page document for ${filename}.`);
	const site = normalizeSiteDocument(siteDocument);
	const page = normalizePageDocument(pageDocument);
	const allPages = mergePreviewPage(filename, page, pageDocuments);
	return {
		filename,
		siteDocument,
		pageDocument,
		site,
		page,
		allPages,
		navigationPages: allPages.filter((entry) => entry.showInNavigation),
		pageDocuments
	};
}

export const loadLocalTinaPage = (filename: string) => loadTinaPage(filename, localClient);
