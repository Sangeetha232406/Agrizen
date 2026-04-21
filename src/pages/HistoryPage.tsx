import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Bug, Calendar, MapPin, ChevronRight, Loader2, ArrowLeft, X, Droplets, Thermometer, Wind, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from '../lib/translations';

interface HistoryPageProps {
  user: User;
}

export default function HistoryPage({ user }: HistoryPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState<any[]>([]);
  const [dets, setDets] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'crop' | 'pest'>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const recQuery = query(
          collection(db, 'recommendations'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const detQuery = query(
          collection(db, 'detections'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const [recSnap, detSnap] = await Promise.all([
          getDocs(recQuery),
          getDocs(detQuery)
        ]);

        setRecs(recSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'crop' })));
        setDets(detSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'pest' })));
      } catch (err) {
        console.error(err);
        try {
          handleFirestoreError(err, 'list');
        } catch (firestoreErr: any) {
          alert(`${firestoreErr.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user.uid]);

  const allHistory = [...recs, ...dets].sort((a, b) => 
    (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
  );

  const filteredHistory = allHistory.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-clay mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t.common.backToDashboard}
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-clay font-bold mb-1">{t.history.archivalRecords}</p>
          <h1 className="font-serif text-4xl text-accent-green mb-2">{t.history.title}</h1>
          <p className="text-gray-500 italic text-sm">{t.history.subtitle}</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-[#E5E5E0] shadow-sm">
          {(['all', 'crop', 'pest'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-accent-green text-white shadow-card' : 'text-gray-400 hover:text-accent-green'
              }`}
            >
              {f === 'all' ? t.history.all : f === 'crop' ? t.history.crop : t.history.pest}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
           <Loader2 className="h-6 w-6 animate-spin text-accent-green/20" />
           <p className="text-accent-green/40 font-serif italic italic text-sm">{t.history.unearthing}</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 border border-dashed border-[#E5E5E0] text-center shadow-card">
           <p className="text-accent-green/30 font-serif text-xl italic italic">{t.history.emptyArchives}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="group bg-white p-6 rounded-[32px] border border-transparent hover:border-accent-green/10 shadow-card hover:shadow-xl transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  item.type === 'crop' ? 'bg-green-soft text-accent-green' : 'bg-orange-50 text-clay'
                }`}>
                  {item.type === 'crop' ? <Sprout size={24} /> : <Bug size={24} />}
                </div>
                
                <div>
                   <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                      <span className={item.type === 'crop' ? 'text-accent-green' : 'text-clay'}>
                        {item.type === 'crop' ? t.history.crop : t.history.pest}
                      </span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center text-gray-400">
                         <Calendar size={10} className="mr-1" />
                         {item.timestamp ? format(item.timestamp.toDate(), 'MMM dd, yyyy') : t.history.recently}
                      </div>
                   </div>
                   <h3 className="font-serif text-xl text-gray-900 group-hover:text-accent-green transition-colors">
                     {item.type === 'crop' ? item.recommendedCrop : item.pestName}
                   </h3>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                 {item.type === 'pest' && item.imageUrl && (
                    <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white shadow-inner group-hover:ring-2 ring-accent-green/20 transition-all">
                       <img src={item.imageUrl} alt="Pest" className="h-full w-full object-cover" />
                    </div>
                 )}
                 <div className="h-8 w-8 rounded-full border border-[#E5E5E0] flex items-center justify-center text-gray-300 group-hover:text-accent-green group-hover:bg-green-soft transition-all">
                    <ChevronRight size={14} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-accent-green/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 pb-4 flex justify-between items-start">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-clay mb-1">
                     {selectedItem.type === 'crop' ? t.history.recommendation : t.history.detection}
                   </p>
                   <h2 className="font-serif text-3xl text-gray-900 leading-tight">
                     {selectedItem.type === 'crop' ? selectedItem.recommendedCrop : selectedItem.pestName}
                   </h2>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>

              <div className="p-8 pt-0 overflow-y-auto custom-scrollbar">
                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">
                  <Calendar className="h-3 w-3 mr-2" />
                  {selectedItem.timestamp ? format(selectedItem.timestamp.toDate(), 'MMMM dd, yyyy • HH:mm') : t.history.recently}
                </div>

                {selectedItem.type === 'crop' ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-soft/30 p-4 rounded-2xl border border-accent-green/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-accent-green/60 mb-2">{t.crop.nitrogen}</p>
                        <p className="text-xl font-serif text-accent-green">{selectedItem.soilData.nitrogen}</p>
                      </div>
                      <div className="bg-green-soft/30 p-4 rounded-2xl border border-accent-green/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-accent-green/60 mb-2">{t.crop.phosphorus}</p>
                        <p className="text-xl font-serif text-accent-green">{selectedItem.soilData.phosphorus}</p>
                      </div>
                      <div className="bg-green-soft/30 p-4 rounded-2xl border border-accent-green/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-accent-green/60 mb-2">{t.crop.potassium}</p>
                        <p className="text-xl font-serif text-accent-green">{selectedItem.soilData.potassium}</p>
                      </div>
                      <div className="bg-green-soft/30 p-4 rounded-2xl border border-accent-green/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-accent-green/60 mb-2">{t.crop.ph}</p>
                        <p className="text-xl font-serif text-accent-green">{selectedItem.soilData.ph}</p>
                      </div>
                    </div>

                    <div className="bg-[#F9F9F7] p-8 rounded-[32px] border border-[#E5E5E0]">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-clay mb-6 flex items-center">
                         <MapPin className="h-3 w-3 mr-2" />
                         {t.crop.farmingInsight}
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="flex items-center space-x-4">
                             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-accent-green">
                                <Thermometer size={20} />
                             </div>
                             <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{t.crop.temp}</p>
                                <p className="font-serif text-gray-900">{selectedItem.soilData.temperature}°C</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-4">
                             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-accent-green">
                                <Droplets size={20} />
                             </div>
                             <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{t.crop.humidity}</p>
                                <p className="font-serif text-gray-900">{selectedItem.soilData.humidity}%</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-4">
                             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-accent-green">
                                <Wind size={20} />
                             </div>
                             <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{t.crop.rainfall}</p>
                                <p className="font-serif text-gray-900">{selectedItem.soilData.rainfall}mm</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-clay">{t.crop.optimalSowing}</h3>
                       <div className="prose prose-sm font-serif italic text-gray-600 leading-relaxed max-w-none">
                         {selectedItem.tips.split('\n').map((tip: string, i: number) => (
                           <p key={i} className={tip.trim().startsWith('*') || tip.trim().startsWith('-') ? 'pl-4 border-l-2 border-accent-green/20' : ''}>
                             {tip.replace(/^[*-\s]+/, '')}
                           </p>
                         ))}
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {selectedItem.imageUrl && (
                      <div className="aspect-video w-full rounded-[32px] overflow-hidden border-8 border-white shadow-xl">
                        <img src={selectedItem.imageUrl} alt="Detection" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-orange-50 p-6 rounded-[32px] border border-clay/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-clay/60 mb-2">{t.pest.confidence}</p>
                          <p className="text-3xl font-serif text-clay">{(selectedItem.confidence * 100).toFixed(1)}%</p>
                       </div>
                       <div className="bg-green-soft p-6 rounded-[32px] border border-accent-green/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-accent-green/60 mb-2">{t.pest.pathogenDetected}</p>
                          <p className="text-xl font-serif text-accent-green">{selectedItem.isPest ? 'Confirmed' : 'None detected'}</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-clay mb-3">{t.pest.morphDetails}</h3>
                          <p className="font-serif italic text-gray-600 leading-relaxed bg-[#F9F9F7] p-6 rounded-[32px] border border-[#E5E5E0]">
                            {selectedItem.details}
                          </p>
                       </div>

                       <div>
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-clay mb-3">{t.pest.recommendedPesticides}</h3>
                          <div className="grid grid-cols-1 gap-2">
                             {selectedItem.pesticides.map((p: string, i: number) => (
                               <div key={i} className="bg-white p-4 rounded-2xl border border-[#E5E5E0] flex items-center space-x-4">
                                  <div className="h-8 w-8 rounded-lg bg-green-soft flex items-center justify-center text-accent-green">
                                     <Beaker size={16} />
                                  </div>
                                  <span className="font-serif text-gray-900">{p}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-8 py-3 bg-accent-green text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-card hover:bg-accent-green/90 transition-all"
                >
                  {t.history.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
