export function score(questions, picks) {
	return questions.reduce((n, q, i) => n + (picks[i] === q.answer ? 1 : 0), 0);
}

export function loadBest(storage, slug) {
	try {
		const n = Number(storage.getItem(`quiz:${slug}`));
		return Number.isInteger(n) && n >= 0 ? n : 0;
	} catch {
		return 0;
	}
}

export function saveBest(storage, slug, s) {
	try {
		if (s > loadBest(storage, slug)) storage.setItem(`quiz:${slug}`, String(s));
	} catch {
		// Storage blocked (private mode / site data disabled): progress just isn't saved.
	}
}
