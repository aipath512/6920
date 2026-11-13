# C6920 V3.5 — Audit editorial și tehnic (2026-11-13)

## Domeniu
52 servicii, 520 perechi FAQ, referențial `data/c6920-services-v3.json`, pagina `servicii/index.html`, site public `https://6920.inweb.ro/servicii/`.

## Rezultate confirmate în GitHub
- 52 servicii × 10 FAQ = 520.
- 520 întrebări distincte după normalizare textuală.
- Numai 367 răspunsuri distincte textual; 153 intrări reprezintă repetiții ale altor răspunsuri.
- Zece tipare comune de întrebări, reutilizate în toate cele 52 de servicii; unicitatea textuală este produsă în mare parte prin inserarea numelui serviciului.
- 520 blocuri HTML FAQ vizibile în sursă și 520 entități Question în JSON-LD; CSS FAQ prezent.
- 52 fișe editoriale sunt în continuare neconfirmate ca oferte comerciale.

## Verificare publică
- Endpointul JSON public conține întrebările V3.5.
- Extragerea HTML a paginii publice nu a confirmat prezența noului markup FAQ. Aceasta nu demonstrează singură absența sa în browser: extractorul poate elimina detalii/scripturi. Este necesară verificare DOM în browser, inclusiv deschiderea detaliilor.
- Robots meta: `noindex,follow`, adecvat etalonului înainte de activarea unui cabinet real.
- Canonical: `https://6920.inweb.ro/servicii/`.

## Neconformități editoriale
1. CRITIC: repetiții semantice masive; 153 răspunsuri repetate textual și multe altele similare semantic.
2. MAJOR: întrebările nu sunt bazate suficient pe intenții specifice fiecărui serviciu; șabloane despre preț, durată și responsabilități.
3. MAJOR: exemplele nu includ suficiente excepții, documente concrete, riscuri și decizii profesionale.
4. MAJOR: FAQPage cu 520 întrebări într-o singură pagină poate produce markup voluminos și nu garantează rich results. Conformitatea semantică necesită ca întrebările și răspunsurile marcate să fie disponibile vizitatorului; nu se vor crea răspunsuri invizibile diferite.
5. MAJOR: conținutul din JSON și HTML este duplicat în cod, fără generator unic verificat; risc de divergență la actualizări.
6. DE VERIFICAT: performanță mobil, accesibilitatea controalelor `details`, timp de încărcare și comportamentul configuratorului după extindere.

## Criterii de acceptare V3.6
- Minimum 10 FAQ per serviciu, minimum 520 în total.
- Fără întrebări duplicate după normalizare și fără răspunsuri copiate mecanic între servicii.
- Cel puțin 6 din 10 întrebări per serviciu să trateze situații concrete specifice, riscuri, excepții sau decizii.
- Răspunsuri factuale, fără termene legale, tarife sau calificări inventate; marcarea limitelor de competență.
- Un singur SSOT JSON și generare deterministă HTML/JSON-LD; verificare identitate text vizibil/text structurat.
- Test DOM live, mobil/desktop, navigare tastatură, indexabilitate și performanță înainte de acceptare.
