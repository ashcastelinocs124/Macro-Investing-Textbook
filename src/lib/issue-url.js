// Reader issue reports: a prefilled GitHub "new issue" link (no server, the reader submits on GitHub).
export const REPO_URL = 'https://github.com/ashcastelinocs124/Macro-Investing-Textbook';

export function issueUrl({ chapter, page, problem }) {
	const text = problem.trim();
	const short = text.length > 60 ? `${text.slice(0, 60).trimEnd()}…` : text;
	const params = new URLSearchParams({
		title: `[${chapter}] ${short}`,
		body: `**Chapter:** ${chapter}\n**Page:** ${page}\n\n${text}`,
	});
	return `${REPO_URL}/issues/new?${params}`;
}

// Starlight sidebar -> [{label, href, current}] in reading order. "Overview" pages take their part's name.
export function chapterOptions(entries, group = '') {
	return entries.flatMap((e) =>
		e.type === 'group'
			? chapterOptions(e.entries, e.label)
			: [{ label: e.label === 'Overview' && group ? group : e.label, href: e.href, current: e.isCurrent }],
	);
}
