// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { User, Thermometer, Activity, Stethoscope } from 'lucide-react';
// import { Symptoms, Vitals } from '@/lib/inference-engine';

// interface FormData {
//   childName: string;
//   childGender: string;
//   childAgeMonths: number;
//   hasComorbidities: boolean; // Thêm dòng này
//   symptoms: Symptoms;
//   vitals: Vitals;
// }

// interface DiagnosisFormProps {
//   onSubmit: (data: FormData) => void;
//   isLoading?: boolean;
// }

// export function DiagnosisForm({ onSubmit, isLoading }: DiagnosisFormProps) {
//   const [formData, setFormData] = useState<FormData>({
//     childName: '',
//     childGender: '',
//     childAgeMonths: 0,
//     hasComorbidities: false, // Thêm dòng này
//     symptoms: {
//       mouthUlcer: false,
//       rash: false,
//       highFever: false,
//       feverOver2Days: false,
//       vomiting: false,
//       lethargy: false,
//       limbWeakness: false,
//     },
//     vitals: {
//       heartRate: 100,
//       spo2: 98,
//       startleCount: 0,
//       isRestingNoFever: false,
//     },
//   });

//   const updateSymptom = (key: keyof Symptoms, value: boolean) => {
//     setFormData(prev => ({
//       ...prev,
//       symptoms: { ...prev.symptoms, [key]: value },
//     }));
//   };

//   const updateVital = (key: keyof Vitals, value: number | boolean) => {
//     setFormData(prev => ({
//       ...prev,
//       vitals: { ...prev.vitals, [key]: value },
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid gap-6 md:grid-cols-3">
//         {/* Card 1: Child Info */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2 text-lg">
//               <User className="h-5 w-5 text-primary" />
//               Thông tin trẻ
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="childName">Họ và tên</Label>
//               <Input
//                 id="childName"
//                 placeholder="Nhập tên trẻ"
//                 value={formData.childName}
//                 onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="childGender">Giới tính</Label>
//               <Select
//                 value={formData.childGender}
//                 onValueChange={(value) => setFormData(prev => ({ ...prev, childGender: value }))}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Chọn giới tính" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="male">Nam</SelectItem>
//                   <SelectItem value="female">Nữ</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="childAge">Tuổi (tháng)</Label>
//               <Input
//                 id="childAge"
//                 type="number"
//                 min={0}
//                 max={120}
//                 placeholder="VD: 24"
//                 value={formData.childAgeMonths || ''}
//                 onChange={(e) => setFormData(prev => ({ ...prev, childAgeMonths: parseInt(e.target.value) || 0 }))}
//                 required
//               />
//             </div>
//             <div className="flex items-center justify-between pt-2 border-t">
//               <Label htmlFor="hasComorbidities" className="text-sm cursor-pointer">Bệnh nền (Tim mạch, phổi...)</Label>
//               <Switch 
//                 id="hasComorbidities"
//                 checked={formData.hasComorbidities}
//                 onCheckedChange={(v) => setFormData(prev => ({ ...prev, hasComorbidities: v }))}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Card 2: Symptoms */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2 text-lg">
//               <Thermometer className="h-5 w-5 text-primary" />
//               Triệu chứng lâm sàng
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <SymptomToggle
//               label="Loét miệng, họng"
//               checked={formData.symptoms.mouthUlcer}
//               onChange={(v) => updateSymptom('mouthUlcer', v)}
//             />
//             <SymptomToggle
//               label="Phát ban da (tay, chân, mông)"
//               checked={formData.symptoms.rash}
//               onChange={(v) => updateSymptom('rash', v)}
//             />
//             <SymptomToggle
//               label="Sốt cao ≥ 39°C"
//               checked={formData.symptoms.highFever}
//               onChange={(v) => updateSymptom('highFever', v)}
//             />
//             <SymptomToggle
//               label="Sốt kéo dài > 2 ngày"
//               checked={formData.symptoms.feverOver2Days}
//               onChange={(v) => updateSymptom('feverOver2Days', v)}
//             />
//             <SymptomToggle
//               label="Nôn nhiều"
//               checked={formData.symptoms.vomiting}
//               onChange={(v) => updateSymptom('vomiting', v)}
//             />
//             <SymptomToggle
//               label="Lừ đừ, mệt mỏi"
//               checked={formData.symptoms.lethargy}
//               onChange={(v) => updateSymptom('lethargy', v)}
//             />
//             <SymptomToggle
//               label="Run chi, yếu chi, loạng choạng"
//               checked={formData.symptoms.limbWeakness}
//               onChange={(v) => updateSymptom('limbWeakness', v)}
//             />
//           </CardContent>
//         </Card>

