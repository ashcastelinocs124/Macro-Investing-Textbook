import { test } from 'node:test';
import assert from 'node:assert/strict';
import { issueUrl, chapterOptions, REPO_URL } from '../src/lib/issue-url.js';

test('issueUrl prefills an encoded title and body', () => {
	const url = new URL(issueUrl({ chapter: 'Money, banks & credit', page: 'https://x.io/p/', problem: '  Chart is blank & broken  ' }));
	assert.equal(url.origin + url.pathname, `${REPO_URL}/issues/new`);
	assert.equal(url.searchParams.get('title'), '[Money, banks & credit] Chart is blank & broken');
	assert.equal(url.searchParams.get('body'), '**Chapter:** Money, banks & credit\n**Page:** https://x.io/p/\n\nChart is blank & broken');
});

test('issueUrl truncates long titles but keeps the full body', () => {
	const problem = 'a'.repeat(100);
	const url = new URL(issueUrl({ chapter: 'C', page: 'p', problem }));
	assert.equal(url.searchParams.get('title'), `[C] ${'a'.repeat(60)}…`);
	assert.ok(url.searchParams.get('body').endsWith(problem));
});

test('chapterOptions flattens groups and names Overview pages after their part', () => {
	const sidebar = [
		{ type: 'group', label: 'Part I', entries: [
			{ type: 'link', label: 'Overview', href: '/p1/', isCurrent: false },
			{ type: 'link', label: 'Growth', href: '/p1/g/', isCurrent: true },
		] },
		{ type: 'link', label: 'Glossary', href: '/glossary/', isCurrent: false },
	];
	assert.deepEqual(chapterOptions(sidebar), [
		{ label: 'Part I', href: '/p1/', current: false },
		{ label: 'Growth', href: '/p1/g/', current: true },
		{ label: 'Glossary', href: '/glossary/', current: false },
	]);
});
