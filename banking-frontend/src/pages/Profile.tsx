import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { User, Mail, Shield, CreditCard, Leaf } from 'lucide-react';

export default function Profile() {
  const { user, isAdmin } = useAuth();
  return (
    <div className="min-h-screen relative animate-page-in zone-sage" style={{ background: '#F5F0E6' }}>
      <VideoBackground page="profile" className="fixed" />
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-2xl mx-auto">
        <PageHero title="Your|Profile" subtitle="Your digital banking identity"
          badge="Account Profile" character="assistant" mood="wave" page="profile" minHeight="145px" />

        <GlassCard className="p-7 ecard-sage accent-band-sage" hover={false}>
          <div className="flex items-center gap-5 mb-7">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#9CAF88,#A9714E,#3F4A3D)', boxShadow: '0 6px 20px rgba(63,74,61,0.25)', color: '#F5F0E6' }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-black" style={{ color: '#3F4A3D' }}>{user?.email?.split('@')[0]}</h2>
              <span className={`echip text-[10px] mt-1.5 inline-flex items-center gap-1.5 ${isAdmin ? 'echip-warning' : 'echip-success'}`}>
                <Shield size={10} /> {isAdmin ? 'Administrator' : 'Customer'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: Mail,       label: 'Email',        value: user?.email },
              { icon: Shield,     label: 'Role',         value: user?.role },
              { icon: CreditCard, label: 'Access Level', value: isAdmin ? 'Full System Access' : 'Standard Banking' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(63,74,61,0.09)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(156,175,136,0.18)' }}>
                  <Icon size={15} style={{ color: '#7A8F68' }} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#9A9285' }}>{label}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: '#3F4A3D' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={13} style={{ color: '#9CAF88' }} />
            <p className="text-xs font-semibold" style={{ color: '#3F4A3D' }}>Account Security Note</p>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: '#9A9285' }}>
            Account management requires contacting your administrator.
            Your JWT session expires every 24 hours for security.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
