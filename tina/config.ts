import { defineConfig, type Template, type TinaField } from 'tinacms';

const branch = process.env.GITHUB_BRANCH ?? process.env.HEAD ?? 'main';

const pageRoutes: Record<string, string> = {
	start: '/',
	'ueber-mich': '/über-mich',
	angebot: '/angebot',
	'ablauf-kosten': '/ablauf-kosten',
	kontakt: '/kontakt',
	'ausbildungen-berufserfahrung': '/ausbildungen-berufserfahrung',
	'impressum-datenschutz': '/impressum-datenschutz'
};

const linkFields: TinaField[] = [
	{ name: 'label', label: 'Beschriftung', type: 'string', required: true },
	{ name: 'href', label: 'Link-Ziel', type: 'string', required: true }
];
const visibleField: TinaField = {
	name: 'visible',
	label: 'Anzeigen',
	type: 'boolean',
	ui: { defaultValue: true }
};

const siteUiFields: TinaField[] = [
	{ name: 'skipLinkLabel', label: 'Skip-Link', type: 'string', required: true },
	{ name: 'menuLabel', label: 'Menü', type: 'string', required: true },
	{ name: 'headerCta', label: 'Header-Button', type: 'object', fields: linkFields },
	{ name: 'formSubject', label: 'Kontaktformular-Betreff', type: 'string', required: true },
	{ name: 'formNamePlaceholder', label: 'Name-Platzhalter', type: 'string', required: true },
	{ name: 'formEmailPlaceholder', label: 'E-Mail-Platzhalter', type: 'string', required: true },
	{ name: 'formMessagePlaceholder', label: 'Nachrichten-Platzhalter', type: 'string', required: true },
	{ name: 'formSubmitLabel', label: 'Absenden-Button', type: 'string', required: true },
	{ name: 'footerCopyright', label: 'Footer-Copyright', type: 'string', required: true }
];

const itemFields: TinaField[] = [
	{ name: 'label', label: 'Label', type: 'string' },
	{ name: 'text', label: 'Text', type: 'string', required: true },
	{ name: 'href', label: 'Link-Ziel', type: 'string' }
];
const cardFields: TinaField[] = [
	{ name: 'title', label: 'Titel', type: 'string', required: true },
	{ name: 'image', label: 'Bild', type: 'image' },
	{ name: 'imageAlt', label: 'Bildbeschreibung', type: 'string' },
	{ name: 'description', label: 'Beschreibung', type: 'string', ui: { component: 'textarea' } },
	{ name: 'items', label: 'Einträge', type: 'string', list: true },
	{ name: 'hrefLabel', label: 'Link-Label', type: 'string' },
	{ name: 'href', label: 'Link-Ziel', type: 'string' }
];
const timelineEntryFields: TinaField[] = [
	{ name: 'period', label: 'Zeitraum', type: 'string', required: true },
	{ name: 'title', label: 'Titel', type: 'string', required: true },
	{ name: 'organization', label: 'Organisation', type: 'string' },
	{ name: 'details', label: 'Details', type: 'string', list: true }
];
const pricingEntryFields: TinaField[] = [
	{ name: 'title', label: 'Titel', type: 'string', required: true },
	{ name: 'price', label: 'Preis', type: 'string' },
	{ name: 'duration', label: 'Dauer', type: 'string' },
	{ name: 'description', label: 'Beschreibung', type: 'string', required: true, ui: { component: 'textarea' } },
	{ name: 'note', label: 'Hinweis', type: 'string' }
];
const calloutEntryFields: TinaField[] = [
	{ name: 'title', label: 'Titel', type: 'string' },
	{ name: 'text', label: 'Text', type: 'string', required: true, ui: { component: 'textarea' } },
	{ name: 'hrefLabel', label: 'Link-Label', type: 'string' },
	{ name: 'href', label: 'Link-Ziel', type: 'string' }
];

