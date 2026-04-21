import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, syncUserProfile } from './lib/firebase';
import Navbar from './components/layout/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CropPage from './pages/CropPage';
import PestPage from './pages/PestPage';
import HistoryPage from './pages/HistoryPage';
import MarketPage from './pages/MarketPage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncUserProfile(user);
      }
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl font-serif text-[#5A5A40]"
        >
          AgriZen
        </motion.div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-surface text-[#2C2C2C] font-sans selection:bg-accent-green selection:text-white overflow-hidden">
        {user && <Navbar user={user} />}
        <main className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/auth" 
                element={!user ? <AuthPage /> : <Navigate to="/" />} 
              />
              <Route 
                path="/" 
                element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/crop" 
                element={user ? <CropPage user={user} /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/pest" 
                element={user ? <PestPage user={user} /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/history" 
                element={user ? <HistoryPage user={user} /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/market" 
                element={user ? <MarketPage user={user} /> : <Navigate to="/auth" />} 
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </BrowserRouter>
  );
}
