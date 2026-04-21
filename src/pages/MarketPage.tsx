import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, TrendingUp, Calendar, Loader2, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMarketPrices } from '../services/gemini';
import { useTranslation } from '../lib/translations';

interface MarketPageProps {
  user: User;
}

export default function MarketPage({ user }: MarketPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async (loc: string) => {
    if (!loc) return;
    setLoading(true);
    setError(null);
    try {
      const results = await getMarketPrices(loc);
      setData(results);
    } catch (err: any) {
      console.error(err);
      setError('System Timeout: Mandi nodes unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt auto-location on mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // We can use a simple reverse geocode or just tell Gemini to find prices for "near my current coordinates" 
          // or ask Gemini to detect state if we give it coords?
          // For simplicity, I'll just prompt the user or try to get city.
          // But I can't easily geocode without another API key.
          // I'll stick to manual search or a default like "Karnataka" for Indian demo.
        },
        () => {
          // Fallback - do nothing, wait for user input
        }
      );
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Link to="/" className="inline-flex items-center text-[9px] font-black uppercase tracking-[0.25em] text-clay/60 mb-10 hover:text-clay transition-all group">
         <div className="h-7 w-7 rounded-full border border-clay/10 flex items-center justify-center mr-3 group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={10} />
         </div>
         {t.common.backToDashboard}
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <span className="h-px w-6 bg-clay/30" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-clay">{t.market.fetchPrices}</p>
          </div>
          <h1 className="font-serif text-6xl text-accent-green tracking-tight">{t.market.title}</h1>
          <p className="text-forest/40 italic text-lg max-w-md">{t.market.subtitle}</p>
        </div>

        <div className="relative group w-full lg:max-w-md">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-forest/20 group-focus-within:text-accent-green transition-colors" />
           <input 
             type="text" 
             placeholder={t.market.searchHint}
             value={location}
             onChange={(e) => setLocation(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && fetchPrices(location)}
             className="w-full bg-white pl-16 pr-8 py-6 rounded-[2rem] border border-accent-green/5 focus:outline-none focus:ring-4 focus:ring-accent-green/5 focus:border-accent-green/20 transition-all shadow-float text-sm font-medium placeholder:text-forest/20 shadow-accent-green/[0.02]"
           />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
           <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-accent-green/10" />
              <TrendingUp className="absolute inset-0 m-auto h-5 w-5 text-accent-green/30" />
           </div>
           <p className="text-accent-green/40 font-serif italic text-lg">{t.market.loadingPrices}</p>
        </div>
      ) : data ? (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-[3rem] border border-accent-green/5 shadow-float relative overflow-hidden">
             {/* Decorative pattern */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-green-soft/20 rounded-full blur-2xl -mr-12 -mt-12" />
             
             <div className="flex items-center space-x-6 relative">
                <div className="h-16 w-16 rounded-[1.5rem] bg-accent-green/5 flex items-center justify-center text-accent-green shadow-inner">
                   <MapPin size={28} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-green/40 mb-1">{t.market.marketName}</p>
                   <p className="font-serif text-3xl text-accent-green tracking-tight">{data.location}</p>
                </div>
             </div>
             
             <div className="mt-6 md:mt-0 text-center md:text-right flex flex-col items-center md:items-end p-4 border-l border-forest/5 relative">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-clay/60 mb-2">{t.market.lastUpdated}</p>
                <div className="flex items-center text-clay font-serif italic text-xl">
                   <Calendar size={18} className="mr-3 opacity-40" />
                   {data.lastUpdated}
                </div>
             </div>
          </div>

          <div className="bento-grid">
            {data.prices.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white p-10 rounded-[3rem] border border-accent-green/[0.02] hover:border-accent-green/10 shadow-card hover:shadow-float transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                   <div className="h-16 w-16 rounded-[1.5rem] bg-green-soft/30 flex items-center justify-center text-accent-green transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <TrendingUp size={32} />
                   </div>
                   <div className="px-4 py-1.5 rounded-full bg-forest/[0.03] text-[9px] font-black uppercase tracking-widest text-forest/30 border border-forest/[0.05]">
                      Mandi Node
                   </div>
                </div>
                
                <div className="relative z-10">
                   <h3 className="text-2xl font-serif text-forest group-hover:text-accent-green transition-colors mb-2 tracking-tight">
                     {item.commodity}
                   </h3>
                   <div className="flex items-center gap-2 text-clay mb-8">
                      <div className="h-1.5 w-1.5 rounded-full bg-clay/30" />
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                        {item.market}
                      </p>
                   </div>
                </div>

                <div className="pt-8 border-t border-forest/[0.05] flex items-end justify-between relative z-10">
                   <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-forest/20 block mb-1">{t.market.price}</span>
                      <span className="text-3xl font-serif text-accent-green tracking-tighter">{item.price}</span>
                   </div>
                   <div className="h-10 w-10 rounded-full border border-accent-green/10 flex items-center justify-center text-accent-green/30 group-hover:bg-accent-green group-hover:text-white transition-all group-hover:border-transparent cursor-pointer">
                      <ArrowRight size={16} className="-rotate-45" />
                   </div>
                </div>

                {/* Organic glow background */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-green-soft/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-16">
             <button 
               onClick={() => fetchPrices(location)}
               className="group flex items-center gap-4 px-12 py-5 bg-white border border-accent-green/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-float hover:bg-forest hover:text-white transition-all text-accent-green"
             >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                <span>Refresh Intelligence</span>
             </button>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white rounded-[4rem] px-10 py-32 border border-dashed border-accent-green/20 text-center shadow-card relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#2D4A22_1px,transparent_1px)] [background-size:20px_20px]" />
           <div className="h-24 w-24 bg-green-soft/30 rounded-full flex items-center justify-center mx-auto mb-8 text-accent-green/30 relative">
              <Search size={40} />
              <div className="absolute inset-0 border-2 border-dashed border-accent-green/20 rounded-full animate-[spin_20s_linear_infinite]" />
           </div>
           <p className="text-accent-green/40 font-serif text-3xl italic tracking-tight">{t.market.noData}</p>
           {error && (
             <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl border border-red-100">
                <span className="text-[10px] tracking-widest uppercase font-black">{error}</span>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
