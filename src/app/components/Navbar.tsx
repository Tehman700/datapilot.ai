import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
const SERIF = "'Instrument Serif', Georgia, serif";
const BLUE = '#1710E6';
const LIME = '#8DC651';
const INK = '#0e0e12';
const PAPER = '#f6f4ef';

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

function LiveClock({ dark = false }: { dark?: boolean }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <span style={{
      fontVariantNumeric: 'tabular-nums',
      color: dark ? LIME : BLUE,
      fontFamily: MONO, fontSize: 13,
    }}>
      {pad(now.getHours())} {pad(now.getMinutes())} {pad(now.getSeconds())}
    </span>
  );
}

export function Navbar({ biasScore, genderBias, dataImbalance, confidence, biasHistory }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const isDark              = theme === 'dark';

  const fg     = isDark ? PAPER : INK;
  const bg     = isDark ? INK   : PAPER;
  const pillBg = isDark ? 'rgba(246,244,239,0.04)' : '#fff';
  const pillBorder = isDark ? 'rgba(246,244,239,0.22)' : INK;
  const chipBorder = isDark ? 'rgba(246,244,239,0.18)' : 'rgba(14,14,18,0.2)';

  const getBiasRisk = (score: number) => {
    if (score < 0.3) return { label: 'Low Risk',      color: LIME };
    if (score < 0.7) return { label: 'Moderate Risk', color: '#e88c1a' };
    return              { label: 'High Risk',      color: '#d4183d' };
  };
  const risk = getBiasRisk(biasScore);

  const handleLogout = () => { logout(); navigate('/login'); };

  const btnStyle: React.CSSProperties = {
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent',
    border: `1px solid ${chipBorder}`,
    borderRadius: 4,
    color: isDark ? 'rgba(246,244,239,0.6)' : '#6b6458',
    cursor: 'pointer', padding: 0,
    transition: 'border-color 0.15s, color 0.15s',
    fontFamily: MONO,
  };

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50, height: 64,
      background: bg, borderBottom: `1px solid ${isDark ? 'rgba(246,244,239,0.1)' : 'rgba(14,14,18,0.1)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', fontFamily: MONO,
      transition: 'background 0.3s, border-color 0.3s',
    }}>

      {/* Left — brand + file */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <motion.div
          whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 300 }}
          style={{
            width: 30, height: 30, background: BLUE, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 0 16px rgba(23,16,230,0.25)',
          }}
        >
          <span style={{ color: PAPER, fontSize: 10, fontWeight: 600, fontFamily: MONO }}>dp</span>
        </motion.div>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: fg, fontWeight: 600 }}>
            Datapilot AI
          </div>
          <div style={{ fontSize: 11, color: isDark ? 'rgba(246,244,239,0.45)' : '#6b6458', letterSpacing: '0.04em' }}>
            census_data.csv
          </div>
        </div>
      </motion.div>

      {/* Center — bias score pill + sparkline */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        style={{ display: 'flex', alignItems: 'center', gap: 14 }}
      >
        {/* Status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 9,
          background: pillBg, border: `1.5px solid ${pillBorder}`,
          padding: '6px 14px 6px 9px', borderRadius: 999, fontSize: 13,
          color: fg,
        }}>
          <motion.span
            key={risk.label}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.4 }}
            style={{
              width: 12, height: 12, borderRadius: 999,
              background: risk.color, display: 'inline-block', flexShrink: 0,
            }}
          />
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, letterSpacing: '0.02em' }}>
            <AnimatedNumber value={biasScore} />
          </span>
          <span style={{ color: isDark ? 'rgba(246,244,239,0.5)' : '#6b6458', fontSize: 11, letterSpacing: '0.04em' }}>
            {risk.label}
          </span>
        </div>

        {/* Sparkline */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
          {biasHistory.map((v, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.05 + 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 6, borderRadius: '2px 2px 0 0',
                height: `${v * 28}px`,
                background: LIME,
                opacity: 0.3 + (i / biasHistory.length) * 0.7,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right — metric chips + user + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {[
          { label: 'Gender', value: genderBias,    decimals: 2 },
          { label: 'Imbal.',  value: dataImbalance, decimals: 2 },
          { label: 'Conf.',   value: confidence,    decimals: 0, suffix: '%' },
        ].map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 + 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '5px 10px', borderRadius: 4,
              border: `1px solid ${chipBorder}`,
              fontFamily: MONO, fontSize: 12,
              color: isDark ? 'rgba(246,244,239,0.8)' : INK,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ color: isDark ? 'rgba(246,244,239,0.45)' : '#6b6458' }}>{chip.label}:</span>
            <span style={{ fontWeight: 600, color: BLUE, fontVariantNumeric: 'tabular-nums' }}>
              <AnimatedNumber value={chip.value} decimals={chip.decimals} />
              {chip.suffix}
            </span>
          </motion.div>
        ))}

        {/* Live clock */}
        <div style={{
          padding: '5px 10px', borderRadius: 4,
          border: `1px solid ${chipBorder}`,
          fontSize: 12, display: 'flex', alignItems: 'center',
        }}>
          <LiveClock dark={isDark} />
        </div>

        {/* User */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            style={{
              fontSize: 12, color: isDark ? 'rgba(246,244,239,0.55)' : '#6b6458',
              fontFamily: MONO, paddingLeft: 4,
            }}
          >
            Hey,{' '}
            <span style={{ color: fg, fontWeight: 600, textTransform: 'capitalize' }}>{user.name}</span>
          </motion.div>
        )}

        {/* Theme toggle */}
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          whileHover={{ borderColor: BLUE, color: BLUE }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          style={btnStyle}
          aria-label="Toggle theme"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </motion.div>
        </motion.button>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          whileHover={{ borderColor: '#d4183d', color: '#d4183d' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          style={btnStyle}
          aria-label="Logout"
        >
          <LogOut size={14} />
        </motion.button>
      </div>
    </div>
  );
}
