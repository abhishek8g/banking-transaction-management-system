import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import GlassCard from '../components/ui/GlassCard';
import PageHero from '../components/ui/PageHero';
import VideoBackground from '../components/ui/VideoBackground';
import { Leaf, Accessibility, Volume2, RotateCcw } from 'lucide-react';

const categories = [
  { icon:Leaf,          label:'Appearance',    color:'#9CAF88',
    items:[{key:'immersiveMode' as const, label:'Immersive Mode', desc:'Enable richer 3D environment with enhanced organic particles and camera movement.'}]},
  { icon:Accessibility, label:'Accessibility', color:'#7A8F68',
    items:[
      {key:'reduceMotion'   as const, label:'Reduce Motion',  desc:'Minimise animations and movement throughout the interface.'},
      {key:'disable3D'      as const, label:'Disable 3D',     desc:'Switch to a clean 2D interface. All banking features remain fully functional.'},
      {key:'standardCursor' as const, label:'Standard Cursor', desc:'Use the browser default cursor instead of the custom earthy cursor.'},
      {key:'highContrast'   as const, label:'High Contrast',  desc:'Increase contrast ratios for better readability.'},
    ]},
  { icon:Volume2, label:'Sound', color:'#A9714E',
    items:[{key:'soundEnabled' as const, label:'Sound Effects', desc:'Enable subtle sounds for button clicks, successful transactions, and errors.'}]},
];

function Toggle({ value, onChange, color='#9CAF88' }: { value:boolean; onChange:()=>void; color?:string }) {
  return (
    <motion.button whileTap={{scale:0.92}} onClick={onChange}
      className="w-11 h-6 rounded-full relative flex-shrink-0 transition-colors duration-300"
      style={{background:value?color:'rgba(63,74,61,0.18)',border:`1px solid ${value?color+'55':'rgba(63,74,61,0.18)'}`}}>
      <motion.div animate={{x:value?20:2}} transition={{type:'spring',stiffness:500,damping:32}}
        className="absolute top-[3px] w-[16px] h-[16px] rounded-full shadow-sm"
        style={{background:value?'#F5F0E6':'#9A9285'}}/>
    </motion.button>
  );
}

export default function Settings() {
  const { settings, toggle } = useSettings();
  return (
    <div className="min-h-screen relative animate-page-in zone-olive" style={{background:'#F5F0E6'}}>
      <VideoBackground page="settings" className="fixed"/>
      <div className="relative z-10 p-5 lg:p-7 space-y-5 max-w-2xl mx-auto">
        <PageHero title="Settings|Control Room" subtitle="Configure your digital banking environment" badge="Preferences" character="support" mood="idle" page="settings" minHeight="145px"/>

        {categories.map(({icon:Icon,label,color,items}) => (
          <motion.div key={label} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}>
            <GlassCard className="overflow-hidden" hover={false}>
              <div className="flex items-center gap-3 p-5" style={{borderBottom:'1px solid rgba(63,74,61,0.08)'}}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:`${color}18`,border:`1px solid ${color}25`}}>
                  <Icon size={15} style={{color}}/>
                </div>
                <h2 className="text-sm font-bold" style={{color:'#3F4A3D'}}>{label}</h2>
              </div>
              <div className="divide-y" style={{borderColor:'rgba(63,74,61,0.06)'}}>
                {items.map(({key,label:lbl,desc}) => (
                  <div key={key} className="flex items-center justify-between p-5 transition-colors hover:bg-[rgba(156,175,136,0.06)]"
                    style={{borderBottom:'1px solid rgba(63,74,61,0.05)'}}>
                    <div className="flex-1 pr-5">
                      <p className="text-sm font-semibold" style={{color:'#3F4A3D'}}>{lbl}</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{color:'#9A9285'}}>{desc}</p>
                    </div>
                    <Toggle value={settings[key]} onChange={() => toggle(key)} color={color}/>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}

        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{color:'#3F4A3D'}}>Replay Onboarding Tour</p>
              <p className="text-[11px] mt-0.5" style={{color:'#9A9285'}}>Walk through the interactive introduction again</p>
            </div>
            <button onClick={() => toggle('onboardingDone')} className="ebtn ebtn-ghost flex items-center gap-2 text-xs">
              <RotateCcw size={12}/> Replay
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
