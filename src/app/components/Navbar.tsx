import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { TrendingDown, AlertTriangle, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  biasScore: number;
  genderBias: number;
  dataImbalance: number;
  confidence: number;
  biasHistory: number[];
}

function AnimatedNumber({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const mv     = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 80, damping: 18 });
  const display = useTransform(spring, v => v.toFixed(decimals));
  useEffect(() => { mv.set(value); }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

const chipVariants = {
  hidden:  { opacity: 0, y: -12, scale: 0.9 },
  visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Navbar({ biasScore, genderBias, dataImbalance, confidence, biasHistory }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();

  const getBiasLevel = (score: number) => {
    if (score < 0.3) return { label: 'Low Risk',      color: '#10B981' };
    if (score < 0.7) return { label: 'Moderate Risk', color: '#F59E0B' };
    return              { label: 'High Risk',      color: '#EF4444' };
  };
  const biasLevel = getBiasLevel(biasScore);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="sticky top-0 z-50 h-[72px] border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="flex h-full items-center justify-between px-8">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <motion.div className="flex items-center gap-2"
            whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#A3E635] to-[#10B981] flex items-center justify-center"
              whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}
              style={{ boxShadow: '0 0 20px rgba(163,230,53,0.3)' }}
            >
              <AlertTriangle className="h-5 w-5 text-[#0A0A0A]" />
            </motion.div>
            <div>
              <div className="text-sm text-foreground font-semibold">Bias Detector</div>
              <div className="text-xs text-muted-foreground">census_data.csv</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Center */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex items-center gap-6"
        >
          <div className="flex flex-col items-center">
            <motion.div
              key={biasScore}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-4xl font-bold" style={{ color: biasLevel.color }}
            >
              <AnimatedNumber value={biasScore} />
            </motion.div>
            <div className="text-sm text-muted-foreground mt-1">{biasLevel.label}</div>
          </div>

          {/* Sparkline */}
          <div className="flex items-end gap-1 h-12">
            {biasHistory.map((value, i) => (
              <motion.div
                key={i}
                className="w-2 bg-[#A3E635] rounded-t"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ height: `${value * 48}px`, opacity: 0.35 + (i / biasHistory.length) * 0.65, transformOrigin: 'bottom' }}
                transition={{ delay: i * 0.06 + 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
        </motion.div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {[
            { label: 'Gender Bias', value: genderBias,     decimals: 2 },
            { label: 'Imbalance',   value: dataImbalance,  decimals: 2 },
            { label: 'Confidence',  value: confidence,      decimals: 0, suffix: '%' },
          ].map((chip, i) => (
            <motion.div
              key={chip.label}
              custom={i}
              variants={chipVariants}
              initial="hidden"
              animate="visible"
              className="px-4 py-2 rounded-full bg-muted border border-border"
            >
              <span className="text-xs text-muted-foreground">{chip.label}:</span>
              <span className="ml-2 text-sm font-semibold text-[#A3E635]">
                <AnimatedNumber value={chip.value} decimals={chip.decimals} />
                {chip.suffix}
              </span>
            </motion.div>
          ))}

          {/* User greeting */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-xs text-muted-foreground hidden lg:block"
            >
              Hey, <span className="text-foreground font-medium capitalize">{user.name}</span>
            </motion.div>
          )}

          {/* Theme toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center hover:border-[#A3E635] hover:bg-[#A3E635]/10 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </motion.div>
          </motion.button>

          {/* Logout */}
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-colors duration-200"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
