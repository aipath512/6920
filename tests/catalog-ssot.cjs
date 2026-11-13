'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'servicii/index.html'), 'utf8');
const source = JSON.parse(fs.readFileSync(path.join(root, 'data/c6920-services-v3.json'), 'utf8'));
const ldMatch = html.match(/<script type="application\/ld\+json" id="c6920-faq-structured-data">([\s\S]*?)<\/script>/);
assert.ok(ldMatch, 'FAQPage JSON-LD script is missing');
const ld = JSON.parse(ldMatch[1]);
assert.equal(ld['@type'], 'FAQPage');
assert.ok(Array.isArray(ld.mainEntity), 'FAQPage.mainEntity must be an array');
assert.equal(source.services.length, 52, 'Expected 52 canonical service records');
assert.equal(ld.mainEntity.length, 520, 'Expected 520 JSON-LD Question records');

const blocks = [...html.matchAll(/<article class="etalon-tier-service etalon-tier-service-detailed" id="serviciu-([eas])(\d+)">/g)];
assert.equal(blocks.length, 52, 'Expected 52 detailed services in HTML');
const expectedCodes = [
  ...Array.from({length: 19}, (_, i) => 'E' + String(i + 1).padStart(2, '0')),
  ...Array.from({length: 18}, (_, i) => 'A' + String(i + 1).padStart(2, '0')),
  ...Array.from({length: 15}, (_, i) => 'S' + String(i + 1).padStart(2, '0'))
];
const ids = source.services.map(s => s.id);
assert.deepEqual(ids, expectedCodes, 'Canonical service order/identifiers diverge');
const htmlIds = blocks.map(m => m[1].toUpperCase() + m[2]);
assert.deepEqual(htmlIds, expectedCodes, 'HTML service order/identifiers diverge');

const pairs = [];
const questions = new Set(), answers = new Set();
const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
for (let i = 0; i < blocks.length; i++) {
  const start = blocks[i].index;
  const end = i + 1 < blocks.length ? blocks[i + 1].index : html.indexOf('</section>', start);
  assert.ok(end > start, 'Missing terminal boundary for last service');
  const section = html.slice(start, end), service = source.services[i], id = expectedCodes[i];
  const markupFAQ = [...section.matchAll(/<details class="etalon-faq-item"><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)];
  assert.equal(markupFAQ.length, 10, id + ': HTML must have exactly 10 FAQs');
  assert.equal(service.faq.length, 10, id + ': SSOT must have exactly 10 FAQs');
  for (let j = 0; j < 10; j++) {
    const q = markupFAQ[j][1], a = markupFAQ[j][2], record = service.faq[j];
    assert.equal(record.id, id + '-FAQ' + String(j + 1).padStart(2, '0'), id + ': FAQ ID mismatch');
    assert.equal(record.question, q, id + ': question mismatch at index ' + (j + 1));
    assert.equal(record.answer, a, id + ': answer mismatch at index ' + (j + 1));
    assert.ok(q.length > 0 && a.length > 0, id + ': empty question/answer');
    assert.ok(!questions.has(normalize(q)), 'Duplicate question: ' + q);
    assert.ok(!answers.has(normalize(a)), 'Duplicate answer: ' + a);
    questions.add(normalize(q)); answers.add(normalize(a));
    pairs.push({q, a});
  }
}
assert.equal(pairs.length, 520);
for (let i = 0; i < pairs.length; i++) {
  const q = ld.mainEntity[i];
  assert.equal(q['@type'], 'Question', 'JSON-LD Question type at ' + i);
  assert.equal(q.name, pairs[i].q, 'JSON-LD question mismatch at ' + i);
  assert.equal(q.acceptedAnswer?.['@type'], 'Answer', 'JSON-LD Answer type at ' + i);
  assert.equal(q.acceptedAnswer.text, pairs[i].a, 'JSON-LD answer mismatch at ' + i);
}
console.log('PASS C6920 SSOT → HTML → JSON-LD: 52 services, 520 exact FAQ pairs, no duplicates');
