// HFMD Forward Chaining Inference Engine
// Based on Vietnam Ministry of Health Guidelines

// export interface Symptoms {
//   mouthUlcer: boolean;
//   rash: boolean;
//   highFever: boolean;       // Sốt ≥39°C
//   feverOver2Days: boolean;  // Sốt > 2 ngày
//   vomiting: boolean;        // Nôn nhiều
//   lethargy: boolean;        // Lừ đừ
//   limbWeakness: boolean;    // Run/yếu chi
// }

// export interface Vitals {
//   heartRate: number;        // Mạch (bpm)
//   spo2: number;             // SpO2 (%)
//   startleCount: number;     // Số lần giật mình/30 phút
//   isRestingNoFever: boolean; // Trẻ đang nằm yên, không sốt
// }

// export interface InferenceStep {
//   ruleId: string;
//   description: string;
//   condition: string;
//   activated: boolean;
//   isFinal?: boolean;
// }

// export interface DiagnosisResult {
//   isClinicalCase: boolean;
//   resultGrade: '1' | '2a' | '2b' | '3' | '4' | null;
//   treatment: string;
//   inferenceSteps: InferenceStep[];
// }

// export interface DiagnosisRecord {
//   id: string;
//   childName: string;
//   childGender: string;
//   childAgeMonths: number;
//   symptoms: Symptoms;
//   vitals: Vitals;
//   result: DiagnosisResult;
//   createdAt: string;
// }

