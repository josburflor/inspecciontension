import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Droplets, 
  Zap,
  CheckCircle2,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getBPStatus } from '../lib/healthUtils';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format, subDays, isWithinInterval, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';

export function Dashboard({ user, onNavigate }: { user: any, onNavigate?: (tab: string) => void }) {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'readings'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
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

  const latest = readings[0];
  const chartData = [...readings].reverse().map(r => ({
    time: format(r.timestamp, 'HH:mm'),
    date: format(r.timestamp, 'dd/MM'),
    sys: r.systolic,
    dia: r.diastolic,
    hr: r.heartRate
  }));

  const avgSys = readings.length > 0 ? Math.round(readings.reduce((acc, r) => acc + r.systolic, 0) / readings.length) : 0;
  const avgDia = readings.length > 0 ? Math.round(readings.reduce((acc, r) => acc + r.diastolic, 0) / readings.length) : 0;

  const currentStatus = getBPStatus(avgSys, avgDia);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="w-8 h-8 animate-pulse text-[#9E9E9E]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-black">Bienvenido de nuevo</h2>
          <p className="text-xl font-bold text-[#0055AA]/70">Aquí tienes un resumen de tu salud cardiovascular.</p>
        </div>
        <div className="bg-[#0055AA] p-4 rounded-3xl flex items-center gap-4 text-white shadow-lg cursor-pointer hover:bg-[#004488] transition-all group scale-100 hover:scale-105 active:scale-95" onClick={() => onNavigate?.('guide')}>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-widest">¿No entiendes los términos?</p>
            <p className="text-lg font-bold">Ver Guía de Salud →</p>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden ring-1 ring-[#D0D0D0]">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Droplets className="text-[#0055AA] w-8 h-8" />
              </div>
              <span className={cn("text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl", currentStatus.bgColor, currentStatus.textColor)}>
                {currentStatus.label}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-md font-black text-black/40 uppercase tracking-widest font-mono">Presión Arterial</p>
              <h3 className="text-5xl font-black font-mono text-black">
                {avgSys}<span className="text-3xl text-black/20 px-1">/</span>{avgDia}
              </h3>
              <p className="text-xs uppercase text-black/60 font-black tracking-widest">PROMEDIO mmHg</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden ring-1 ring-[#D0D0D0]">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-red-50 rounded-2xl">
                <Activity className="text-red-600 w-8 h-8" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-md font-black text-black/40 uppercase tracking-widest font-mono">Ritmo Cardíaco</p>
              <h3 className="text-5xl font-black font-mono text-black">
                {readings.length > 0 ? Math.round(readings.reduce((acc, r) => acc + r.heartRate, 0) / readings.length) : 0}
              </h3>
              <p className="text-xs uppercase text-black/60 font-black tracking-widest">BPM (PULSACIONES)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden ring-1 ring-[#D0D0D0]">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-purple-50 rounded-2xl">
                <Zap className="text-purple-600 w-8 h-8" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-md font-black text-black/40 uppercase tracking-widest font-mono">Nivel de Estrés</p>
              <h3 className="text-5xl font-black font-mono text-black">
                {readings.length > 0 ? (readings.reduce((acc, r) => acc + (r.stressLevel || 0), 0) / readings.length).toFixed(1) : '—'}
              </h3>
              <p className="text-xs uppercase text-black/60 font-black tracking-widest">ESCALA 1-10</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white rounded-3xl p-6">
          <CardHeader className="p-0 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Tendencia de Presión</CardTitle>
                <CardDescription>Últimas 20 mediciones</CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9E9E9E' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9E9E9E' }}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sys" 
                  name="Sistólica"
                  stroke="#141414" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSys)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="dia" 
                  name="Diastólica"
                  stroke="#9E9E9E" 
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-3xl p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl">Actividad Cardíaca (BPM)</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9E9E9E' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9E9E9E' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="hr" 
                  name="BPM"
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Latest Readings List */}
      <div className="space-y-6">
        <h3 className="font-black text-2xl px-2 text-black">Lecturas Recientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {readings.slice(0, 4).map((r) => {
            const rStatus = getBPStatus(r.systolic, r.diastolic);
            return (
            <div key={r.id} className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border-2 border-transparent hover:border-[#0055AA] transition-all cursor-pointer group ring-1 ring-[#D0D0D0]/50">
              <div className="flex items-center gap-5">
                <div className={cn("p-4 rounded-2xl flex items-center justify-center min-w-[80px]", rStatus.bgColor, rStatus.textColor)}>
                  <p className="text-xl font-black font-mono tracking-tighter">{r.systolic}/{r.diastolic}</p>
                </div>
                <div>
                  <p className="text-lg font-black text-black">{rStatus.label}</p>
                  <p className="text-[12px] text-black/50 uppercase font-bold tracking-widest">
                    {format(r.timestamp, "d 'de' MMMM", { locale: es })} • {format(r.timestamp, "HH:mm")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black font-mono text-black">{r.heartRate} <span className="text-[12px] text-black/40 uppercase">BPM</span></p>
                <div className="flex gap-1.5 justify-end mt-2">
                   {Array.from({ length: 5 }).map((_, i) => (
                     <div key={i} className={cn("w-2.5 h-2.5 rounded-full", i < (r.stressLevel / 2) ? "bg-[#0055AA]" : "bg-[#F5F5F5]")} />
                   ))}
                </div>
              </div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}
