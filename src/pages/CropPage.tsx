import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { getCropRecommendation } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Droplets, 
  Thermometer, 
  Wind, 
  MapPin, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/translations';

interface CropPageProps {
  user: User;
}

export default function CropPage({ user }: CropPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [inputs, setInputs] = useState({
    n: 50,
    p: 50,
    k: 50,
    temperature: 25,
    humidity: 60,
    ph: 6.5,
    rainfall: 100,
    location: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'location' ? value : Number(value) }));
  };

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setInputs(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const recommendation = await getCropRecommendation(inputs);
      
      // Save to Firebase
      await addDoc(collection(db, 'recommendations'), {
        userId: user.uid,
        inputs,
        recommendedCrop: recommendation.recommendedCrop,
        tips: recommendation.tips,
        timestamp: serverTimestamp()
      });

      setResult(recommendation);
    } catch (err) {
      console.error(err);
      try {
        handleFirestoreError(err, 'create', 'recommendations');
      } catch (firestoreErr: any) {
        alert(`${firestoreErr.message}`);
      }
      alert('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <Link to="/" className="inline-flex items-center text-[10px] uppercase tracking-widest font-black text-clay/60 mb-10 hover:text-clay hover:-translate-x-1 transition-all group">
        <div className="h-7 w-7 rounded-full border border-clay/10 flex items-center justify-center mr-3 group-hover:-translate-x-1 transition-transform">
          <ArrowLeft size={10} />
        </div>
        {t.common.backToDashboard}
      </Link>

      <div className="grid lg:grid-cols-12 gap-0 bg-white rounded-[4rem] shadow-float border border-accent-green/5 overflow-hidden">
        {/* Input Column */}
        <div className="lg:col-span-5 bg-green-soft/30 p-10 lg:p-14 border-r border-accent-green/5">
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-6 bg-clay/30" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-clay font-black">{t.crop.soilAnalysis}</p>
              </div>
              <h1 className="font-serif text-5xl text-accent-green mb-4 tracking-tight leading-none">{t.crop.title}</h1>
              <p className="text-forest/40 italic text-sm leading-relaxed">{t.crop.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.nitrogen}</label>
                  <input type="number" name="n" value={inputs.n} onChange={handleInputChange} className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.phosphorus}</label>
                  <input type="number" name="p" value={inputs.p} onChange={handleInputChange} className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.potassium}</label>
                  <input type="number" name="k" value={inputs.k} onChange={handleInputChange} className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.ph}</label>
                  <input type="number" step="0.1" name="ph" value={inputs.ph} onChange={handleInputChange} className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.temp}</label>
                  <div className="relative">
                    <input type="number" name="temperature" value={inputs.temperature} onChange={handleInputChange} className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-forest/20">°C</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.humidity}</label>
                  <div className="relative">
                    <input type="number" name="humidity" value={inputs.humidity} onChange={handleInputChange} className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-forest/20">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.rainfall}</label>
                <div className="relative">
                  <input type="number" name="rainfall" value={inputs.rainfall} onChange={handleInputChange} className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-forest/20">mm</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-black text-forest/30 ml-1">{t.crop.location}</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    name="location" 
                    value={inputs.location} 
                    onChange={handleInputChange} 
                    placeholder="Search region..."
                    className="w-full bg-white/60 backdrop-blur-sm border border-accent-green/5 rounded-2xl pl-5 pr-14 py-4 text-sm outline-none focus:bg-white focus:border-clay/30 transition-all shadow-sm font-medium" 
                  />
                  <button 
                    type="button" 
                    onClick={fetchLocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-clay/40 hover:text-accent-green transition-all bg-accent-green/[0.03] rounded-xl border border-accent-green/5"
                  >
                    <MapPin size={18} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-green text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-accent-green/20 hover:bg-forest hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center space-x-3 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t.crop.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Sprout className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{t.crop.updateMetrics}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-7 bg-white relative p-10 lg:p-20 overflow-hidden">
           {/* Decorative organic background */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2D4A22_1px,transparent_1px)] [background-size:30px_30px]" />
           
           <AnimatePresence mode="wait">
             {result ? (
               <motion.div
                 key="result"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="relative z-10 h-full flex flex-col"
               >
                 <div className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1 bg-clay/5 text-clay rounded-full text-[9px] font-black uppercase tracking-widest border border-clay/10">Recommendation Engine</span>
                       <span className="h-px w-8 bg-clay/20" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-clay/40 block mb-2">{t.crop.optimalSowing}</span>
                    <h2 className="font-serif text-7xl text-accent-green tracking-tighter leading-none mb-6">
                      {result.recommendedCrop}
                    </h2>
                    <div className="flex items-center gap-4">
                       <div className="h-1 w-20 bg-clay rounded-full" />
                       <p className="text-clay font-serif italic text-lg opacity-60">Verified Agriculture Data</p>
                    </div>
                 </div>

                 <div className="bg-green-soft/10 backdrop-blur-sm rounded-[3rem] p-10 lg:p-14 border border-accent-green/5 flex-grow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-accent-green/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent-green/10 transition-colors" />
                    
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-green/40 block mb-8 leading-none">{t.crop.farmingInsight}</span>
                    
                    <div className="space-y-10">
                      <p className="font-serif text-2xl leading-tight italic text-forest/80 border-l-4 border-clay/20 pl-8 py-2">
                        "{result.tips[0]}"
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        {result.tips.slice(1).map((tip: string, i: number) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-start gap-4 p-5 rounded-2xl bg-white/50 border border-accent-green/[0.03] hover:border-accent-green/10 transition-all hover:shadow-card group/tip"
                          >
                             <div className="h-8 w-8 rounded-xl bg-clay/5 text-clay flex items-center justify-center shrink-0 group-hover/tip:bg-clay group-hover/tip:text-white transition-all">
                               <CheckCircle2 size={16} />
                             </div>
                             <p className="text-forest/60 text-[11px] font-bold leading-relaxed">{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                 </div>

                 <div className="mt-12 flex justify-between items-center">
                    <button 
                     onClick={() => setResult(null)}
                     className="group flex items-center gap-3 text-[10px] uppercase font-black text-clay/40 hover:text-clay transition-all tracking-[0.25em]"
                    >
                      <div className="h-10 w-10 rounded-full border border-clay/10 flex items-center justify-center group-hover:bg-clay group-hover:text-white transition-all">
                        <RefreshCw size={14} />
                      </div>
                      {t.crop.planAnother}
                    </button>
                    
                    <p className="text-[9px] font-black uppercase tracking-widest text-forest/20 italic">
                      AgriZen Wisdom © 2024
                    </p>
                 </div>
               </motion.div>
             ) : (
               <motion.div
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="h-full flex flex-col items-center justify-center text-center relative z-10"
               >
                  <div className="space-y-10 max-w-sm">
                     <div className="relative mx-auto">
                        <div className="absolute inset-0 bg-accent-green/5 rounded-full blur-2xl animate-pulse" />
                        <div className="bg-white h-32 w-32 rounded-[3rem] mx-auto flex items-center justify-center shadow-float border border-accent-green/5 relative z-10">
                           <LeafIcon size={48} className="text-accent-green opacity-40 animate-[bounce_3s_infinite]" />
                        </div>
                     </div>
                     <div className="space-y-4">
                       <p className="text-accent-green font-serif text-4xl tracking-tighter leading-none">{t.dashboard.waitingData}</p>
                       <p className="text-forest/20 text-[10px] uppercase tracking-[0.3em] font-black leading-relaxed">
                         {t.crop.waitMetrics.split('.')[0]}<br/>
                         Analyze soil composition to generate<br/>
                         organic AI recommendations.
                       </p>
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LeafIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    </svg>
  );
}
