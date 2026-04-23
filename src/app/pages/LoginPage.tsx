import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BLOBS = [
  { left: '-8%', top: '-15%', w: 650, h: 550, color: '#A3E635', dur: 22 },
  { left: '65%', top: '45%',  w: 520, h: 420, color: '#10B981', dur: 28 },
  { left: '25%', top: '70%',  w: 420, h: 360, color: '#A3E635', dur: 17 },
];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 14.3 + 3) % 96}%`,
  top:  `${(i * 18.7 + 8) % 92}%`,
  size: 1 + (i % 3) * 0.8,
  dur:  5 + (i % 9) * 1.4,
  delay: (i % 8) * 0.65,
  opacity: 0.08 + (i % 5) * 0.06,
}));

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

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.38 } } };
  const item    = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } } };

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: '#E4E4E7',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(163,230,53,0.032) 1px,transparent 1px),linear-gradient(90deg,rgba(163,230,53,0.032) 1px,transparent 1px)`, backgroundSize: '52px 52px' }} />

      {/* Blobs */}
      {BLOBS.map((b, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: b.left, top: b.top, width: b.w, height: b.h, background: `radial-gradient(ellipse, ${b.color}12 0%, transparent 68%)`, filter: 'blur(70px)', borderRadius: '50%' }}
          animate={{ x: [0, 28, -18, 10, 0], y: [0, -35, 22, -12, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Scan line */}
      <motion.div
        style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(163,230,53,0.2) 25%, rgba(163,230,53,0.55) 50%, rgba(163,230,53,0.2) 75%, transparent 100%)' }}
        animate={{ top: ['-1%', '101%'] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
      />

      {/* Particles */}
      {PARTICLES.map(p => (
        <motion.div key={p.id}
          style={{ position: 'absolute', left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: '50%', background: '#A3E635', opacity: p.opacity }}
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
          border: '1px solid rgba(163,230,53,0.11)',
          borderRadius: '26px', padding: '52px 48px',
          boxShadow: '0 0 0 1px rgba(163,230,53,0.03), 0 48px 96px rgba(0,0,0,0.75)',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '46px' }}
        >
          <motion.div whileHover={{ scale: 1.12, rotate: 8 }} transition={{ type: 'spring', stiffness: 300 }}
            style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, #A3E635 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(163,230,53,0.38)' }}
          >
            <AlertTriangle style={{ width: '21px', height: '21px', color: '#0A0A0A' }} />
          </motion.div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#EFEFEF', letterSpacing: '-0.025em', lineHeight: 1.2 }}>DataPilot AI</div>
            <div style={{ fontSize: '10px', color: '#3F3F46', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px' }}>Bias Detection Platform</div>
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.h1 variants={item} style={{ fontSize: '31px', fontWeight: 700, color: '#F4F4F5', marginBottom: '7px', letterSpacing: '-0.033em', lineHeight: 1.15 }}>
            Welcome back
          </motion.h1>
          <motion.p variants={item} style={{ fontSize: '14px', color: '#52525B', marginBottom: '38px', lineHeight: 1.5 }}>
            Sign in to continue to your workspace
          </motion.p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', fontSize: '13px' }}>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={item} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#71717A', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '9px' }}>
              Email Address
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={inputBase}
              onFocus={e => { e.target.style.borderColor = 'rgba(163,230,53,0.42)'; e.target.style.background = 'rgba(163,230,53,0.015)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
            />
          </motion.div>

          <motion.div variants={item} style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#71717A', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Password</label>
              <a href="#" style={{ fontSize: '12px', color: '#A3E635', textDecoration: 'none', opacity: 0.75 }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && submit(e as any)}
                style={{ ...inputBase, padding: '13px 48px 13px 16px' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(163,230,53,0.42)'; e.target.style.background = 'rgba(163,230,53,0.015)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
              />
              <button type="button" onClick={() => setShow(v => !v)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 0, display: 'flex' }}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <motion.button
              onClick={submit} disabled={loading}
              whileHover={!loading ? { scale: 1.025, boxShadow: '0 8px 44px rgba(163,230,53,0.38)' } : {}}
              whileTap={!loading ? { scale: 0.975 } : {}}
              style={{
                width: '100%', height: '53px',
                background: loading ? 'rgba(163,230,53,0.55)' : '#A3E635',
                border: 'none', borderRadius: '13px',
                color: '#070707', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 32px rgba(163,230,53,0.22)', letterSpacing: '-0.01em',
                transition: 'background 0.2s',
              }}
            >
              {loading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'block', width: '16px', height: '16px', border: '2.5px solid rgba(0,0,0,0.2)', borderTopColor: '#0A0A0A', borderRadius: '50%' }}
                  />
                  Signing in...
                </>
              ) : (
                <> Sign In <ArrowRight size={16} /> </>
              )}
            </motion.button>
          </motion.div>

          <motion.p variants={item} style={{ textAlign: 'center', fontSize: '13px', color: '#52525B', marginTop: '26px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#A3E635', textDecoration: 'none', fontWeight: 600 }}>Create account</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