const blockTemplates: Template[] = [
	{
		name: 'hero',
		label: 'Hero',
		fields: [
			visibleField,
			{
				name: 'variant',
				label: 'Darstellung',
				type: 'string',
				ui: { defaultValue: 'standard' },
				options: [
					{ value: 'standard', label: 'Standard' },
					{ value: 'portrait', label: 'Mit Portrait' },
					{ value: 'portrait-tall', label: 'Mit hohem Portrait' }
				]
			},
			{ name: 'eyebrow', label: 'Überzeile', type: 'string' },
			{ name: 'title', label: 'Titel', type: 'string' },
			{ name: 'subtitle', label: 'Untertitel', type: 'string' },
			{ name: 'intro', label: 'Einleitung', type: 'string', ui: { component: 'textarea' } },
			{ name: 'image', label: 'Bild', type: 'image' },
			{ name: 'imageAlt', label: 'Bildbeschreibung', type: 'string' },
			{ name: 'primaryCta', label: 'Primärer Button', type: 'object', fields: linkFields },
			{ name: 'secondaryCta', label: 'Sekundärer Button', type: 'object', fields: linkFields }
		]
	},
	{
		name: 'focus',
		label: 'Schwerpunkte / Textliste',
		fields: [
			visibleField,
			{ name: 'title', label: 'Titel', type: 'string' },
			{ name: 'intro', label: 'Einleitung', type: 'string', ui: { component: 'textarea' } },
			{ name: 'points', label: 'Einträge', type: 'string', list: true }
		]
	},
	{
		name: 'services',
		label: 'Angebot',
		fields: [
			visibleField,
			{
				name: 'variant',
				label: 'Anordnung',
				type: 'string',
				ui: { defaultValue: 'grid' },
				options: [
					{ value: 'grid', label: 'Raster' },
					{ value: 'compact', label: 'Kompakt' }
				]
			},
			{ name: 'title', label: 'Überschrift', type: 'string' },
			{
				name: 'cards',
				label: 'Angebote',
				type: 'object',
				list: true,
				ui: { itemProps: (item) => ({ label: item?.title ?? 'Angebot' }) },
				fields: cardFields
			}
		]
	},
	{
		name: 'content',
		label: 'Textinhalt',
		fields: [
			visibleField,
			{ name: 'title', label: 'Überschrift', type: 'string' },
			{
				name: 'body',
				label: 'Text',
				type: 'rich-text',
				parser: { type: 'slatejson' },
				overrides: {
					toolbar: ['bold', 'italic', 'highlight', 'link', 'raw']
				}
			},
			{ name: 'links', label: 'Verweise', type: 'object', list: true, fields: itemFields }
		]
	},
	{
		name: 'timeline',
		label: 'Erfahrung / Zeitstrahl',
		fields: [
			visibleField,
			{ name: 'title', label: 'Überschrift', type: 'string' },
			{
				name: 'entries',
				label: 'Einträge',
				type: 'object',
				list: true,
				ui: { itemProps: (item) => ({ label: `${item?.period ?? ''} ${item?.title ?? ''}`.trim() || 'Eintrag' }) },
				fields: timelineEntryFields
			}
		]
	},
	{
		name: 'pricing',
		label: 'Ablauf & Kosten',
		fields: [
			visibleField,
			{ name: 'title', label: 'Überschrift', type: 'string' },
			{ name: 'info', label: 'Zusatzinfo', type: 'string', ui: { component: 'textarea' } },
			{
				name: 'entries',
				label: 'Leistungen',
				type: 'object',
				list: true,
				ui: { itemProps: (item) => ({ label: item?.title ?? 'Leistung' }) },
				fields: pricingEntryFields
			}
		]
	},
	{
		name: 'callout',
		label: 'Hinweis',
		fields: [
			visibleField,
			{ name: 'title', label: 'Überschrift', type: 'string' },
			{
				name: 'notices',
				label: 'Hinweise',
				type: 'object',
				list: true,
				ui: { itemProps: (item) => ({ label: item?.title || 'Hinweis' }) },
				fields: calloutEntryFields
			}
		]
	},
	{
		name: 'contact',
		label: 'Kontakt',
		fields: [
			visibleField,
			{
				name: 'mode',
				label: 'Kontaktaktion',
				type: 'string',
				ui: { defaultValue: 'links' },
				options: [
					{ value: 'form', label: 'Formular' },
					{ value: 'links', label: 'Kontaktlinks' }
				]
			},
			{
				name: 'body',
				label: 'Kontakttext',
				type: 'rich-text',
				parser: { type: 'slatejson' },
				overrides: {
					toolbar: ['bold', 'italic', 'highlight', 'link', 'raw']
				}
			},
			{ name: 'image', label: 'Praxisbild', type: 'image' },
			{ name: 'imageAlt', label: 'Bildbeschreibung', type: 'string' },
			{
				name: 'mapEmbedUrl',
				label: 'Google-Maps-Embed-URL',
				type: 'string',
				ui: { component: 'textarea' }
			},
			{
				name: 'notice',
				label: 'Hinweis unter dem Formular',
				type: 'object',
				fields: [
					{ name: 'title', label: 'Überschrift', type: 'string', required: true },
					{ name: 'text', label: 'Text', type: 'string', required: true, ui: { component: 'textarea' } }
				]
			}
		]
	},
	{
		name: 'legal',
		label: 'Rechtlicher Inhalt',
		fields: [
			visibleField,
			{
				name: 'sections',
				label: 'Bereiche',
				type: 'object',
				list: true,
				ui: { itemProps: (item) => ({ label: item?.title ?? 'Bereich' }) },
				fields: [
					{ name: 'title', label: 'Titel', type: 'string', required: true },
					{ name: 'paragraphs', label: 'Absätze', type: 'string', list: true, ui: { component: 'textarea' } },
					{ name: 'items', label: 'Verweise', type: 'object', list: true, fields: itemFields },
					{
						name: 'subsections',
						label: 'Unterbereiche',
						type: 'object',
						list: true,
						ui: { itemProps: (item) => ({ label: item?.title ?? 'Unterbereich' }) },
						fields: [
							{ name: 'title', label: 'Titel', type: 'string', required: true },
							{ name: 'paragraphs', label: 'Absätze', type: 'string', list: true, ui: { component: 'textarea' } },
							{ name: 'items', label: 'Verweise', type: 'object', list: true, fields: itemFields }
						]
					}
				]
			}
		]
	}
];

