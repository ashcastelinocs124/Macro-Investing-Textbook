// Counts for the landing page's stats row, so the numbers stay true as chapters are added.

/** Docs ids look like 'part-1-economy/02-growth' (chapter) or 'part-1-economy/five-big-economies/china' (country or bank page). */
export function bookCounts(ids) {
	const book = ids.filter((id) => /^(start-here|part-\d)/.test(id));
	const depth = (id) => id.split('/').length;
	return {
		chapters: book.filter((id) => depth(id) === 2).length,
		deepDives: book.filter((id) => depth(id) === 3).length,
	};
}

/** Number of `## Term` entries in the glossary source. */
export const glossaryTermCount = (body) => body.match(/^## /gm)?.length ?? 0;

/** First paragraph under a glossary heading, or undefined. */
export function glossaryEntry(body, term) {
	const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return body.match(new RegExp(`^## ${escaped}\\n+(.+)`, 'm'))?.[1];
}
