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
	{ year: 'Mar 2023', title: 'Silicon Valley Bank fails', what: 'After the fastest rate hikes in decades, SVB’s bond holdings lose value, depositors run, and it becomes the largest US bank failure since 2008.', lesson: 'When rates rise fast, something eventually breaks, often in the banking system.', source: 'https://en.wikipedia.org/wiki/Collapse_of_Silicon_Valley_Bank' },
	{ year: 'May 2023', title: 'The AI boom takes off', what: 'Demand for AI chips sends Nvidia past a $1 trillion market value. Tech giants start pouring hundreds of billions into AI data centers.', lesson: 'A new technology becomes a macro force when it drives a huge wave of investment spending.', source: 'https://en.wikipedia.org/wiki/Nvidia' },
	{ year: 'Oct 2023', title: 'War in the Middle East', what: 'The Gaza war begins, opening a regional crisis that later spreads to Red Sea shipping and to Iran.', lesson: 'Markets price the risk of war into oil and shipping costs long before supply is actually hit.', source: 'https://en.wikipedia.org/wiki/Gaza_war' },
	{ year: 'Aug 2024', title: 'The yen carry trade unwinds', what: 'After a surprise Bank of Japan rate hike and weak US jobs data, investors who borrowed cheap yen rush to repay. Japan’s Nikkei falls 12.4% on 5 August, its worst day since 1987.', lesson: 'Crowded trades built on cheap borrowing unwind violently when the borrowing stops being cheap.', source: 'https://www.bis.org/publ/bisbull90.pdf' },
	{ year: 'Apr 2025', title: '“Liberation Day” tariffs', what: 'On 2 April 2025 the US announces sweeping tariffs on imports from nearly every country, and global stocks sell off sharply.', lesson: 'Trade policy is macro policy: tariffs hit growth, inflation and currencies at once.', source: 'https://en.wikipedia.org/wiki/Liberation_Day_tariffs' },
	{ year: 'Jun 2025', title: 'The Twelve-Day War', what: 'Israel and Iran fight from 13 to 24 June 2025, and the US strikes Iranian nuclear sites. Oil jumps, then falls back as supplies keep flowing.', lesson: 'War risk fades from prices quickly if the oil keeps moving.', source: 'https://en.wikipedia.org/wiki/Twelve-Day_War' },
	{ year: 'Jul 2025', title: 'The $4 trillion AI trade', what: 'Nvidia becomes the first company worth over $4 trillion, and later $5 trillion, as AI spending keeps growing.', lesson: 'When one theme dominates the stock market, the whole index rides on it, in both directions.', source: 'https://en.wikipedia.org/wiki/Nvidia' },
	{ year: 'Oct 2025', title: 'The data goes dark', what: 'A US government shutdown from 1 October to 12 November 2025 halts official statistics, and the October inflation report is never published.', lesson: 'Macro investors depend on data; when it stops, uncertainty rises.', source: 'https://en.wikipedia.org/wiki/2025_United_States_federal_government_shutdown' },
	{ year: 'Mar 2026', title: 'Iran war and the Strait of Hormuz', what: 'From 28 February 2026 the US and Israel are at war with Iran. Tanker traffic through the Strait of Hormuz, which carries about a fifth of the world’s oil, nearly stops, and oil jumps from about $60 to over $100 a barrel.', lesson: 'Wars hit the global economy mainly through energy prices.', source: 'https://en.wikipedia.org/wiki/2026_Iran_war_fuel_crisis' },
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
