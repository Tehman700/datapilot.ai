import { Clock, Star } from 'lucide-react';

interface Version {
  id: string;
  name: string;
  timestamp: string;
  biasScore: number;
  isBest?: boolean;
}

interface VersionControlProps {
  versions: Version[];
  selectedVersion: string;
  onVersionSelect: (versionId: string) => void;
}

export function VersionControl({ versions, selectedVersion, onVersionSelect }: VersionControlProps) {
  const getBiasColor = (score: number) => {
    if (score < 0.3) return '#10B981';
    if (score < 0.7) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="h-[45%] bg-background border-b border-border p-6 overflow-y-auto transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-[#A3E635]" />
        <h3 className="font-semibold text-foreground">Version History</h3>
      </div>

      <div className="space-y-3">
        {versions.map((version) => (
          <button
            key={version.id}
            onClick={() => onVersionSelect(version.id)}
            className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
              selectedVersion === version.id
                ? 'bg-muted border-[#A3E635] shadow-lg shadow-[#A3E635]/10'
                : 'bg-card border-border hover:border-[#A3E635]/50 hover:bg-muted'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{version.name}</h4>
                  {version.isBest && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/30">
                      <Star className="h-3 w-3 text-[#A3E635] fill-[#A3E635]" />
                      <span className="text-xs text-[#A3E635] font-medium">Best</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{version.timestamp}</p>
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: getBiasColor(version.biasScore) }}
              >
                {version.biasScore.toFixed(2)}
              </div>
            </div>

            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${version.biasScore * 100}%`,
                  backgroundColor: getBiasColor(version.biasScore)
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
