// Simplified teaching model of how a policy-rate change spreads through the economy; not a forecast.
const START_POLICY = 4; // % policy rate before the change
const START_INFLATION = 4; // % inflation before the change
const MORTGAGE_SPREAD = 2; // mortgage rate = policy rate + 2 points
const INFLATION_PER_POINT = -0.35; // points of inflation per point of rate change, once fully felt
const UNEMPLOYMENT_PER_POINT = 0.2; // points of unemployment per point of rate change
const LAG_QUARTERS = 8; // inflation takes about two years to feel the full effect

/** Monthly payment on a fixed-rate loan (standard annuity formula). */
export function monthlyPayment(annualRatePct, principal = 300_000, years = 30) {
	const i = annualRatePct / 1200;
	const n = years * 12;
	return i === 0 ? principal / n : (principal * i) / (1 - (1 + i) ** -n);
}

/** What a policy-rate change of `change` points does, starting from a 4% rate and 4% inflation. */
export function transmit(change, quarters = 12) {
	const policy = START_POLICY + change;
	const mortgage = policy + MORTGAGE_SPREAD;
	const inflationEffect = INFLATION_PER_POINT * change;
	return {
		policy,
		mortgage,
		payment: monthlyPayment(mortgage),
		paymentBefore: monthlyPayment(START_POLICY + MORTGAGE_SPREAD),
		inflation: START_INFLATION + inflationEffect,
		unemployment: UNEMPLOYMENT_PER_POINT * change,
		// The effect builds up in a straight line over the lag, then stays.
		inflationPath: Array.from({ length: quarters + 1 }, (_, q) => [q, START_INFLATION + inflationEffect * Math.min(1, q / LAG_QUARTERS)]),
	};
}
export { START_INFLATION, LAG_QUARTERS };
