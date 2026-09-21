import { useEffect, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import * as txApi from '../api/transactions';
import * as accountApi from '../api/accounts';
import type { Account } from '../types';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const WithdrawVaultScene = lazy(() =>
  import('../components/3d/VaultScene').then(m => ({ default: m.WithdrawVaultScene }))
);

export default function Withdraw() {
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

  const selectedAcc  = accounts.find(a => a.id === parseInt(accountId));
  const overBalance  = !!amount && !!selectedAcc && parseFloat(amount) > selectedAcc.balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setVaultOpen(true);
    try { await txApi.withdraw(parseInt(accountId), parseFloat(amount)); setState('success'); }
    catch (err: any) { setErrMsg(err.response?.data?.message || 'Withdrawal failed'); setState('error'); setVaultOpen(false); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative animate-page-in zone-terra" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="withdraw" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-lg mx-auto">
        <PageHero title="Withdraw|Funds" subtitle="Take money from your secure vault"
          badge="Secure Withdrawal" character="specialist" mood="wave" page="withdraw" minHeight="150px" />

        {!settings.disable3D && (
          <GlassCard className="p-0 overflow-hidden h-44" hover={false}>
            <Suspense fallback={null}>
              <WithdrawVaultScene open={vaultOpen} />
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
              <h3 className="text-xl font-black mb-2" style={{ color: '#3F4A3D' }}>Withdrawal Successful!</h3>
              <p className="text-sm mb-5" style={{ color: '#9A9285' }}>₹{parseFloat(amount).toLocaleString('en-IN')} withdrawn.</p>
              <button onClick={() => { setState('form'); setVaultOpen(false); setAmount(''); }} className="ebtn ebtn-terra">New Withdrawal</button>
            </motion.div>
          ) : state === 'error' ? (
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(169,113,78,0.15)', border: '1px solid rgba(169,113,78,0.30)' }}>
                <AlertCircle size={32} style={{ color: '#7D5239' }} />
              </div>
              <h3 className="text-xl font-black mb-2" style={{ color: '#3F4A3D' }}>Withdrawal Failed</h3>
              <p className="text-sm mb-5" style={{ color: '#9A9285' }}>{errMsg}</p>
              <button onClick={() => setState('form')} className="ebtn ebtn-ghost">Try Again</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#A9714E,#C4926D)', boxShadow: '0 4px 12px rgba(169,113,78,0.35)' }}>
                  <TrendingDown size={17} style={{ color: '#F5F0E6' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#3F4A3D' }}>Withdraw Cash</p>
                  <p className="text-[11px]" style={{ color: '#9A9285' }}>Balance verified before processing</p>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>Select Account</label>
                <select value={accountId} onChange={e => setAccountId(e.target.value)} required className="einput">
                  <option value="">Select account</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.accountNumber} — ₹{a.balance.toLocaleString('en-IN')}</option>)}
                </select>
              </div>
              {selectedAcc && (
                <div className="flex items-center justify-between p-3 rounded-xl text-[11px]"
                  style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(63,74,61,0.10)' }}>
                  <span style={{ color: '#9A9285' }}>Available Balance</span>
                  <span className="font-black" style={{ color: '#7A8F68' }}>₹{selectedAcc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9A9285' }}>Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color: '#9A9285' }}>₹</span>
                  <input type="number" min="0.01" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" className="einput pl-8"
                    style={overBalance ? { borderColor: 'rgba(169,113,78,0.50)' } : {}} />
                </div>
                {overBalance && (
                  <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: '#7D5239' }}>
                    <AlertCircle size={11} /> Exceeds available balance
                  </p>
                )}
              </div>
              <motion.button whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }}
                type="submit" disabled={loading || overBalance} className="ebtn ebtn-terra w-full justify-center"
                style={{ opacity: (loading || overBalance) ? 0.60 : 1 }}>
                {loading ? 'Processing...' : 'Withdraw Funds'}
              </motion.button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