export default defineConfig({
	branch,
	build: { outputFolder: 'admin', publicFolder: 'public' },
	media: { tina: { mediaRoot: 'images/uploads', publicFolder: 'src/assets' } },
	schema: {
		collections: [
			{
				name: 'site',
				label: 'Site-Einstellungen',
				path: 'src/data',
				match: { include: 'site' },
				format: 'json',
				ui: { global: true, allowedActions: { create: false, delete: false } },
				fields: [
					{ name: 'name', label: 'Sitename', type: 'string', required: true },
					{ name: 'lang', label: 'Sprache', type: 'string' },
					{ name: 'siteUrl', label: 'Site-URL', type: 'string' },
					{ name: 'description', label: 'Meta-Beschreibung', type: 'string', ui: { component: 'textarea' } },
					{ name: 'owner', label: 'Inhaberin', type: 'string' },
					{ name: 'jobTitle', label: 'Berufsbezeichnung', type: 'string' },
					{ name: 'email', label: 'E-Mail', type: 'string' },
					{ name: 'phone', label: 'Telefon (E.164)', type: 'string' },
					{ name: 'phoneDisplay', label: 'Telefon (Anzeige)', type: 'string' },
					{ name: 'addressLines', label: 'Adresszeilen', type: 'string', list: true },
					{ name: 'officeHours', label: 'Praxiszeiten', type: 'string', list: true },
					{ name: 'ui', label: 'Texte & Beschriftungen', type: 'object', fields: siteUiFields }
				]
			},
			{
				name: 'page',
				label: 'Seiten',
				path: 'src/data/pages',
				format: 'json',
				ui: {
					allowedActions: { create: false, delete: false },
					router: ({ document }) => pageRoutes[document?._sys.filename] ?? '/'
				},
				fields: [
					{ name: 'order', label: 'Reihenfolge', type: 'number', required: true, ui: { component: 'hidden' } },
					{ name: 'route', label: 'Pfad', type: 'string', required: true, ui: { component: 'hidden' } },
					{ name: 'title', label: 'Seitentitel', type: 'string', required: true, isTitle: true },
					{ name: 'navTitle', label: 'Navigationstitel', type: 'string', required: true },
					{ name: 'description', label: 'Meta-Beschreibung', type: 'string', ui: { component: 'textarea' } },
					{ name: 'showInNavigation', label: 'In Navigation anzeigen', type: 'boolean' },
					{
						name: 'blocks',
						label: 'Seiteninhalte',
						type: 'object',
						list: true,
						templates: blockTemplates
					}
				]
			}
		]
	}
});
