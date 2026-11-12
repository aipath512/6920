# C6920 / ETALON 6920 — integrare controlată

Sursă originală identificată în Biblioteca ChatGPT: `pachet_omnichannel_intents_6920_v1.1.zip` (27 fișiere), plus `Master intenții 300.csv`.

## Stare
- [x] Sursa originală localizată și inspectată; arhiva include masterul 300×33, build.py și exporturile.
- [x] Regulile de alias documentate: 195→47, 191→49, 192→49.
- [x] Importat masterul original CSV 300×33 în acest branch; celelalte 26 de fișiere din arhivă încă nu au fost importate.
- [x] Adăugat validatorul `validate_and_stage.py` pentru exporturi interne draft-only; execuția CI nu este încă confirmată.\n- [ ] Regenerarea din master cu `SITE_DOMAIN=https://6920.inweb.ro`.
- [ ] Validarea întrebărilor și aprobarea de owner/reviewer.
- [ ] Conectarea interfeței FAQ/EVA la datele validate.
- [ ] Teste responsive și merge în main.

**Regulă de siguranță:** conținutul original este marcat `draft – de validat de owner`; nu se publică automat drept sfat fiscal sau promisiune comercială. Homepage-ul și HERO-ul existente nu se modifică în această etapă.

**Verificări necesare:** 300 ID-uri în registru, 297 ID-uri canonice după 3 aliasuri, 20 homepage, 128 plasări FAQ servicii, 300 intrări EVA recunoscute, 13 seturi JSON-LD. Numărătorile sunt ținte declarate, nu rezultate validate.
