import { useEffect, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import * as txApi from '../api/transactions';
import * as accountApi from '../api/accounts';
import type { Account } from '../types';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { ArrowLeftRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const TransferVaultScene = lazy(() =>
  import('../components/3d/VaultScene').then(m => ({ default: m.TransferVaultScene }))
);

export default function Transfer() {
  const { settings } = useSettings();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm]         = useState({ sourceAccountId: '', destinationAccountId: '', amount: '', description: '' });
  const [loading, setLoading]   = useState(false);
  const [state, setState]       = useState<'form' | 'success' | 'error'>('form');
  const [errMsg, setErrMsg]     = useState('');
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    accountApi.getAccounts(0, 20).then(r => setAccounts(r.data.content.filter(a => a.status === 'ACTIVE')));
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setStreaming(true);
    try {
      await txApi.transfer(parseInt(form.sourceAccountId), parseInt(form.destinationAccountId), parseFloat(form.amount), form.description || undefined);
      setState('success');
    } catch (err: any) {
      setErrMsg(err.response?.data?.message || 'Transfer failed');
      setState('error'); setStreaming(false);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative animate-page-in zone-terra" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="transfer" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-2xl mx-auto">
        <PageHero title="Transfer|Funds" subtitle="Move money between accounts with atomic security"
          badge="Secure Transfer" character="specialist" mood="point" page="transfer" minHeight="155px" />

        {!settings.disable3D && (
          <GlassCard className="p-0 overflow-hidden h-44" hover={false}>
            <Suspense fallback={null}>
              <TransferVaultScene streaming={streaming} amount={parseFloat(form.amount) || 1000} />
            </Suspense>
          </GlassCard>
        )}

        <GlassCard className="p-7 accent-band-terra" hover={false}>
          {state === 'success' ? (
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-breathe"
                style={{ background: 'rgba(156,175,136,0.20)', border: '1px solid rgba(156,175,136,0.35)' }}>
                <CheckCircle size={32} style={{ color: '#7A8F68' }} />
              </div>
              <h3 className="text-xl font-black mb-2" style={{ color: '#3F4A3D' }}>Transfer Successful!</h3>
              <p className="text-sm mb-5" style={{ color: '#9A9285' }}>₹{parseFloat(form.amount).toLocaleString('en-IN')} transferred.</p>
              <button onClick={() => { setState('form'); setStreaming(false); setForm({ sourceAccountId: '', destinationAccountId: '', amount: '', description: '' }); }}
                className="ebtn ebtn-sage">New Transfer</button>
            </motion.div>
          ) : state === 'error' ? (
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(169,113,78,0.15)', border: '1px solid rgba(169,113,78,0.30)' }}>
                <AlertCircle size={32} style={{ color: '#7D5239' }} />
              </div>
              <h3 className="text-xl font-black mb-2" style={{ color: '#3F4A3D' }}>Transfer Failed</h3>
              <p className="text-sm mb-5" style={{ color: '#9A9285' }}>{errMsg}</p>
              <button onClick={() => { setState('form'); setStreaming(false); }} className="ebtn ebtn-ghost">Try Again</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#3F4A3D,#566154)', boxShadow: '0 4px 12px rgba(63,74,61,0.30)' }}>
                  <ArrowLeftRight size={17} style={{ color: '#F5F0E6' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#3F4A3D' }}>Atomic Fund Transfer</p>
                  <p className="text-[11px]" style={{ color: '#9A9285' }}>Rolls back completely if either account has issues</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>From Account</label>
                <select value={form.sourceAccountId} onChange={e => set('sourceAccountId', e.target.value)} required className="einput">
                  <option value="">Select source account</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.accountNumber} — ₹{a.balance.toLocaleString('en-IN')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>Destination Account ID</label>
                <input type="number" required value={form.destinationAccountId} onChange={e => set('destinationAccountId', e.target.value)}
                  placeholder="Account ID" className="einput" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color: '#9A9285' }}>₹</span>
                  <input type="number" min="0.01" step="0.01" required value={form.amount} onChange={e => set('amount', e.target.value)}
                    placeholder="0.00" className="einput pl-8" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>
                  Description <span className="normal-case font-normal">(optional)</span>
                </label>
                <input type="text" value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="e.g. Rent payment" className="einput" />
              </div>
              <motion.button whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }}
                type="submit" disabled={loading} className="ebtn ebtn-olive w-full justify-center"
                style={{ opacity: loading ? 0.65 : 1 }}>
                {loading ? 'Transferring...' : 'Transfer Funds'}
              </motion.button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
