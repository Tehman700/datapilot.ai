import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
const SERIF = "'Instrument Serif', Georgia, serif";
const BLUE = '#1710E6';
const LIME = '#8DC651';
const INK = '#0e0e12';
const PAPER = '#f6f4ef';

const CHIPS = [
  { label: 'normalize ✓',  top: '14%',  left: '5%',  rotate: '-6deg', bg: '#fff',  color: INK,   border: `1.5px solid ${INK}`, serif: false },
  { label: 'dedupe 9,412', top: '19%',  right: '6%', rotate: '5deg',  bg: LIME,    color: INK,   border: 'none',                serif: false },
  { label: 'clean data',   bottom: '22%', left: '7%', rotate: '3deg',  bg: BLUE,    color: PAPER, border: 'none',                serif: true  },
  { label: 'enrich · ✨', bottom: '15%', right: '5%', rotate: '-4deg', bg: INK,     color: PAPER, border: 'none',                serif: false },
];

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', color: BLUE }}>
      {pad(now.getHours())} {pad(now.getMinutes())} {pad(now.getSeconds())}
    </span>
  );
}

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try { await login(email, password); navigate('/dashboard'); }
    catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: PAPER, border: '1px solid rgba(14,14,18,0.22)',
    borderRadius: 4, color: INK, fontFamily: MONO,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: '100vh', background: PAPER, color: INK,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', fontFamily: MONO,
      }}
    >
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', fontFamily: MONO, fontSize: 13,
        letterSpacing: '0.04em', color: INK,
        borderBottom: '1px solid rgba(14,14,18,0.1)',
        background: PAPER,
      }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Datapilot&nbsp;AI</span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', border: `1.5px solid ${INK}`,
          padding: '5px 14px 5px 8px', borderRadius: 999, fontSize: 12,
        }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: BLUE, display: 'inline-block' }} />
          <span>Sign&nbsp;in</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13 }}>
          <LiveClock />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: LIME, display: 'inline-block' }} />
            Open for work
          </span>
        </div>
      </div>

      {/* Floating chips */}
      {CHIPS.map((chip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.12, duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          style={{
            position: 'absolute',
            top: chip.top, left: chip.left,
            bottom: (chip as any).bottom, right: (chip as any).right,
            padding: '10px 18px', borderRadius: 999,
            background: chip.bg, color: chip.color,
            border: chip.border,
            fontFamily: chip.serif ? SERIF : MONO,
            fontStyle: chip.serif ? 'italic' : 'normal',
            fontSize: chip.serif ? 17 : 14,
            transform: `rotate(${chip.rotate})`,
            boxShadow: '0 8px 24px rgba(14,14,18,0.08)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}
        >
          {chip.label}
        </motion.div>
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 440, margin: '80px 24px 0',
          background: '#fff',
          border: `1.5px solid ${INK}`,
          borderRadius: 6,
          padding: '52px 48px',
          boxShadow: '6px 6px 0 0 rgba(14,14,18,0.07)',
        }}
      >
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 42 }}>
          <div style={{
            width: 30, height: 30, background: BLUE, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: PAPER, fontSize: 11, fontWeight: 600, fontFamily: MONO }}>dp</span>
          </div>
          <span style={{
            fontFamily: MONO, fontSize: 12, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: INK,
          }}>
            Datapilot AI
          </span>
        </div>

        {/* Kicker */}
        <div style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: '#6b6458', marginBottom: 18,
        }}>
          — sign in to continue —
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: SERIF, fontWeight: 400,
          fontSize: 54, lineHeight: 1.05,
          letterSpacing: '-0.025em', color: INK,
          margin: '0 0 42px',
        }}>
          Welcome{' '}
          <em style={{ fontStyle: 'italic', color: BLUE }}>back</em>
          <span style={{ color: BLUE }}>.</span>
        </h1>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 16 }}
            >
              <div style={{
                padding: '10px 14px', borderRadius: 4,
                background: 'rgba(212,24,61,0.06)', border: '1px solid rgba(212,24,61,0.3)',
                color: '#d4183d', fontSize: 12, fontFamily: MONO,
              }}>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block', fontFamily: MONO, fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#6b6458', marginBottom: 8,
          }}>
            Email Address
          </label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = BLUE; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(14,14,18,0.22)'; }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{
              fontFamily: MONO, fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6458',
            }}>
              Password
            </label>
            <a href="#" style={{
              fontFamily: MONO, fontSize: 11, color: BLUE, textDecoration: 'none',
              borderBottom: `1px solid ${BLUE}`, lineHeight: 1.4,
            }}>
              Forgot?
            </a>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && submit(e as any)}
              style={{ ...inputStyle, padding: '12px 44px 12px 14px' }}
              onFocus={e => { e.target.style.borderColor = BLUE; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(14,14,18,0.22)'; }}
            />
            <button type="button" onClick={() => setShow(v => !v)}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: '#6b6458',
                padding: 0, display: 'flex',
              }}
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          onClick={submit} disabled={loading}
          whileHover={!loading ? { scale: 1.02, boxShadow: '0 6px 28px rgba(23,16,230,0.28)' } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          style={{
            width: '100%', height: 50,
            background: loading ? 'rgba(23,16,230,0.55)' : BLUE,
            border: 'none', borderRadius: 4,
            color: PAPER, fontSize: 13, fontFamily: MONO,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            letterSpacing: '0.06em', boxShadow: '0 4px 20px rgba(23,16,230,0.2)',
            transition: 'background 0.15s',
          }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                style={{
                  display: 'block', width: 14, height: 14,
                  border: '2px solid rgba(246,244,239,0.3)',
                  borderTopColor: PAPER, borderRadius: '50%',
                }}
              />
              Signing in...
            </>
          ) : (
            <>Sign in <ArrowRight size={14} /></>
          )}
        </motion.button>

        <p style={{
          textAlign: 'center', fontFamily: MONO, fontSize: 12,
          color: '#6b6458', marginTop: 24, marginBottom: 0,
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{
            color: BLUE, textDecoration: 'none',
            borderBottom: `1px solid ${BLUE}`, lineHeight: 1.4,
          }}>
            Create one
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
