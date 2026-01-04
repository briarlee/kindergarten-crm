import type {
  Kindergarten,
  State,
  KindergartenType,
  Rating,
  CustomerStatus,
  SourceChannel,
  Tag
} from '../types/kindergarten';

// Australian state distribution (approximate based on population)
const stateDistribution: { state: State; weight: number; fullName: string; suburbs: string[] }[] = [
  {
    state: 'NSW',
    weight: 0.32,
    fullName: 'New South Wales',
    suburbs: ['Sydney', 'Parramatta', 'Liverpool', 'Blacktown', 'Penrith', 'Newcastle', 'Wollongong', 'Chatswood', 'Bondi', 'Manly', 'Hornsby', 'Bankstown', 'Campbelltown', 'Ryde', 'Burwood', 'Strathfield', 'Hurstville', 'Kogarah', 'Cronulla', 'Dee Why']
  },
  {
    state: 'VIC',
    weight: 0.26,
    fullName: 'Victoria',
    suburbs: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Frankston', 'Dandenong', 'Box Hill', 'Glen Waverley', 'Doncaster', 'Ringwood', 'Brighton', 'St Kilda', 'Carlton', 'Footscray', 'Werribee', 'Sunbury', 'Craigieburn', 'Epping', 'Mornington', 'Pakenham']
  },
  {
    state: 'QLD',
    weight: 0.20,
    fullName: 'Queensland',
    suburbs: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns', 'Townsville', 'Toowoomba', 'Rockhampton', 'Mackay', 'Bundaberg', 'Hervey Bay', 'Ipswich', 'Logan', 'Redcliffe', 'Caboolture', 'Nambour', 'Caloundra', 'Southport', 'Surfers Paradise', 'Robina', 'Nerang']
  },
  {
    state: 'WA',
    weight: 0.10,
    fullName: 'Western Australia',
    suburbs: ['Perth', 'Fremantle', 'Joondalup', 'Mandurah', 'Rockingham', 'Bunbury', 'Albany', 'Geraldton', 'Kalgoorlie', 'Broome', 'Subiaco', 'Nedlands', 'Claremont', 'Cottesloe', 'Scarborough', 'Morley', 'Midland', 'Armadale', 'Cannington', 'Victoria Park']
  },
  {
    state: 'SA',
    weight: 0.07,
    fullName: 'South Australia',
    suburbs: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta', 'Port Lincoln', 'Victor Harbor', 'Gawler', 'Salisbury', 'Elizabeth', 'Modbury', 'Marion', 'Unley', 'Norwood', 'Burnside', 'Mitcham', 'Glenelg', 'Semaphore', 'Henley Beach', 'Brighton']
  },
  {
    state: 'TAS',
    weight: 0.025,
    fullName: 'Tasmania',
    suburbs: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston', 'Sandy Bay', 'Glenorchy', 'Moonah', 'New Town', 'Lindisfarne', 'Bellerive', 'Rosny', 'Howrah', 'Mowbray', 'Newnham', 'Ravenswood', 'Legana', 'Perth', 'Longford', 'George Town']
  },
  {
    state: 'ACT',
    weight: 0.02,
    fullName: 'Australian Capital Territory',
    suburbs: ['Canberra', 'Belconnen', 'Woden', 'Tuggeranong', 'Gungahlin', 'Civic', 'Braddon', 'Kingston', 'Manuka', 'Deakin', 'Curtin', 'Weston', 'Kambah', 'Ngunnawal', 'Harrison', 'Franklin', 'Casey', 'Amaroo', 'Bonner', 'Coombs']
  },
  {
    state: 'NT',
    weight: 0.015,
    fullName: 'Northern Territory',
    suburbs: ['Darwin', 'Alice Springs', 'Katherine', 'Palmerston', 'Casuarina', 'Nightcliff', 'Fannie Bay', 'Stuart Park', 'Parap', 'Rapid Creek', 'Millner', 'Malak', 'Karama', 'Wulagi', 'Leanyer', 'Brinkin', 'Muirhead', 'Lyons', 'Moulden', 'Gray']
  }
];

const kindergartenTypes: KindergartenType[] = ['Long Day Care', 'Family Day Care', 'Preschool', 'OSHC'];
const typeWeights = [0.55, 0.20, 0.15, 0.10];

const ratings: Rating[] = ['Exceeding', 'Meeting', 'Working Towards'];
const ratingWeights = [0.25, 0.55, 0.20];

const sourceChannels: SourceChannel[] = ['阿里巴巴', '独立站', 'Google开发', 'LinkedIn', '展会', '转介绍'];

const tags: Tag[] = ['新开园', '连锁品牌', 'Montessori', 'Reggio'];

const namePrefix = [
  'Little', 'Bright', 'Happy', 'Sunshine', 'Rainbow', 'Golden', 'Tiny', 'Growing',
  'Curious', 'Creative', 'Learning', 'Discovery', 'Adventure', 'Wonder', 'Magic',
  'Star', 'Garden', 'Village', 'Community', 'Family', 'Kids', 'Children\'s',
  'Early', 'First', 'Step', 'Future', 'Dream', 'Joy', 'Play', 'Fun'
];

