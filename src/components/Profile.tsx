import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User, Scale, Ruler, Calendar, Mail, ShieldCheck, Info } from 'lucide-react';

export function Profile({ user, profile }: { user: any, profile: any }) {
  const [name, setName] = useState(profile?.name || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [gender, setGender] = useState(profile?.gender || 'other');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        gender
      });
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tight text-[#0055AA]">Mi Perfil</h2>
        <p className="text-xl font-bold text-black/50 mt-2">Completa tus datos para que el sistema te ayude mejor.</p>
      </header>

      <form onSubmit={handleUpdate} className="space-y-6">
        <Card className="border-none shadow-sm bg-white rounded-3xl p-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-zinc-500 mb-1">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Información Personal</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-[#F5F5F5] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-zinc-300" />
                )}
              </div>
              <div>
                <h3 className="font-black text-xl">{user?.displayName || 'Usuario'}</h3>
                <p className="text-sm text-zinc-500">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase text-[#9E9E9E]">Nombre Completo</Label>
              <Input 
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-12 border-none bg-[#F5F5F5] rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-[#9E9E9E]">Correo Electrónico</Label>
                <div className="flex items-center gap-2 px-4 h-12 bg-[#F5F5F5] rounded-xl text-[#9E9E9E] text-sm overflow-hidden whitespace-nowrap">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-[#9E9E9E]">Género</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-12 border-none bg-[#F5F5F5] rounded-xl outline-none ring-0">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#E5E5E5]">
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro / No definido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-white rounded-3xl p-2 ring-4 ring-[#0055AA]/10">
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-center gap-2 text-[#0055AA] mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg font-black uppercase">Tu Edad</span>
              </div>
              <Input 
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="h-16 border-none bg-[#F5F5F5] rounded-xl font-black text-3xl text-center text-[#0055AA]"
              />
              <p className="text-sm text-[#0055AA] font-black text-center uppercase tracking-widest mt-2">Años cumplidos</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-3xl p-2">
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <Scale className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Peso</span>
              </div>
              <Input 
                type="number"
                step="0.1"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="h-12 border-none bg-[#F5F5F5] rounded-xl font-mono text-lg"
              />
              <p className="text-[8px] text-[#9E9E9E] uppercase font-bold text-center">Kilogramos</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-3xl p-2">
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <Ruler className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Altura</span>
              </div>
              <Input 
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="h-12 border-none bg-[#F5F5F5] rounded-xl font-mono text-lg"
              />
              <p className="text-[8px] text-[#9E9E9E] uppercase font-bold text-center">Centímetros</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm bg-white rounded-3xl p-6 bg-gradient-to-br from-blue-50/50 to-white border-l-8 border-blue-400">
          <div className="flex gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-blue-100 self-start">
              <Info className="text-[#0055AA] w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-[#0055AA] text-lg">¿Por qué pedimos tu edad?</h4>
              <p className="text-lg text-black/70 mt-1 leading-relaxed font-medium">
                La presión arterial cambia naturalmente con los años. Conocer tu edad nos permite mostrarte si tus valores están en el rango normal para tu etapa de vida.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-3xl p-6 bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="flex gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-indigo-100 self-start">
              <ShieldCheck className="text-indigo-500 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900">Seguridad de Datos</h4>
              <p className="text-sm text-indigo-700/80 mt-1 leading-relaxed">
                Tus datos están protegidos y solo tú puedes acceder a ellos. Los registros se almacenan de forma segura en la nube para sincronización entre dispositivos.
              </p>
            </div>
          </div>
        </Card>

        <Button 
          type="submit" 
          disabled={isUpdating}
          className="w-full h-14 rounded-2xl bg-[#141414] hover:bg-black text-white font-bold transition-all"
        >
          {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </div>
  );
}
