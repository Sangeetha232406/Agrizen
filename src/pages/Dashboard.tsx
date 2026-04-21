import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Sprout, Bug, History, ArrowRight, Sun, Droplets, Thermometer, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/translations';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const { t } = useTranslation();
  const cards = [
    {
      title: t.dashboard.diagnosticTool,
      description: t.pest.subtitle,
      icon: Bug,
      path: '/pest',
      color: 'bg-accent-green text-white',
      border: 'border-white/20'
    },
    {
      title: t.dashboard.analyticalTool,
      description: t.crop.subtitle,
      icon: Sprout,
      path: '/crop',
      color: 'bg-white text-accent-green',
      border: 'border-[#E5E5E0]'
    },
    {
      title: t.market.title,
      description: t.market.subtitle,
      icon: TrendingUp,
      path: '/market',
      color: 'bg-orange-50 text-clay',
      border: 'border-clay/10'
    }
  ];

  return (
    <div className="flex flex-col gap-10 h-full relative">
      {/* Dynamic background accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-green/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-clay/5 rounded-full blur-[100px] -mr-32 -mb-32" />
      </div>

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded-full bg-accent-green/5 text-[9px] font-black uppercase tracking-[0.2em] text-accent-green border border-accent-green/10">
               Live Conditions
             </span>
             <span className="h-px w-8 bg-clay/20" />
          </div>
          <h2 className="font-serif text-5xl text-accent-green tracking-tight">
            {t.dashboard.greeting}, <span className="text-clay italic">{user.displayName?.split(' ')[0] || 'Farmer'}</span>.
          </h2>
        </div>
        
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-[2.5rem] shadow-float border border-accent-green/5">
          <div className="flex items-center gap-3 px-6 py-3 bg-green-soft/20 rounded-[2rem]">
            <Thermometer size={16} className="text-accent-green/40" />
            <div>
              <p className="text-[8px] uppercase font-black tracking-widest text-accent-green/40 mb-0.5">{t.dashboard.temp}</p>
              <p className="text-base font-bold text-accent-green leading-none">24<span className="text-xs opacity-50">°C</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3">
            <Droplets size={16} className="text-clay/40" />
            <div>
              <p className="text-[8px] uppercase font-black tracking-widest text-clay/40 mb-0.5">{t.dashboard.humidity}</p>
              <p className="text-base font-bold text-forest leading-none">68<span className="text-xs opacity-50">%</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3">
            <div className="h-8 w-8 rounded-full bg-accent-green flex items-center justify-center text-white shadow-lg shadow-accent-green/20">
               <span className="text-xs font-black italic">pH</span>
            </div>
            <div>
              <p className="text-[8px] uppercase font-black tracking-widest text-forest/40 mb-0.5">{t.dashboard.soilPh}</p>
              <p className="text-base font-bold text-forest leading-none">6.4</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Main Philosophy Card - Massive & Immersive */}
        <div className="col-span-12 lg:col-span-12 xl:col-span-8 bg-white rounded-[3rem] p-12 shadow-card border border-accent-green/5 flex flex-col relative overflow-hidden group">
          <div 
            className="absolute inset-0 opacity-[0.04] -z-10 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2670&auto=format&fit=crop")' }}
          />
          
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <h3 className="font-serif text-3xl text-accent-green">{t.dashboard.philosophyTitle}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-clay/60">Core Values</p>
            </div>
            <div className="flex -space-x-3">
               {[1,2,3].map(i => (
                 <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-green-soft flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/agri${i}/100/100`} className="h-full w-full object-cover grayscale opacity-50" referrerPolicy="no-referrer" />
                 </div>
               ))}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center max-w-2xl relative">
            <div className="absolute -left-8 top-0 text-7xl font-serif text-accent-green/5">"</div>
            <p className="font-serif text-3xl leading-[1.4] italic text-forest/80 mb-10 text-balance">
              {t.dashboard.philosophyText}
            </p>
            <div className="flex flex-wrap gap-4">
              {['Sustainable', 'Efficient', 'Empowering'].map(tag => (
                <span key={tag} className="px-6 py-2.5 bg-green-soft/30 hover:bg-green-soft/60 border border-accent-green/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-accent-green transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-12 flex items-center gap-10">
            <Link 
              to="/crop" 
              className="group/btn flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-accent-green hover:text-clay transition-colors"
            >
              <div className="h-8 w-8 rounded-full border border-accent-green/20 flex items-center justify-center transition-all group-hover/btn:border-clay group-hover/btn:px-2 group-hover/btn:w-auto">
                 <ArrowRight size={14} className="group-hover/btn:rotate-[-45deg] transition-transform" />
              </div>
              {t.dashboard.launchRecommendation}
            </Link>
            <Link 
              to="/history" 
              className="text-[11px] font-black uppercase tracking-widest text-forest/40 hover:text-accent-green transition-colors"
            >
              {t.dashboard.browseLogs}
            </Link>
          </div>
        </div>

        {/* Action Cards - Bento Layout */}
        <div className="col-span-12 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Link 
                to={card.path}
                className={cn(
                  "p-8 rounded-[2.5rem] shadow-card flex flex-col justify-between h-full border transition-all hover:shadow-float hover:-translate-y-1 relative overflow-hidden group",
                  card.color,
                  card.border
                )}
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-[9px] font-black uppercase tracking-[0.25em]", index === 0 ? "text-white/60" : "text-clay/60")}>
                      {card.title === t.dashboard.diagnosticTool || card.title === t.dashboard.analyticalTool ? (index === 0 ? t.dashboard.diagnosticTool : t.dashboard.analyticalTool) : "Global Node"}
                    </p>
                    <div className={cn("h-2 w-2 rounded-full", index === 0 ? "bg-white/40" : "bg-clay/20")} />
                  </div>
                  <h3 className="font-serif text-2xl tracking-tight">{card.title}</h3>
                </div>

                <div className="flex items-center justify-between relative z-10">
                   <div className={cn(
                     "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                     index === 0 ? "bg-white/10" : "bg-accent-green/5"
                   )}>
                      <card.icon size={28} className={index === 0 ? "text-white" : "text-accent-green"} />
                   </div>
                   <div className="text-right">
                      <p className={cn("text-[8px] uppercase font-black tracking-widest mb-1", index === 0 ? "text-white/40" : "text-gray-400")}>
                        {t.dashboard.startAnalysis}
                      </p>
                      <ChevronRight size={16} className={index === 0 ? "text-white ml-auto" : "text-accent-green ml-auto"} />
                   </div>
                </div>

                {/* Decorative glow */}
                <div className={cn(
                  "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-transform group-hover:scale-150",
                  index === 0 ? "bg-white" : "bg-clay"
                )} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Leaf({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C10 14.5 10.5 13.8 11.5 12.33 12.5 10.86 15 11 15 11"/>
    </svg>
  );
}
