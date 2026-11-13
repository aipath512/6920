#!/usr/bin/env python3
"""Validate ETALON 6920 master and produce review-safe derived exports.
No publication of draft content; no synthetic intents or answers.
Usage: python3 omnichannel/build.py --master path/to/master_intents_300.csv
"""
import argparse,csv,json,pathlib,collections,sys
ROOT=pathlib.Path(__file__).resolve().parent
ALIASES={int(k):int(v) for k,v in json.loads((ROOT/"dedup_aliases.json").read_text(encoding="utf-8"))["aliases"].items()}
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--master",required=True)
 p.add_argument("--out",default=str(ROOT/"generated"))
 a=p.parse_args()
 with open(a.master,encoding="utf-8-sig",newline="") as f:
  sample=f.read(4096);f.seek(0)
  dialect=csv.Sniffer().sniff(sample,delimiters=";,")
  reader=csv.DictReader(f,dialect=dialect)
  fields=reader.fieldnames or []
  rows=list(reader)
 required={"id","intentie","raspuns_master"}
 missing=required-set(fields)
 if missing: raise SystemExit("Missing required columns: "+", ".join(sorted(missing)))
 if len(fields)!=33: raise SystemExit(f"Expected 33 columns, found {len(fields)}")
 if len(rows)!=300: raise SystemExit(f"Expected 300 rows, found {len(rows)}")
 ids=[int(r["id"]) for r in rows]
 if len(set(ids))!=300 or set(ids)!=set(range(1,301)): raise SystemExit("IDs must be unique and cover 1..300")
 if any(not r["intentie"].strip() or not r["raspuns_master"].strip() for r in rows): raise SystemExit("Empty intent or master answer")
 if any(i not in ids or canonical not in ids for i,canonical in ALIASES.items()): raise SystemExit("Alias references missing")
 out=pathlib.Path(a.out);out.mkdir(parents=True,exist_ok=True)
 for r in rows:
  r["canonical_id"]=str(ALIASES.get(int(r["id"]),int(r["id"])))
  r["is_alias"]="Da" if int(r["id"]) in ALIASES else "Nu"
 (out/"eva_intents.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 canonical=[r for r in rows if r["is_alias"]=="Nu"]
 (out/"canonical_intents.json").write_text(json.dumps(canonical,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 report={"total_ids":len(rows),"canonical_ids":len(canonical),"aliases":len(ALIASES),"categories":len(set(r.get("categorie","") for r in rows)),"status":"validated-structure-not-editorial-approval","publication_allowed":False}
 (out/"validation_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print(json.dumps(report,ensure_ascii=False))
if __name__=="__main__":main()
