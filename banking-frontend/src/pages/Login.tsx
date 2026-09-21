import { useState, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Leaf, Shield, TrendingUp, Zap } from 'lucide-react';
import VideoBackground from '../components/ui/VideoBackground';

const Scene3D = lazy(() => import('../components/3d/Scene3D'));

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      login({ email: data.email, role: data.role }, data.token);
      toast.success('Welcome back!');
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: '#EDE6D6' }}>
      <VideoBackground page="login" />

      {/* Left hero */}
      <div className="hidden lg:flex flex-col justify-center px-16 flex-1 relative z-10">
        <div className="absolute inset-0 opacity-55">
          <Suspense fallback={null}>
            <Scene3D mood="wave" character="assistant" reduceMotion={false} />
          </Suspense>
        </div>

        <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }} className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)', boxShadow:'0 4px 18px rgba(156,175,136,0.45)' }}>
              <Leaf size={20} style={{ color:'#F5F0E6' }} />
            </div>
            <span className="font-black text-xl" style={{ color:'#3F4A3D' }}>BankingApp</span>
          </div>

          <div className="ebadge mb-6"><span className="w-1.5 h-1.5 rounded-full bg-[#9CAF88] animate-breathe inline-block" /> Calm. Secure. Intelligent.</div>

          <h1 className="text-5xl font-black leading-tight mb-5" style={{ color:'#3F4A3D' }}>
            Your Money.<br />
            <span className="text-gradient-terra">Your Space.</span>
          </h1>
          <p className="text-lg mb-2 font-light" style={{ color:'#566154' }}>Secure. Calm. Transparent.</p>
          <p className="text-sm max-w-md leading-relaxed" style={{ color:'#8A9688' }}>
            Manage your finances in a warm, intelligent digital environment — designed around clarity and trust.
          </p>

          <div className="flex gap-6 mt-10">
            {[
              { icon:Shield,     label:'JWT Auth',  color:'#9CAF88' },
              { icon:TrendingUp, label:'Real-Time', color:'#A9714E' },
              { icon:Zap,        label:'Instant Tx',color:'#3F4A3D' },
            ].map(({ icon:Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} style={{ color }} />
                <span className="text-sm" style={{ color:'#8A9688' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center w-full lg:w-auto px-6 lg:px-16 py-12 relative z-10">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)' }}>
              <Leaf size={17} style={{ color:'#F5F0E6' }} />
            </div>
            <span className="font-black" style={{ color:'#3F4A3D' }}>BankingApp</span>
          </div>

          <div className="ecard ecard-sage p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black" style={{ color:'#3F4A3D' }}>Sign In</h2>
              <p className="text-sm mt-1" style={{ color:'#8A9688' }}>Access your banking dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>Email</label>
                <input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="einput" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>Password</label>
                <div className="relative">
                  <input type={showPass?'text':'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className="einput pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color:'#9A9285' }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <motion.button whileHover={{ scale:1.01, y:-2 }} whileTap={{ scale:0.98 }}
                type="submit" disabled={loading}
                className="ebtn ebtn-terra w-full mt-2 justify-center"
                style={{ opacity:loading?0.65:1 }}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </motion.button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color:'#9A9285' }}>
              No account?{' '}
              <Link to="/register" className="font-semibold transition-colors hover:opacity-75" style={{ color:'#A9714E' }}>Create one</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
