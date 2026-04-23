import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BLOBS = [
  { left: '70%', top: '-12%', w: 580, h: 480, color: '#10B981', dur: 24 },
  { left: '-10%', top: '50%',  w: 500, h: 400, color: '#A3E635', dur: 20 },
  { left: '40%', top: '75%',   w: 380, h: 320, color: '#10B981', dur: 16 },
];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 11.9 + 7) % 94}%`,
  top:  `${(i * 16.1 + 12) % 90}%`,
  size: 1 + (i % 3) * 0.8,
  dur:  5 + (i % 9) * 1.4,
  delay: (i % 8) * 0.65,
  opacity: 0.06 + (i % 5) * 0.06,
}));

function strength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const levels = [
    { label: 'Too short', color: '#EF4444' },
    { label: 'Weak',      color: '#F97316' },
    { label: 'Fair',      color: '#F59E0B' },
    { label: 'Good',      color: '#84CC16' },
    { label: 'Strong',    color: '#10B981' },
  ];
  return { score: s, ...levels[s] };
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
    try { await signup(name.trim(), email, password); navigate('/dashboard'); }
    catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } };
  const item    = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } };

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: '#E4E4E7',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  };
  const focus  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(163,230,53,0.42)'; e.target.style.background = 'rgba(163,230,53,0.015)'; };
  const blur   = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#71717A', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '9px' };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '32px 0' }}
    >
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(16,185,129,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.028) 1px,transparent 1px)`, backgroundSize: '52px 52px' }} />

      {BLOBS.map((b, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: b.left, top: b.top, width: b.w, height: b.h, background: `radial-gradient(ellipse, ${b.color}11 0%, transparent 68%)`, filter: 'blur(70px)', borderRadius: '50%' }}
          animate={{ x: [0, -22, 16, -8, 0], y: [0, 30, -18, 10, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.2) 25%, rgba(16,185,129,0.5) 50%, rgba(16,185,129,0.2) 75%, transparent 100%)' }}
        animate={{ top: ['101%', '-1%'] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />

      {PARTICLES.map(p => (
        <motion.div key={p.id}
          style={{ position: 'absolute', left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: '50%', background: '#10B981', opacity: p.opacity }}
          animate={{ opacity: [p.opacity, p.opacity * 3.5, p.opacity], scale: [1, 1.8, 1] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 52, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: '444px', margin: '0 24px',
          background: 'rgba(9,9,9,0.9)',
          backdropFilter: 'blur(36px) saturate(1.4)',
          border: '1px solid rgba(16,185,129,0.12)',
          borderRadius: '26px', padding: '48px',
          boxShadow: '0 0 0 1px rgba(16,185,129,0.03), 0 48px 96px rgba(0,0,0,0.75)',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}
        >
          <motion.div whileHover={{ scale: 1.12, rotate: -8 }} transition={{ type: 'spring', stiffness: 300 }}
            style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, #10B981 0%, #A3E635 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(16,185,129,0.38)' }}
          >
            <AlertTriangle style={{ width: '21px', height: '21px', color: '#0A0A0A' }} />
          </motion.div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#EFEFEF', letterSpacing: '-0.025em', lineHeight: 1.2 }}>DataPilot AI</div>
            <div style={{ fontSize: '10px', color: '#3F3F46', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px' }}>Bias Detection Platform</div>
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={item} style={{ fontSize: '29px', fontWeight: 700, color: '#F4F4F5', marginBottom: '6px', letterSpacing: '-0.032em', lineHeight: 1.15 }}>
            Create your account
          </motion.h1>
          <motion.p variants={item} style={{ fontSize: '14px', color: '#52525B', marginBottom: '34px', lineHeight: 1.5 }}>
            Start detecting and eliminating data bias today
          </motion.p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: '13px' }}>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name */}
          <motion.div variants={item} style={{ marginBottom: '14px' }}>
            <label style={lbl}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
              style={inputBase} onFocus={focus} onBlur={blur} />
          </motion.div>

          {/* Email */}
          <motion.div variants={item} style={{ marginBottom: '14px' }}>
            <label style={lbl}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={inputBase} onFocus={focus} onBlur={blur} />
          </motion.div>

          {/* Password */}
          <motion.div variants={item} style={{ marginBottom: '8px' }}>
            <label style={lbl}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={{ ...inputBase, padding: '12px 48px 12px 16px' }} onFocus={focus} onBlur={blur} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0, display: 'flex' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </motion.div>

          {/* Strength bar */}
          <AnimatePresence>
            {password.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px', marginBottom: '4px' }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < pw.score ? pw.color : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: pw.color, fontWeight: 500 }}>{pw.label}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm */}
          <motion.div variants={item} style={{ marginBottom: '28px' }}>
            <label style={lbl}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showCf ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && submit(e as any)}
                style={{ ...inputBase, padding: '12px 48px 12px 16px', borderColor: confirm && confirm !== password ? 'rgba(239,68,68,0.4)' : confirm && confirm === password ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)' }}
                onFocus={focus} onBlur={blur} />
              <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <AnimatePresence>
                  {confirm && confirm === password && (
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Check size={14} color="#10B981" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button type="button" onClick={() => setShowCf(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0, display: 'flex' }}>
                  {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <motion.button
              onClick={submit} disabled={loading}
              whileHover={!loading ? { scale: 1.025, boxShadow: '0 8px 44px rgba(16,185,129,0.38)' } : {}}
              whileTap={!loading ? { scale: 0.975 } : {}}
              style={{
                width: '100%', height: '53px',
                background: loading ? 'rgba(16,185,129,0.55)' : '#10B981',
                border: 'none', borderRadius: '13px',
                color: '#070707', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 32px rgba(16,185,129,0.22)', letterSpacing: '-0.01em',
                transition: 'background 0.2s',
              }}
            >
              {loading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'block', width: '16px', height: '16px', border: '2.5px solid rgba(0,0,0,0.2)', borderTopColor: '#0A0A0A', borderRadius: '50%' }}
                  />
                  Creating account...
                </>
              ) : (
                <> Create Account <ArrowRight size={16} /> </>
              )}
            </motion.button>
          </motion.div>

          <motion.p variants={item} style={{ textAlign: 'center', fontSize: '13px', color: '#52525B', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#A3E635', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
