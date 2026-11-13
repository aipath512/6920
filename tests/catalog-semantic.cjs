'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const canonical = read('data/c6920-services-v3.json');
const proposals = {
  ...read('audits/C6920-A01-A18-FAQ-REMEDIATION-2026.json'),
  ...read('audits/C6920-S01-S10-FAQ-REMEDIATION-2026.json')
};
const stems = [
  t => `Cum stabilim dacă ${t}?`,
  t => `Ce informații sunt necesare pentru ${t}?`,
  t => `Cum verificăm ${t}?`,
  t => `Ce facem dacă ${t}?`,
  t => `Ce risc apare când ${t}?`,
  t => `Cum tratăm ${t}?`,
  t => `Cine răspunde de ${t}?`,
  t => `Ce dovezi păstrăm pentru ${t}?`,
  t => `Cum stabilim calendarul pentru ${t}?`,
  t => `Ce trebuie să conțină livrabilul pentru ${t}?`
];
assert.equal(canonical.services.length, 52);
assert.equal(Object.keys(proposals).length, 28, '28 services require dedicated editorial scenarios');
let checked = 0;
for (const service of canonical.services) {
  assert.ok(Array.isArray(service.sources) && service.sources.length > 0, service.id + ' missing legal framework references');
  assert.ok(service.sources.every(s => s.url.startsWith('https://') && s.act && s.verification), service.id + ' reference missing provenance');
  assert.equal(service.legal_review?.article_level_validation, 'pending', 'Do not pretend an exhaustive legal review is signed off');
  assert.ok(service.professional_authorization_category, service.id + ' professional scope classification absent');
  if (!proposals[service.id]) continue;
  const rows = proposals[service.id];
  assert.equal(rows.length, 10, service.id + ' must have 10 dedicated editorial scenarios');
  assert.equal(service.faq_review?.semantic_anchor, rows[0][0], service.id + ' scenario anchor does not match');
  rows.forEach(([topic, answer], i) => {
    assert.equal(service.faq[i].question, stems[i](topic), service.id + ' wrong topic attribution in FAQ' + (i + 1));
    assert.equal(service.faq[i].answer, answer, service.id + ' answer does not match the service-specific editorial scenario at ' + (i + 1));
    assert.ok(answer.length >= 60, service.id + ' answer too short at ' + (i + 1));
    checked++;
  });
}
assert.equal(checked, 280, 'Expected exactly 280 remediated service-specific FAQ cases');
console.log('PASS C6920 semantic and legal provenance guard: 280 specialized scenarios, 52 official-source mappings and pending review labels');
