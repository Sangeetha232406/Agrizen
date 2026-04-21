import { Link, useLocation } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { 
  Sprout, 
  Bug, 
  History, 
  LayoutDashboard, 
  Globe,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useTranslation, Language } from '../../lib/translations';

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: t.common.dashboard, path: '/', icon: LayoutDashboard },
    { name: t.common.cropRec, path: '/crop', icon: Sprout },
    { name: t.common.pestDet, path: '/pest', icon: Bug },
    { name: t.market.title, path: '/market', icon: TrendingUp },
    { name: t.common.history, path: '/history', icon: History },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'हिंदी' },
  ];

  return (
    <nav className="w-72 bg-white border-r border-accent-green/5 flex flex-col shrink-0 h-full relative overflow-y-auto custom-scrollbar">
      {/* Subtle organic pattern */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 p-10 flex flex-col gap-16">
        <div>
          <Link to="/" className="block group">
            <h1 className="font-serif text-3xl text-accent-green font-bold tracking-tighter group-hover:scale-[1.02] transition-transform origin-left">AgriZen</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-[1px] w-4 bg-clay/40" />
              <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-clay/80">Precision AI</p>
            </div>
          </Link>
        </div>

        <div className="flex p-1 bg-green-soft/40 rounded-2xl border border-accent-green/5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "flex-1 py-2 text-[10px] font-black tracking-widest rounded-xl transition-all",
                language === lang.code 
                  ? "bg-white text-accent-green shadow-sm ring-1 ring-accent-green/5" 
                  : "text-accent-green/30 hover:text-accent-green/60"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all group relative",
                  location.pathname === item.path 
                    ? "bg-accent-green/5 text-accent-green" 
                    : "text-forest/40 hover:text-forest hover:bg-forest/[0.02]"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-transform group-hover:scale-110",
                  location.pathname === item.path ? "text-accent-green" : "opacity-60"
                )} />
                <span className="tracking-tight">
                  {item.name}
                </span>
                
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-clay rounded-r-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-10 pt-0 mt-auto">
        <div className="pt-10 border-t border-accent-green/5">
          <div className="flex items-center gap-4 mb-8 bg-green-soft/20 p-4 rounded-3xl border border-accent-green/5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-float flex items-center justify-center font-serif font-black text-accent-green text-xl uppercase shrink-0 border border-accent-green/5">
              {user.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-forest truncate">{user.displayName || user.email?.split('@')[0]}</p>
              <p className="text-[9px] font-black tracking-widest text-clay/60 uppercase">{t.common.farmerLevel}</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={handleLogout}
            className="w-full py-4 px-4 text-[10px] uppercase font-black tracking-[0.25em] text-forest/30 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl flex items-center justify-center gap-3 group/logout"
          >
            <LogOut size={14} className="opacity-40 group-hover/logout:opacity-100 transition-opacity" />
            <span>{t.common.logout}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
