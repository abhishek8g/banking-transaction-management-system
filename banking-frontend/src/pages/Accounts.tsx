import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as accountApi from '../api/accounts';
import type { Account } from '../types';
import GlassCard from '../components/ui/GlassCard';
import TransactionModal from '../components/ui/TransactionModal';
import VideoBackground from '../components/ui/VideoBackground';
import PageHero from '../components/ui/PageHero';
import { CreditCard, Plus, TrendingUp, TrendingDown, ArrowLeftRight, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

type TxType = 'deposit' | 'withdraw' | 'transfer';

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<{ type: TxType; accountId: number } | null>(null);

  const fetchAccounts = async () => {
    try { const { data } = await accountApi.getAccounts(0, 20); setAccounts(data.content); }
    catch { toast.error('Failed to load accounts'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAccounts(); }, []);

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E6' }}>
      <div className="w-10 h-10 rounded-full animate-breathe" style={{ background: 'linear-gradient(135deg,#9CAF88,#7A8F68)' }} />
    </div>
  );

  return (
    <div className="min-h-screen relative animate-page-in zone-sage" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="accounts" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-5xl mx-auto">
        <PageHero title="My|Accounts" subtitle="Manage your savings and checking accounts"
          badge="Account Vault" character="specialist" mood="point" page="accounts" minHeight="160px" />

        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#9A9285' }}>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </p>
          <Link to="/accounts/new">
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              className="ebtn ebtn-terra flex items-center gap-2 text-sm">
              <Plus size={15} /> New Account
            </motion.div>
          </Link>
        </div>

        {accounts.length === 0 ? (
          <GlassCard className="p-16 text-center" hover={false}>
            <CreditCard size={44} className="mx-auto mb-4" style={{ color: '#C4B8A8' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: '#3F4A3D' }}>No Accounts Yet</h3>
            <p className="text-sm mb-5" style={{ color: '#9A9285' }}>Open your first bank account to start banking</p>
            <Link to="/accounts/new" className="ebtn ebtn-terra inline-flex items-center gap-2">
              <Plus size={14} /> Open Account
            </Link>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {accounts.map((acc, i) => {
              const isSav  = acc.accountType === 'SAVINGS';
              const barBg  = isSav ? 'linear-gradient(90deg,#9CAF88,#7A8F68)' : 'linear-gradient(90deg,#A9714E,#C4926D)';
              const tint   = isSav ? 'ecard-sage' : 'ecard-terra';
              return (
                <motion.div key={acc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <GlassCard className={`overflow-hidden accent-band-${isSav ? 'sage' : 'terra'} ${tint}`}
                    glow={isSav ? 'sage' : 'terra'}>
                    <div className="h-1.5 w-full" style={{ background: barBg }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9A9285' }}>
                            {acc.accountType}
                          </span>
                          <p className="text-[11px] font-mono mt-0.5" style={{ color: '#9A9285' }}>{acc.accountNumber}</p>
                        </div>
                        <span className={`echip text-[9px] ${acc.status === 'ACTIVE' ? 'echip-success' : acc.status === 'BLOCKED' ? 'echip-danger' : 'echip-info'}`}>
                          {acc.status}
                        </span>
                      </div>
                      <p className="text-2xl font-black mb-1" style={{ color: '#3F4A3D' }}>{fmt(acc.balance)}</p>
                      <p className="text-[10px]" style={{ color: '#9A9285' }}>
                        Opened {new Date(acc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>

                      {acc.status === 'ACTIVE' && (
                        <div className="flex gap-2 mt-4">
                          {([
                            { type: 'deposit'  as TxType, icon: TrendingUp,    bg: 'linear-gradient(135deg,#9CAF88,#7A8F68)' },
                            { type: 'withdraw' as TxType, icon: TrendingDown,  bg: 'linear-gradient(135deg,#A9714E,#C4926D)' },
                            { type: 'transfer' as TxType, icon: ArrowLeftRight, bg: 'linear-gradient(135deg,#3F4A3D,#566154)' },
                          ]).map(({ type, icon: Icon, bg }) => (
                            <motion.button key={type} whileHover={{ scale: 1.10, y: -2 }} whileTap={{ scale: 0.92 }}
                              onClick={() => setModal({ type, accountId: acc.id })}
                              className="flex-1 py-2 rounded-xl flex items-center justify-center transition-all"
                              style={{ background: bg, boxShadow: '0 2px 8px rgba(63,74,61,0.15)' }}>
                              <Icon size={13} style={{ color: '#F5F0E6' }} />
                            </motion.button>
                          ))}
                          <Link to={`/accounts/${acc.id}`}
                            className="flex-1 py-2 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(63,74,61,0.12)' }}>
                            <Eye size={13} style={{ color: '#8A9688' }} />
                          </Link>
                        </div>
                      )}
                      {acc.status !== 'ACTIVE' && (
                        <div className="mt-4 py-2 text-center text-[11px] rounded-xl"
                          style={{ border: '1px dashed rgba(63,74,61,0.15)', color: '#9A9285' }}>
                          Account {acc.status.toLowerCase()}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}

            {/* New account tile */}
            <Link to="/accounts/new">
              <GlassCard className="h-full min-h-[180px] flex items-center justify-center" glow="sage">
                <div className="text-center p-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(156,175,136,0.15)', border: '1px dashed rgba(156,175,136,0.40)' }}>
                    <Plus size={22} style={{ color: '#9A9285' }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#9A9285' }}>Open New Account</p>
                </div>
              </GlassCard>
            </Link>
          </div>
        )}
      </div>

      {modal && (
        <TransactionModal type={modal.type} accountId={modal.accountId}
          onClose={() => setModal(null)}
          onSuccess={() => { setModal(null); fetchAccounts(); }} />
      )}
    </div>
  );
}