// // Forward Chaining Rules - Priority from severe to mild
// const RULES = [
//   {
//     id: 'CLINICAL_CASE',
//     name: 'Xác nhận Ca lâm sàng',
//     check: (s: Symptoms) => s.mouthUlcer || s.rash,
//     getCondition: (s: Symptoms) => {
//       const conditions = [];
//       if (s.mouthUlcer) conditions.push('Có loét miệng');
//       if (s.rash) conditions.push('Có phát ban da');
//       return conditions.join(' + ') || 'Không có triệu chứng điển hình';
//     },
//     grade: null as string | null,
//     treatment: '',
//   },
//   {
//     id: 'GRADE_4_SPO2',
//     name: 'Độ 4 - SpO2 rất thấp',
//     check: (_s: Symptoms, v: Vitals) => v.spo2 < 92,
//     getCondition: (_s: Symptoms, v: Vitals) => `SpO2 = ${v.spo2}% (< 92%)`,
//     grade: '4',
//     treatment: 'CẤP CỨU NGAY! Chuyển ICU, thở máy nếu cần.',
//   },
//   {
//     id: 'GRADE_3_HR',
//     name: 'Độ 3 - Mạch rất nhanh',
//     check: (_s: Symptoms, v: Vitals) => v.heartRate > 170,
//     getCondition: (_s: Symptoms, v: Vitals) => `Mạch = ${v.heartRate} bpm (> 170)`,
//     grade: '3',
//     treatment: 'NGUY HIỂM! Chuyển tuyến trên ngay, điều trị tích cực.',
//   },
//   {
//     id: 'GRADE_3_SPO2',
//     name: 'Độ 3 - SpO2 thấp',
//     check: (_s: Symptoms, v: Vitals) => v.spo2 < 94,
//     getCondition: (_s: Symptoms, v: Vitals) => `SpO2 = ${v.spo2}% (< 94%)`,
//     grade: '3',
//     treatment: 'NGUY HIỂM! Chuyển tuyến trên ngay, điều trị tích cực.',
//   },
//   {
//     id: 'GRADE_2B_N1',
//     name: 'Độ 2b Nhóm 1 - Giật mình/Mạch nhanh',
//     check: (_s: Symptoms, v: Vitals) => 
//       v.startleCount >= 2 || (v.heartRate > 150 && v.isRestingNoFever),
//     getCondition: (_s: Symptoms, v: Vitals) => {
//       const conditions = [];
//       if (v.startleCount >= 2) conditions.push(`Giật mình ${v.startleCount} lần (≥ 2 lần/30 phút)`);
//       if (v.heartRate > 150 && v.isRestingNoFever) conditions.push(`Mạch ${v.heartRate} bpm (> 150, trẻ nằm yên)`);
//       return conditions.join(' HOẶC ') || `Giật mình ${v.startleCount} lần, Mạch ${v.heartRate} bpm`;
//     },
//     grade: '2b',
//     treatment: 'CẢNH BÁO! Nhập viện theo dõi sát, có thể chuyển tuyến.',
//   },
//   {
//     id: 'GRADE_2B_N2',
//     name: 'Độ 2b Nhóm 2 - Rối loạn thần kinh',
//     check: (s: Symptoms) => s.limbWeakness,
//     getCondition: () => 'Có run/yếu chi, đi loạng choạng',
//     grade: '2b',
//     treatment: 'CẢNH BÁO! Nhập viện theo dõi sát, có thể chuyển tuyến.',
//   },
//   {
//     id: 'GRADE_2A_FEVER',
//     name: 'Độ 2a - Sốt cao/kéo dài',
//     check: (s: Symptoms) => s.highFever || s.feverOver2Days,
//     getCondition: (s: Symptoms) => {
//       const conditions = [];
//       if (s.highFever) conditions.push('Sốt ≥ 39°C');
//       if (s.feverOver2Days) conditions.push('Sốt > 2 ngày');
//       return conditions.join(' + ') || 'Không sốt cao/kéo dài';
//     },
//     grade: '2a',
//     treatment: 'Nhập viện theo dõi tại cơ sở y tế.',
//   },
//   {
//     id: 'GRADE_2A_SYMPTOMS',
//     name: 'Độ 2a - Triệu chứng nặng',
//     check: (s: Symptoms) => s.vomiting || s.lethargy,
//     getCondition: (s: Symptoms) => {
//       const conditions = [];
//       if (s.vomiting) conditions.push('Nôn nhiều');
//       if (s.lethargy) conditions.push('Lừ đừ');
//       return conditions.join(' + ') || 'Không có triệu chứng nặng';
//     },
//     grade: '2a',
//     treatment: 'Nhập viện theo dõi tại cơ sở y tế.',
//   },
//   {
//     id: 'GRADE_2A_STARTLE',
//     name: 'Độ 2a - Giật mình ít',
//     check: (_s: Symptoms, v: Vitals) => v.startleCount === 1,
//     getCondition: (_s: Symptoms, v: Vitals) => `Giật mình ${v.startleCount} lần (= 1 lần/30 phút)`,
//     grade: '2a',
//     treatment: 'Nhập viện theo dõi tại cơ sở y tế.',
//   },
//   {
//     id: 'GRADE_1_DEFAULT',
//     name: 'Độ 1 - Thể nhẹ',
//     check: () => true, // Always true as fallback
//     getCondition: () => 'Không có biến chứng, chỉ có triệu chứng tại chỗ',
//     grade: '1',
//     treatment: 'Điều trị ngoại trú, theo dõi tại nhà. Tái khám nếu có dấu hiệu nặng.',
//   },
// ];

// // Đường dẫn tới server Flask của bạn
// const API_BASE_URL = 'http://127.0.0.1:5000';

// export async function runInference(
//   symptoms: Symptoms, 
//   vitals: Vitals, 
//   childName: string, 
//   childGender: string, 
//   childAgeMonths: number,
//   hasComorbidities: boolean // Thêm tham số này
// ): Promise<DiagnosisResult> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/diagnose`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         symptoms, 
//         vitals, 
//         childName,     // Gửi kèm tên
//         childGender,   // Gửi kèm giới tính
//         childAgeMonths, // Gửi kèm tuổi
//         hasComorbidities // Gửi kèm sang app.py
//       })
//     });
    
//     if (!response.ok) throw new Error('Lỗi kết nối Backend');
//     return await response.json();
//   } catch (error) {
//     console.error("Inference Error:", error);
//     throw error;
//   }
// }

// // Thay đổi các hàm Storage để gọi API thay vì localStorage
// export async function saveDiagnosis(record: DiagnosisRecord): Promise<void> {
//   await fetch(`${API_BASE_URL}/save_patient`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(record)
//   });
// }

