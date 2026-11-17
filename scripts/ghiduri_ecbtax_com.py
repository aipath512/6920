#!/usr/bin/env python3
"""Ghiduri de blog statice pentru ecbtax.com, din aceleași întrebări–răspunsuri ca ecbtax.inweb.ro (v1.0, 2026-11-17).
Intrare: pagini OWNER (JSON), intents.json (ordinea TOF→MOF→BOF), ghiduri.json (titluri/introduceri).
Ieșire: <repo>/blog/ghid-*/index.html + secțiunea „Ghiduri” în <repo>/blog/index.html.
Pe ecbtax.com: fără prețuri neconfirmate de ECBTAX; FAQPage + BlogPosting în pagină (ca la celelalte articole)."""
import json, re, sys, html as H
PAG, INT, GH, REPO = sys.argv[1:5]
pag = {p['cale']: p['html'] for p in json.load(open(PAG))['pagini']}
intents = json.load(open(INT)); ghid = json.load(open(GH))
MAP = {"ghid-infiintare-firma": "/infiintare-firma/", "ghid-infiintare-srl": "/infiintare-srl/", "ghid-infiintare-pfa": "/infiintare-pfa/",
 "ghid-alegerea-contabilului": "/contabilitate/", "ghid-contabilitate-srl": "/contabilitate-srl/", "ghid-taxe-pfa": "/contabilitate-pfa/",
 "ghid-tva-e-factura": "/tva-e-factura/", "ghid-salarizare": "/salarizare-srl/", "ghid-bilant": "/bilant-srl/",
 "ghid-fiscalitate-srl": "/consultanta-fiscala/", "ghid-preturi-contabilitate": "/preturi/"}
ETI = {"/infiintare-firma/": "Înființare firmă", "/infiintare-srl/": "Înființare SRL", "/infiintare-pfa/": "Înființare PFA", "/contabilitate/": "Contabilitate", "/contabilitate-srl/": "Contabilitate SRL", "/contabilitate-pfa/": "Contabilitate PFA", "/tva-e-factura/": "TVA și e-Factura", "/salarizare-srl/": "Salarizare", "/bilant-srl/": "Bilanț", "/consultanta-fiscala/": "Consultanță fiscală", "/preturi/": "Prețuri și oferte"}
PRET = {  # prețurile nu sunt confirmate de ECBTAX: pe ecbtax.com nu se publică
 "6920I0044": [("contabilitatea (la ECB Tax de la 300 lei/lună + TVA, pachetul Start)", "contabilitatea lunară (prețul îl primești în oferta scrisă ECBTAX)")],
 "6920I0059": [("Contabilitatea lunară începe de la 300 lei/lună + TVA (pachetul Start), iar Start-Up Pack", "Prețul contabilității lunare îl primești în oferta scrisă, iar Start-Up Pack")],
 "6920I0112": [(", de la 300 lei/lună + TVA", "")],
 "6920I0113": [("Pachetul Start începe de la 300 lei/lună + TVA, iar Start-Up Pack", "Start-Up Pack")]}
INLOC = {"6920I0108": "<p>Prețul depinde de numărul de documente, de TVA, de numărul de angajați și de complexitatea activității. Îl primești într-o ofertă scrisă, după ce ne spui datele firmei. Start-Up Pack (site, hosting, email profesional, asistent AI) este inclus în orice contract.</p><p><a href=\"/contact/\">Cere oferta →</a></p>",
 "6920I0109": "<p>Prețul salarizării depinde de numărul de angajați și de tipurile de contracte și îl primești în oferta scrisă.</p><p><a href=\"/contact/\">Cere ofertă salarizare →</a></p>"}
META = {"ghid-preturi-contabilitate": {"titlu": "Cât costă contabilitatea în 2026: cum se face oferta și ce să întrebi", "descriere": "Cum se calculează prețul contabilității, cum primești o ofertă ECBTAX și ce să verifici înainte de a semna.", "intro": "<p>Prețul contabilității depinde de volumul de documente, de TVA și de angajați. Mai jos afli cum se construiește oferta și ce întrebări merită să pui oricărui contabil.</p>"}}
rang = {x['id']: i for i, e in enumerate(["TOF", "MOF", "BOF"]) for x in intents.get(e, [])}
ETAPA = {0: "Află", 1: "Compară", 2: "Alege"}
qs = {slug: [m.groups() for m in re.finditer(r'<details id="(6920I\d{4})"><summary>([\s\S]*?)</summary>([\s\S]*?)</details>', pag.get(c, ""))] for slug, c in MAP.items()}
unde = {i: slug for slug, l in qs.items() for i, _, _ in l}
txt = lambda s: re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", s))).strip()
def link(m):
    u = m.group(1)
    mm = re.match(r"^(/[a-z0-9-]+/)#(6920I\d{4})$", u)
    if mm and mm.group(2) in unde: return f'href="/blog/{unde[mm.group(2)]}/#{mm.group(2)}"'
    if u.startswith("/contact/"): return 'href="/contact/"'
    if u == "/startup-pack/": return 'href="/startup-pack"'
    for s, c in MAP.items():
        if u == c: return f'href="/blog/{s}/"'
    return m.group(0)
def curat(i, corp):
    corp = re.sub(r"<p><small>Răspuns în verificare profesională[\s\S]*?</small></p>", "", corp)
    if i in INLOC: corp = INLOC[i] + (re.search(r"<p><small>Surse:[\s\S]*?</small></p>", corp).group(0) if "Surse:" in corp else "")
    for a, b in PRET.get(i, []):
        assert a in corp, (i, a); corp = corp.replace(a, b)
    corp = re.sub(r'href="([^"]+)"', link, corp)
    assert not re.search(r"\d+ lei/lună|lei/angajat", corp), i
    return corp
