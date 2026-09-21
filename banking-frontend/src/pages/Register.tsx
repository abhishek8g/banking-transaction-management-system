import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as authApi from '../api/auth';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import VideoBackground from '../components/ui/VideoBackground';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'CUSTOMER' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]:v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await authApi.register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background:'#EDE6D6' }}>
      <VideoBackground page="login" />
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm relative z-10">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#9CAF88,#7A8F68)', boxShadow:'0 3px 12px rgba(156,175,136,0.40)' }}>
            <Leaf size={17} style={{ color:'#F5F0E6' }} />
          </div>
          <span className="font-black text-lg" style={{ color:'#3F4A3D' }}>BankingApp</span>
        </div>

        <div className="ecard ecard-sage p-8">
          <div className="mb-6">
            <h2 className="text-xl font-black" style={{ color:'#3F4A3D' }}>Create Account</h2>
            <p className="text-sm mt-1" style={{ color:'#8A9688' }}>Join the digital banking platform</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key:'name',  label:'Full Name', type:'text',  placeholder:'Jane Doe',         min:2 },
              { key:'email', label:'Email',     type:'email', placeholder:'you@example.com',  min:0 },
            ].map(({ key, label, type, placeholder, min }) => (
              <div key={key}>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>{label}</label>
                <input type={type} required minLength={min||undefined}
                  value={(form as any)[key]} onChange={e => set(key, e.target.value)}
                  placeholder={placeholder} className="einput" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>Password</label>
              <div className="relative">
                <input type={showPass?'text':'password'} required minLength={6}
                  value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Min 6 characters" className="einput pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'#9A9285' }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color:'#8A9688' }}>Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)} className="einput">
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <motion.button whileHover={{ scale:1.01, y:-2 }} whileTap={{ scale:0.98 }}
              type="submit" disabled={loading} className="ebtn ebtn-terra w-full mt-2 justify-center" style={{ opacity:loading?0.65:1 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>
          <p className="text-center text-sm mt-5" style={{ color:'#9A9285' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color:'#A9714E' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
