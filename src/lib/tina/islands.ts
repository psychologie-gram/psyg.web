import type { IslandRegistry } from '@tinacms/astro/experimental';

import EditablePageContent from '../../components/tina/EditablePageContent.astro';
import { loadTinaPage } from './data';

export const islands: IslandRegistry = {
	pageContent: {
		fetch: (_request, params) => {
			const filename = params.get('filename');

			if (!filename) {
				throw new Error('Missing Tina page filename.');
			}

			return loadTinaPage(filename);
		},
		component: EditablePageContent,
		wrapper: { tag: 'div' },
		propsFromData: (data) => {
			const page = data as Awaited<ReturnType<typeof loadTinaPage>>;

			return {
				pageDocument: page.pageDocument,
				siteDocument: page.siteDocument
			};
		}
	}
};
