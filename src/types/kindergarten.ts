export type State = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export type KindergartenType = 'Long Day Care' | 'Family Day Care' | 'Preschool' | 'OSHC';

export type Rating = 'Exceeding' | 'Meeting' | 'Working Towards';

export type CustomerStatus = '未触达' | '已触达' | '有意向' | '已成交';

export type SourceChannel = '阿里巴巴' | '独立站' | 'Google开发' | 'LinkedIn' | '展会' | '转介绍';

export type Tag = '新开园' | '连锁品牌' | 'Montessori' | 'Reggio';

export interface Kindergarten {
  id: string;
  name: string;
  state: State;
  suburb: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  type: KindergartenType;
  rating: Rating;
  capacity: number;
  approved_date: string;
  status: CustomerStatus;
  source: SourceChannel | null;
  tags: Tag[];
  last_contact: string | null;
  notes: string;
}

export interface StateDistribution {
  state: State;
  count: number;
  fullName: string;
}

export interface FunnelData {
  stage: string;
  value: number;
  fill: string;
}
