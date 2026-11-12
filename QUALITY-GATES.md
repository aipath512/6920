# C6920 — Contract anti-regresie V1.0

## Referință imutabilă
- Branch: `baseline/c6920-2026-11-12`
- Commit: `f6010be07160f6e6f16f7acd1234f99a403bbdf4`
- Site: `https://6920.inweb.ro/`
- Etalonul este un reper tehnic, **nu** o versiune validată vizual sau juridic.

## Flux obligatoriu
1. Fiecare schimbare pornește din `develop/anti-regression-v1` într-un branch de lucru.
2. PR către develop; rulează `npm test` și testele browser.
3. Preview Cloudflare separat; comparație vizuală la 390, 768, 1440 px.
4. Aprobare explicită pentru orice diferență intenționată.
5. PR develop → main numai după verificări; validare live și rollback la commitul anterior dacă apar probleme.

## Invariante
- HERO folosește `/assets/hero-6920.png` ca background și păstrează contrastul.
- Șase servicii, fiecare cu imagine și text, alternate L/R/L/R/L/R.
- Nicio imagine de serviciu nu trebuie să fie spartă.
- Meniul, linkurile, formularul și EVA nu trebuie să dispară.
- Cookie-uri statistice/marketing dezactivate implicit; butoane Refuză/Acceptă echivalente.
- Link permanent la setările cookie în footer.
- Nicio acreditare, recenzie, preț sau funcție operațională inventată.

## Gate-uri de publicare
- Static checks PASS
- Browser checks PASS
- Capturi comparative desktop/tabletă/mobil revizuite
- Confirmarea integrărilor de consimțământ și a serviciilor externe
- Aprobare umană înainte de merge

## Limitări actuale
- Testele automate nu dovedesc conformitatea GDPR sau disponibilitatea unui backend.
- Fotografiile Pexels externe și `noindex` sunt probleme cunoscute, urmărite separat.
- GitHub Actions verifică doar codul/preview-ul configurat; deployment Cloudflare nu este automat protejat până la configurarea politicilor de branch și a fluxului de deploy.
