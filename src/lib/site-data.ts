import { z } from 'astro/zod';
import type { TinaRichTextContent } from '@tinacms/astro/types';

import processPageRaw from '../data/pages/ablauf-kosten.json';
import servicesPageRaw from '../data/pages/angebot.json';
import experiencePageRaw from '../data/pages/ausbildungen-berufserfahrung.json';
import legalPageRaw from '../data/pages/impressum-datenschutz.json';
import contactPageRaw from '../data/pages/kontakt.json';
import homePageRaw from '../data/pages/start.json';
import aboutPageRaw from '../data/pages/ueber-mich.json';
import siteRaw from '../data/site.json';
import { isTinaRichTextContent } from './rich-text';

const linkSchema = z.object({ label: z.string(), href: z.string() });
const visibleSchema = { visible: z.boolean().default(true) };

const siteUiSchema = z.object({
	skipLinkLabel: z.string(),
	menuLabel: z.string(),
	headerCta: linkSchema,
	formSubject: z.string(),
	formNamePlaceholder: z.string(),
	formEmailPlaceholder: z.string(),
	formMessagePlaceholder: z.string(),
	formSubmitLabel: z.string(),
	footerCopyright: z.string()
});

const heroSchema = z.object({
	_template: z.literal('hero'),
	...visibleSchema,
	variant: z.enum(['standard', 'portrait', 'portrait-tall']).default('standard'),
	eyebrow: z.string().optional(),
	title: z.string().default(''),
	subtitle: z.string().optional(),
	intro: z.string(),
	image: z.string().optional(),
	imageAlt: z.string().optional(),
	primaryCta: linkSchema.optional(),
	secondaryCta: linkSchema.optional()
});

const focusSchema = z.object({
	_template: z.literal('focus'),
	...visibleSchema,
	title: z.string().default(''),
	intro: z.string().optional(),
	points: z.array(z.string()).default([])
});

const cardSchema = z.object({
	title: z.string(),
	image: z.string().optional(),
	imageAlt: z.string().optional(),
	description: z.string().optional(),
	items: z.array(z.string()).default([]),
	hrefLabel: z.string().optional(),
	href: z.string().optional()
});

const servicesSchema = z.object({
	_template: z.literal('services'),
	...visibleSchema,
	variant: z.enum(['grid', 'compact']).default('grid'),
	title: z.string().default(''),
	cards: z.array(cardSchema).default([])
});

const contentItemSchema = z.object({
	label: z.string().optional(),
	text: z.string(),
	href: z.string().optional()
});

const contentSchema = z.object({
	_template: z.literal('content'),
	...visibleSchema,
	title: z.string().default(''),
	body: z.custom<TinaRichTextContent>(isTinaRichTextContent).optional(),
	paragraphs: z.array(z.string()).default([]),
	links: z.array(contentItemSchema).default([])
});

const timelineEntrySchema = z.object({
	period: z.string(),
	title: z.string(),
	organization: z.string().optional(),
	details: z.array(z.string()).default([])
});

const timelineSchema = z.object({
	_template: z.literal('timeline'),
	...visibleSchema,
	title: z.string().default(''),
	entries: z.array(timelineEntrySchema).default([])
});

const pricingEntrySchema = z.object({
	title: z.string(),
	price: z.string().optional(),
	duration: z.array(z.string()).default([]),
	description: z.string(),
	note: z.string().optional()
});

const pricingSchema = z.object({
	_template: z.literal('pricing'),
	...visibleSchema,
	title: z.string().default(''),
	info: z.string().optional(),
	entries: z.array(pricingEntrySchema).default([])
});

const calloutEntrySchema = z.object({
	title: z.string(),
	text: z.string(),
	hrefLabel: z.string().optional(),
	href: z.string().optional()
});

const calloutSchema = z.object({
	_template: z.literal('callout'),
	...visibleSchema,
	title: z.string().default(''),
	notices: z.array(calloutEntrySchema).default([])
});

const contactNoticeSchema = z.object({
	title: z.string(),
	text: z.string()
});

