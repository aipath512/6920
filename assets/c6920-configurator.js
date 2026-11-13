"use strict";
(async function(){
 const catalogEl=document.getElementById("catalog"),stats=document.getElementById("stats"),preview=document.getElementById("preview");
 const search=document.getElementById("search"),level=document.getElementById("level"),exportBtn=document.getElementById("export"),resetBtn=document.getElementById("reset");
 const levels=[["essential","Nivel 1 · Esențiale IMM"],["advanced","Nivel 2 · Avansate"],["regulated","Nivel 3 · Specializate / condiționate"]];
 let services=[],catalogVersion="";
 const selections=new Map();
 function eligible(s,approval){return approval.provider_identity_verified===true&&approval.provider_approved_at!=null&&selections.get(s.id)==="confirmed"&&(s.level!=="regulated"||approval.professional_verification?.[s.id]?.verified===true)}
 function render(){
  const q=search.value.trim().toLocaleLowerCase("ro-RO"),lv=level.value;
  catalogEl.replaceChildren();
  for(const [key,label] of levels){
   const group=services.filter(s=>s.level===key&&(!lv||lv===key)&&(!q||(s.name+" "+s.id).toLocaleLowerCase("ro-RO").includes(q)));
   if(!group.length)continue;
   const sec=document.createElement("section");sec.className="group";const h=document.createElement("h2");h.textContent=label;sec.append(h);
   for(const s of group){
    const row=document.createElement("div");row.className="item";const info=document.createElement("div");
    const strong=document.createElement("strong");strong.textContent=s.name;
    const small=document.createElement("small");small.textContent=s.id+" · "+(key==="regulated"?"Necesită verificare profesională":"Serviciu informativ");
    info.append(strong,small);
    const select=document.createElement("select");select.setAttribute("aria-label","Starea pentru "+s.name);
    for(const [value,label] of [["unconfirmed","Neconfirmat"],["confirmed","Propus ca oferit"],["unavailable","Indisponibil"]]){const o=document.createElement("option");o.value=value;o.textContent=label;select.append(o)}
    select.value=selections.get(s.id)||"unconfirmed";select.addEventListener("change",()=>{selections.set(s.id,select.value);updateSummary()});
    row.append(info,select);sec.append(row);
   }
   catalogEl.append(sec);
  }
  if(!catalogEl.children.length)catalogEl.textContent="Niciun serviciu nu corespunde filtrului.";
  updateSummary();
 }
 function updateSummary(){
  const count=status=>services.filter(s=>(selections.get(s.id)||"unconfirmed")===status).length;
  stats.replaceChildren();for(const [label,n] of [["Total",services.length],["Propuse",count("confirmed")],["Neconfirmate",count("unconfirmed")],["Indisponibile",count("unavailable")]]){const el=document.createElement("span");el.textContent=label+": "+n;stats.append(el)}
  const approval={provider_identity_verified:false,provider_approved_at:null,professional_verification:{}};
  const publishable=services.filter(s=>eligible(s,approval));
  preview.textContent=JSON.stringify({catalog_version:catalogVersion,provider_identity_verified:false,provider_approved_at:null,publishable_service_ids:publishable.map(s=>s.id),publication_blocked:true,reason:"Lipsesc identitatea verificată, aprobarea prestatorului și verificările profesionale necesare."},null,2);
 }
 try{
  const r=await fetch("/data/c6920-services-v3.json",{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);
  const data=await r.json();if(!Array.isArray(data.services))throw Error("Catalog invalid");
  services=data.services;catalogVersion=data.version;for(const s of services)selections.set(s.id,"unconfirmed");
  search.addEventListener("input",render);level.addEventListener("change",render);
  resetBtn.addEventListener("click",()=>{for(const s of services)selections.set(s.id,"unconfirmed");render()});
  exportBtn.addEventListener("click",()=>{
   const out={schema:"scara.c6920.provider-selection.v1",catalog_version:catalogVersion,provider_id:null,provider_identity_verified:false,selection_status:"draft",services:services.map(s=>({service_id:s.id,status:selections.get(s.id),provider_approved_at:null,professional_verification:{required:s.level==="regulated",verified:false,evidence_reference:null},publishable:false}))};
   const blob=new Blob([JSON.stringify(out,null,2)+"\n"],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="c6920-selectie-draft.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  exportBtn.disabled=false;resetBtn.disabled=false;render();
 }catch(e){catalogEl.textContent="Catalogul nu poate fi încărcat: "+e.message+". Verifică publicarea fișierului JSON."}
})();