// export async function getHistory(): Promise<DiagnosisRecord[]> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/history`);
//     if (!response.ok) throw new Error('Network response was not ok');
//     const data = await response.json();
//     // Đảm bảo trả về một mảng, nếu không có dữ liệu thì trả về mảng rỗng []
//     return Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error("Lỗi lấy lịch sử:", error);
//     return [];
//   }
// }

// // Hàm tạo ID ngẫu nhiên cho bản ghi (Sửa lỗi Index.tsx)
// export const generateId = () => {
//   return Math.random().toString(36).substring(2, 9);
// };

// // Hàm xóa bản ghi (Sửa lỗi History.tsx)
// export async function deleteDiagnosis(id: string): Promise<boolean> {
//   try {
//     const response = await fetch(`http://127.0.0.1:5000/delete_patient/${id}`, {
//       method: 'DELETE',
//     });
//     return response.ok; // Trả về true nếu xóa thành công
//   } catch (error) {
//     console.error("Lỗi xóa:", error);
//     return false;
//   }
// }


// HFMD Forward Chaining Inference Engine - FULL VERSION 2024 (Updated with Grading Rules)

// 1. Nhóm Lâm sàng (ClinicalAssessment)
export interface Symptoms {
  fever: boolean;
  fever_temp: number;
  fever_duration_days: number;
  fever_refractory: boolean; // Không đáp ứng thuốc hạ sốt (Dùng cho 2b-N2)
  
  mouth_ulcer: boolean;
  ulcer_characteristics: 'Typical' | 'Atypical';
  history_ulcer_recurrence: boolean;
  
  skin_rash: boolean;
  skin_rash_location: 'Lòng bàn tay, chân, gối, khuỷu, mông' | 'Toàn thân'| 'Sau tai' ;
  rash_type: 'Phỏng nước điển hình' | 'Mụn mủ' | 'Chấm xuất huyết' | 'Bầm máu' | 'Hoại tử' | 'Dát sẩn';
  rash_itchiness: boolean;
  rash_stages: 'Đồng đều' | 'Nhiều độ tuổi';
  skin_rash_pain: boolean;
  
  vomiting: boolean;
  lethargy: boolean; // Lừ đừ
  sleep_disturbance: boolean; // Khó ngủ (Dùng cho 2a)
  irritable_crying: boolean; // Quấy khóc vô cớ (Dùng cho 2a)
  
  poor_feeding: boolean;
  sore_throat: boolean;
  fatigue: boolean;
  symptom_progression_speed: 'Normal' | 'Very Fast';
}

// 2. Nhóm Sinh hiệu & Thần kinh (VitalSigns_Neuro)
export interface Vitals {
  heart_rate: number;
  respiratory_rate: number;
  systolic_bp: number;
  diastolic_bp: number; 
  pulse_pressure: number; // Hiệu áp (Sẽ được tính: Systolic - Diastolic)
  unmeasurable_bp_pulse: boolean; // Mạch không bắt được, HA không đo được (Độ 4)
  respiratory_rate_high: boolean;
  stridor: boolean; //Thở rít thanh quản.
  spo2: number;
  coma_gcs: number;
  avpu_score: 'A' | 'V' | 'P' | 'U'; // Rối loạn tri giác (P/A VPU dùng cho 2b-N2)
  
  // Giật mình
  startle_reflex_history: number; // Số lần/30p theo bệnh sử
  startle_reflex_exam: boolean; // Lúc khám
  
  // Thần kinh & Biến chứng
  ataxia: boolean; // Thất điều
  nystagmus: boolean; // Rung giật nhãn cầu
  squint: boolean; // Lác mắt (Độ 2b-N2)
  limb_weakness: boolean; // Yếu/Liệt chi
  muscle_tone_increased: boolean; // Tăng trương lực cơ
  cranial_nerve_palsy: boolean; // Liệt thần kinh sọ (nuốt sặc, đổi giọng)
  
