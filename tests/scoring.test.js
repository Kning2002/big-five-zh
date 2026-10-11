import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { score } from '../scoring.js';
const questions = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url), 'utf8'));
const answersFor = callback => Object.fromEntries(questions.map(q => [q.id, callback(q)]));
test('neutral answers produce raw 72 and normalized 50 for all domains', () => {
  for (const domain of score(questions, answersFor(() => 3))) { assert.equal(domain.raw, 72); assert.equal(domain.mean, 3); assert.equal(domain.normalized, 50); }
});
test('key-aware endpoints score 0 and 100, verifying reverse scoring', () => {
  assert.ok(score(questions, answersFor(q => q.keyed === 'plus' ? 5 : 1)).every(d => d.normalized === 100 && d.raw === 120));
  assert.ok(score(questions, answersFor(q => q.keyed === 'plus' ? 1 : 5)).every(d => d.normalized === 0 && d.raw === 24));
});
test('incomplete, noninteger, and out-of-range responses are rejected', () => {
  for (const invalid of [undefined, 0, 6, 2.5, '3']) {
    const answers = answersFor(() => 3); answers[questions[0].id] = invalid; assert.throws(() => score(questions, answers));
  }
});
test('question IDs, keys, domains and facet balance are valid', () => {
  assert.equal(questions.length, 120); assert.equal(new Set(questions.map(q => q.id)).size, 120);
  for (const domain of ['O', 'C', 'E', 'A', 'N']) for (let facet = 1; facet <= 6; facet++) assert.equal(questions.filter(q => q.domain === domain && q.facet === facet).length, 4);
  assert.throws(() => score([...questions.slice(1), questions[1]], answersFor(() => 3)));
});
