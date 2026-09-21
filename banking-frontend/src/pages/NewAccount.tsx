import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as accountApi from '../api/accounts';
import GlassCard from '../components/ui/GlassCard';
import VideoBackground from '../components/ui/VideoBackground';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewAccount() {
  const [accountType, setAccountType] = useState<'SAVINGS'|'CHECKING'>('SAVINGS');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await accountApi.createAccount(accountType, parseFloat(initialDeposit)||0); toast.success('Account created!'); navigate('/accounts'); }
    catch (err:any) { toast.error(err.response?.data?.message||'Failed to create account'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative animate-page-in zone-sage" style={{background:'#F5F0E6'}}>
      <VideoBackground page="accounts" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 max-w-lg mx-auto">
        <Link to="/accounts" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors" style={{color:'#9A9285'}}
          onMouseEnter={e=>(e.currentTarget.style.color='#3F4A3D')} onMouseLeave={e=>(e.currentTarget.style.color='#9A9285')}>
          <ArrowLeft size={15}/> Back to Accounts
        </Link>

        <GlassCard className="p-7" hover={false}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#9CAF88,#7A8F68)',boxShadow:'0 4px 12px rgba(156,175,136,0.40)'}}>
              <CreditCard size={18} style={{color:'#F5F0E6'}}/>
            </div>
            <div><h1 className="text-xl font-black" style={{color:'#3F4A3D'}}>Open New Account</h1><p className="text-[11px]" style={{color:'#9A9285'}}>Choose type and initial deposit</p></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:'#9A9285'}}>Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(['SAVINGS','CHECKING'] as const).map(type => {
                  const isSelected = accountType===type;
                  const color = type==='SAVINGS'?'#9CAF88':'#A9714E';
                  return (
                    <motion.button key={type} type="button" whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.98}}
                      onClick={() => setAccountType(type)}
                      className="relative p-4 rounded-2xl text-left transition-all"
                      style={isSelected?{background:`${color}15`,border:`1px solid ${color}35`,boxShadow:`0 4px 14px ${color}18`}:{background:'rgba(255,255,255,0.55)',border:'1px solid rgba(63,74,61,0.10)'}}>
                      {isSelected && <CheckCircle size={13} className="absolute top-3 right-3" style={{color}}/>}
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 text-[9px] font-black"
                        style={{background:`linear-gradient(135deg,${color},${type==='SAVINGS'?'#7A8F68':'#C4926D'})`,color:'#F5F0E6'}}>
                        {type==='SAVINGS'?'SAV':'CHK'}
                      </div>
                      <p className="text-sm font-bold" style={{color:'#3F4A3D'}}>{type.charAt(0)+type.slice(1).toLowerCase()}</p>
                      <p className="text-[10px] mt-0.5" style={{color:'#9A9285'}}>{type==='SAVINGS'?'Earn interest, grow money':'Everyday transactions'}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{color:'#9A9285'}}>Initial Deposit <span className="normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{color:'#9A9285'}}>₹</span>
                <input type="number" min="0" step="0.01" value={initialDeposit} onChange={e=>setInitialDeposit(e.target.value)} placeholder="0.00" className="einput pl-8"/>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => navigate('/accounts')} className="flex-1 ebtn ebtn-ghost">Cancel</button>
              <motion.button type="submit" disabled={loading} whileHover={{scale:1.01,y:-1}} whileTap={{scale:0.99}}
                className="flex-1 ebtn ebtn-sage" style={{opacity:loading?0.65:1}}>
                {loading?'Creating...':'Open Account'}
              </motion.button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
