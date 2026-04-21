import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, Loader2, Sprout } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/translations';

export default function AuthPage() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[40s] scale-125 motion-safe:animate-[pulse_20s_infinite_alternate]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2664&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-br from-forest/80 via-accent-green/40 to-clay/20 backdrop-blur-[1px]" />
      
      {/* Floating particles background effect */}
      <div className="absolute inset-0 z-2 opacity-30 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-clay rounded-full blur-[120px] animate-[pulse_10s_infinite]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-12">
           <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="inline-flex items-center justify-center h-20 w-20 bg-white rounded-[32px] shadow-float border border-white/40 mb-8 transform hover:rotate-12 transition-transform"
           >
              <Sprout className="h-10 w-10 text-accent-green" />
           </motion.div>
           <motion.h1 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1 }}
             className="font-serif text-6xl text-white mb-3 tracking-tight drop-shadow-2xl"
           >
             {t.auth.title}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-[11px] uppercase font-black tracking-[0.4em] text-green-soft drop-shadow-lg"
           >
             {t.auth.subtitle}
           </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/85 backdrop-blur-xl rounded-[3rem] p-12 shadow-float border border-white/40 relative overflow-hidden"
        >
          {/* Subtle inner glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent-green/10 rounded-full blur-3xl" />

          <div className="flex bg-forest/[0.03] p-1.5 rounded-[1.5rem] mb-10 border border-forest/[0.05]">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all",
                isLogin ? "bg-white text-accent-green shadow-sm ring-1 ring-forest/5" : "text-forest/30 hover:text-forest"
              )}
            >
              {t.auth.signIn}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all",
                !isLogin ? "bg-white text-accent-green shadow-sm ring-1 ring-forest/5" : "text-forest/30 hover:text-forest"
              )}
            >
              {t.auth.register}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-forest/40 ml-1">{t.auth.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-forest/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-accent-green/5 focus:border-accent-green/30 transition-all shadow-sm placeholder:text-forest/20"
                placeholder="farmer@agrizen.ai"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-forest/40 ml-1">{t.auth.password}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border border-forest/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-accent-green/5 focus:border-accent-green/30 transition-all shadow-sm placeholder:text-forest/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center italic leading-relaxed"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-green text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-accent-green/20 hover:bg-forest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 overflow-hidden group"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" /> : <UserPlus className="h-4 w-4" />}
                  <span>{isLogin ? t.auth.enterLaboratory : t.auth.createProfile}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-12 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-forest/5"></div></div>
            <span className="relative bg-white/0 px-6 text-[9px] uppercase font-black tracking-[0.3em] text-forest/20 backdrop-blur-sm">{t.auth.neuralNet}</span>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-white border border-forest/5 text-forest/80 font-black py-5 rounded-[1.5rem] shadow-sm hover:shadow-float active:scale-[0.98] transition-all flex items-center justify-center space-x-4 text-[10px] uppercase tracking-[0.2em]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
            <span>{t.auth.connectGoogle}</span>
          </button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 leading-relaxed"
        >
          {t.auth.sustainable}
        </motion.p>
      </div>
    </div>
  );
}
