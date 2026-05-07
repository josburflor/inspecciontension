import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ReadingForm } from './components/ReadingForm';
import { History } from './components/History';
import { Profile } from './components/Profile';
import { HealthGuide } from './components/HealthGuide';
import { Button } from '@/components/ui/button';
import { loginWithGoogle } from './lib/firebase';
import { Toaster, toast } from 'sonner';
import { motion } from 'motion/react';
import { Heart, Shield, Activity, Share2 } from 'lucide-react';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = async () => {
    try {
      console.log("Starting Google login...");
      await loginWithGoogle();
      toast.success('Sesión iniciada correctamente');
    } catch (error: any) {
      console.error("Login error:", error.code, error.message);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('La ventana de inicio de sesión fue cerrada.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('El navegador bloqueó la ventana emergente.', {
          description: 'Por favor, permite las ventanas emergentes o intenta de nuevo.'
        });
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google Sign-In no está habilitado.', {
          description: 'Debes habilitar Google en la consola de Firebase.'
        });
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('Dominio no autorizado.', {
          description: 'Añade este dominio a la lista de dominios autorizados en Firebase.'
        });
      } else {
        toast.error('Error al iniciar sesión con Google.', {
          description: error.message
        });
      }
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <motion.div
           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-16 h-16 text-red-500 fill-current" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Cargando TensioBot</h2>
          <p className="text-[#9E9E9E] font-mono text-xs uppercase tracking-widest">Sincronizando registros seguros...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center justify-center p-8 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0055AA] blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-xl w-full space-y-12 relative z-10 text-center">
          <div className="space-y-8">
            <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="flex flex-col items-center gap-6"
            >
              <img 
                src="/hero-login.jpg" 
                alt="TensioBot Hero" 
                className="w-full max-w-[320px] rounded-3xl shadow-2xl border-4 border-white"
                onError={(e) => {
                  // Fallback to the heart icon if the image is not found
                  (e.target as any).style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                  if (fallback) (fallback as any).style.display = 'flex';
                }}
              />
              <div className="fallback-icon hidden w-28 h-28 bg-[#0055AA] rounded-[2.5rem] flex items-center justify-center shadow-2xl ring-8 ring-white">
                <Heart className="text-white w-14 h-14 fill-white/20" />
              </div>
            </motion.div>

            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-black tracking-tight mb-4 text-[#0055AA]">TensioBot</h1>
              <p className="text-2xl font-bold text-black/60 max-w-md mx-auto">Tu compañero confiable para el control de la presión arterial.</p>
            </motion.div>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-lg border-2 border-transparent border-t-[#0055AA]">
              <Shield className="w-10 h-10 text-[#0055AA]" />
              <span className="text-md font-black uppercase tracking-widest text-[#0055AA]">Seguro</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-lg border-2 border-transparent border-t-red-500">
              <Activity className="w-10 h-10 text-red-500" />
              <span className="text-md font-black uppercase tracking-widest text-red-500">Salud</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl shadow-lg border-2 border-transparent border-t-blue-300">
              <Share2 className="w-10 h-10 text-blue-400" />
              <span className="text-md font-black uppercase tracking-widest text-blue-400">Control</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Button 
              onClick={handleLogin}
              className="w-full h-24 bg-[#0055AA] hover:bg-[#004488] text-white rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-6 group transition-all hover:scale-[1.02]"
            >
              <img src="https://www.google.com/favicon.ico" className="w-8 h-8 rounded-full bg-white p-1" alt="Google" />
              INICIAR CON GOOGLE
            </Button>
            <p className="text-lg font-black text-black/40 uppercase tracking-[0.2em]">
              Sencillo • Seguro • Médico
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setActiveTab} />;
      case 'history':
        return <History user={user} />;
      case 'add':
        return <ReadingForm user={user} onComplete={() => setActiveTab('dashboard')} />;
      case 'profile':
        return <Profile user={user} profile={profile} />;
      case 'guide':
        return <HealthGuide />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
        {renderContent()}
      </Layout>
      <Toaster position="top-right" expand={false} richColors />
    </>
  );
}
