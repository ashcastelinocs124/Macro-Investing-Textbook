// China's yearly GDP growth targets, from each March's Government Work Report. low === high for a single number.
// 2020 is missing on purpose: no target was set that year because of Covid-19.
const GW = 'https://english.www.gov.cn';
export const chinaTargets = [
	{ year: 2011, low: 8, high: 8, url: 'https://www.chinadaily.com.cn/china/2012-03/05/content_14755389.htm' },
	{ year: 2012, low: 7.5, high: 7.5, url: 'https://www.chinadaily.com.cn/china/2012-03/05/content_14755389.htm' },
	{ year: 2013, low: 7.5, high: 7.5, url: 'https://www.cnbc.com/2014/03/04/china-sets-2014-gdp-growth-target-at-75.html' },
	{ year: 2014, low: 7.5, high: 7.5, url: 'https://www.cnbc.com/2014/03/04/china-sets-2014-gdp-growth-target-at-75.html' },
	{ year: 2015, low: 7, high: 7, url: 'https://www.foxnews.com/world/china-sets-official-economic-growth-target-of-about-7-percent-for-2015' },
	{ year: 2016, low: 6.5, high: 7, url: 'https://www.deccanherald.com/business/china-slashes-2017-gdp-target-1994029' },
	{ year: 2017, low: 6.5, high: 6.5, url: 'https://www.deccanherald.com/business/china-slashes-2017-gdp-target-1994029' },
	{ year: 2018, low: 6.5, high: 6.5, url: 'https://www.pressreader.com/suriname/times-of-suriname/20180306/282140701883922' },
	{ year: 2019, low: 6, high: 6.5, url: `${GW}/premier/news/2019/03/05/content_281476549639196.htm` },
	{ year: 2021, low: 6, high: 6, url: `${GW}/premier/news/202103/05/content_WS6041b3c0c6d0719374afa151.html` }, // "over 6%"
	{ year: 2022, low: 5.5, high: 5.5, url: `${GW}/premier/news/202203/05/content_WS6222c1cdc6d09c94e48a5f67.html` },
	{ year: 2023, low: 5, high: 5, url: 'https://gulfnews.com/business/china-sets-economic-growth-target-of-around-5-for-2023-1.1677986045144' },
	{ year: 2024, low: 5, high: 5, url: `${GW}/news/202403/05/content_WS65e67406c6d0868f4e8e4a25.html` },
	{ year: 2025, low: 5, high: 5, url: `${GW}/news/202503/05/content_WS67c7ad77c6d0868f4e8f0568.html` },
	{ year: 2026, low: 4.5, high: 5, url: `${GW}/2026special/2026npcandcpcc/202603/05/content_WS69a8ea12c6d00ca5f9a0987b.html` },
];

const at = (year) => `${year}-07-01`; // World Bank yearly points are dated mid-year

/** Chart lines: the target (midpoint when it is a range) next to actual growth over the same years. */
export function targetLines(targets, growth) {
	const years = new Set(targets.map((t) => t.year));
	return [
		{ label: 'Growth target', points: targets.map((t) => [at(t.year), (t.low + t.high) / 2]) },
		{ label: 'Actual growth', points: growth.filter(([d]) => years.has(+d.slice(0, 4)) || +d.slice(0, 4) === 2020) },
	];
}