  // Hô hấp & Vận mạch
  respiratory_distress: boolean; // Thở nhanh, khó thở, thở rít (Độ 3)
  apnea_gasping: boolean; // Ngưng thở, thở dốc (Độ 4)
  cyanosis: boolean; // Tím tái (Độ 4)
  mottled_skin: boolean; // Da nổi bông (Độ 3)
  sweating: boolean; // Vã mồ hôi (Độ 3)
}

// 3. Nhóm Xét nghiệm (LabTests)
export interface LabTests {
  wbc_count: number;
  blood_glucose: number;
  platelet_count: number;
  crp_level: number;
  ev71_result: 'Positive' | 'Negative' | 'NotDone';
  other_enterovirus_result: 'Positive' | 'Negative' | 'NotDone'; // Coxsackie A16, A6... ngoài EV71. 
  viral_isolation_result: 'Positive' | 'Negative' | 'NotDone'; //Kết quả phân lập virus (Nuôi cấy)
  troponin_i: number;
  chest_xray_edema: boolean; // X-quang phổi có hình ảnh phù phổi không
}

// 4. Kết quả chẩn đoán & Phân độ
export interface DiagnosisResult {
  diagnosis_status: 'Ca xác định TCM' | 'Ca lâm sàng TCM' | 'Nghi ngờ bệnh khác' | 'Chưa đủ dữ liệu';
  clinical_form: 'Cấp tính' | 'Không điển hình (Chỉ loét miệng)' | 'Không điển hình (Thể kín)' | 'Tối cấp';
  current_grade: 'Độ 1' | 'Độ 2a' | 'Độ 2b (Nhóm 1)' | 'Độ 2b (Nhóm 2)' | 'Độ 3' | 'Độ 4';
  priority_level: '3' | '2' | '1'; // 1 (cao nhất), 2 (trung bình), 3(thấp nhất).
  complication_type: 'Thần kinh' | 'Tim mạch' | 'Hô hấp' ; //Loại biến chứng nghi ngờ
  differential_alert: 'Ap tơ' | 'Thủy đậu' | 'Sốt xuất huyết/Nhiễm khuẩn huyết' | 'Viêm da mủ' | 'Dị ứng' ;
  treatment_location: string;
  transfer_needed: boolean;
  warning_signs: string[] ; //Các dấu hiệu cảnh báo cần theo dõi sát (Ví dụ: Mạch > 130, Sốt cao khó hạ).
  oxygen_support: boolean;
  recommended_next_step: string;
}

// 5. Hồ sơ bệnh nhân
export interface DiagnosisRecord {
  patient_id?: string ;
  full_name: string;
  age_months: number;
  gender: string;
  epidemiology_contact: boolean;
  has_comorbidities: boolean;
  comorbidities_detail: string;
  symptoms: Symptoms;
  vitals: Vitals;
  labTests: LabTests;
  result?: DiagnosisResult;
}

const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Thực hiện chạy suy diễn (Inference)
 * Tự động tính hiệu áp trước khi gửi dữ liệu
 */
export async function runInference(formData: DiagnosisRecord): Promise<DiagnosisResult> {
  try {
    // Tự động tính Hiệu áp trước khi gửi lên Server
    if (formData.vitals.systolic_bp && formData.vitals.diastolic_bp) {
      formData.vitals.pulse_pressure = formData.vitals.systolic_bp - formData.vitals.diastolic_bp;
    }

    const response = await fetch(`${API_BASE_URL}/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) 
    });
    
    if (!response.ok) throw new Error('Lỗi kết nối Backend');
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error("Inference Error:", error);
    throw error;
  }
}

export async function getHistory(): Promise<DiagnosisRecord[]> {
  const response = await fetch(`${API_BASE_URL}/history`);
  return await response.json();
}

export async function deleteDiagnosis(id: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/delete_patient/${id}`, { method: 'DELETE' });
  return response.ok;
}

export const generateId = () => Math.random().toString(36).substring(2, 9);

export async function saveDiagnosis(record: DiagnosisRecord): Promise<void> {
  console.log("Dữ liệu gửi lưu trữ:", record);
}