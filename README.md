# 6920 — Site etalon CAEN 6920

Site static multipagină demonstrativ, proiectat pentru Cloudflare Pages, cu 33 rute HTML reale.

## Conținut funcțional
- Homepage premium cu două trasee comerciale (înființare vs firmă existentă)
- 33 pagini statice, cu HTML vizibil fără JavaScript și navigație responsive
- Servicii, pachete de ofertare, contact, FAQ, protecția documentelor și pagini legale de referință
- Asistent EVA demo: răspunsuri locale, deterministe și fără apel API; nu reprezintă corpusul omnichannel complet
- Formular demonstrativ care produce un text de cerere, **fără transmitere ori salvare server-side**
- Tema light/dark, meniul mobil, limbi cu indicator pentru traduceri neimplementate

## Limitări și reguli de publicare
- **Nu există firmă reală**: nu inventa CUI, telefon, e-mail, experți, recenzii, tarife, autorizări sau SLA.
- Toate paginile au `noindex,follow`, până la configurarea și verificarea identității unei firme reale.
- Canonical este de tip *placeholder* `https://6920.inweb.ro/`: schimbă-l și configurează DNS **înainte de indexare**.
- EVA nu accesează D1 sau cele 300 intents. Corpusul omnichannel este produs separat și necesită validare.
- Portalul client, CRM-ul, trimiterea leadului, plățile, operațiunile bancare și motorul HOLMES nu sunt implementate.
- Rutele juridice sunt doar structură demonstrativă; înlocuiește-le cu politici reale ale operatorului.
- Paginile au structură WebPage JSON-LD; nu declară entități profesionale neconfirmate.

## Cloudflare Pages
1. Creează proiectul Pages conectat la `aipath512/6920`, branch `main`.
2. Framework preset: **None**. Build command: **(gol)**. Build output directory: **/**.
3. Domeniul `6920.inweb.ro` este doar o sugestie de adresă și **nu este configurat sau verificat**.
4. După deploy verifică toate cele 33 rute și fallback 404; apoi configurează domain/canonical.
5. După onboarding, generează politici legale reale, robots/sitemap, JSON-LD firmă, traduceri și conectează CRM/EVA.

## Ordine continuare
1. Verificare vizuală și funcțională în preview live.
2. Onboarding cu identitate și servicii reale, regula autorizării per serviciu.
3. API securizat pentru leaduri, anti-spam și retenție GDPR.
4. KB EVA din masterul original, deduplicat, verificat și cu escaladare.
5. Portal de clienți separat cu MFA/RBAC/tenant isolation.
6. Admin/HOLMES și generator multi-tenant.

Detalii de inventar: `site-manifest.json`.