const contactSchema = z.object({
	_template: z.literal('contact'),
	...visibleSchema,
	mode: z.enum(['form', 'links']).default('links'),
	body: z.custom<TinaRichTextContent>(isTinaRichTextContent).optional(),
	image: z.string().optional(),
	imageAlt: z.string().optional(),
	mapEmbedUrl: z.string().optional(),
	notice: contactNoticeSchema.optional()
});

const contentSubsectionSchema = z.object({
	title: z.string(),
	paragraphs: z.array(z.string()).default([]),
	items: z.array(contentItemSchema).default([])
});

const legalSectionSchema = z.object({
	title: z.string(),
	paragraphs: z.array(z.string()).default([]),
	items: z.array(contentItemSchema).default([]),
	subsections: z.array(contentSubsectionSchema).default([])
});

const legalSchema = z.object({
	_template: z.literal('legal'),
	...visibleSchema,
	sections: z.array(legalSectionSchema).default([])
});

const blockSchema = z.discriminatedUnion('_template', [
	heroSchema,
	focusSchema,
	servicesSchema,
	contentSchema,
	timelineSchema,
	pricingSchema,
	calloutSchema,
	contactSchema,
	legalSchema
]);

const pageSchema = z.object({
	order: z.number(),
	route: z.string(),
	title: z.string(),
	navTitle: z.string(),
	description: z.string(),
	showInNavigation: z.boolean().default(true),
	blocks: z.array(blockSchema).default([])
});

const siteSchema = z.object({
	name: z.string(),
	lang: z.string(),
	siteUrl: z.url(),
	description: z.string(),
	owner: z.string(),
	jobTitle: z.string(),
	email: z.email(),
	phone: z.string(),
	phoneDisplay: z.string(),
	addressLines: z.array(z.string()).default([]),
	officeHours: z.array(z.string()).default([]),
	ui: siteUiSchema
});

export type Link = z.infer<typeof linkSchema>;
export type SiteUiSettings = z.infer<typeof siteUiSchema>;
export type HeroContent = z.infer<typeof heroSchema>;
export type FocusContent = z.infer<typeof focusSchema>;
export type CardContent = z.infer<typeof cardSchema>;
export type ServicesContent = z.infer<typeof servicesSchema>;
export type ContentItem = z.infer<typeof contentItemSchema>;
export type ContentBlock = z.infer<typeof contentSchema>;
export type TimelineEntry = z.infer<typeof timelineEntrySchema>;
export type TimelineBlock = z.infer<typeof timelineSchema>;
export type PricingEntry = z.infer<typeof pricingEntrySchema>;
export type PricingBlock = z.infer<typeof pricingSchema>;
export type CalloutEntry = z.infer<typeof calloutEntrySchema>;
export type CalloutBlock = z.infer<typeof calloutSchema>;
export type ContactContent = z.infer<typeof contactSchema>;
export type ContentSubsection = z.infer<typeof contentSubsectionSchema>;
export type ContentSection = z.infer<typeof legalSectionSchema>;
export type LegalBlock = z.infer<typeof legalSchema>;
export type PageBlock = z.infer<typeof blockSchema>;
export type PageData = z.infer<typeof pageSchema>;
export type SiteSettings = z.infer<typeof siteSchema>;

export const site = siteSchema.parse(siteRaw);
export const homePage = pageSchema.parse(homePageRaw);
export const aboutPage = pageSchema.parse(aboutPageRaw);
export const servicesPage = pageSchema.parse(servicesPageRaw);
export const processPage = pageSchema.parse(processPageRaw);
export const contactPage = pageSchema.parse(contactPageRaw);
export const experiencePage = pageSchema.parse(experiencePageRaw);
export const legalPage = pageSchema.parse(legalPageRaw);

export const allPages = [
	homePage,
	aboutPage,
	servicesPage,
	processPage,
	contactPage,
	experiencePage,
	legalPage
].sort((left, right) => left.order - right.order);

export const navigationPages = allPages.filter((page) => page.showInNavigation);