//         {/* Card 3: Vitals */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2 text-lg">
//               <Activity className="h-5 w-5 text-primary" />
//               Chỉ số sinh hiệu
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="heartRate">Mạch (bpm)</Label>
//               <Input
//                 id="heartRate"
//                 type="number"
//                 min={40}
//                 max={250}
//                 placeholder="VD: 120"
//                 value={formData.vitals.heartRate || ''}
//                 onChange={(e) => updateVital('heartRate', parseInt(e.target.value) || 0)}
//                 required
//               />
//               <p className="text-xs text-muted-foreground">Bình thường: 80-140 bpm</p>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="spo2">SpO2 (%)</Label>
//               <Input
//                 id="spo2"
//                 type="number"
//                 min={70}
//                 max={100}
//                 placeholder="VD: 98"
//                 value={formData.vitals.spo2 || ''}
//                 onChange={(e) => updateVital('spo2', parseInt(e.target.value) || 0)}
//                 required
//               />
//               <p className="text-xs text-muted-foreground">Bình thường: ≥ 95%</p>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="startleCount">Số lần giật mình (trong 30 phút)</Label>
//               <Input
//                 id="startleCount"
//                 type="number"
//                 min={0}
//                 max={20}
//                 placeholder="VD: 0"
//                 value={formData.vitals.startleCount}
//                 onChange={(e) => updateVital('startleCount', parseInt(e.target.value) || 0)}
//               />
//             </div>
//             <div className="flex items-center space-x-2 pt-2">
//               <Checkbox
//                 id="isRestingNoFever"
//                 checked={formData.vitals.isRestingNoFever}
//                 onCheckedChange={(v) => updateVital('isRestingNoFever', v as boolean)}
//               />
//               <Label htmlFor="isRestingNoFever" className="text-sm cursor-pointer">
//                 Trẻ đang nằm yên, không sốt
//               </Label>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Submit Button */}
//       <div className="flex justify-center">
//         <Button 
//           type="submit" 
//           size="lg" 
//           className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all animate-pulse-glow"
//           disabled={isLoading}
//         >
//           <Stethoscope className="mr-2 h-5 w-5" />
//           {isLoading ? 'Đang xử lý...' : 'Thực hiện Suy diễn & Chẩn đoán'}
//         </Button>
//       </div>
//     </form>
//   );
// }

// function SymptomToggle({ label, checked, onChange }: { 
//   label: string; 
//   checked: boolean; 
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <div className="flex items-center justify-between">
//       <Label className="text-sm cursor-pointer flex-1">{label}</Label>
//       <Switch checked={checked} onCheckedChange={onChange} />
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, Thermometer, Activity, Stethoscope, Beaker, 
  Brain, MapPin, HeartPulse, ClipboardCheck, AlertTriangle 
} from 'lucide-react';
import { Symptoms, Vitals, LabTests, DiagnosisRecord } from '@/lib/inference-engine';

const POPULAR_COMORBIDITIES = [
  { id: 'vsd', label: 'Thông liên thất (VSD)' },
  { id: 'asthma', label: 'Hen phế quản' },
  { id: 'heart_failure', label: 'Suy tim bẩm sinh' },
  { id: 'malnutrition', label: 'Suy dinh dưỡng nặng' },
  { id: 'immunodeficiency', label: 'Suy giảm miễn dịch' },
];

const RASH_LOCATIONS = [
  { id: 'palm', label: 'lòng bàn tay' },
  { id: 'sole', label: 'lòng bàn chân' },
  { id: 'knee', label: 'gối' },
  { id: 'buttock', label: 'mông' },
  { id: 'elbow', label: 'khuỷu tay' },
  { id: 'whole_body', label: 'Toàn thân' },
];

interface DiagnosisFormProps {
  onSubmit: (data: DiagnosisRecord) => void;
  isLoading?: boolean;
}

