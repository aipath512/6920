(function(){
const html=document.documentElement;
const themeButton=document.getElementById("theme-toggle");
let stored;try{stored=localStorage.getItem("6920-theme")}catch(e){}
if(stored==="dark"||stored==="light")html.dataset.theme=stored;
themeButton?.addEventListener("click",()=>{html.dataset.theme=html.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem("6920-theme",html.dataset.theme)}catch(e){}});
document.getElementById("menu-toggle")?.addEventListener("click",function(){const nav=document.getElementById("main-nav");const open=nav.classList.toggle("open");this.setAttribute("aria-expanded",String(open));this.textContent=open?"✕":"☰"});
document.getElementById("lang-toggle")?.addEventListener("click",function(){const menu=document.getElementById("lang-list");menu.hidden=!menu.hidden;this.setAttribute("aria-expanded",String(!menu.hidden))});
const lead=document.getElementById("lead-form");
lead?.addEventListener("submit",function(e){e.preventDefault();if(!lead.reportValidity())return;const values=Object.fromEntries(new FormData(lead).entries());const safe=x=>String(x||"").trim();const summary="CERERE DE EVALUARE — 6920 (DEMONSTRAȚIE)\n"+"Firmă: "+safe(values.company)+"\n"+"Contact: "+safe(values.name)+"\n"+"E-mail: "+safe(values.email)+"\n"+"Telefon: "+safe(values.phone)+"\n"+"Formă: "+safe(values.type)+"\n"+"TVA: "+safe(values.vat)+"\n"+"Serviciu: "+safe(values.need)+"\n"+"Context: "+safe(values.details)+"\n\nNetransmis către un server. Trimite cererea pe un canal confirmat de firma reală.";
const out=document.getElementById("lead-output");out.hidden=false;out.replaceChildren();const title=document.createElement("strong");title.textContent="Cerere pregătită — nu este încă transmisă.";const area=document.createElement("textarea");area.value=summary;area.readOnly=true;const b=document.createElement("button");b.type="button";b.className="btn btn-primary";b.textContent="Copiază cererea";b.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(summary);b.textContent="Copiat"}catch(e){area.select();b.textContent="Selectează și copiază textul"}});out.append(title,area,b);out.scrollIntoView({behavior:"smooth",block:"center"});
});
const toggle=document.getElementById("eva-trigger"),panel=document.getElementById("eva-box"),close=document.getElementById("eva-close"),log=document.getElementById("eva-history"),form=document.getElementById("eva-form"),input=document.getElementById("eva-question");
const knowledge=[
{re:/preț|pret|cost|tarif|abonament/i,text:"Costul depinde de numărul și tipul documentelor, regimul TVA, angajați și serviciile incluse. Etalonul nu publică tarife inventate. Poți consulta pachetele sau pregăti o cerere de ofertă.",url:"/preturi/",label:"Vezi pachetele"},
{re:/schimb|prelua|preluare|alt contabil|nu (mai )?răspunde/i,text:"Pentru schimbarea contabilului se verifică documentele, soldurile, declarațiile și termenele înainte de stabilirea transferului. Durata depinde de situația concretă.",url:"/preluare-contabilitate/",label:"Procesul de preluare"},
{re:/tva|tax|impozit|anaf|somație|somatie|control/i,text:"Obligațiile fiscale diferă în funcție de firmă și de data aplicării regulilor. Dacă ai o notificare ANAF, verifică termenul și contactează un profesionist autorizat. Nu trimite acte sensibile aici.",url:"/consultanta-fiscala/",label:"Fiscalitate"},
{re:/salar|angaja|personal|reges|salariat/i,text:"Salarizarea poate include calculul salariilor, declarațiile aplicabile și evidența personalului, numai dacă serviciul este confirmat și contractat.",url:"/salarii-personal/",label:"Salarizare"},
{re:/înființ|infiint|pornesc|deschid|srl sau pfa/i,text:"Înainte de înființare clarifică forma juridică, activitatea, sediul, documentele și modul de organizare a evidenței. SRL sau PFA se aleg după nevoile și riscurile activității.",url:"/infiintare-firma/",label:"Înființare"},
{re:/factur|factura|e-factura/i,text:"RO e-Factura implică obligații și proceduri care trebuie verificate la data operațiunii. Un prestator poate oferi suport de transmitere și verificare, dacă serviciul este contractat.",url:"/tva-e-factura/",label:"TVA și e-Factura"},
{re:/document|trim|extrase|bonuri|facturi/i,text:"De obicei, evidența contabilă folosește facturi, extrase bancare, contracte și alte justificative. Documentele sensibile se transmit pe canalul securizat al prestatorului, nu aici.",url:"/securitate-documente/",label:"Documente în siguranță"},
{re:/profit|raport|bilanț|bilant|cash.flow/i,text:"Rapoartele pot explica veniturile, cheltuielile și rezultatul perioadei; tipul și frecvența lor se definesc în contract. Valorile pot fi provizorii.",url:"/contabilitate-srl/",label:"Contabilitate SRL"},
{re:/shopify|woocommerce|magazin|online|ecommerce|marketplace/i,text:"Pentru un magazin online sunt relevante procesatorii de plăți, retururile, comisioanele marketplace și operațiunile transfrontaliere. Integrările sunt evaluate individual.",url:"/contabilitate-ecommerce/",label:"E-commerce"}
];
function say(text,who="eva",url,label){const el=document.createElement("div");el.className="bubble"+(who==="user"?" user":"");el.append(document.createTextNode(text));if(url){const a=document.createElement("a");a.href=url;a.textContent=" "+label+" ↗";a.style.display="block";a.style.marginTop="7px";a.style.fontWeight="800";el.append(a)}log.append(el);log.scrollTop=log.scrollHeight}
function openPanel(open){panel.hidden=!open;toggle.setAttribute("aria-expanded",String(open));if(open){input.focus();if(!log.children.length)say("Bună! Sunt EVA, asistentul demonstrativ 6920. Pot explica servicii, preluarea, costurile și pașii uzuali. Nu sunt consultant fiscal și nu primesc documente confidențiale.")}}
toggle?.addEventListener("click",()=>openPanel(panel.hidden));close?.addEventListener("click",()=>openPanel(false));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)openPanel(false)});
function respond(q){q=q.trim().slice(0,500);if(!q)return;say(q,"user");const match=knowledge.find(x=>x.re.test(q));if(match)say(match.text,"eva",match.url,match.label);else say("Pot răspunde la întrebări generale despre contabilitate SRL/PFA, înființare, preluare, TVA, salarizare, prețuri și documente. Pentru o situație concretă, pregătește o cerere de evaluare.","eva","/contact/","Cere ofertă")}
form?.addEventListener("submit",e=>{e.preventDefault();respond(input.value);input.value=""});
document.querySelectorAll("[data-eva-suggestion]").forEach(b=>b.addEventListener("click",()=>respond(b.dataset.evaSuggestion)));

