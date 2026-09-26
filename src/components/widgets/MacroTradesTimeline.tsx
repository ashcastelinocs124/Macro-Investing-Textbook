import { useState } from 'react';

type Event = { year: string; title: string; what: string; lesson: string; source: string };

const EVENTS: Event[] = [
	{ year: '1971', title: 'Nixon ends the gold link', what: 'The US stops converting dollars into gold, ending the Bretton Woods system of fixed exchange rates.', lesson: 'Currencies became free to float, which created the modern FX market that macro traders trade.', source: 'https://en.wikipedia.org/wiki/Nixon_shock' },
	{ year: '1992', title: 'Soros breaks the Bank of England', what: 'On Black Wednesday, Soros’s Quantum Fund bet that the pound would be forced out of Europe’s currency peg, and made around $1 billion.', lesson: 'When a policy is unsustainable, the market eventually forces the change.', source: 'https://en.wikipedia.org/wiki/Black_Wednesday' },
	{ year: '1997', title: 'Asian financial crisis', what: 'Thailand abandons its dollar peg; the baht collapses and the crisis spreads across Asia.', lesson: 'Borrowing in a foreign currency is dangerous when your own currency can fall.', source: 'https://en.wikipedia.org/wiki/1997_Asian_financial_crisis' },
	{ year: '1998', title: 'LTCM collapses', what: 'Long-Term Capital Management, run by Nobel laureates, loses billions on leveraged bets, and the Fed organizes a rescue.', lesson: 'Leverage turns small mistakes into fatal ones.', source: 'https://en.wikipedia.org/wiki/Long-Term_Capital_Management' },
	{ year: '2007', title: 'Paulson shorts subprime', what: 'John Paulson bets against US subprime mortgages before the housing bust, and his funds make billions.', lesson: 'A credit boom built on loose lending ends in a bust.', source: 'https://en.wikipedia.org/wiki/John_Paulson' },
	{ year: '2008', title: 'Lehman Brothers fails', what: 'The investment bank goes bankrupt on 15 September 2008, turning a housing crisis into a global financial crisis.', lesson: 'Everything is connected through the banking system.', source: 'https://en.wikipedia.org/wiki/Bankruptcy_of_Lehman_Brothers' },
	{ year: '2020', title: 'COVID shock', what: 'The Fed cuts rates to near zero on 15 March 2020 and restarts bond buying as the economy shuts down.', lesson: 'Central banks can move markets faster than any company news.', source: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm' },
	{ year: '2022', title: 'The great hiking cycle', what: 'Facing the highest inflation in 40 years, the Fed raises rates from near zero to over 5% in about 16 months.', lesson: 'Interest rates are the gravity of all asset prices.', source: 'https://www.federalreserve.gov/monetarypolicy/openmarket.htm' },
];

export default function MacroTradesTimeline() {
	const [i, setI] = useState(1);
	const e = EVENTS[i];
	return (
		<section className="not-content macro-widget">
			<h3>Moments that made global macro</h3>
			<p className="sub">Pick a year.</p>
			<div role="group" aria-label="Year" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
				{EVENTS.map((ev, j) => (
					<button key={ev.year} type="button" aria-pressed={i === j} onClick={() => setI(j)}>{ev.year}</button>
				))}
			</div>
			<div aria-live="polite">
				<strong>{e.year}: {e.title}</strong>
				<p style={{ margin: '0.4rem 0' }}>{e.what}</p>
				<p style={{ margin: '0.4rem 0' }}><em>Macro lesson:</em> {e.lesson}</p>
				<a href={e.source} target="_blank" rel="noopener">Source</a>
			</div>
		</section>
	);
}
