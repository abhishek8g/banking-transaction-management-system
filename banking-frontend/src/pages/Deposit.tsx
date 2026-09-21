import { useEffect, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import * as txApi from '../api/transactions';
import * as accountApi from '../api/accounts';
import type { Account } from '../types';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DepositVaultScene = lazy(() =>
  import('../components/3d/VaultScene').then(m => ({ default: m.DepositVaultScene }))
);

export default function Deposit() {
  const { settings } = useSettings();
  const [accounts, setAccounts]   = useState<Account[]>([]);
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [state, setState]         = useState<'form' | 'success' | 'error'>('form');
  const [errMsg, setErrMsg]       = useState('');
  const [vaultOpen, setVaultOpen] = useState(false);

  useEffect(() => {
    accountApi.getAccounts(0, 20).then(r => setAccounts(r.data.content.filter(a => a.status === 'ACTIVE')));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setVaultOpen(true);
    try { await txApi.deposit(parseInt(accountId), parseFloat(amount)); setState('success'); }
    catch (err: any) { setErrMsg(err.response?.data?.message || 'Deposit failed'); setState('error'); setVaultOpen(false); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative animate-page-in zone-sage" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="deposit" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-lg mx-auto">
        <PageHero title="Deposit|Funds" subtitle="Add money to your vault instantly"
          badge="Instant Deposit" character="specialist" mood="point" page="deposit" minHeight="150px" />

        {!settings.disable3D && (
          <GlassCard className="p-0 overflow-hidden h-44" hover={false}>
            <Suspense fallback={null}>
              <DepositVaultScene open={vaultOpen} amount={parseFloat(amount) || 0} />
            </Suspense>
          </GlassCard>
        )}

        <GlassCard className="p-7 accent-band-sage" hover={false}>
          {state === 'success' ? (
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-breathe"
                style={{ background: 'rgba(156,175,136,0.20)', border: '1px solid rgba(156,175,136,0.35)' }}>
                <CheckCircle size={32} style={{ color: '#7A8F68' }} />
              </div>
              <h3 className="text-xl font-black mb-2" style={{ color: '#3F4A3D' }}>Deposit Successful!</h3>
              <p className="text-sm mb-5" style={{ color: '#9A9285' }}>₹{parseFloat(amount).toLocaleString('en-IN')} deposited to your vault.</p>
              <button onClick={() => { setState('form'); setVaultOpen(false); setAmount(''); }} className="ebtn ebtn-sage">New Deposit</button>
            </motion.div>
          ) : state === 'error' ? (
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(169,113,78,0.15)', border: '1px solid rgba(169,113,78,0.30)' }}>
                <AlertCircle size={32} style={{ color: '#7D5239' }} />
              </div>
              <h3 className="text-xl font-black mb-2" style={{ color: '#3F4A3D' }}>Deposit Failed</h3>
              <p className="text-sm mb-5" style={{ color: '#9A9285' }}>{errMsg}</p>
              <button onClick={() => setState('form')} className="ebtn ebtn-ghost">Try Again</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#9CAF88,#7A8F68)', boxShadow: '0 4px 12px rgba(156,175,136,0.40)' }}>
                  <TrendingUp size={17} style={{ color: '#F5F0E6' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#3F4A3D' }}>Add Funds to Vault</p>
                  <p className="text-[11px]" style={{ color: '#9A9285' }}>Instantly credited, securely stored</p>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>Select Account</label>
                <select value={accountId} onChange={e => setAccountId(e.target.value)} required className="einput">
                  <option value="">Select account</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.accountNumber} — ₹{a.balance.toLocaleString('en-IN')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color: '#9A9285' }}>₹</span>
                  <input type="number" min="0.01" step="0.01" required autoFocus value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" className="einput pl-8" />
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }}
                type="submit" disabled={loading} className="ebtn ebtn-sage w-full justify-center" style={{ opacity: loading ? 0.65 : 1 }}>
                {loading ? 'Depositing...' : 'Deposit Funds'}
              </motion.button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