const nameSuffix = [
  'Academy', 'Learning Centre', 'Early Learning', 'Childcare', 'Kindergarten',
  'Preschool', 'Child Care Centre', 'Early Education', 'Kids Club', 'Learning Hub',
  'Development Centre', 'Education Centre', 'Play School', 'Nursery', 'Day Care',
  'Learning Academy', 'Education Hub', 'Children\'s Centre', 'Kids Academy', 'Learning Space'
];

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function weightedRandom<T>(items: T[], weights: number[], random: () => number): T {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomFromArray<T>(arr: T[], random: () => number): T {
  return arr[Math.floor(random() * arr.length)];
}

function generatePhone(state: State, random: () => number): string {
  const areaCodes: Record<State, string> = {
    'NSW': '02',
    'VIC': '03',
    'QLD': '07',
    'WA': '08',
    'SA': '08',
    'TAS': '03',
    'ACT': '02',
    'NT': '08'
  };
  const areaCode = areaCodes[state];
  const number = Math.floor(random() * 90000000 + 10000000);
  return `${areaCode} ${String(number).slice(0, 4)} ${String(number).slice(4)}`;
}

function generateEmail(name: string, random: () => number): string {
  const domains = ['gmail.com', 'outlook.com', 'childcare.edu.au', 'education.net.au', 'hotmail.com'];
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  return `${cleanName}${Math.floor(random() * 100)}@${randomFromArray(domains, random)}`;
}

function generateDate(startYear: number, endYear: number, random: () => number): string {
  const year = Math.floor(random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(random() * 12) + 1;
  const day = Math.floor(random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function generateKindergartens(count: number = 17000, seed: number = 12345): Kindergarten[] {
  const random = seededRandom(seed);
  const kindergartens: Kindergarten[] = [];

  // Status distribution: 已成交200, 有意向500, 已触达2000, 未触达14300
  const statusConfig: { status: CustomerStatus; count: number }[] = [
    { status: '已成交', count: 200 },
    { status: '有意向', count: 500 },
    { status: '已触达', count: 2000 },
    { status: '未触达', count: count - 2700 }
  ];

  // Create status array
  const statuses: CustomerStatus[] = [];
  statusConfig.forEach(config => {
    for (let i = 0; i < config.count; i++) {
      statuses.push(config.status);
    }
  });

  // Shuffle statuses
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }

  for (let i = 0; i < count; i++) {
    const stateInfo = weightedRandom(stateDistribution, stateDistribution.map(s => s.weight), random);
    const suburb = randomFromArray(stateInfo.suburbs, random);
    const name = `${randomFromArray(namePrefix, random)} ${suburb} ${randomFromArray(nameSuffix, random)}`;
    const type = weightedRandom(kindergartenTypes, typeWeights, random);
    const status = statuses[i];

    // Generate tags (20% chance for each tag)
    const kindergartenTags: Tag[] = [];
    tags.forEach(tag => {
      if (random() < 0.2) {
        kindergartenTags.push(tag);
      }
    });

    // Source and last_contact only for non-未触达
    let source: SourceChannel | null = null;
    let lastContact: string | null = null;

    if (status !== '未触达') {
      source = randomFromArray(sourceChannels, random);
      lastContact = generateDate(2023, 2025, random);
    }

    const kindergarten: Kindergarten = {
      id: `AU-${String(i + 1).padStart(6, '0')}`,
      name,
      state: stateInfo.state,
      suburb,
      address: `${Math.floor(random() * 500) + 1} ${randomFromArray(['Main', 'High', 'Park', 'Station', 'Church', 'School', 'Garden', 'Lake', 'River', 'Hill'], random)} Street, ${suburb}, ${stateInfo.state}`,
      phone: generatePhone(stateInfo.state, random),
      email: generateEmail(name, random),
      website: random() > 0.3 ? `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.au` : '',
      type,
      rating: weightedRandom(ratings, ratingWeights, random),
      capacity: Math.floor(random() * 150) + 20,
      approved_date: generateDate(2005, 2024, random),
      status,
      source,
      tags: kindergartenTags,
      last_contact: lastContact,
      notes: status === '已成交' ? randomFromArray(['优质客户', '多次复购', '大订单客户', '合作稳定'], random) : ''
    };

    kindergartens.push(kindergarten);
  }

  return kindergartens;
}

export function getStateDistribution(kindergartens: Kindergarten[]) {
  const distribution: Record<State, number> = {
    'NSW': 0, 'VIC': 0, 'QLD': 0, 'WA': 0, 'SA': 0, 'TAS': 0, 'ACT': 0, 'NT': 0
  };

  kindergartens.forEach(k => {
    distribution[k.state]++;
  });

  const stateNames: Record<State, string> = {
    'NSW': 'New South Wales',
    'VIC': 'Victoria',
    'QLD': 'Queensland',
    'WA': 'Western Australia',
    'SA': 'South Australia',
    'TAS': 'Tasmania',
    'ACT': 'ACT',
    'NT': 'Northern Territory'
  };

  return Object.entries(distribution)
    .map(([state, count]) => ({
      state: state as State,
      count,
      fullName: stateNames[state as State]
    }))
    .sort((a, b) => b.count - a.count);
}

export function getFunnelData(kindergartens: Kindergarten[]) {
  const total = kindergartens.length;
  const contacted = kindergartens.filter(k => k.status !== '未触达').length;
  const interested = kindergartens.filter(k => k.status === '有意向' || k.status === '已成交').length;
  const closed = kindergartens.filter(k => k.status === '已成交').length;

  return [
    { stage: '全量客户', value: total, fill: '#1e40af' },
    { stage: '已触达', value: contacted, fill: '#3b82f6' },
    { stage: '有意向', value: interested, fill: '#60a5fa' },
    { stage: '已成交', value: closed, fill: '#22c55e' }
  ];
}
