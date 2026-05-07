import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Download, 
  Trash2, 
  Filter,
  MoreVertical,
  Calendar as CalendarIcon,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getBPStatus } from '../lib/healthUtils';
import { toast } from 'sonner';

export function History({ user }: { user: any }) {
  const [readings, setReadings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'readings'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setReadings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await deleteDoc(doc(db, 'readings', id));
        toast.success('Registro eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Hora', 'Sistólica', 'Diastólica', 'BPM', 'Estrés', 'Estado', 'Notas'];
    const rows = readings.map(r => [
      format(r.timestamp, 'yyyy-MM-dd'),
      format(r.timestamp, 'HH:mm'),
      r.systolic,
      r.diastolic,
      r.heartRate,
      r.stressLevel,
      r.mood,
      r.note.replace(/,/g, ';')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tensiolog_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReadings = readings.filter(r => 
    r.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.mood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-black">Historial Completo</h2>
          <p className="text-xl font-bold text-[#0055AA]/70">Gestiona tus registros históricos con facilidad.</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="h-14 px-8 rounded-2xl border-2 font-black text-[#0055AA] border-[#0055AA] hover:bg-[#0055AA] hover:text-white transition-all gap-3 shadow-sm">
          <Download className="w-6 h-6" />
          <span>Exportar Datos</span>
        </Button>
      </header>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/40 w-6 h-6" />
        <Input 
          placeholder="Buscar por notas o estado de ánimo..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-16 h-20 border-none bg-white shadow-md rounded-3xl focus-visible:ring-2 focus-visible:ring-[#0055AA] text-lg font-bold placeholder:text-black/20 ring-1 ring-[#D0D0D0]/50"
        />
      </div>

      <div className="space-y-6">
        {filteredReadings.map((r) => {
          const rStatus = getBPStatus(r.systolic, r.diastolic);
          return (
          <div key={r.id} className="bg-white p-8 rounded-[2rem] shadow-md border-2 border-transparent hover:border-[#0055AA] transition-all group ring-1 ring-[#D0D0D0]/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-24 h-24 rounded-3xl flex flex-col items-center justify-center shadow-inner",
                  rStatus.bgColor, rStatus.textColor
                )}>
                  <p className="text-2xl font-black font-mono leading-none">{r.systolic}</p>
                  <div className="w-10 h-[2px] bg-black/10 my-1" />
                  <p className="text-2xl font-black font-mono leading-none">{r.diastolic}</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{r.mood}</span>
                    <h3 className={cn("text-2xl font-black", rStatus.textColor)}>
                      {rStatus.label}
                    </h3>
                  </div>
                  <p className="text-lg font-bold text-black/50 uppercase tracking-widest font-mono">
                    {format(r.timestamp, "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                  <p className="text-md font-bold text-[#0055AA]">A las {format(r.timestamp, "HH:mm")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:flex lg:items-center gap-10">
                <div className="text-center lg:text-left">
                  <p className="text-[12px] font-black uppercase tracking-widest text-black/30 mb-1">Ritmo</p>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Activity className="w-6 h-6 text-red-500" />
                    <span className="text-2xl font-black font-mono">{r.heartRate} <span className="text-xs font-bold text-black/40 tracking-tighter">BPM</span></span>
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <p className="text-[12px] font-black uppercase tracking-widest text-black/30 mb-1">Estrés</p>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Zap className="w-6 h-6 text-purple-500" />
                    <span className="text-2xl font-black font-mono">{r.stressLevel} <span className="text-xs font-bold text-black/40 tracking-tighter">/ 10</span></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 flex-1 md:justify-end">
                {r.note && (
                   <div className="w-full md:max-w-[200px] p-6 bg-zinc-50 rounded-2xl border-l-4 border-[#0055AA]">
                     <p className="text-md font-bold text-black/70 italic line-clamp-3">"{r.note}"</p>
                   </div>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(r.id)}
                  className="w-14 h-14 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-7 h-7" />
                </Button>
              </div>
            </div>
          </div>
        );})}
        {filteredReadings.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2rem] border-2 border-dashed border-[#D0D0D0]">
            <Search className="w-16 h-16 text-black/10 mb-4" />
            <p className="text-xl font-black text-black/30 italic">No se encontraron registros para tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
