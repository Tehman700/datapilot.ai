import { motion } from 'motion/react';
import { Database, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  impact: number;
}

interface SidebarProps {
  recommendations: Recommendation[];
  onRecommendationClick: (rec: Recommendation) => void;
}

const statItems = [
  { label: 'Rows',            value: '12,450', color: 'text-foreground' },
  { label: 'Columns',         value: '28',     color: 'text-foreground' },
  { label: 'Missing values',  value: '3.2%',   color: 'text-[#e88c1a]' },
];

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Sidebar({ recommendations, onRecommendationClick }: SidebarProps) {
  return (
    <div className="w-[280px] h-full bg-background border-r border-border p-6 overflow-y-auto transition-colors duration-300">

      {/* Dataset Overview */}
      <motion.div className="mb-8" variants={stagger} initial="hidden" animate="visible">
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
          <motion.div whileHover={{ rotate: 20, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Database className="h-5 w-5" style={{ color: '#1710E6' }} />
          </motion.div>
          <h3 className="font-semibold text-foreground text-sm">Dataset Overview</h3>
        </motion.div>

        <div className="space-y-3">
          {statItems.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="flex justify-between">
              <span className="text-sm text-muted-foreground">{s.label}:</span>
              <span className={`text-sm font-medium ${s.color}`}>{s.value}</span>
            </motion.div>
          ))}
          <motion.div variants={fadeUp} className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Skewed features:</span>
            <div className="text-right">
              <div className="text-sm text-foreground font-medium">4</div>
              <div className="text-xs text-muted-foreground mt-1">income, age, region, education</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-2 mb-4"
        >
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}>
            <Sparkles className="h-5 w-5" style={{ color: '#1710E6' }} />
          </motion.div>
          <h3 className="font-semibold text-foreground text-sm">AI Recommendations</h3>
        </motion.div>

        <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="visible">
          {recommendations.map((rec, i) => (
            <motion.button
              key={rec.id}
              variants={fadeUp}
              custom={i}
              onClick={() => onRecommendationClick(rec)}
              whileHover={{ scale: 1.018, borderColor: '#1710E6' }}
              whileTap={{ scale: 0.97 }}
              className="w-full p-4 rounded-sm bg-card border border-border hover:bg-muted transition-colors duration-200 text-left group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-foreground transition-colors"
                  style={{ color: undefined }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#1710E6')}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}
                >
                  {rec.title}
                </h4>
                {rec.impact > 0
                  ? <TrendingDown className="h-4 w-4 flex-shrink-0" style={{ color: '#8DC651' }} />
                  : <TrendingUp   className="h-4 w-4 flex-shrink-0" style={{ color: '#e88c1a' }} />
                }
              </div>
              <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium"
                style={
                  rec.impact > 0
                    ? { background: 'rgba(141,198,81,0.15)', color: '#0e0e12', border: '1px solid rgba(141,198,81,0.4)' }
                    : { background: 'rgba(232,140,26,0.1)', color: '#e88c1a', border: '1px solid rgba(232,140,26,0.3)' }
                }
              >
                {rec.impact > 0 ? '-' : '+'}{Math.abs(rec.impact).toFixed(2)} bias
              </motion.div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
