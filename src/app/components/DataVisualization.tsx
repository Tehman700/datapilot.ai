import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { BarChart3, Activity } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

interface DataVisualizationProps {
  selectedVersion: string;
}

export function DataVisualization({ selectedVersion }: DataVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'distribution' | 'comparison'>('distribution');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridColor = isDark ? '#2A2A2A' : 'rgba(0,0,0,0.08)';
  const axisColor = isDark ? '#71717A' : '#9CA3AF';
  const tooltipBg = isDark ? '#1E1E1E' : '#ffffff';
  const tooltipBorder = isDark ? '#2A2A2A' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDark ? '#D4D4D8' : '#030213';

  const distributionData = [
    { range: '20-30', before: 45, after: 52 },
    { range: '30-40', before: 78, after: 85 },
    { range: '40-50', before: 120, after: 125 },
    { range: '50-60', before: 95, after: 98 },
    { range: '60-70', before: 60, after: 65 },
    { range: '70-80', before: 35, after: 38 },
  ];

  const comparisonData = [
    { group: 'Male', income: 65000 },
    { group: 'Female', income: 62000 },
    { group: 'Non-binary', income: 63500 },
  ];

  return (
    <div className="h-[55%] bg-background p-6 overflow-y-auto transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#A3E635]" />
          <h3 className="font-semibold text-foreground">Data Visualization</h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'distribution'
                ? 'bg-[#A3E635] text-[#0A0A0A]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="h-3 w-3 inline mr-1" />
            Distribution
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'comparison'
                ? 'bg-[#A3E635] text-[#0A0A0A]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-3 w-3 inline mr-1" />
            Comparison
          </button>
        </div>
      </div>

      <div className="h-[250px] bg-card rounded-xl border border-border p-4 transition-colors duration-300">
        {activeTab === 'distribution' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={distributionData}>
              <defs>
                <linearGradient id="beforeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="afterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A3E635" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A3E635" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="range" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} />
              <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText
                }}
              />
              <Area type="monotone" dataKey="before" stroke="#6B7280" strokeWidth={2} fill="url(#beforeGradient)" name="Before" />
              <Area type="monotone" dataKey="after" stroke="#A3E635" strokeWidth={2} fill="url(#afterGradient)" name="After" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="group" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} />
              <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText
                }}
              />
              <Bar dataKey="income" fill="#A3E635" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        {activeTab === 'distribution' && (
          <>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#6B7280]" />
              <span className="text-muted-foreground">Before correction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#A3E635]" />
              <span className="text-muted-foreground">After correction</span>
            </div>
          </>
        )}
        {activeTab === 'comparison' && (
          <div className="text-muted-foreground">Average income by group (after bias correction)</div>
        )}
      </div>
    </div>
  );
}
