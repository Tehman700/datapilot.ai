import { TrendingDown, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface NavbarProps {
  biasScore: number;
  genderBias: number;
  dataImbalance: number;
  confidence: number;
  biasHistory: number[];
}

export function Navbar({ biasScore, genderBias, dataImbalance, confidence, biasHistory }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  const getBiasLevel = (score: number) => {
    if (score < 0.3) return { label: 'Low Risk', color: '#10B981' };
    if (score < 0.7) return { label: 'Moderate Risk', color: '#F59E0B' };
    return { label: 'High Risk', color: '#EF4444' };
  };

  const biasLevel = getBiasLevel(biasScore);

  return (
    <div className="sticky top-0 z-50 h-[72px] border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="flex h-full items-center justify-between px-8">
        {/* Left: Project Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#A3E635] to-[#10B981] flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-[#0A0A0A]" />
            </div>
            <div>
              <div className="text-sm text-foreground font-semibold">Bias Detector</div>
              <div className="text-xs text-muted-foreground">census_data.csv</div>
            </div>
          </div>
        </div>

        {/* Center: Large Bias Score */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold" style={{ color: biasLevel.color }}>
              {biasScore.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{biasLevel.label}</div>
          </div>

          {/* Sparkline */}
          <div className="flex items-end gap-1 h-12">
            {biasHistory.map((value, i) => (
              <div
                key={i}
                className="w-2 bg-[#A3E635] rounded-t"
                style={{
                  height: `${value * 48}px`,
                  opacity: 0.4 + (i / biasHistory.length) * 0.6
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Metric Chips + Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-muted border border-border">
            <span className="text-xs text-muted-foreground">Gender Bias:</span>
            <span className="ml-2 text-sm font-semibold text-[#A3E635]">{genderBias.toFixed(2)}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-muted border border-border">
            <span className="text-xs text-muted-foreground">Imbalance:</span>
            <span className="ml-2 text-sm font-semibold text-[#A3E635]">{dataImbalance.toFixed(2)}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-muted border border-border">
            <span className="text-xs text-muted-foreground">Confidence:</span>
            <span className="ml-2 text-sm font-semibold text-[#A3E635]">{confidence}%</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center hover:border-[#A3E635] hover:bg-[#A3E635]/10 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4 text-muted-foreground" />
              : <Moon className="h-4 w-4 text-muted-foreground" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