export function DiagnosisForm({ onSubmit, isLoading }: DiagnosisFormProps) {
  const [formData, setFormData] = useState<DiagnosisRecord>({
    full_name: '',
    age_months: 0,
    gender: '',
    epidemiology_contact: false,
    has_comorbidities: false,
    comorbidities_detail: '',
    symptoms: {
      fever: false,
      fever_temp: 37,
      fever_duration_days: 0,
      fever_refractory: false,
      symptom_progression_speed: 'Normal',
      mouth_ulcer: false,
      ulcer_characteristics: 'Typical',
      history_ulcer_recurrence: false,
      skin_rash: false,
      skin_rash_location: [],
      rash_type: 'Phỏng nước điển hình',
      rash_itchiness: false,
      rash_stages: 'Đồng đều',
      skin_rash_pain: false,
      vomiting: false,
      lethargy: false,
      sleep_disturbance: false,
      irritable_crying: false,
      poor_feeding: false,
      sore_throat: false,
      fatigue: false,
    },
    vitals: {
      heart_rate: 100,
      respiratory_rate: 20,
      respiratory_distress: false,
      systolic_bp: 100,
      diastolic_bp: 70,
      pulse_pressure: 30,
      unmeasurable_bp_pulse: false,
      respiratory_rate_high: false,
      cranial_nerve_palsy: false,
      stridor: false,
      spo2: 98,
      apnea_gasping: false,
      cyanosis: false,
      mottled_skin: false,
      sweating: false,
      ataxia: false,
      nystagmus: false,
      limb_weakness: false,
      squint: false,
      muscle_tone_increased: false,
      avpu_score: 'A',
      coma_gcs: 15,
      startle_reflex_history: 0,
      startle_reflex_exam: false,
    },
    labTests: {
      wbc_count: 0,
      blood_glucose: 0,
      platelet_count: 0,
      crp_level: 0,
      ev71_result: 'NotDone',
      other_enterovirus_result: 'NotDone',
      viral_isolation_result: 'NotDone',
      troponin_i: 0,
      chest_xray_edema: false,
    }
  });

  // Tự động tính hiệu áp khi HA thay đổi
  useEffect(() => {
    const pp = formData.vitals.systolic_bp - formData.vitals.diastolic_bp;
    if (pp !== formData.vitals.pulse_pressure) {
      updateVital('pulse_pressure', pp);
    }
  }, [formData.vitals.systolic_bp, formData.vitals.diastolic_bp]);

  const updateSymptom = (key: keyof Symptoms, value: any) => {
    setFormData(prev => ({ ...prev, symptoms: { ...prev.symptoms, [key]: value } }));
  };

  const updateVital = (key: keyof Vitals, value: any) => {
    setFormData(prev => ({ ...prev, vitals: { ...prev.vitals, [key]: value } }));
  };

  const updateLab = (key: keyof LabTests, value: any) => {
    setFormData(prev => ({ ...prev, labTests: { ...prev.labTests, [key]: value } }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      
      {/* 1. HÀNH CHÍNH & BỆNH NỀN */}
      <Card className="shadow-sm border-t-4 border-t-blue-500">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><User size={18}/> Bệnh nhân & Dịch tễ</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1"><Label className="text-xs">Họ tên trẻ</Label><Input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Tuổi (tháng)</Label><Input type="number" value={formData.age_months} onChange={e => setFormData({...formData, age_months: parseInt(e.target.value) || 0})} required /></div>
              <div className="space-y-1">
                <Label className="text-xs">Giới tính</Label>
                <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SymptomToggle label="Tiếp xúc nguồn lây / Vùng dịch" checked={formData.epidemiology_contact} onChange={v => setFormData({...formData, epidemiology_contact: v})} />
          <div className="space-y-3 pt-2 bg-slate-50 p-2 rounded-lg">
            <SymptomToggle label="Có bệnh lý đồng mắc" checked={formData.has_comorbidities} onChange={v => setFormData({...formData, has_comorbidities: v})} />
            {formData.has_comorbidities && (
              <div className="space-y-2">
                <Textarea placeholder="Liệt kê bệnh nền (VSD, Hen...)" value={formData.comorbidities_detail} onChange={e => setFormData({...formData, comorbidities_detail: e.target.value})} className="text-xs h-20 bg-white" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. ĐÁNH GIÁ LÂM SÀNG (SỐT & NIÊM MẠC) */}
      <Card className="shadow-sm border-t-4 border-t-orange-500">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><Stethoscope size={18}/> Lâm sàng (Sốt - Loét)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <SymptomToggle label="Trẻ có sốt" checked={formData.symptoms.fever} onChange={v => updateSymptom('fever', v)} />
          
          {formData.symptoms.fever && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label className="text-xs">Nhiệt độ tối đa (°C)</Label><Input type="number" step="0.1" value={formData.symptoms.fever_temp} onChange={e => updateSymptom('fever_temp', parseFloat(e.target.value) || 0)} /></div>
                <div className="space-y-1"><Label className="text-xs">Số ngày sốt</Label><Input type="number" value={formData.symptoms.fever_duration_days} onChange={e => updateSymptom('fever_duration_days', parseInt(e.target.value) || 0)} /></div>
              </div>
              <SymptomToggle label="Sốt cao khó hạ" checked={formData.symptoms.fever_refractory} onChange={v => updateSymptom('fever_refractory', v)} />
            </div>
          )}

          <div className="space-y-1 border-t pt-2">
            <SymptomToggle label="Diễn tiến rất nhanh (24-48h)" checked={formData.symptoms.symptom_progression_speed === 'Very Fast'} onChange={v => updateSymptom('symptom_progression_speed', v ? 'Very Fast' : 'Normal')} />
          </div>
          <div className="border-t pt-3 space-y-2">
            <SymptomToggle label="Có loét miệng / phỏng nước miệng" checked={formData.symptoms.mouth_ulcer} onChange={v => updateSymptom('mouth_ulcer', v)} />
            {formData.symptoms.mouth_ulcer && (
              <div className="pl-4 space-y-2 border-l-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold">Đặc điểm loét</Label>
                  <Select value={formData.symptoms.ulcer_characteristics} onValueChange={v => updateSymptom('ulcer_characteristics', v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Typical">Typical (Nông, đỏ 2-3mm)</SelectItem><SelectItem value="Atypical">Atypical (Sâu, có dịch tiết)</SelectItem></SelectContent>
                  </Select>
                </div>
                <SymptomToggle label="Tiền sử loét tái phát nhiều lần" checked={formData.symptoms.history_ulcer_recurrence} onChange={v => updateSymptom('history_ulcer_recurrence', v)} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. PHÁT BAN (SKIN RASH) */}
      <Card className="shadow-sm border-t-4 border-t-green-600">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><MapPin size={18}/> Lâm sàng (Phát ban)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <SymptomToggle label="Có phát ban da" checked={formData.symptoms.skin_rash} onChange={v => updateSymptom('skin_rash', v)} />
          {formData.symptoms.skin_rash && (
            <div className="space-y-4 pl-4 border-l-2 border-green-100">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold">Vị trí (chọn nhiều)</Label>
                <div className="grid grid-cols-2 gap-1">
                  {RASH_LOCATIONS.map(loc => (
                    <div key={loc.id} className="flex items-center space-x-2">
                      <Checkbox id={loc.id} checked={formData.symptoms.skin_rash_location.includes(loc.label)} onCheckedChange={(c) => {
                        const curr = formData.symptoms.skin_rash_location;
                        updateSymptom('skin_rash_location', c ? [...curr, loc.label] : curr.filter(i => i !== loc.label));
                      }} />
                      <Label htmlFor={loc.id} className="text-[10px]">{loc.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold">Dạng ban</Label>
                <Select value={formData.symptoms.rash_type} onValueChange={v => updateSymptom('rash_type', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phỏng nước điển hình">Phỏng nước điển hình</SelectItem>
                    <SelectItem value="Mụn mủ">Mụn mủ</SelectItem>
                    <SelectItem value="Chấm xuất huyết">Chấm xuất huyết</SelectItem>
                    <SelectItem value="Hoại tử trung tâm">Hoại tử trung tâm</SelectItem>
                    <SelectItem value="Dát sẩn">Dát sẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <SymptomToggle label="Ban có ngứa" checked={formData.symptoms.rash_itchiness} onChange={v => updateSymptom('rash_itchiness', v)} />
                <SymptomToggle label="Có sưng đau nốt ban" checked={formData.symptoms.skin_rash_pain} onChange={v => updateSymptom('skin_rash_pain', v)} />
                <div className="flex items-center justify-between mt-1">
                  <Label className="text-[11px]">Độ tuổi ban</Label>
                  <Select value={formData.symptoms.rash_stages} onValueChange={v => updateSymptom('rash_stages', v)}>
                    <SelectTrigger className="w-24 h-7 text-[10px]"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Đồng đều">Đồng đều</SelectItem><SelectItem value="Nhiều độ tuổi">Nhiều lứa tuổi</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <div className="border-t pt-3 grid grid-cols-1 gap-1">
            <SymptomToggle label="Nôn ói nhiều" checked={formData.symptoms.vomiting} onChange={v => updateSymptom('vomiting', v)} />
            <SymptomToggle label="Bỏ ăn/Bỏ bú/Tăng tiết nước bọt" checked={formData.symptoms.poor_feeding} onChange={v => updateSymptom('poor_feeding', v)} />
            <SymptomToggle label="Đau họng" checked={formData.symptoms.sore_throat} onChange={v => updateSymptom('sore_throat', v)} />
            <SymptomToggle label="Mệt mỏi / Biếng chơi" checked={formData.symptoms.fatigue} onChange={v => updateSymptom('fatigue', v)} />
          </div>
        </CardContent>
      </Card>

      {/* 4. SINH HIỆU (VITALS) */}
      <Card className="shadow-sm border-t-4 border-t-red-500">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><HeartPulse size={18} /> Sinh hiệu & Hô hấp</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Mạch (l/p)</Label><Input type="number" value={formData.vitals.heart_rate} onChange={e => updateVital('heart_rate', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">Nhịp thở (l/p)</Label><Input type="number" value={formData.vitals.respiratory_rate} onChange={e => updateVital('respiratory_rate', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">HA Tâm thu</Label><Input type="number" value={formData.vitals.systolic_bp} onChange={e => updateVital('systolic_bp', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">HA Tâm trương</Label><Input type="number" value={formData.vitals.diastolic_bp} onChange={e => updateVital('diastolic_bp', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">SpO2 (%)</Label><Input type="number" value={formData.vitals.spo2} onChange={e => updateVital('spo2', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1">
               <Label className="text-xs text-blue-600 font-bold">Hiệu áp (PP)</Label>
               <div className="h-9 flex items-center px-3 bg-blue-50 border border-blue-200 rounded-md font-bold text-blue-700">
                 {formData.vitals.pulse_pressure} mmHg
               </div>
            </div>
          </div>
          <div className="bg-red-50 p-2 rounded-lg space-y-1">
            <SymptomToggle label="Mạch/HA KHÔNG ĐO ĐƯỢC" checked={formData.vitals.unmeasurable_bp_pulse} onChange={v => updateVital('unmeasurable_bp_pulse', v)} />
            <SymptomToggle label="Suy hô hấp (Co kéo/Phập phồng)" checked={formData.vitals.respiratory_distress} onChange={v => updateVital('respiratory_distress', v)} />
            <SymptomToggle label="Thở rít thanh quản" checked={formData.vitals.stridor} onChange={v => updateVital('stridor', v)} />
            <SymptomToggle label="Ngưng thở / Thở dốc" checked={formData.vitals.apnea_gasping} onChange={v => updateVital('apnea_gasping', v)} />
            <SymptomToggle label="Tím tái / Da nổi bông" checked={formData.vitals.cyanosis || formData.vitals.mottled_skin} onChange={v => {updateVital('cyanosis', v); updateVital('mottled_skin', v)}} />
            <SymptomToggle label="Vã mồ hôi khu trú" checked={formData.vitals.sweating} onChange={v => updateVital('sweating', v)} />
          </div>
        </CardContent>
      </Card>

      {/* 5. THẦN KINH & GIẬT MÌNH (NEURO) */}
      <Card className="shadow-sm border-t-4 border-t-purple-600">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><Brain size={18} /> Thần kinh & Giật mình</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between bg-purple-50 p-2 rounded">
            <Label className="text-xs font-bold text-purple-900">Giật mình bệnh sử (lần/30p)</Label>
            <Input type="number" className="w-16 h-8 border-purple-200" value={formData.vitals.startle_reflex_history} onChange={e => updateVital('startle_reflex_history', parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1">
            <SymptomToggle label="Giật mình ghi nhận lúc khám" checked={formData.vitals.startle_reflex_exam} onChange={v => updateVital('startle_reflex_exam', v)} />
            <SymptomToggle label="Lừ đừ / Ngủ gà" checked={formData.symptoms.lethargy} onChange={v => updateSymptom('lethargy', v)} />
            <SymptomToggle label="Khó ngủ / Quấy khóc vô cớ" checked={formData.symptoms.sleep_disturbance || formData.symptoms.irritable_crying} onChange={v => {updateSymptom('sleep_disturbance', v); updateSymptom('irritable_crying', v)}} />
            <SymptomToggle label="Thất điều (Run chi/Đi loạng choạng)" checked={formData.vitals.ataxia} onChange={v => updateVital('ataxia', v)} />
            <SymptomToggle label="Rung giật nhãn cầu / Lác mắt" checked={formData.vitals.nystagmus || formData.vitals.squint} onChange={v => {updateVital('nystagmus', v); updateVital('squint', v)}} />
            <SymptomToggle label="Yếu chi / Liệt mềm cấp" checked={formData.vitals.limb_weakness} onChange={v => updateVital('limb_weakness', v)} />
            <SymptomToggle label="Liệt dây sọ (Nuốt sặc/Thay giọng)" checked={formData.vitals.cranial_nerve_palsy} onChange={v => updateVital('cranial_nerve_palsy', v)} />
            <SymptomToggle label="Tăng trương lực cơ" checked={formData.vitals.muscle_tone_increased} onChange={v => updateVital('muscle_tone_increased', v)} />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold">Glasgow</Label>
              <Input type="number" className="h-8" value={formData.vitals.coma_gcs} onChange={e => updateVital('coma_gcs', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold">AVPU</Label>
              <Select value={formData.vitals.avpu_score} onValueChange={v => updateVital('avpu_score', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="A">A (Tỉnh)</SelectItem><SelectItem value="V">V (Lời nói)</SelectItem><SelectItem value="P">P (Đau)</SelectItem><SelectItem value="U">U (Hôn mê)</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. CẬN LÂM SÀNG (LAB TESTS) */}
      <Card className="shadow-sm border-t-4 border-t-slate-700">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><Beaker size={18} /> Cận lâm sàng (Không bắt buộc)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-[11px]">Bạch cầu (G/L)</Label><Input type="number" step="0.1" value={formData.labTests.wbc_count} onChange={e => updateLab('wbc_count', parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-[11px]">Đường huyết (mg%)</Label><Input type="number" value={formData.labTests.blood_glucose} onChange={e => updateLab('blood_glucose', parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-[11px]">Tiểu cầu (G/L)</Label><Input type="number" value={formData.labTests.platelet_count} onChange={e => updateLab('platelet_count', parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-[11px]">Troponin I (ng/L)</Label><Input type="number" value={formData.labTests.troponin_i} onChange={e => updateLab('troponin_i', parseFloat(e.target.value) || 0)} /></div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold">Kết quả EV71 (PCR/Test nhanh)</Label>
              <Select value={formData.labTests.ev71_result} onValueChange={v => updateLab('ev71_result', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NotDone">Chưa xét nghiệm</SelectItem><SelectItem value="Positive">Dương tính (+)</SelectItem><SelectItem value="Negative">Âm tính (-)</SelectItem></SelectContent>
              </Select>
            </div>
            <SymptomToggle label="X-quang: Hình ảnh phù phổi" checked={formData.labTests.chest_xray_edema} onChange={v => updateLab('chest_xray_edema', v)} />
          </div>
        </CardContent>
      </Card>

      {/* NÚT CHẨN ĐOÁN */}
      <div className="md:col-span-2 lg:col-span-3 pt-6">
        <Button type="submit" size="lg" className="w-full py-8 text-2xl font-black bg-red-600 hover:bg-red-700 shadow-xl transition-all" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-3"><Activity className="animate-spin" /> ĐANG SUY DIỄN...</div>
          ) : (
            <div className="flex items-center gap-3"><ClipboardCheck size={32} /> CHẨN ĐOÁN & PHÂN ĐỘ NGAY</div>
          )}
        </Button>
      </div>
    </form>
  );
}

function SymptomToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void; }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-slate-100 transition-colors">
      <Label className="text-[12px] cursor-pointer font-medium leading-tight flex-1 pr-4">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}