import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function ImmersiveToggle() {
  const { settings, toggle } = useSettings();
  const on = settings.immersiveMode;
  return (
    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
      onClick={() => toggle('immersiveMode')}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all"
      style={on
        ? { background:'rgba(156,175,136,0.25)', border:'1px solid rgba(156,175,136,0.45)', color:'#3F4A3D', boxShadow:'0 4px 16px rgba(156,175,136,0.30)' }
        : { background:'rgba(245,240,230,0.85)', border:'1px solid rgba(63,74,61,0.15)', color:'#8A9688', backdropFilter:'blur(12px)' }}>
      <Leaf size={13} style={{ color: on ? '#7A8F68' : '#9A9285' }} />
      Immersive
      <div className="w-7 h-3.5 rounded-full relative transition-colors" style={{ background: on ? '#9CAF88' : '#D4DDCD' }}>
        <motion.div animate={{ x: on ? 14 : 0 }} transition={{ type:'spring', stiffness:500, damping:32 }}
          className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
      </div>
    </motion.button>
  );
}
