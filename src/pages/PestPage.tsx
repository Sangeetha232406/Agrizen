import React, { useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { detectPest } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bug, 
  Camera, 
  Upload, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  Info,
  X,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/translations';

interface PestPageProps {
  user: User;
}

export default function PestPage({ user }: PestPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true);
    
    try {
      const detection = await detectPest(image);
      
      // Save to Firebase
      await addDoc(collection(db, 'detections'), {
        userId: user.uid,
        imageUrl: image, // In a real app, store in Cloud Storage and save URL
        pestName: detection.pestName,
        confidence: detection.confidence,
        pesticides: detection.pesticides,
        details: detection.details,
        timestamp: serverTimestamp()
      });

      setResult(detection);
    } catch (err) {
      console.error(err);
      try {
        handleFirestoreError(err, 'create', 'detections');
      } catch (firestoreErr: any) {
        alert(`${firestoreErr.message}`);
      }
      alert('Recognition failed. Please try again with a clearer photo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-clay mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t.common.backToDashboard}
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-clay font-bold mb-1">{t.dashboard.diagnosticTool}</p>
            <h1 className="font-serif text-4xl text-accent-green mb-2 text-balance">{t.pest.title}</h1>
            <p className="text-gray-500 italic text-sm">{t.pest.subtitle}</p>
          </div>

          <div className="space-y-6">
            <div className="aspect-[4/3] bg-white rounded-[32px] border-2 border-dashed border-[#E5E5E0] overflow-hidden relative flex items-center justify-center group transition-all hover:bg-white/80 shadow-card">
              {image ? (
                <>
                  <img src={image} alt="Crop preview" className="w-full h-full object-cover" />
                  {!result && (
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                   <div className="h-20 w-20 bg-green-soft rounded-[28px] mx-auto mb-6 flex items-center justify-center text-accent-green transition-transform group-hover:scale-110 shadow-inner">
                      <Camera size={32} />
                   </div>
                   <div className="space-y-2">
                     <p className="text-accent-green font-serif text-xl italic">{t.pest.noImage}</p>
                     <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">{t.pest.uploadClear}</p>
                   </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 py-4 border border-[#E5E5E0] bg-white rounded-xl font-bold uppercase tracking-widest text-[10px] text-gray-400 hover:text-clay hover:border-clay/30 transition-all shadow-sm"
               >
                 <Upload size={14} />
                 <span>{t.pest.uploadFile}</span>
               </button>
               
               <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
               />

               <button 
                onClick={() => fileInputRef.current?.setAttribute('capture', 'environment')}
                className="flex items-center justify-center space-x-2 py-4 bg-accent-green text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#3d632e] transition-all shadow-card shadow-accent-green/20"
               >
                 <Camera size={14} />
                 <span>{t.pest.launchCamera}</span>
               </button>
            </div>

            {image && !result && (
              <button
                onClick={handleDetect}
                disabled={loading}
                className="w-full py-4 bg-clay text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-card shadow-clay/20 hover:bg-[#a05a1e] transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t.pest.processing}</span>
                  </>
                ) : (
                  <>
                    <Bug className="h-4 w-4" />
                    <span>{t.pest.analyzePattern}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="relative">
           <AnimatePresence mode="wait">
             {result ? (
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white rounded-[32px] p-8 border border-white shadow-card h-full overflow-y-auto"
               >
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay block mb-1">{t.pest.pathogenDetected}</span>
                       <h2 className="font-serif text-4xl text-accent-green">{result.pestName}</h2>
                    </div>
                    <div className="h-16 w-16 bg-green-soft rounded-2xl flex flex-col items-center justify-center text-accent-green border border-white">
                       <span className="text-xs font-bold leading-none">{Math.round(result.confidence * 100)}%</span>
                       <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">{t.pest.confidence}</span>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <section>
                       <div className="flex items-center space-x-2 text-clay mb-4">
                          <Info size={14} />
                          <h3 className="text-[10px] font-black uppercase tracking-widest">{t.pest.morphologicalDetails}</h3>
                       </div>
                       <p className="text-gray-600 font-serif text-lg leading-relaxed italic border-l-2 border-clay/20 pl-4">{result.details}</p>
                    </section>

                    <section className="bg-green-soft/30 p-6 rounded-2xl border border-green-soft">
                       <div className="flex items-center space-x-2 text-accent-green mb-4">
                          <ShieldCheck size={16} />
                          <h3 className="text-[10px] font-black uppercase tracking-widest">{t.pest.recommendedPesticides}</h3>
                       </div>
                       <div className="grid grid-cols-1 gap-3">
                          {result.pesticides.map((p: string, i: number) => (
                             <div key={i} className="flex items-center justify-between bg-white/60 p-4 rounded-xl border border-white group">
                                <span className="text-xs font-bold text-gray-700 tracking-tight">{p}</span>
                                <div className="h-6 w-6 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
                                   <ChevronRight size={12} />
                                </div>
                             </div>
                          ))}
                       </div>
                    </section>
                 </div>

                 <button 
                  onClick={reset}
                  className="mt-10 text-[10px] uppercase font-bold text-gray-400 hover:text-clay flex items-center transition-colors tracking-widest"
                 >
                   {t.pest.newScan} <ChevronRight size={14} className="ml-1" />
                 </button>
               </motion.div>
             ) : (
               <div className="h-full bg-white rounded-[32px] border border-white shadow-card flex items-center justify-center p-12 text-center">
                  <div className="space-y-6 max-w-xs">
                     <div className="bg-green-soft h-20 w-20 rounded-[28px] mx-auto flex items-center justify-center shadow-inner border border-white/50">
                        <Bug size={32} className="text-accent-green" />
                     </div>
                     <div>
                       <p className="text-accent-green font-serif text-xl mb-1 italic">{t.pest.scanPending}</p>
                       <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">{t.pest.positionLens}</p>
                     </div>
                  </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
