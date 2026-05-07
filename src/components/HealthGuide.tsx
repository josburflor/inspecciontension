import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, BookOpen, Clock, Activity, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export function HealthGuide() {
  const bpCategories = [
    { range: '1-12 meses', sys: '75-100', dia: '50-70', label: 'Bebés' },
    { range: '1-5 años', sys: '80-110', dia: '50-80', label: 'Niños pequeños' },
    { range: '6-13 años', sys: '90-115', dia: '60-80', label: 'Niños' },
    { range: '14-19 años', sys: '105-120', dia: '70-80', label: 'Adolescentes' },
    { range: '20-39 años', sys: '110-125', dia: '70-85', label: 'Adultos jóvenes' },
    { range: '40-59 años', sys: '120-135', dia: '80-88', label: 'Adultos' },
    { range: '60+ años', sys: '125-145', dia: '85-90', label: 'Adultos mayores' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-10">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-[#0055AA]/10 rounded-full mb-2">
          <BookOpen className="w-10 h-10 text-[#0055AA]" />
        </div>
        <h2 className="text-5xl font-black tracking-tight text-[#0055AA]">Guía de Salud</h2>
        <p className="text-xl font-bold text-black/50 max-w-2xl mx-auto">
          Aprende a entender tu presión arterial de forma sencilla y clara.
        </p>
      </header>

      {/* Definitions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-[#0055AA]"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Activity className="w-8 h-8 text-[#0055AA]" />
            </div>
            <h3 className="text-2xl font-black text-[#0055AA]">Sistólica (Alta)</h3>
          </div>
          <p className="text-lg leading-relaxed text-black/70 font-medium">
            Es el número <strong className="text-[#0055AA] font-black">más alto</strong>. 
            Indica la fuerza con la que el corazón bombea sangre al cuerpo cuando late. 
            <br /><br />
            <span className="italic bg-blue-50 p-2 rounded-lg inline-block text-sm">Piensa en ello como el "empuje" de tu corazón.</span>
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border-l-8 border-red-500"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-50 rounded-2xl">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-red-500">Diastólica (Baja)</h3>
          </div>
          <p className="text-lg leading-relaxed text-black/70 font-medium">
            Es el número <strong className="text-red-500 font-black">más bajo</strong>. 
            Indica la presión en las arterias cuando el corazón descansa entre latidos.
            <br /><br />
            <span className="italic bg-red-50 p-2 rounded-lg inline-block text-sm">Piensa en ello como la "pausa" para recargar.</span>
          </p>
        </motion.div>
      </div>

      {/* Categories Clarity Section */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-lg border border-[#0055AA]/10">
        <h3 className="text-3xl font-black text-[#0055AA] mb-6">Entendiendo los términos</h3>
        <div className="space-y-6">
          <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
            <h4 className="text-2xl font-black text-red-700 mb-2">¿Qué es Hipertensión Grado 2?</h4>
            <p className="text-lg font-bold text-red-800/70 leading-relaxed">
              Significa que tu presión está <span className="text-red-700 font-black">muy por encima</span> de lo normal. Es un aviso serio de tu cuerpo. No significa que sea una emergencia inmediata, pero sí que debes tomar medidas urgentes con tu médico y ajustar tu estilo de vida para evitar riesgos mayores en el futuro.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <h4 className="text-2xl font-black text-[#0055AA] mb-2">¿Qué es la Hipotensión?</h4>
            <p className="text-lg font-bold text-blue-800/70 leading-relaxed">
              Es cuando la presión está <span className="text-blue-700 font-black">más baja de lo usual</span>. Puede causar mareos o cansancio. A veces es normal por haber dormido mucho o por la constitución de la persona, pero si hay desmayos, requiere atención.
            </p>
          </div>
        </div>
      </div>

      {/* Values Table Section */}
      <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
        <CardHeader className="bg-[#0055AA] text-white p-8">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8" />
            <CardTitle className="text-3xl font-black">Valores por Edad</CardTitle>
          </div>
          <p className="text-white/80 font-bold mt-2">
            Valores promedio para estar saludable según tus años.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F8FF] border-b border-[#D0D0D0]">
                  <th className="p-6 text-xl font-black text-[#0055AA]">Edad</th>
                  <th className="p-6 text-xl font-black text-[#0055AA] text-center">Alta (Sistólica)</th>
                  <th className="p-6 text-xl font-black text-[#0055AA] text-center">Baja (Diastólica)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {bpCategories.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-6">
                      <div className="font-black text-xl text-black">{cat.range}</div>
                      <div className="text-sm font-bold text-black/40 uppercase tracking-widest">{cat.label}</div>
                    </td>
                    <td className="p-6 text-2xl font-mono font-bold text-center text-[#0055AA]">{cat.sys}</td>
                    <td className="p-6 text-2xl font-mono font-bold text-center text-red-500">{cat.dia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Advice Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-red-50 p-10 rounded-[3rem] border-2 border-red-200">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white rounded-3xl shadow-sm">
              <Heart className="w-10 h-10 text-red-600 animate-pulse" />
            </div>
            <div className="space-y-4">
              <h4 className="text-3xl font-black text-red-900">¿Presión ALTA?</h4>
              <p className="text-lg font-bold text-red-800/80">Sigue estos pasos para calmarte:</p>
              <ul className="space-y-4 text-lg font-bold text-red-800/70">
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full mt-2 shrink-0" />
                  Reposa en un lugar fresco y silencioso.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full mt-2 shrink-0" />
                  Respira profundo: Inhala (4s), exhala (6s).
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full mt-2 shrink-0" />
                  Bebe un poco de agua fresca.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-10 rounded-[3rem] border-2 border-blue-200">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white rounded-3xl shadow-sm">
              <Activity className="w-10 h-10 text-blue-600" />
            </div>
            <div className="space-y-4">
              <h4 className="text-3xl font-black text-blue-900">¿Presión BAJA?</h4>
              <p className="text-lg font-bold text-blue-800/80">Si te sientes débil o mareado:</p>
              <ul className="space-y-4 text-lg font-bold text-blue-800/70">
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 shrink-0" />
                  Túmbate y eleva las piernas por encima del corazón.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 shrink-0" />
                  Bebe agua o algo con electrolitos.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 shrink-0" />
                  No te levantes de golpe; siéntate primero.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 p-10 rounded-[3rem] border-2 border-yellow-200">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-white rounded-3xl shadow-sm">
            <Info className="w-10 h-10 text-yellow-600" />
          </div>
          <div className="space-y-4">
            <h4 className="text-3xl font-black text-yellow-900">Consejos para una buena medición</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl font-bold text-yellow-800/80">
              <li className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                Reposa 5 minutos antes.
              </li>
              <li className="flexitems-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                No hables ni cruces las piernas.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                Brazo a la altura del corazón.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                Evita café o tabaco antes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
