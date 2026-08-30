import type { SiteSettings } from './site-data';

interface StructuredDataPage {
	canonicalUrl: string;
	pageTitle: string;
	description: string;
	imagePath?: string;
}

function getPostalAddress(site: SiteSettings) {
	const localityLine = site.addressLines.find((line) => /\d{4}\s+/.test(line));
	const localityMatch = localityLine?.match(/(\d{4})\s+(.+)/);

	const address: Record<string, string> = {
		'@type': 'PostalAddress',
		addressCountry: 'AT'
	};

	if (site.addressLines[0]) {
		address.streetAddress = site.addressLines[0];
	}

	if (localityMatch?.[1]) {
		address.postalCode = localityMatch[1];
	}

	if (localityMatch?.[2]) {
		address.addressLocality = localityMatch[2];
	}

	return address;
}

export function buildStructuredData(site: SiteSettings, page: StructuredDataPage) {
	const siteRoot = site.siteUrl.endsWith('/') ? site.siteUrl.slice(0, -1) : site.siteUrl;
	const practiceId = `${siteRoot}#practice`;
	const personId = `${siteRoot}#person`;
	const websiteId = `${siteRoot}#website`;
	const imageUrl = new URL(page.imagePath ?? '/og-image.svg', site.siteUrl).toString();
	const address = getPostalAddress(site);

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': websiteId,
				url: site.siteUrl,
				name: site.name,
				description: site.description,
				inLanguage: site.lang
			},
			{
				'@type': 'Person',
				'@id': personId,
				name: site.owner,
				jobTitle: site.jobTitle,
				description: site.description,
				url: site.siteUrl,
				email: site.email,
				telephone: site.phoneDisplay,
				image: imageUrl,
				address,
				worksFor: { '@id': practiceId }
			},
			{
				'@type': 'ProfessionalService',
				'@id': practiceId,
				name: site.name,
				description: site.description,
				url: site.siteUrl,
				email: site.email,
				telephone: site.phoneDisplay,
				image: imageUrl,
				address,
				founder: { '@id': personId },
				contactPoint: {
					'@type': 'ContactPoint',
					contactType: 'appointments',
					email: site.email,
					telephone: site.phone
				}
			},
			{
				'@type': 'WebPage',
				'@id': `${page.canonicalUrl}#webpage`,
				url: page.canonicalUrl,
				name: page.pageTitle,
				description: page.description,
				inLanguage: site.lang,
				isPartOf: { '@id': websiteId },
				about: { '@id': practiceId },
				primaryImageOfPage: {
					'@type': 'ImageObject',
					url: imageUrl
				}
			}
		]
	};
}
