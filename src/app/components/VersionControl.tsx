import { motion } from 'motion/react';
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

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

export function VersionControl({ versions, selectedVersion, onVersionSelect }: VersionControlProps) {
  const getBiasColor = (score: number) => {
    if (score < 0.3) return '#8DC651';
    if (score < 0.7) return '#e88c1a';
    return '#d4183d';
  };

  return (
    <div className="h-[45%] bg-background border-b border-border p-6 overflow-y-auto transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-4"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Clock className="h-5 w-5" style={{ color: '#1710E6' }} />
        </motion.div>
        <h3 className="font-semibold text-foreground text-sm">Version History</h3>
      </motion.div>

      <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="visible">
        {versions.map((version) => (
          <motion.button
            key={version.id}
            variants={fadeUp}
            onClick={() => onVersionSelect(version.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-sm border transition-colors duration-200 text-left ${
              selectedVersion === version.id
                ? 'bg-muted'
                : 'bg-card border-border hover:bg-muted'
            }`}
            style={{
              borderColor: selectedVersion === version.id ? '#1710E6' : undefined,
              boxShadow: selectedVersion === version.id ? '0 2px 12px rgba(23,16,230,0.1)' : undefined,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{version.name}</h4>
                  {version.isBest && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-sm"
                      style={{ background: 'rgba(141,198,81,0.18)', border: '1px solid rgba(141,198,81,0.45)' }}
                    >
                      <Star className="h-3 w-3" style={{ color: '#0e0e12', fill: '#8DC651' }} />
                      <span className="text-xs font-medium" style={{ color: '#0e0e12' }}>Best</span>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{version.timestamp}</p>
              </div>
              <motion.div
                key={version.biasScore}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold"
                style={{ color: getBiasColor(version.biasScore) }}
              >
                {version.biasScore.toFixed(2)}
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${version.biasScore * 100}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{ backgroundColor: getBiasColor(version.biasScore) }}
              />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
