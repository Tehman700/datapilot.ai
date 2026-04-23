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
    if (score < 0.3) return '#10B981';
    if (score < 0.7) return '#F59E0B';
    return '#EF4444';
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
          <Clock className="h-5 w-5 text-[#A3E635]" />
        </motion.div>
        <h3 className="font-semibold text-foreground">Version History</h3>
      </motion.div>

      <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="visible">
        {versions.map((version) => (
          <motion.button
            key={version.id}
            variants={fadeUp}
            onClick={() => onVersionSelect(version.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-xl border transition-colors duration-200 text-left ${
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
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/30"
                    >
                      <Star className="h-3 w-3 text-[#A3E635] fill-[#A3E635]" />
                      <span className="text-xs text-[#A3E635] font-medium">Best</span>
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

            {/* Animated progress bar */}
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
