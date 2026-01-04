import type { Kindergarten, State, KindergartenType, Rating, CustomerStatus, SourceChannel, Tag } from '../types/kindergarten';

const SHEET_ID = '1fwoy4cJKkDuT6uLYiGdQtCWFD4omRHZ53Ten3oq5UdM';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    data.push(row);
  }

  return data;
}

function validateState(state: string): State {
  const validStates: State[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
  return validStates.includes(state as State) ? (state as State) : 'NSW';
}

function validateType(type: string): KindergartenType {
  const validTypes: KindergartenType[] = ['Long Day Care', 'Family Day Care', 'Preschool', 'OSHC'];
  return validTypes.includes(type as KindergartenType) ? (type as KindergartenType) : 'Long Day Care';
}

function validateRating(rating: string): Rating {
  const validRatings: Rating[] = ['Exceeding', 'Meeting', 'Working Towards'];
  return validRatings.includes(rating as Rating) ? (rating as Rating) : 'Meeting';
}

function validateStatus(status: string): CustomerStatus {
  const validStatuses: CustomerStatus[] = ['未触达', '已触达', '有意向', '已成交'];
  return validStatuses.includes(status as CustomerStatus) ? (status as CustomerStatus) : '未触达';
}

function validateSource(source: string): SourceChannel | null {
  if (!source) return null;
  const validSources: SourceChannel[] = ['阿里巴巴', '独立站', 'Google开发', 'LinkedIn', '展会', '转介绍'];
  return validSources.includes(source as SourceChannel) ? (source as SourceChannel) : null;
}

function parseTags(tagsStr: string): Tag[] {
  if (!tagsStr) return [];
  const validTags: Tag[] = ['新开园', '连锁品牌', 'Montessori', 'Reggio'];
  return tagsStr.split(';')
    .map(t => t.trim())
    .filter(t => validTags.includes(t as Tag)) as Tag[];
}

export async function fetchKindergartens(): Promise<Kindergarten[]> {
  const response = await fetch(CSV_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }

  const csvText = await response.text();
  const rawData = parseCSV(csvText);

  return rawData.map(row => ({
    id: row.id || '',
    name: row.name || '',
    state: validateState(row.state),
    suburb: row.suburb || '',
    address: row.address || '',
    phone: row.phone || '',
    email: row.email || '',
    website: row.website || '',
    type: validateType(row.type),
    rating: validateRating(row.rating),
    capacity: parseInt(row.capacity) || 0,
    approved_date: row.approved_date || '',
    status: validateStatus(row.status),
    source: validateSource(row.source),
    tags: parseTags(row.tags),
    last_contact: row.last_contact || null,
    notes: row.notes || ''
  }));
}
