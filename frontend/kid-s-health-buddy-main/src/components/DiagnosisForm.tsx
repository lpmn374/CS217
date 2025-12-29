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
  User, Activity, Stethoscope, Beaker, 
  Brain, MapPin, HeartPulse, ClipboardCheck, AlertCircle
} from 'lucide-react';
import { Symptoms, Vitals, LabTests, DiagnosisRecord } from '@/lib/inference-engine';

// Danh sách bệnh nền phổ biến
const COMMON_COMORBIDITIES = [
  "Tim bẩm sinh", "Suy dinh dưỡng", "Suyễn/Bệnh phổi mãn", 
  "Suy giảm miễn dịch", "Động kinh", "Béo phì"
];

// const RASH_LOCATIONS = [
//   { id: 'classic', label: 'Lòng bàn tay, chân, gối, mông' },
//   { id: 'whole_body', label: 'Toàn thân' },
//   { id: 'behind_ears', label: 'Sau tai' },
// ];

interface DiagnosisFormProps {
  onSubmit: (data: any) => void; // Chuyển thành any vì cấu trúc gửi đi sẽ khác với DiagnosisRecord
  isLoading?: boolean;
}

export function DiagnosisForm({ onSubmit, isLoading }: DiagnosisFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState<DiagnosisRecord>({
    patient_id: undefined,
    full_name: '',
    age_months: undefined,
    gender: '',
    epidemiology_contact: false,
    has_comorbidities: false,
    comorbidities_detail: '',
    symptoms: {
      fever: false,
      fever_temp: 39,
      fever_duration_days: 1,
      fever_refractory: false,
      symptom_progression_speed: 'Normal',
      mouth_ulcer: false,
      ulcer_characteristics: 'Typical',
      history_ulcer_recurrence: false,
      skin_rash: false,
      skin_rash_location: 'Lòng bàn tay, chân, gối, khuỷu, mông',
      rash_type: 'Phỏng nước điển hình',
      rash_itchiness: false,
      rash_stages: 'Đồng đều',
      skin_rash_pain: false,
      post_auricular_lymph_nodes: false,
      mucosal_bleeding: false,

      vomiting: false,
      lethargy: false,
      sleep_disturbance: false,
      irritable_crying: false,
      poor_feeding: false,
      sore_throat: false,
      fatigue: false,
    },
    vitals: {
      heart_rate: undefined,
      respiratory_rate: undefined,
      respiratory_distress: false,
      systolic_bp: 95,
      diastolic_bp: 65,
      pulse_pressure: 30,
      unmeasurable_bp_pulse: false,
      capillary_refill_time: undefined,
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
      coma_gcs: undefined,
      startle_reflex_history: 0,
      startle_reflex_exam: false,
    },
    labTests: {
      // wbc_count: undefined,
      // blood_glucose: undefined,
      // platelet_count: undefined,
      // crp_level: undefined,
      // troponin_i: undefined,
      ev71_result: 'NotDone',
      other_enterovirus_result: 'NotDone',
      viral_isolation_result: 'NotDone',
      chest_xray_edema: false,
    }
  });

  useEffect(() => {
    const pp = formData.vitals.systolic_bp - formData.vitals.diastolic_bp;
    if (pp !== formData.vitals.pulse_pressure) {
      updateVital('pulse_pressure', pp);
    }
  }, [formData.vitals.systolic_bp, formData.vitals.diastolic_bp]);

  // Hàm update dùng chung kèm rào >= 0
  const updateVital = (key: keyof Vitals, value: any) => {
    // Chỉ rào các trường kiểu số (trừ các trường boolean)
    let safeValue = value;
    if (typeof value === 'number' && key !== 'avpu_score') {
      safeValue = Math.max(0, value);
    }
    setFormData(prev => ({ ...prev, vitals: { ...prev.vitals, [key]: safeValue } }));
  };

  const updateSymptom = (key: keyof Symptoms, value: any) => {
    let safeValue = value;
    if (key === 'fever_duration_days') {
      safeValue = Math.max(0, value);
    }
    setFormData(prev => ({ ...prev, symptoms: { ...prev.symptoms, [key]: safeValue } }));
  };

  // const updateVital = (key: keyof Vitals, value: any) => {
  //   setFormData(prev => ({ ...prev, vitals: { ...prev.vitals, [key]: value } }));
  // });
  const updateLab = (key: keyof LabTests, value: any) => {
    setFormData(prev => ({ ...prev, labTests: { ...prev.labTests, [key]: value } }));
  };

  const handleComorbidityToggle = (disease: string) => {
    const current = formData.comorbidities_detail.split(', ').filter(i => i !== "");
    const updated = current.includes(disease) 
      ? current.filter(i => i !== disease) 
      : [...current, disease];
    setFormData(prev => ({ ...prev, comorbidities_detail: updated.join(', ') }));
  };

  return (
    //<form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
    // Tìm đến dòng <form onSubmit={...}> và thay bằng đoạn này:
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        
        // Đóng gói dữ liệu theo đúng cấu trúc app.py cần (patient, clinical, vitals, lab)
        const transformedData = {
          patient: {
            full_name: formData.full_name,
            age_months: formData.age_months,
            gender: formData.gender,
            epidemiology_contact: formData.epidemiology_contact ? 1 : 0,
            has_comorbidities: formData.has_comorbidities ? 1 : 0,
            comorbidities_detail: formData.comorbidities_detail,
          },
          clinical: {
            fever: formData.symptoms.fever ? 1 : 0,
            fever_temp: formData.symptoms.fever_temp,
            fever_duration_days: formData.symptoms.fever_duration_days,
            fever_refractory: formData.symptoms.fever_refractory ? 1 : 0,
            symptom_progression_speed: formData.symptoms.symptom_progression_speed,
            mouth_ulcer: formData.symptoms.mouth_ulcer ? 1 : 0,
            ulcer_characteristics: formData.symptoms.ulcer_characteristics,
            history_ulcer_recurrence: formData.symptoms.history_ulcer_recurrence ? 1 : 0,
            skin_rash: formData.symptoms.skin_rash ? 1 : 0,
            skin_rash_location: formData.symptoms.skin_rash_location || '',
            rash_itchiness: formData.symptoms.rash_itchiness ? 1 : 0,
            rash_stages: formData.symptoms.rash_stages,
            skin_rash_pain: formData.symptoms.skin_rash_pain ? 1 : 0,
            post_auricular_lymph_nodes: formData.symptoms.post_auricular_lymph_nodes ? 1 : 0,
            mucosal_bleeding: formData.symptoms.mucosal_bleeding ? 1 : 0,
            vomiting: formData.symptoms.vomiting ? 1 : 0,
            lethargy: formData.symptoms.lethargy ? 1 : 0,
            sleep_disturbance: formData.symptoms.sleep_disturbance ? 1 : 0,
            irritable_crying: formData.symptoms.irritable_crying ? 1 : 0,
            poor_feeding: formData.symptoms.poor_feeding ? 1 : 0,
            sore_throat: formData.symptoms.sore_throat ? 1 : 0,
            fatigue: formData.symptoms.fatigue ? 1 : 0,
          },
          vitals: {
            heart_rate: formData.vitals.heart_rate,
            respiratory_rate: formData.vitals.respiratory_rate,
            systolic_bp: formData.vitals.systolic_bp,
            diastolic_bp: formData.vitals.diastolic_bp,
            pulse_pressure: formData.vitals.pulse_pressure,
            spo2: formData.vitals.spo2,
            capillary_refill_time: formData.vitals.capillary_refill_time,
            unmeasurable_bp_pulse: formData.vitals.unmeasurable_bp_pulse ? 1 : 0,
            respiratory_rate_high: formData.vitals.respiratory_rate_high ? 1 : 0,
            respiratory_distress: formData.vitals.respiratory_distress ? 1 : 0,
            stridor: formData.vitals.stridor ? 1 : 0,
            apnea_gasping: formData.vitals.apnea_gasping ? 1 : 0,
            cyanosis: formData.vitals.cyanosis ? 1 : 0,
            mottled_skin: formData.vitals.mottled_skin ? 1 : 0,
            sweating: formData.vitals.sweating ? 1 : 0,
            startle_reflex_history: formData.vitals.startle_reflex_history,
            startle_reflex_exam: formData.vitals.startle_reflex_exam ? 1 : 0,
            ataxia: formData.vitals.ataxia ? 1 : 0,
            nystagmus: formData.vitals.nystagmus ? 1 : 0,
            squint: formData.vitals.squint ? 1 : 0,
            limb_weakness: formData.vitals.limb_weakness ? 1 : 0,
            muscle_tone_increased: formData.vitals.muscle_tone_increased ? 1 : 0,
            cranial_nerve_palsy: formData.vitals.cranial_nerve_palsy ? 1 : 0,
            avpu_score: formData.vitals.avpu_score,
            coma_gcs: formData.vitals.coma_gcs,
          },
          lab: {
            ev71_result: formData.labTests.ev71_result,
            other_enterovirus_result: formData.labTests.other_enterovirus_result,
            viral_isolation_result: formData.labTests.viral_isolation_result,
            chest_xray_edema: formData.labTests.chest_xray_edema ? 1 : 0,
          }
        };

        onSubmit(transformedData); 
      }} 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
    >  
      {/* 1. HÀNH CHÍNH & DỊCH TỄ */}
      <Card className="shadow-sm border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-md font-bold uppercase">
            <User size={18}/> Bệnh nhân & Dịch tễ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Họ tên */}
          <div className="space-y-1">
            <Label className="text-xs">Họ tên trẻ (Có thể viết tắt)</Label>
            <Input 
              value={formData.full_name} 
              onChange={e => setFormData({...formData, full_name: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-1">
              <Label className="text-xs font-bold text-blue-600">Số tháng tuổi</Label>
              <Input 
                type="number" 
                min="0"
                max="180"
                value={formData.age_months} 
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  age_months: Math.max(0, parseInt(e.target.value) || 0) 
                }))} 
                required 
              />
            </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Giới tính */}
            <div className="space-y-1">
              <Label className="text-xs">Giới tính</Label>
              <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SymptomToggle 
            label="Tiếp xúc nguồn lây / Vùng dịch" 
            checked={formData.epidemiology_contact} 
            onChange={v => setFormData({...formData, epidemiology_contact: v})} 
          />
          
          <div className="pt-2 bg-slate-50 p-2 rounded-lg space-y-2 border border-slate-200">
            <SymptomToggle 
              label="Có bệnh lý đồng mắc" 
              checked={formData.has_comorbidities} 
              onChange={v => setFormData({...formData, has_comorbidities: v})} 
            />
            {formData.has_comorbidities && (
              <div className="space-y-2 animate-in fade-in">
                <Label className="text-[10px] font-bold text-slate-500">Chọn bệnh nền phổ biến:</Label>
                <div className="grid grid-cols-2 gap-1">
                  {COMMON_COMORBIDITIES.map(disease => (
                    <div key={disease} className="flex items-center space-x-2">
                      <Checkbox 
                        id={disease} 
                        checked={formData.comorbidities_detail.includes(disease)} 
                        onCheckedChange={() => handleComorbidityToggle(disease)} 
                      />
                      <Label htmlFor={disease} className="text-[10px] cursor-pointer">{disease}</Label>
                    </div>
                  ))}
                </div>
                <Textarea 
                  placeholder="Ghi chú thêm bệnh nền khác..." 
                  value={formData.comorbidities_detail} 
                  onChange={e => setFormData({...formData, comorbidities_detail: e.target.value})} 
                  className="text-xs h-16 bg-white" 
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. LÂM SÀNG (SỐT & TIÊU HÓA) */}
      <Card className="shadow-sm border-t-4 border-t-orange-500">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><Stethoscope size={18}/> Lâm sàng (Sốt - Tiêu hóa)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <SymptomToggle label="Trẻ có sốt" checked={formData.symptoms.fever} onChange={v => { updateSymptom('fever', v); if (!v) updateSymptom('fever_temp', 0);}} /> 
          {formData.symptoms.fever && (
            <div className="p-3 bg-orange-50 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${formData.symptoms.fever_temp <= 37 ? 'text-red-500' : ''}`}>
                    Nhiệt độ tối đa (°C)
                  </Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="VD: 38.5"
                    className={formData.symptoms.fever_temp <= 37 ? "border-red-500 focus-visible:ring-red-500" : ""}
                    value={formData.symptoms.fever_temp || ''} 
                    onChange={e => updateSymptom('fever_temp', parseFloat(e.target.value) || 0)} 
                  />
                  {formData.symptoms.fever_temp <= 37 && (
                    <p className="text-[10px] text-red-600 font-medium">Nhiệt độ phải {'>'} 37°C khi có sốt</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className={`text-xs font-bold ${formData.symptoms.fever_duration_days < 1 ? 'text-red-500' : ''}`}>
                    Số ngày sốt
                  </Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="VD: 1"
                    className={formData.symptoms.fever_duration_days < 1 ? "border-red-500 focus-visible:ring-red-500" : ""}
                    value={formData.symptoms.fever_duration_days || ''} 
                    onChange={e => updateSymptom('fever_duration_days', parseInt(e.target.value) || 0)} 
                  />
                  {formData.symptoms.fever_duration_days < 1 && (
                    <p className="text-[10px] text-red-600 font-medium">Số ngày sốt phải tính {'>='} 1 ngày </p>
                  )}
                </div>
              </div>
              <SymptomToggle label="Sốt cao không đáp ứng thuốc hạ sốt" checked={formData.symptoms.fever_refractory} onChange={v => updateSymptom('fever_refractory', v)} />
            </div>
          )}
          <div className="border-t pt-2 space-y-2">
            <SymptomToggle label="Nôn ói nhiều" checked={formData.symptoms.vomiting} onChange={v => updateSymptom('vomiting', v)} />
            <SymptomToggle label="Bỏ ăn/Bỏ bú, tăng tiết nước bọt" checked={formData.symptoms.poor_feeding} onChange={v => updateSymptom('poor_feeding', v)} />
            <SymptomToggle label="Đau họng" checked={formData.symptoms.sore_throat} onChange={v => updateSymptom('sore_throat', v)} />
            <div className="flex items-center justify-between">
                <Label className="text-xs font-bold">Diễn tiến bệnh</Label>
                <Select value={formData.symptoms.symptom_progression_speed} onValueChange={v => updateSymptom('symptom_progression_speed', v)}>
                   <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                   <SelectContent><SelectItem value="Normal">Bình thường</SelectItem><SelectItem value="Very Fast">Rất nhanh (Diễn tiến nặng trong vòng 24 - 48 giờ).</SelectItem></SelectContent>
                </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. LÂM SÀNG (NIÊM MẠC & PHÁT BAN) */}
      <Card className="shadow-sm border-t-4 border-t-green-600">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><MapPin size={18}/> Lâm sàng (Ban & Niêm mạc)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <SymptomToggle label="Có loét miệng" checked={formData.symptoms.mouth_ulcer} onChange={v => updateSymptom('mouth_ulcer', v)} />
            {formData.symptoms.mouth_ulcer && (
               <div className="pl-4 border-l-2 space-y-2">
                  <Select value={formData.symptoms.ulcer_characteristics} onValueChange={v => updateSymptom('ulcer_characteristics', v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Typical">Điển hình (Nông, đỏ, đường kính 2-3 mm)</SelectItem><SelectItem value="Atypical">Không điển hình (Sâu, có tiết dịch)</SelectItem></SelectContent>
                  </Select>
                  <SymptomToggle label="Tiền sử loét tái phát" checked={formData.symptoms.history_ulcer_recurrence} onChange={v => updateSymptom('history_ulcer_recurrence', v)} />
               </div>
             )}
          <SymptomToggle label="Có phát ban da/ phỏng nước" checked={formData.symptoms.skin_rash} onChange={v => updateSymptom('skin_rash', v)} />
          {formData.symptoms.skin_rash && (
            <div className="space-y-3 pl-4 border-l-2 border-green-100 animate-in slide-in-from-left-2">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold">Dạng ban & Tính chất</Label>
                <Select value={formData.symptoms.rash_type} onValueChange={v => updateSymptom('rash_type', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phỏng nước điển hình">Phỏng nước điển hình (Mụn nước)</SelectItem>
                    <SelectItem value="Mụn mủ">Mụn mủ</SelectItem>
                    <SelectItem value="Chấm xuất huyết">Chấm xuất huyết</SelectItem>
                    <SelectItem value="Bầm máu">Bầm máu</SelectItem>
                    <SelectItem value="Hoại tử trung tâm">Hoại tử trung tâm</SelectItem>
                    <SelectItem value="Hồng ban và sẩn">Hồng ban xen kẽ ít dạng sẩn (Vết như muỗi chích)</SelectItem>
                    <SelectItem value="Hồng ban đa dạng">Hồng ban đa dạng</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="text-[10px] font-bold">Vị trí ban:</Label>
                <Select 
                  // Nếu formData trống thì lấy giá trị mặc định này để hiển thị
                  value={formData.symptoms.skin_rash_location || 'Lòng bàn tay, chân, gối, khuỷu, mông'} 
                  onValueChange={v => updateSymptom('skin_rash_location', v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue /> 
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lòng bàn tay, chân, gối, khuỷu, mông">
                      Lòng bàn tay, chân, gối, khuỷu, mông (Điển hình)
                    </SelectItem>
                    <SelectItem value="Toàn thân">Toàn thân</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <SymptomToggle label="Ban có ngứa" checked={formData.symptoms.rash_itchiness} onChange={v => updateSymptom('rash_itchiness', v)} />
                <SymptomToggle label="Ban có đau" checked={formData.symptoms.skin_rash_pain} onChange={v => updateSymptom('skin_rash_pain', v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-bold">Độ tuổi ban</Label>
                <Select value={formData.symptoms.rash_stages} onValueChange={v => updateSymptom('rash_stages', v)}>
                  <SelectTrigger className="w-28 h-7 text-[10px]"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Đồng đều">Đồng đều</SelectItem><SelectItem value="Nhiều độ tuổi">Nhiều độ tuổi</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          <SymptomToggle label="Có nổi hạch sau tai" checked={formData.symptoms.post_auricular_lymph_nodes} onChange={v => updateSymptom('post_auricular_lymph_nodes', v)} />
          <SymptomToggle label="Có xuất huyết niêm mạc" checked={formData.symptoms.mucosal_bleeding} onChange={v => updateSymptom('mucosal_bleeding', v)} />
        </CardContent>
      </Card>

      {/* 4. SINH HIỆU & HÔ HẤP */}
      <Card className="shadow-sm border-t-4 border-t-red-500">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><HeartPulse size={18} /> Sinh hiệu & Hô hấp</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Mạch (l/p)</Label><Input type="number" min="0" value={formData.vitals.heart_rate} onChange={e => updateVital('heart_rate', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">Nhịp thở (l/p)</Label><Input type="number" min="0" value={formData.vitals.respiratory_rate} onChange={e => updateVital('respiratory_rate', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">HA Tâm thu</Label><Input type="number" min="0" value={formData.vitals.systolic_bp} onChange={e => updateVital('systolic_bp', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">HA Tâm trương</Label><Input type="number" min="0" value={formData.vitals.diastolic_bp} onChange={e => updateVital('diastolic_bp', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-xs">SpO2 (%)</Label><Input type="number" min="0" max="100" value={formData.vitals.spo2} onChange={e => updateVital('spo2', parseInt(e.target.value) || 0)} /></div>
            <div className="space-y-1">
              <Label className={`text-xs font-bold ${formData.vitals.pulse_pressure <= 20 ? 'text-white bg-red-600 px-1 rounded' : 'text-red-600'}`}>Hiệu áp (PP)</Label>
              <div className={`h-9 flex items-center px-3 border rounded-md font-black transition-all ${formData.vitals.pulse_pressure <= 20 ? 'bg-red-600 text-white animate-bounce' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {formData.vitals.pulse_pressure}
              </div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Thời gian đổ đầy mao mạch (giây)</Label><Input type="number" min="0" value={formData.vitals.capillary_refill_time} onChange={e => updateVital('capillary_refill_time', parseInt(e.target.value) || 0)} /></div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg space-y-1 border border-red-100">
            <SymptomToggle label="Mạch/HA không đo được" checked={formData.vitals.unmeasurable_bp_pulse} onChange={v => updateVital('unmeasurable_bp_pulse', v)} />
            <SymptomToggle label="Thở nhanh bất thường" checked={formData.vitals.respiratory_rate_high} onChange={v => updateVital('respiratory_rate_high', v)} />
            <SymptomToggle label="Suy hô hấp (Khó thở, co kéo ngực,...)" checked={formData.vitals.respiratory_distress} onChange={v => updateVital('respiratory_distress', v)} />
            <div className="grid grid-cols-1 gap-0.5 border-t border-red-200 pt-1 mt-1">
               <SymptomToggle label="Thở rít thanh quản" checked={formData.vitals.stridor} onChange={v => updateVital('stridor', v)} />
               <SymptomToggle label="Ngưng thở / Thở dốc" checked={formData.vitals.apnea_gasping} onChange={v => updateVital('apnea_gasping', v)} />
               <SymptomToggle label="Tím tái (Môi/Đầu chi)" checked={formData.vitals.cyanosis} onChange={v => updateVital('cyanosis', v)} />
               <SymptomToggle label="Da nổi bông" checked={formData.vitals.mottled_skin} onChange={v => updateVital('mottled_skin', v)} />
               <SymptomToggle label="Vã mồ hôi" checked={formData.vitals.sweating} onChange={v => updateVital('sweating', v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. THẦN KINH & GIẬT MÌNH */}
      <Card className="shadow-sm border-t-4 border-t-purple-600">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><Brain size={18} /> Thần kinh </CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 p-2 rounded border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-bold text-purple-900">Giật mình (lần/30p)</Label>
              <Input type="number" min="0" className="w-16 h-8 border-purple-300" value={formData.vitals.startle_reflex_history} onChange={e => updateVital('startle_reflex_history', parseInt(e.target.value) || 0)} />
            </div>
            <SymptomToggle label="Giật mình ghi nhận lúc khám" checked={formData.vitals.startle_reflex_exam} onChange={v => updateVital('startle_reflex_exam', v)} />
          </div>
          <div className="space-y-1">
            <SymptomToggle label="Lừ đừ / Ngủ gà" checked={formData.symptoms.lethargy} onChange={v => updateSymptom('lethargy', v)} />
            <SymptomToggle label="Khó ngủ" checked={formData.symptoms.sleep_disturbance} onChange={v => updateSymptom('sleep_disturbance', v)} />
            <SymptomToggle label="Quấy khóc vô cớ" checked={formData.symptoms.irritable_crying} onChange={v => updateSymptom('irritable_crying', v)} />
            <SymptomToggle label="Mệt mỏi / Biếng chơi" checked={formData.symptoms.fatigue} onChange={v => updateSymptom('fatigue', v)} />
            <SymptomToggle label="Thất điều (Run chi/Run người/Đi loạng choạng)" checked={formData.vitals.ataxia} onChange={v => updateVital('ataxia', v)} />
            <SymptomToggle label="Rung giật nhãn cầu" checked={formData.vitals.nystagmus} onChange={v => updateVital('nystagmus', v)} />
            <SymptomToggle label="Lác mắt" checked={formData.vitals.squint} onChange={v => updateVital('squint', v)} />
            <SymptomToggle label="Yếu chi / Liệt chi" checked={formData.vitals.limb_weakness} onChange={v => updateVital('limb_weakness', v)} />
            <SymptomToggle label="Tăng trưng lực cơ (Cơ bắp căng cứng)" checked={formData.vitals.muscle_tone_increased} onChange={v => updateVital('muscle_tone_increased', v)} />
            <SymptomToggle label="Liệt dây sọ (Nuốt sặc/Thay giọng)" checked={formData.vitals.cranial_nerve_palsy} onChange={v => updateVital('cranial_nerve_palsy', v)} />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="space-y-1"><Label className="text-[10px] font-bold">AVPU</Label>
              <Select value={formData.vitals.avpu_score} onValueChange={v => updateVital('avpu_score', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="A">A (Tỉnh táo)</SelectItem><SelectItem value="V">V (Đáp ứng với lời nói: Không tỉnh hoàn toàn nhưng đáp ứng khi được gọi tên hoặc có người nói chuyện)</SelectItem><SelectItem value="P">P (Đáp ứng với kích thích đau: Không đáp ứng với lời nói, nhưng có phản ứng như mở mắt, cử động khi có kích thích đau)</SelectItem><SelectItem value="U">U (Hôn mê)</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px] font-bold">Thang điểm hôn mê Glasgow</Label><Input type="number" min="3" max="15" className="h-8" value={formData.vitals.coma_gcs} onChange={e => updateVital('coma_gcs', parseInt(e.target.value) || 0)} /></div>
          </div>
        </CardContent>
      </Card>

      {/* 6. CẬN LÂM SÀNG */}
      <Card className="shadow-sm border-t-4 border-t-slate-700">
        <CardHeader><CardTitle className="flex items-center gap-2 text-md font-bold uppercase"><Beaker size={18} /> Xét nghiệm (Lab)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-[11px]">Bạch cầu (G/L)</Label><Input type="number" step="0.1" value={formData.labTests.wbc_count} onChange={e => updateLab('wbc_count', parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-[11px]">Đường huyết (mg%)</Label><Input type="number" value={formData.labTests.blood_glucose} onChange={e => updateLab('blood_glucose', parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-[11px]">Tiểu cầu (G/L)</Label><Input type="number" value={formData.labTests.platelet_count} onChange={e => updateLab('platelet_count', parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-[11px]">CRP (mg/L)</Label><Input type="number" value={formData.labTests.crp_level} onChange={e => updateLab('crp_level', parseFloat(e.target.value) || 0)} /></div>
            <div className="space-y-1"><Label className="text-[11px]">Chỉ số Troponin I</Label><Input type="number" step="0.001" value={formData.labTests.troponin_i} onChange={e => updateLab('troponin_i', parseFloat(e.target.value) || 0)} /></div>
          </div> */}
          <div className="space-y-2 border-t pt-2">
            <div className="space-y-1"><Label className="text-[10px] font-bold">Xét nghiệm EV71</Label>
              <Select value={formData.labTests.ev71_result} onValueChange={v => updateLab('ev71_result', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NotDone">Chưa làm</SelectItem><SelectItem value="Positive">Dương tính (+)</SelectItem><SelectItem value="Negative">Âm tính (-)</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px] font-bold">Các chủng Enterovirus khác (A16, A6...)</Label>
              <Select value={formData.labTests.other_enterovirus_result} onValueChange={v => updateLab('other_enterovirus_result', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NotDone">Chưa làm</SelectItem><SelectItem value="Positive">Dương tính (+)</SelectItem><SelectItem value="Negative">Âm tính (-)</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px] font-bold">Phân lập Virus (Nuôi cấy) thuộc họ Enterovirus</Label>
              <Select value={formData.labTests.viral_isolation_result} onValueChange={v => updateLab('viral_isolation_result', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="NotDone">Chưa làm</SelectItem><SelectItem value="Positive">Dương tính (+)</SelectItem><SelectItem value="Negative">Âm tính (-)</SelectItem></SelectContent>
              </Select>
            </div>
            <SymptomToggle label="X-quang: Phù phổi" checked={formData.labTests.chest_xray_edema} onChange={v => updateLab('chest_xray_edema', v)} />
          </div>
        </CardContent>
      </Card>

      {/* NÚT CHẨN ĐOÁN */}
      <div className="md:col-span-2 lg:col-span-3 pt-6">
        <Button type="submit" size="lg" className="w-full py-8 text-2xl font-black bg-red-600 hover:bg-red-700 shadow-xl transition-all" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-3"><Activity className="animate-spin" /> ĐANG PHÂN TÍCH...</div>
          ) : (
            <div className="flex items-center gap-3"><ClipboardCheck size={32} /> CHẨN ĐOÁN & PHÂN ĐỘ</div>
          )}
        </Button>
      </div>
    </form>
  );
}

function SymptomToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void; }) {
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-100 transition-colors">
      <Label className="text-[11px] cursor-pointer font-medium leading-tight flex-1 pr-4">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} className="scale-75" />
    </div>
  );
}