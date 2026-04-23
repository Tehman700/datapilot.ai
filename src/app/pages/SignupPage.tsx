import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
const SERIF = "'Instrument Serif', Georgia, serif";
const BLUE = '#1710E6';
const LIME = '#8DC651';
const INK = '#0e0e12';
const PAPER = '#f6f4ef';

const CHIPS = [
  { label: '1M rows / 6s',  top: '13%',  right: '5%',  rotate: '5deg',  bg: LIME,  color: INK,   border: 'none',                serif: false },
  { label: 'AI-powered',    top: '16%',  left: '4%',   rotate: '-5deg', bg: '#fff', color: INK,   border: `1.5px solid ${INK}`,  serif: false },
  { label: 'beautifully',   bottom: '18%', right: '6%', rotate: '-3deg', bg: BLUE,  color: PAPER, border: 'none',                serif: true  },
  { label: 'zero bias ✓',  bottom: '12%', left: '6%',  rotate: '4deg',  bg: INK,   color: PAPER, border: 'none',                serif: false },
];

function strength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const levels = [
    { label: 'Too short', color: '#d4183d' },
    { label: 'Weak',      color: '#e88c1a' },
    { label: 'Fair',      color: '#d4a017' },
    { label: 'Good',      color: LIME },
    { label: 'Strong',    color: BLUE },
  ];
  return { score: s, ...levels[s] };
}

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

export default function SignupPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const pw = strength(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const user = await signup(name.trim(), email, password);
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: PAPER, border: '1px solid rgba(14,14,18,0.22)',
    borderRadius: 4, color: INK, fontFamily: MONO,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontFamily: MONO, fontSize: 10,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: '#6b6458', marginBottom: 8,
  };
  const focus  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = BLUE; };
  const blur   = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(14,14,18,0.22)'; };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: '100vh', background: PAPER, color: INK,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: MONO, padding: '32px 0',
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
          <span style={{ width: 12, height: 12, borderRadius: 999, background: LIME, display: 'inline-block' }} />
          <span>Create&nbsp;account</span>
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
          padding: '48px',
          boxShadow: '6px 6px 0 0 rgba(14,14,18,0.07)',
        }}
      >
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 38 }}>
          <div style={{
            width: 30, height: 30, background: BLUE, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: PAPER, fontSize: 11, fontWeight: 600, fontFamily: MONO }}>dp</span>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK }}>
            Datapilot AI
          </span>
        </div>

        {/* Kicker */}
        <div style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: '#6b6458', marginBottom: 16,
        }}>
          — get started —
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: SERIF, fontWeight: 400,
          fontSize: 50, lineHeight: 1.05,
          letterSpacing: '-0.025em', color: INK,
          margin: '0 0 36px',
        }}>
          Create{' '}
          <em style={{ fontStyle: 'italic', color: LIME }}>account</em>
          <span style={{ color: BLUE }}>.</span>
        </h1>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}
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

        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Jane Smith" style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <label style={lbl}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPw ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ ...inputStyle, padding: '12px 44px 12px 14px' }}
              onFocus={focus} onBlur={blur} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6458', padding: 0, display: 'flex' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Strength bar */}
        <AnimatePresence>
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}
            >
              <div style={{ display: 'flex', gap: 4, marginTop: 8, marginBottom: 4 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i < pw.score ? pw.color : 'rgba(14,14,18,0.1)',
                    transition: 'background 0.25s',
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: pw.color, fontFamily: MONO, fontWeight: 500 }}>{pw.label}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm */}
        <div style={{ marginBottom: 28 }}>
          <label style={lbl}>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showCf ? 'text' : 'password'} value={confirm}
              onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && submit(e as any)}
              style={{
                ...inputStyle,
                padding: '12px 72px 12px 14px',
                borderColor: confirm && confirm !== password
                  ? 'rgba(212,24,61,0.5)'
                  : confirm && confirm === password
                  ? LIME
                  : 'rgba(14,14,18,0.22)',
              }}
              onFocus={focus}
              onBlur={e => {
                e.target.style.borderColor = confirm && confirm !== password
                  ? 'rgba(212,24,61,0.5)'
                  : confirm && confirm === password ? LIME : 'rgba(14,14,18,0.22)';
              }}
            />
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <AnimatePresence>
                {confirm && confirm === password && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }} transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Check size={14} color={LIME} />
                  </motion.div>
                )}
              </AnimatePresence>
              <button type="button" onClick={() => setShowCf(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6458', padding: 0, display: 'flex' }}>
                {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
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
                style={{ display: 'block', width: 14, height: 14, border: '2px solid rgba(246,244,239,0.3)', borderTopColor: PAPER, borderRadius: '50%' }}
              />
              Creating account...
            </>
          ) : (
            <>Create Account <ArrowRight size={14} /></>
          )}
        </motion.button>

        <p style={{
          textAlign: 'center', fontFamily: MONO, fontSize: 12,
          color: '#6b6458', marginTop: 22, marginBottom: 0,
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: BLUE, textDecoration: 'none', borderBottom: `1px solid ${BLUE}`, lineHeight: 1.4 }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
