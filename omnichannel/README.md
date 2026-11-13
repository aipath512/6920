# ETALON 6920 → C6920 / EVA-6920 integration

## Source-of-truth contract

The canonical source is the **actual** ETALON 6920 omnichannel CSV with 300 rows and 33 columns. It is **not yet committed here**. The public description alone cannot reconstruct the 300 full answers or their 33-field governance metadata.

Run:
```sh
python3 omnichannel/build.py --master /path/to/master_intents_300.csv
```

The script validates row/column counts, unique IDs 1–300, nonempty answers, and canonical alias references. It generates 300 EVA entries, 297 independently publishable canonical entries, and a structural report. Outputs are local under `omnichannel/generated/`; they are not automatically published.

## Canonical aliases

- 195 → 47 (e-Factura)
- 191 → 49 (SAF-T)
- 192 → 49 (D406)

Keep aliases recognized in EVA, but do not emit duplicate FAQ or JSON-LD entries.

## Publication gate

**All 300 entries remain draft until a named professional owner approves their factual accuracy, services, pricing, sources, and review dates.** The reported 20 homepage FAQ, 108 primary service FAQ, 128 service placements, 18 articles, 262 SEO sections, and 447 crawler placements are *target allocations*, not verified outputs of this repository. Do not fabricate missing fields or silently change source values.

Next integration after obtaining the source files: ingest the full master, validate actual field names, reconcile canonical vs allocation counts, generate channel artifacts, run visual/structural tests on a preview branch, and only then publish. The current site remains unchanged.
