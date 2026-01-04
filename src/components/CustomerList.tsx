import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X, Phone, Mail, Globe, MapPin, Star, Tag } from 'lucide-react';
import type { Kindergarten, CustomerStatus, State } from '../types/kindergarten';

interface CustomerListProps {
  data: Kindergarten[];
  selectedState: State | null;
  onStateChange: (state: State | null) => void;
}

const statusColors: Record<CustomerStatus, string> = {
  '未触达': 'bg-slate-100 text-slate-600',
  '已触达': 'bg-blue-100 text-blue-700',
  '有意向': 'bg-amber-100 text-amber-700',
  '已成交': 'bg-green-100 text-green-700'
};

const ratingColors: Record<string, string> = {
  'Exceeding': 'text-green-600',
  'Meeting': 'text-blue-600',
  'Working Towards': 'text-amber-600'
};

const PAGE_SIZE = 20;

export function CustomerList({ data, selectedState, onStateChange }: CustomerListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | '全部'>('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Kindergarten | null>(null);

  const statuses: (CustomerStatus | '全部')[] = ['全部', '已成交', '有意向', '已触达', '未触达'];
  const states: State[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  const filteredData = useMemo(() => {
    let result = data;

    if (selectedState) {
      result = result.filter(k => k.state === selectedState);
    }

    if (statusFilter !== '全部') {
      result = result.filter(k => k.status === statusFilter);
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(k =>
        k.name.toLowerCase().includes(searchLower) ||
        k.suburb.toLowerCase().includes(searchLower) ||
        k.id.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [data, selectedState, statusFilter, search]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedState, statusFilter, search]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header & Filters */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-800">
            客户列表
            <span className="ml-2 text-sm font-normal text-slate-500">
              (共 {filteredData.length.toLocaleString()} 条)
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索名称、区域或ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* State Filter */}
            <select
              value={selectedState || ''}
              onChange={(e) => onStateChange(e.target.value as State || null)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">全部州</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex gap-1">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">州/区</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">评级</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">容量</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">来源</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((k) => (
              <tr
                key={k.id}
                onClick={() => setSelectedCustomer(k)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm text-slate-500 font-mono">{k.id}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-800">{k.name}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-slate-600">{k.state}</div>
                  <div className="text-xs text-slate-400">{k.suburb}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{k.type}</td>
                <td className={`px-4 py-3 text-sm font-medium ${ratingColors[k.rating] || ''}`}>
                  {k.rating}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{k.capacity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[k.status]}`}>
                    {k.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{k.source || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          显示 {((currentPage - 1) * PAGE_SIZE) + 1} - {Math.min(currentPage * PAGE_SIZE, filteredData.length)} 条，共 {filteredData.length.toLocaleString()} 条
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    currentPage === pageNum
                      ? 'bg-blue-900 text-white'
                      : 'border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-slate-400">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-8 h-8 rounded-lg text-sm border border-slate-200 hover:bg-slate-50"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">{selectedCustomer.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedCustomer.id}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Rating */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${statusColors[selectedCustomer.status]}`}>
                  {selectedCustomer.status}
                </span>
                <span className={`text-sm font-medium ${ratingColors[selectedCustomer.rating]}`}>
                  <Star className="w-4 h-4 inline mr-1" />
                  {selectedCustomer.rating}
                </span>
                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {selectedCustomer.type}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">地址</p>
                    <p className="text-sm text-slate-500">{selectedCustomer.address}</p>
                    <p className="text-sm text-slate-400">{selectedCustomer.suburb}, {selectedCustomer.state}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">电话</p>
                    <p className="text-sm text-slate-500">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">邮箱</p>
                    <p className="text-sm text-slate-500">{selectedCustomer.email}</p>
                  </div>
                </div>
                {selectedCustomer.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">网站</p>
                      <a href={selectedCustomer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {selectedCustomer.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500">容量</p>
                  <p className="text-lg font-semibold text-slate-800">{selectedCustomer.capacity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">批准日期</p>
                  <p className="text-sm font-medium text-slate-800">{selectedCustomer.approved_date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">来源渠道</p>
                  <p className="text-sm font-medium text-slate-800">{selectedCustomer.source || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">最后联系</p>
                  <p className="text-sm font-medium text-slate-800">{selectedCustomer.last_contact || '-'}</p>
                </div>
              </div>

              {/* Tags */}
              {selectedCustomer.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    标签
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCustomer.notes && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">备注</p>
                  <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">{selectedCustomer.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
