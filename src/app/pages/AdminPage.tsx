import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Plus, Trash2, ToggleLeft, ToggleRight, Sun, Moon, LogOut, LayoutDashboard, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';

const MONO  = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
const SERIF = "'Instrument Serif', Georgia, serif";
const BLUE  = '#1710E6';
const LIME  = '#8DC651';
const INK   = '#0e0e12';
const PAPER = '#f6f4ef';

const SERVICES = ['openai', 'anthropic', 'gemini', 'other'] as const;

interface APIKey {
  id: number;
  name: string;
  service: string;
  key_masked: string;
  is_active: boolean;
  created_at: string;
}

function ServiceBadge({ service }: { service: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    openai:    { bg: '#10a37f18', color: '#10a37f' },
    anthropic: { bg: '#d4700020', color: '#d47000' },
    gemini:    { bg: '#1710E618', color: BLUE },
    other:     { bg: 'rgba(14,14,18,0.07)', color: '#6b6458' },
  };
  const c = colors[service] ?? colors.other;
  return (
    <span style={{
      fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em',
      padding: '3px 8px', borderRadius: 3,
      background: c.bg, color: c.color,
      textTransform: 'uppercase',
    }}>
      {service}
    </span>
  );
}

export default function AdminPage() {
  const { user, logout, authFetch } = useAuth();
  const { theme, setTheme }         = useTheme();
  const navigate                    = useNavigate();
  const isDark                      = theme === 'dark';

  const [keys, setKeys]         = useState<APIKey[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formName,    setFormName]    = useState('');
  const [formService, setFormService] = useState<string>('other');
  const [formKey,     setFormKey]     = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError,   setFormError]   = useState('');

  const fg         = isDark ? PAPER : INK;
  const bg         = isDark ? INK   : PAPER;
  const cardBg     = isDark ? '#16161c' : '#fff';
  const borderCol  = isDark ? 'rgba(246,244,239,0.12)' : 'rgba(14,14,18,0.14)';
  const mutedColor = isDark ? '#8a8478' : '#6b6458';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 13px',
    background: isDark ? '#2a2a32' : PAPER,
    border: `1px solid ${borderCol}`,
    borderRadius: 4, color: fg, fontFamily: MONO,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const fetchKeys = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await authFetch('/api/admin/api-keys');
      if (!res.ok) throw new Error('Failed to load keys');
      setKeys(await res.json());
    } catch (e: any) {
      setError(e.message ?? 'Error loading keys');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formKey.trim()) { setFormError('All fields are required.'); return; }
    setFormLoading(true); setFormError('');
    try {
      const res = await authFetch('/api/admin/api-keys', {
        method: 'POST',
        body:   JSON.stringify({ name: formName, service: formService, key_value: formKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? 'Failed to add key');
      setKeys(prev => [data, ...prev]);
      setFormName(''); setFormService('other'); setFormKey('');
      setShowForm(false);
    } catch (e: any) {
      setFormError(e.message ?? 'Error adding key');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    const res = await authFetch(`/api/admin/api-keys/${id}/toggle`, { method: 'PATCH' });
    if (res.ok) {
      const { is_active } = await res.json();
      setKeys(prev => prev.map(k => k.id === id ? { ...k, is_active } : k));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this API key?')) return;
    const res = await authFetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
      setKeys(prev => prev.filter(k => k.id !== id));
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ minHeight: '100vh', background: bg, color: fg, fontFamily: MONO, transition: 'background 0.3s, color 0.3s' }}
    >
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50, height: 64,
        background: bg, borderBottom: `1px solid ${borderCol}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', transition: 'background 0.3s',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 30, height: 30, background: BLUE, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(23,16,230,0.25)',
          }}>
            <span style={{ color: PAPER, fontSize: 10, fontWeight: 600 }}>dp</span>
          </div>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Datapilot AI
            </div>
            <div style={{ fontSize: 10, color: mutedColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          </div>
        </div>

        {/* Center pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: isDark ? 'rgba(141,198,81,0.1)' : 'rgba(141,198,81,0.12)',
          border: `1.5px solid ${LIME}`,
          padding: '5px 14px 5px 9px', borderRadius: 999, fontSize: 12,
        }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: LIME, display: 'inline-block' }} />
          <span style={{ color: fg }}>Admin access</span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user && (
            <span style={{ fontSize: 12, color: mutedColor, marginRight: 4 }}>
              Hey, <strong style={{ color: fg }}>{user.name}</strong>
            </span>
          )}

          {/* To Dashboard */}
          <motion.button
            whileHover={{ borderColor: BLUE, color: BLUE }} whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
            title="Go to Dashboard"
            style={{ ...btnStyle(borderCol, mutedColor) }}
          >
            <LayoutDashboard size={14} />
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ borderColor: BLUE, color: BLUE }} whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{ ...btnStyle(borderCol, mutedColor) }}
            aria-label="Toggle theme"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </motion.div>
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ borderColor: '#d4183d', color: '#d4183d' }} whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            style={{ ...btnStyle(borderCol, mutedColor) }}
            aria-label="Logout"
          >
            <LogOut size={14} />
          </motion.button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 28px 100px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: mutedColor, marginBottom: 16,
          }}>
            — admin · api key management —
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h1 style={{
              fontFamily: SERIF, fontWeight: 400, fontSize: 56,
              lineHeight: 1.05, letterSpacing: '-0.025em', color: fg,
              margin: 0,
            }}>
              API <em style={{ fontStyle: 'italic', color: BLUE }}>Keys</em>
              <span style={{ color: BLUE }}>.</span>
            </h1>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(23,16,230,0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowForm(v => !v); setFormError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: showForm ? 'transparent' : BLUE,
                color: showForm ? fg : PAPER,
                border: `1.5px solid ${showForm ? borderCol : BLUE}`,
                borderRadius: 4, padding: '10px 18px',
                fontFamily: MONO, fontSize: 13, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Plus size={15} />
              {showForm ? 'Cancel' : 'Add New Key'}
            </motion.button>
          </div>
        </motion.div>

        {/* Add key form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <form
                onSubmit={handleAdd}
                style={{
                  background: cardBg,
                  border: `1.5px solid ${BLUE}`,
                  borderRadius: 6, padding: '28px 32px',
                  boxShadow: '0 4px 24px rgba(23,16,230,0.1)',
                }}
              >
                <div style={{
                  fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: mutedColor, marginBottom: 20,
                }}>
                  New key
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {/* Name */}
                  <div>
                    <label style={{ ...lblStyle(mutedColor) }}>Key Name</label>
                    <input
                      value={formName} onChange={e => setFormName(e.target.value)}
                      placeholder="e.g. OpenAI Production"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = BLUE}
                      onBlur={e => e.target.style.borderColor = borderCol}
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label style={{ ...lblStyle(mutedColor) }}>Service</label>
                    <select
                      value={formService} onChange={e => setFormService(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = BLUE}
                      onBlur={e => e.target.style.borderColor = borderCol}
                    >
                      {SERVICES.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Key value */}
                  <div>
                    <label style={{ ...lblStyle(mutedColor) }}>API Key Value</label>
                    <input
                      type="password" value={formKey}
                      onChange={e => setFormKey(e.target.value)}
                      placeholder="sk-..."
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = BLUE}
                      onBlur={e => e.target.style.borderColor = borderCol}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}
                    >
                      <div style={{
                        padding: '8px 12px', borderRadius: 4, fontFamily: MONO, fontSize: 12,
                        background: 'rgba(212,24,61,0.06)', border: '1px solid rgba(212,24,61,0.3)', color: '#d4183d',
                      }}>
                        {formError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit" disabled={formLoading}
                  whileHover={!formLoading ? { scale: 1.02 } : {}}
                  whileTap={!formLoading ? { scale: 0.98 } : {}}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: formLoading ? 'rgba(23,16,230,0.5)' : BLUE,
                    color: PAPER, border: 'none', borderRadius: 4,
                    padding: '10px 20px', fontFamily: MONO, fontSize: 13,
                    cursor: formLoading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  {formLoading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        style={{ display: 'block', width: 12, height: 12, border: '2px solid rgba(246,244,239,0.3)', borderTopColor: PAPER, borderRadius: '50%' }}
                      />
                      Saving...
                    </>
                  ) : (
                    <><Key size={13} /> Save Key</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keys list */}
        <div style={{ marginTop: 40 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: mutedColor, padding: '48px 0', fontFamily: MONO, fontSize: 13 }}>
              Loading keys...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#d4183d', padding: '48px 0', fontFamily: MONO, fontSize: 13 }}>
              {error}
            </div>
          ) : keys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                textAlign: 'center', padding: '64px 0',
                border: `1.5px dashed ${borderCol}`, borderRadius: 6,
              }}
            >
              <div style={{ fontFamily: SERIF, fontSize: 32, color: mutedColor, fontStyle: 'italic' }}>No keys yet.</div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: mutedColor, marginTop: 10 }}>
                Add your first API key above.
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
            >
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1.8fr 0.9fr 1.8fr 0.8fr 1fr',
                padding: '10px 20px',
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: mutedColor,
                borderBottom: `1px solid ${borderCol}`,
              }}>
                <span>Name</span>
                <span>Service</span>
                <span>Key</span>
                <span>Status</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
              </div>

              <AnimatePresence>
                {keys.map((k, i) => (
                  <motion.div
                    key={k.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    style={{
                      display: 'grid', gridTemplateColumns: '1.8fr 0.9fr 1.8fr 0.8fr 1fr',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: cardBg,
                      border: `1px solid ${borderCol}`,
                      borderTop: i === 0 ? `1px solid ${borderCol}` : 'none',
                      borderRadius: i === 0 ? '4px 4px 0 0' : i === keys.length - 1 ? '0 0 4px 4px' : 0,
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Name */}
                    <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: fg }}>
                      {k.name}
                    </span>

                    {/* Service */}
                    <span><ServiceBadge service={k.service} /></span>

                    {/* Masked key */}
                    <span style={{ fontFamily: MONO, fontSize: 12, color: mutedColor, letterSpacing: '0.06em' }}>
                      {k.key_masked}
                    </span>

                    {/* Status */}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 12 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: 999,
                        background: k.is_active ? LIME : borderCol,
                        display: 'inline-block', flexShrink: 0,
                      }} />
                      <span style={{ color: k.is_active ? LIME : mutedColor }}>
                        {k.is_active ? 'active' : 'paused'}
                      </span>
                    </span>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {/* Toggle */}
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggle(k.id)}
                        title={k.is_active ? 'Pause key' : 'Activate key'}
                        style={{
                          ...iconBtnStyle(borderCol, mutedColor),
                          color: k.is_active ? LIME : mutedColor,
                          borderColor: k.is_active ? `${LIME}66` : borderCol,
                        }}
                      >
                        {k.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      </motion.button>

                      {/* Delete */}
                      <motion.button
                        whileHover={{ scale: 1.1, borderColor: '#d4183d', color: '#d4183d' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(k.id)}
                        title="Delete key"
                        style={iconBtnStyle(borderCol, mutedColor)}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 60, fontFamily: MONO, fontSize: 11, color: mutedColor,
          borderTop: `1px solid ${borderCol}`, paddingTop: 20,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>© 2026 Datapilot AI · Admin Panel</span>
          <span>{keys.length} key{keys.length !== 1 ? 's' : ''} stored</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Style helpers ─────────────────────────────────────────────────────────── */

function btnStyle(borderCol: string, color: string): React.CSSProperties {
  return {
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: `1px solid ${borderCol}`,
    borderRadius: 4, color, cursor: 'pointer', padding: 0,
    transition: 'border-color 0.15s, color 0.15s',
    fontFamily: 'inherit',
  };
}

function iconBtnStyle(borderCol: string, color: string): React.CSSProperties {
  return {
    width: 30, height: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: `1px solid ${borderCol}`,
    borderRadius: 4, color, cursor: 'pointer', padding: 0,
    transition: 'border-color 0.15s, color 0.15s',
    fontFamily: 'inherit',
  };
}

function lblStyle(color: string): React.CSSProperties {
  return {
    display: 'block', fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    color, marginBottom: 7,
  };
}