HEAD = open(f"{REPO}/blog/cand-devii-platitor-de-tva/index.html").read()
STYLE = re.search(r"<style>[\s\S]*?</style>", HEAD).group(0)
lista = []
for slug, l in qs.items():
    if not l: continue
    m = {**ghid.get(slug, {}), **META.get(slug, {})}
    titlu, desc, intro, data = m["titlu"], m["descriere"], m["intro"], m.get("data", "2026-11-17")
    l = sorted(enumerate(l), key=lambda t: (rang.get(t[1][0], 3), t[0]))
    items = [(i, q, curat(i, c)) for _, (i, q, c) in l]
    url = f"https://ecbtax.com/blog/{slug}/"
    faq = {"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [{"@type": "Question", "@id": url + "#" + i, "identifier": i, "name": txt(q), "acceptedAnswer": {"@type": "Answer", "text": txt(re.sub(r"<p><small>Surse:[\s\S]*?</small></p>", "", c))}} for i, q, c in items]}
    post = {"@type": "BlogPosting", "headline": titlu, "description": desc, "inLanguage": "ro", "author": {"@id": "https://ecbtax.com/#organization"}, "publisher": {"@id": "https://ecbtax.com/#organization"}, "mainEntityOfPage": url, "datePublished": data, "dateModified": data, "about": ETI[MAP[slug]]}
    ld = json.dumps({"@context": "https://schema.org", "@graph": [post, faq]}, ensure_ascii=False).replace("</", "<\\/")
    e = H.escape
    toc = "".join(f'<a href="#{i}">{q}</a>' for i, q, _ in items)
    corp = "".join(f'<section id="{i}"><h2>{q}</h2>' + (f'<p><small>Etapa: {ETAPA[rang[i]]}</small></p>' if i in rang else "") + f"{c}</section>" for i, q, c in items)
    d = ".".join(reversed(data.split("-")))
    pagina = f"""<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{e(titlu)} | ECBTAX</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="author" content="ECB TAX ACCOUNTING &amp; HR SRL">
<meta property="og:type" content="article"><meta property="og:site_name" content="ECBTAX"><meta property="og:locale" content="ro_RO">
<meta property="og:title" content="{e(titlu)} | ECBTAX"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}">
<meta property="og:image" content="https://ecbtax.com/assets/ecbtax-servicii-og-1200x630.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@aipath512">{STYLE}<script type="application/ld+json">{ld}</script></head><body><div class="topbar">ECBTAX · Accounting, Payroll & Tax Advisory · Trust Center verificabil</div><div class="wrap"><header class="nav"><a class="brand" href="/">ECB <span>Tax</span></a><div class="navlinks"><a href="/">Acasă</a><a href="/blog/">Blog</a><a href="/trust-center/">Trust Center</a><a href="/contact/">Contact</a></div></header><div class="breadcrumb"><a href="/">Acasă</a> → <a href="/blog/">Blog</a> → {e(ETI[MAP[slug]])}</div><section class="hero"><div><div class="eyebrow">Ghid ECBTAX · întrebări și răspunsuri</div><h1>{e(titlu)}</h1><p class="lead">{e(desc)}</p></div><aside class="card gold"><strong>Verificare ECBTAX</strong><p>Acreditările profesionale ECBTAX sunt publicate în Trust Center cu SHA-256 și OpenTimestamps.</p><div class="btns"><a class="btn" href="/trust-center/">Verifică Trust Center</a></div></aside></section><div class="meta-grid"><div class="meta"><strong>Întrebări</strong><span>{len(items)}</span></div><div class="meta"><strong>Actualizat</strong><span>{d} · în verificare profesională</span></div></div><article><aside class="toc"><h2>Cuprins</h2>{toc}</aside><div class="content">{intro}{corp}<p><small>Răspunsurile au caracter general și sunt în verificare profesională la ECBTAX. Pentru situația firmei tale, cere o analiză.</small></p><div class="cta"><h2>Solicită o discuție ECBTAX</h2><p>Spune-ne forma juridică, activitatea, volumul de documente, angajații și situația TVA, iar noi îți trimitem oferta.</p><div class="btns"><a class="btn" href="/contact/">Contactează ECBTAX</a><a class="btn secondary" href="/blog/">Toate articolele</a></div></div></div></article><footer>© ECB TAX ACCOUNTING & HR SRL · <a href="/ai.json">ai.json</a> · <a href="/ai-proof.json">ai-proof.json</a> · <a href="/trust-center/">Trust Center</a></footer>
<!-- Formular ofertă · Kit legal AiVenture v1.0 -->
<script src="/legal/lead.js"></script>
</div></body></html>
"""
    import os; os.makedirs(f"{REPO}/blog/{slug}", exist_ok=True)
    open(f"{REPO}/blog/{slug}/index.html", "w").write(pagina)
    lista.append((slug, titlu, desc, len(items)))
    print(slug, len(items))
# secțiunea Ghiduri în blog/index.html (înlocuită la fiecare rulare)
bi = open(f"{REPO}/blog/index.html").read()
bi = re.sub(r"<!-- GHIDURI:start -->[\s\S]*?<!-- GHIDURI:end -->", "", bi)
sec = '<!-- GHIDURI:start --><h2>Ghiduri: întrebări și răspunsuri</h2><div class="grid">' + "".join(f'<article class="card"><h2><a href="/blog/{s}/">{H.escape(t)}</a></h2><p>{H.escape(d)}</p><p><a href="/blog/{s}/">{n} întrebări →</a></p></article>' for s, t, d, n in lista) + '</div><h2>Articole</h2><!-- GHIDURI:end -->'
i = bi.index('<div class="grid">')
open(f"{REPO}/blog/index.html", "w").write(bi[:i] + sec + bi[i:])
