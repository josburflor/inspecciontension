import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  History as HistoryIcon, 
  Settings, 
  PlusCircle, 
  LogOut,
  LayoutDashboard,
  Heart,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logout } from '@/src/lib/firebase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

export function Layout({ children, activeTab, setActiveTab, user }: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'history', label: 'Historial', icon: HistoryIcon },
    { id: 'add', label: 'Nuevo', icon: PlusCircle },
    { id: 'guide', label: 'Guía', icon: BookOpen },
    { id: 'profile', label: 'Perfil', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#141414] overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-white border-r border-[#D0D0D0] flex-col p-8 space-y-10 z-20 shadow-xl">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-[#0055AA] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Heart className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-[#0055AA]">TensioBot</h1>
            <p className="text-[12px] uppercase font-mono font-bold tracking-widest text-[#0055AA]/60">Pro Salud</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                activeTab === item.id 
                  ? "bg-[#0055AA] text-white shadow-xl scale-[1.02]" 
                  : "text-black hover:bg-[#EBF5FF] hover:text-[#0055AA] font-bold"
              )}
            >
              <item.icon className={cn("w-6 h-6", activeTab === item.id ? "text-white" : "text-[#0055AA]")} />
              <span className="font-bold text-lg">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-[#D0D0D0]">
          <div className="flex items-center gap-4 px-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0055AA] flex items-center justify-center text-white text-lg font-black uppercase transition-transform hover:scale-110 shadow-md overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.[0] || user?.email?.[0] || 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-black truncate text-black">{user?.displayName || 'Usuario'}</p>
              <p className="text-[12px] font-bold text-[#0055AA]/60 truncate font-mono uppercase">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={logout}
            className="w-full justify-start gap-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl p-6 font-black"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-md">Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#D0D0D0] flex justify-around p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors px-4",
              activeTab === item.id ? "text-[#0055AA]" : "text-black/40"
            )}
          >
            <item.icon className="w-7 h-7" />
            <span className="text-[12px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Header - Mobile */}
      <header className="md:hidden bg-white border-b border-[#D0D0D0] p-5 flex justify-between items-center z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Heart className="text-[#0055AA] w-8 h-8 fill-[#0055AA]/10" />
          <h1 className="font-black text-2xl text-[#0055AA]">TensioBot</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#0055AA] flex items-center justify-center text-white text-sm font-black uppercase shadow-md shadow-blue-100 overflow-hidden">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
          ) : (
            user?.displayName?.[0] || 'U'
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative h-screen overflow-y-auto pb-20 md:pb-0">
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
