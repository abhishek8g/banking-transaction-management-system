import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, ArrowLeftRight, CheckCircle, AlertCircle } from 'lucide-react';
import * as txApi from '../../api/transactions';

type TxType = 'deposit' | 'withdraw' | 'transfer';
interface TransactionModalProps {
  type: TxType; accountId: number;
  onClose: () => void; onSuccess: (type: TxType) => void;
}

const config = {
  deposit:  { icon: TrendingUp,    label: 'Deposit Funds',  bg: 'linear-gradient(135deg,#9CAF88,#7A8F68)', accent: '#9CAF88', border: 'rgba(156,175,136,0.35)' },
  withdraw: { icon: TrendingDown,  label: 'Withdraw Funds', bg: 'linear-gradient(135deg,#A9714E,#C4926D)', accent: '#A9714E', border: 'rgba(169,113,78,0.35)'  },
  transfer: { icon: ArrowLeftRight, label: 'Transfer Funds', bg: 'linear-gradient(135deg,#3F4A3D,#566154)', accent: '#3F4A3D', border: 'rgba(63,74,61,0.28)'    },
};

export default function TransactionModal({ type, accountId, onClose, onSuccess }: TransactionModalProps) {
  const [amount, setAmount]           = useState('');
  const [destId, setDestId]           = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]         = useState(false);
  const [state, setState]             = useState<'form'|'success'|'error'>('form');
  const [errMsg, setErrMsg]           = useState('');

  const { icon: Icon, label, bg, accent, border } = config[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const amt = parseFloat(amount);
      if (type === 'deposit')       await txApi.deposit(accountId, amt);
      else if (type === 'withdraw') await txApi.withdraw(accountId, amt);
      else                           await txApi.transfer(accountId, parseInt(destId), amt, description || undefined);
      setState('success');
      setTimeout(() => onSuccess(type), 1800);
    } catch (err: any) {
      setErrMsg(err.response?.data?.message || 'Transaction failed. Please try again.');
      setState('error');
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background:'rgba(63,74,61,0.25)', backdropFilter:'blur(12px)' }}>
        <motion.div
          initial={{ scale:0.90, opacity:0, y:24 }} animate={{ scale:1, opacity:1, y:0 }}
          exit={{ scale:0.90, opacity:0 }}
          transition={{ type:'spring', stiffness:300, damping:26 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md rounded-[24px] overflow-hidden"
          style={{
            background:'rgba(251,248,243,0.96)',
            border:`1px solid ${border}`,
            backdropFilter:'blur(24px)',
            boxShadow:`0 24px 60px rgba(63,74,61,0.18), 0 0 0 1px ${border}`,
          }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4"
            style={{ background:bg, boxShadow:`0 3px 14px ${accent}33` }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon size={17} className="text-white" />
              </div>
              <h2 className="text-base font-black text-white">{label}</h2>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white/80 hover:bg-white/30 transition-all">
              <X size={15} />
            </button>
          </div>

          <div className="p-6">
            {state === 'success' ? (
              <motion.div initial={{ scale:0.85 }} animate={{ scale:1 }} className="text-center py-7">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-breathe"
                  style={{ background:'rgba(156,175,136,0.20)', border:'1px solid rgba(156,175,136,0.35)' }}>
                  <CheckCircle size={32} style={{ color:'#7A8F68' }} />
                </div>
                <h3 className="text-lg font-black mb-1.5" style={{ color:'#3F4A3D' }}>Transaction Successful!</h3>
                <p className="text-sm" style={{ color:'#8A9688' }}>
                  ₹{parseFloat(amount).toLocaleString('en-IN')} {type} processed successfully.
                </p>
              </motion.div>
            ) : state === 'error' ? (
              <motion.div initial={{ scale:0.85 }} animate={{ scale:1 }} className="text-center py-7">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background:'rgba(169,113,78,0.15)', border:'1px solid rgba(169,113,78,0.30)' }}>
                  <AlertCircle size={32} style={{ color:'#7D5239' }} />
                </div>
                <h3 className="text-lg font-black mb-1.5" style={{ color:'#3F4A3D' }}>Transaction Failed</h3>
                <p className="text-sm mb-5" style={{ color:'#8A9688' }}>{errMsg}</p>
                <button onClick={() => setState('form')} className="ebtn ebtn-ghost text-sm">Try Again</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color:'#9A9285' }}>₹</span>
                    <input type="number" min="0.01" step="0.01" required autoFocus
                      value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="0.00" className="einput pl-8" />
                  </div>
                </div>

                {type === 'transfer' && (<>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>Destination Account ID</label>
                    <input type="number" required value={destId} onChange={e => setDestId(e.target.value)}
                      placeholder="Account ID" className="einput" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>
                      Description <span className="normal-case font-normal">(optional)</span>
                    </label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="e.g. Rent payment" className="einput" />
                  </div>
                </>)}

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={onClose} className="flex-1 ebtn ebtn-ghost">Cancel</button>
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.98 }}
                    className="flex-1 ebtn text-white font-black text-sm"
                    style={{ background:bg, opacity:loading?0.65:1, boxShadow:`0 4px 14px ${accent}35` }}>
                    {loading ? 'Processing...' : label}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
