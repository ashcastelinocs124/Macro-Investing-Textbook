import { useEffect, useState } from 'react';
import { score, loadBest, saveBest } from '../lib/quiz.js';

export type Question = { q: string; choices: string[]; answer: number; why: string };

// Even reading window.localStorage can throw when site data is blocked.
const storage = (): Storage | null => {
	try {
		return window.localStorage;
	} catch {
		return null;
	}
};

export default function Quiz({ slug, questions }: { slug: string; questions: Question[] }) {
	const [picks, setPicks] = useState<(number | undefined)[]>([]);
	const [best, setBest] = useState(0);
	const done = questions.every((_, i) => picks[i] !== undefined);
	const total = score(questions, picks);

	useEffect(() => {
		const s = storage();
		if (s) setBest(loadBest(s, slug));
	}, [slug]);

	useEffect(() => {
		const s = storage();
		if (done && s) {
			saveBest(s, slug, total);
			setBest(loadBest(s, slug));
		}
	}, [done, total, slug]);

	const pick = (i: number, j: number) =>
		setPicks((p) => {
			const next = [...p];
			next[i] = j;
			return next;
		});

	return (
		<section className="not-content macro-widget">
			<h3>Check your understanding</h3>
			{best > 0 && !done && <p className="sub">Your best so far: {best}/{questions.length}</p>}
			{questions.map((q, i) => {
				const answered = picks[i] !== undefined;
				return (
					<fieldset key={i}>
						<legend>{i + 1}. {q.q}</legend>
						{q.choices.map((c, j) => (
							<label key={j} className={answered && j === q.answer ? 'correct' : answered && picks[i] === j ? 'wrong' : ''}>
								<input type="radio" name={`${slug}-${i}`} disabled={answered} checked={picks[i] === j} onChange={() => pick(i, j)} /> {c}
							</label>
						))}
						{answered && (
							<p className="sub" role="status">
								{picks[i] === q.answer ? 'Correct. ' : 'Not quite. '}
								{q.why}
							</p>
						)}
					</fieldset>
				);
			})}
			{done && (
				<p>
					<strong>You scored {total}/{questions.length}.</strong> Best: {Math.max(best, total)}/{questions.length}.{' '}
					<button type="button" onClick={() => setPicks([])}>Try again</button>
				</p>
			)}
		</section>
	);
}
