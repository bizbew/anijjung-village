"""Import only Food_Center and Water_Center data, never worksheet feature notes.
Usage: python scripts/import-resource-centers.py /path/to/workbook.xlsx
Requires openpyxl. Existing entries and IDs are retained; repeat imports are idempotent.
"""
import json
import re
import sys
from pathlib import Path
import openpyxl

root = Path(__file__).resolve().parents[1]
path = root / 'src/resources.json'
records = json.loads(path.read_text())
workbook = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
source_file = 'AI Project - Anijjung Resilience.xlsx'

def text(value):
    return str(value).strip() if value is not None else ''

def key(name):
    # Remove the workbook's explicitly marked regional duplicate, not other aliases.
    return re.sub(r'\s+', '', re.sub(r'\s*\(ซ้ำเพื่อระบุภูมิภาคทางราชการ\)', '', name))

def add_unique(record, field, value):
    if value:
        record[field] = list(dict.fromkeys([*record.get(field, []), value]))

water_aliases = {'DGR-HQ': 'water-2', 'DWR-HQ': 'water-1', 'DGR-3': 'water-3'}
counts = {}
for sheet, category in [('Food_Center', 'อาหาร'), ('Water_Center', 'น้ำ')]:
    count = 0
    for row_number, row in enumerate(workbook[sheet].iter_rows(values_only=True), 1):
        if row_number == 1 or len(row) < 6 or not isinstance(row[0], (int, float)) or not row[2]:
            continue
        count += 1
        province, name = text(row[1]), text(row[2])
        if sheet == 'Food_Center':
            record = next((r for r in records if r['category'] == category and key(r['name']) == key(name)), None)
            summary, address = text(row[4]), text(row[5])
            identifier = f'food-center-{int(row[0])}'
        else:
            code = text(row[14])
            identifier = 'water-center-' + code.lower()
            record = next((r for r in records if r.get('agencyCode') == code or r['id'] == water_aliases.get(code)), None)
            summary, address = text(row[4]), text(row[3])
        if record is None:
            record = dict(id=identifier, category=category, name=re.sub(r'\s*\(ซ้ำเพื่อระบุภูมิภาคทางราชการ\)', '', name), area=f'{address} / {province}' if sheet == 'Food_Center' else text(row[6]), summary=summary, url=None, sourceUrl=None, sourceName=source_file, verifiedAt=None)
            records.append(record)
        record.update(sourceFile=source_file, sourceSheet=sheet)
        add_unique(record, 'sourceRows', row_number)
        add_unique(record, 'provinces', province)
        if summary != record['summary']:
            add_unique(record, 'additionalSummaries', summary)
        record['address'] = address
        if sheet == 'Food_Center':
            record['network'] = text(row[3])
        else:
            record.update(agencyCode=code, officeProvince=text(row[6]), organizationType=text(row[9]), assistanceType=text(row[8]))
            for field, column in [('coverageNotes', 7), ('contacts', 10), ('limitations', 11)]:
                add_unique(record, field, text(row[column]))
            source = text(row[12])
            if source.startswith('https://'):
                add_unique(record, 'referenceUrls', source)
                if not record['sourceUrl']:
                    record['sourceUrl'] = source
                    record['url'] = source
            date = row[13]
            if date and hasattr(date, 'date'):
                record['sourceResearchedAt'] = date.date().isoformat()
            # Workbook research is not independent verification by this app.
    counts[sheet] = count
path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'sourceRows': counts, 'totalRecords': len(records), 'categories': {c: sum(r['category'] == c for r in records) for c in ['อาหาร','น้ำ','พลังงาน']}, 'provinces': {c: len({p for r in records if r['category']==c for p in r.get('provinces',[])}) for c in ['อาหาร','น้ำ']}}, ensure_ascii=False))