// Offer-scoping wizard: complexity classification, not a price quotation.
const wizard=document.getElementById("offer-wizard");
wizard?.addEventListener("submit",function(e){e.preventDefault();if(!wizard.reportValidity())return;
 const f=Object.fromEntries(new FormData(wizard).entries());
 const n=k=>Math.max(0,Number(f[k])||0);
 let score=0;const factors=[];
 const add=(points,label)=>{score+=points;if(points>0)factors.push(label)};
 add(n("docs")>500?5:n("docs")>200?3:n("docs")>80?2:n("docs")>30?1:0,"Volumul documentelor");
 add(n("issued")+n("received")>350?3:n("issued")+n("received")>90?1:0,"Fluxul facturilor");
 add(n("employees")>30?4:n("employees")>10?3:n("employees")>0?1:0,"Salarizarea");
 add(f.vat==="yes"?2:0,"Regim TVA");
 add(n("accounts")>4?2:n("accounts")>1?1:0,"Conturi multiple");
 add(n("locations")>3?2:n("locations")>1?1:0,"Puncte de lucru");
 add(f.crossborder==="global"?4:f.crossborder==="eu"?2:0,"Operațiuni externe");
 add(f.stocks==="complex"?3:f.stocks==="simple"?1:0,"Gestiunea stocurilor");
 add(f.commerce==="marketplace"?4:f.commerce==="store"?2:0,"Canale e-commerce");
 add(f.report==="advanced"?4:f.report==="monthly"?2:0,"Raportare managerială");
 add(f.frequency==="daily"?3:f.frequency==="weekly"?1:0,"Frecvența lucrului");
 let plan=f.commerce!=="regular"?"E-commerce":score>=13?"Personalizat":score>=7?"Growth":score>=3?"Business":"Start";
 const res=document.getElementById("wizard-result");res.hidden=false;res.replaceChildren();
 const h=document.createElement("h3");h.textContent="Profil orientativ: "+plan;res.append(h);
 const p=document.createElement("p");p.textContent="Indice intern de complexitate: "+score+". Nu reprezintă un preț sau o ofertă contractuală.";res.append(p);
 const items=document.createElement("p");items.textContent="Factori: "+(factors.length?factors.join(" · "):"Activitate cu complexitate de bază");res.append(items);
 const l=document.createElement("a");l.href="/contact/?plan="+encodeURIComponent(plan)+"&scope="+encodeURIComponent("Documente: "+f.docs+"/lună; angajați: "+f.employees+"; TVA: "+f.vat+"; e-commerce: "+f.commerce+"; extern: "+f.crossborder+"; stocuri: "+f.stocks+"; raportare: "+f.report+"; puncte lucru: "+f.locations+"; conturi: "+f.accounts+"; flux: "+f.frequency);
 l.className="btn btn-primary";l.textContent="Continuă cu această evaluare";res.append(l);
 res.scrollIntoView({behavior:"smooth",block:"nearest"});
});
const q=new URLSearchParams(location.search);const formDetails=document.getElementById("q-details");
if(formDetails&&q.has("scope")){const details="Pachet orientativ: "+(q.get("plan")||"")+"\\n"+(q.get("scope")||"");formDetails.value=details.slice(0,1950);}

})();