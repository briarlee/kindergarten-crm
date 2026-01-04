import { useState, useMemo } from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { MetricCards, StateChart, FunnelChart, CustomerList } from './components';
import { generateKindergartens, getStateDistribution, getFunnelData } from './data/generateData';
import type { State } from './types/kindergarten';

function App() {
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [dataKey, setDataKey] = useState(0);

  // Generate data with stable key
  const data = useMemo(() => generateKindergartens(17000, 12345 + dataKey), [dataKey]);

  // Filter data by selected state for metrics
  const filteredData = useMemo(() => {
    if (!selectedState) return data;
    return data.filter(k => k.state === selectedState);
  }, [data, selectedState]);

  const stateDistribution = useMemo(() => getStateDistribution(data), [data]);
  const funnelData = useMemo(() => getFunnelData(filteredData), [filteredData]);

  const handleRefresh = () => {
    setDataKey(prev => prev + 1);
    setSelectedState(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-800 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">幼儿园客户资产库</h1>
                <p className="text-blue-200 text-sm">Kindergarten Customer Asset Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-blue-200 text-xs">当前市场</p>
                <p className="font-semibold">澳大利亚 Australia</p>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 bg-blue-800 hover:bg-blue-700 rounded-lg transition-colors"
                title="刷新数据"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metric Cards */}
        <MetricCards data={filteredData} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StateChart
            data={stateDistribution}
            selectedState={selectedState}
            onStateClick={setSelectedState}
          />
          <FunnelChart data={funnelData} />
        </div>

        {/* Customer List */}
        <CustomerList
          data={data}
          selectedState={selectedState}
          onStateChange={setSelectedState}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>幼儿园客户资产库 Demo - 数据为模拟生成 | 目标市场: 澳大利亚、加拿大、新西兰、新加坡</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
