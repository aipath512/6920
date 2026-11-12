#!/usr/bin/env python3
"""ETALON 6920: validate original SSOT and generate draft-only QA artifacts.
No public FAQ, JSON-LD or chatbot publication until owner approval.
"""
import csv, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parent
MASTER=ROOT/"master_intents_300.csv"
ALIASES=ROOT/"dedup_aliases.json"
OUT=ROOT/"generated"
def main():
    with MASTER.open(encoding="utf-8-sig",newline="") as f:
        reader=csv.DictReader(f)
        rows=list(reader)
        fields=reader.fieldnames or []
    if len(rows)!=300 or len(fields)!=33:
        raise ValueError(f"Expected 300 rows × 33 columns; got {len(rows)} × {len(fields)}")
    ids=[int(r["id"]) for r in rows]
    if sorted(ids)!=list(range(1,301)):
        raise ValueError("IDs must be unique and cover 1..300")
    raw=json.loads(ALIASES.read_text(encoding="utf-8"))["canonical_map"]
    aliases={int(k):int(v) for k,v in raw.items()}
    if aliases!={195:47,191:49,192:49}:
        raise ValueError("Alias registry mismatch")
    canonical=[r for r in rows if int(r["id"]) not in aliases]
    if len(canonical)!=297:
        raise ValueError("Expected 297 canonical records")
    # Export is a REVIEW dataset, not a public content feed.
    OUT.mkdir(exist_ok=True)
    payload={"schema":"etalons/6920/draft-review-v1","publication_status":"NOT_APPROVED",
             "master_count":len(rows),"canonical_count":len(canonical),
             "aliases":aliases,"records":canonical}
    (OUT/"review_only.json").write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    with (OUT/"review_only.csv").open("w",encoding="utf-8-sig",newline="") as f:
        writer=csv.DictWriter(f,fieldnames=fields,delimiter=";")
        writer.writeheader();writer.writerows(canonical)
    print(f"OK: {len(rows)} master IDs, {len(canonical)} canonical, {len(aliases)} aliases; review-only exports")
if __name__=="__main__":
    try: main()
    except Exception as exc:
        print(f"ERROR: {exc}",file=sys.stderr);sys.exit(1)
