import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getBPStatus } from '../lib/healthUtils';
import { toast } from 'sonner';
import { Heart, Activity, Thermometer, Brain, FileText, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function ReadingForm({ user, onComplete }: { user: any, onComplete: () => void }) {
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [heartRate, setHeartRate] = useState('70');
  const [stressLevel, setStressLevel] = useState(5);
  const [mood, setMood] = useState('Neutral');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const sys = parseInt(systolic);
      const dia = parseInt(diastolic);

      const reading = {
        userId: user.uid,
        systolic: sys,
        diastolic: dia,
        heartRate: parseInt(heartRate),
        stressLevel: stressLevel,
        mood: mood,
        note: note,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'readings'), reading);
      
      // Anomaly detection
      const status = getBPStatus(sys, dia);
      
      if (sys >= 180 || dia >= 120) {
        toast.error('🚨 ¡EMERGENCIA MÉDICA!', {
          description: status.description,
          duration: 10000,
        });
      } else if (sys >= 160 || dia >= 100) {
        toast.error('⚠️ ALERTA: ' + status.label, {
          description: 'Tu presión está muy alta. ' + status.description,
          duration: 8000,
        });
      } else if (sys >= 140 || dia >= 90) {
        toast.warning('⚠️ ' + status.label, {
          description: status.description,
          duration: 6000,
        });
      } else if (sys <= 90 || dia <= 60) {
        toast.warning('⚠️ ' + status.label, {
          description: status.description,
          duration: 6000,
        });
      } else {
        toast.success('✅ ' + status.label, {
          description: status.description,
        });
      }

      onComplete();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'readings');
      toast.error('Error al guardar la lectura');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-black tracking-tight text-black">Nueva Medición</h2>
        <p className="text-xl font-bold text-[#0055AA]/70">Por favor, introduce tus datos con calma.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none shadow-md bg-white rounded-3xl p-4 ring-1 ring-[#D0D0D0]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 text-[#0055AA] mb-1">
                <Heart className="w-8 h-8 fill-current" />
                <span className="text-xs font-black uppercase tracking-widest">Presión Arterial</span>
              </div>
              <CardTitle className="text-2xl font-black">Tensión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-6 items-end">
                <div className="flex-1 space-y-3">
                  <Label htmlFor="systolic" className="text-xs font-black uppercase text-black/40 tracking-widest">Sistólica</Label>
                  <Input 
                    id="systolic"
                    type="number" 
                    value={systolic} 
                    onChange={e => setSystolic(e.target.value)} 
                    className="h-20 text-4xl font-black font-mono border-none bg-blue-50/50 rounded-2xl focus-visible:ring-2 focus-visible:ring-[#0055AA] text-center"
                    required
                  />
                </div>
                <span className="text-5xl text-black/10 pb-4 font-mono">/</span>
                <div className="flex-1 space-y-3">
                  <Label htmlFor="diastolic" className="text-xs font-black uppercase text-black/40 tracking-widest">Diastólica</Label>
                  <Input 
                    id="diastolic"
                    type="number" 
                    value={diastolic} 
                    onChange={e => setDiastolic(e.target.value)} 
                    className="h-20 text-4xl font-black font-mono border-none bg-blue-50/50 rounded-2xl focus-visible:ring-2 focus-visible:ring-[#0055AA] text-center"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white rounded-3xl p-4 ring-1 ring-[#D0D0D0]">
             <CardHeader className="pb-4">
              <div className="flex items-center gap-3 text-red-600 mb-1">
                <Activity className="w-8 h-8" />
                <span className="text-xs font-black uppercase tracking-widest">Ritmo Cardíaco</span>
              </div>
              <CardTitle className="text-2xl font-black">BPM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="heartRate" className="text-xs font-black uppercase text-black/40 tracking-widest">Pulsaciones</Label>
                <Input 
                  id="heartRate"
                  type="number" 
                  value={heartRate} 
                  onChange={e => setHeartRate(e.target.value)} 
                  className="h-20 text-4xl font-black font-mono border-none bg-red-50/30 rounded-2xl focus-visible:ring-2 focus-visible:ring-red-600 text-center"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-md bg-white rounded-3xl p-4 ring-1 ring-[#D0D0D0]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 text-purple-600 mb-1">
              <Brain className="w-8 h-8" />
              <span className="text-xs font-black uppercase tracking-widest">Psicología</span>
            </div>
            <CardTitle className="text-2xl font-black">Nivel de Estrés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <Label className="text-xs font-black uppercase text-black/40 tracking-widest">¿Cómo te sientes?</Label>
                <span className="text-4xl font-black font-mono text-[#0055AA]">{stressLevel}</span>
              </div>
              <div className="flex gap-4">
                {Array.from({ length: 5 }).map((_, i) => {
                  const val = (i + 1) * 2;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setStressLevel(val)}
                      className={cn(
                        "flex-1 h-14 rounded-2xl transition-all border-2 flex items-center justify-center font-black text-xl shadow-sm",
                        stressLevel === val 
                          ? "bg-[#0055AA] text-white border-[#0055AA] scale-105" 
                          : "bg-white border-[#D0D0D0] text-black/40"
                      )}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase text-black/40 tracking-widest">Estado de Ánimo</Label>
              <div className="flex justify-between p-4 bg-gray-50 rounded-3xl gap-2">
                {['😊', '😐', '😔', '😫', '😡'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={cn(
                      "flex-1 aspect-square text-4xl flex items-center justify-center rounded-2xl transition-all border-2",
                      mood === m ? "bg-white border-[#0055AA] shadow-md scale-110" : "bg-transparent border-transparent grayscale opacity-50"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white rounded-3xl p-4 ring-1 ring-[#D0D0D0]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 text-zinc-500 mb-1">
              <FileText className="w-8 h-8" />
              <span className="text-xs font-black uppercase tracking-widest">Observaciones</span>
            </div>
            <CardTitle className="text-2xl font-black">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea 
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Escribe aquí si sientes mareos, dolor o algo inusual..."
              className="w-full h-40 bg-zinc-50 border-2 border-transparent focus:border-[#0055AA] rounded-2xl p-6 outline-none text-xl font-bold placeholder:text-black/20 transition-all resize-none"
            />
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-24 rounded-[2.5rem] bg-[#0055AA] hover:bg-[#004488] text-white text-2xl font-black shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex gap-4 items-center justify-center"
        >
          {isSubmitting ? (
            <Activity className="animate-spin w-10 h-10" />
          ) : (
            <>
              <Check className="w-10 h-10 stroke-[4px]" />
              <span>GUARDAR MEDICIÓN</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
