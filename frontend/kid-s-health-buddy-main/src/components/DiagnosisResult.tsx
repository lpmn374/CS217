// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { AlertTriangle, CheckCircle, XCircle, Stethoscope, GitBranch } from 'lucide-react';
// import { DiagnosisResult as DiagnosisResultType } from '@/lib/inference-engine';
// import { InferenceFlowchart } from './InferenceFlowchart';
// import { cn } from '@/lib/utils';

// interface DiagnosisResultProps {
//   result: DiagnosisResultType;
//   className?: string;
// }

// const GRADE_CONFIG = {
//   '1': {
//     label: 'Độ 1',
//     sublabel: 'Thể nhẹ',
//     color: 'grade-1',
//     bgClass: 'bg-grade-1-bg border-grade-1',
//     textClass: 'text-grade-1',
//     Icon: CheckCircle,
//   },
//   '2a': {
//     label: 'Độ 2a',
//     sublabel: 'Có biến chứng nhẹ',
//     color: 'grade-2a',
//     bgClass: 'bg-grade-2a-bg border-grade-2a',
//     textClass: 'text-grade-2a',
//     Icon: AlertTriangle,
//   },
//   '2b': {
//     label: 'Độ 2b',
//     sublabel: 'Có biến chứng nặng',
//     color: 'grade-2b',
//     bgClass: 'bg-grade-2b-bg border-grade-2b',
//     textClass: 'text-grade-2b',
//     Icon: AlertTriangle,
//   },
//   '3': {
//     label: 'Độ 3',
//     sublabel: 'Nguy hiểm',
//     color: 'grade-3',
//     bgClass: 'bg-grade-3-bg border-grade-3',
//     textClass: 'text-grade-3',
//     Icon: XCircle,
//   },
//   '4': {
//     label: 'Độ 4',
//     sublabel: 'Rất nguy hiểm',
//     color: 'grade-4',
//     bgClass: 'bg-grade-4-bg border-grade-4',
//     textClass: 'text-grade-4',
//     Icon: XCircle,
//   },
// };

// export function DiagnosisResultDisplay({ result, className }: DiagnosisResultProps) {
//   if (!result.isClinicalCase) {
//     return (
//       <Card className={cn("border-2 border-muted", className)}>
//         <CardContent className="pt-6 text-center">
//           <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//           <h3 className="text-xl font-semibold text-muted-foreground">
//             Không phải ca bệnh Tay Chân Miệng
//           </h3>
//           <p className="text-muted-foreground mt-2">
//             Trẻ không có triệu chứng loét miệng hoặc phát ban da điển hình của bệnh TCM.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   const grade = result.resultGrade!;
//   const config = GRADE_CONFIG[grade];
//   const GradeIcon = config.Icon;

//   return (
//     <div className={cn("space-y-6", className)}>
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Result Card */}
//         <Card className={cn("border-2 shadow-lg", config.bgClass)}>
//           <CardHeader className="pb-2">
//             <CardTitle className="flex items-center gap-2">
//               <Stethoscope className={cn("h-5 w-5", config.textClass)} />
//               <span className={config.textClass}>Kết quả chẩn đoán</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-4">
//               <GradeIcon className={cn("h-16 w-16", config.textClass)} />
//               <div>
//                 <h2 className={cn("text-4xl font-bold", config.textClass)}>
//                   {config.label}
//                 </h2>
//                 <p className={cn("text-lg", config.textClass)}>{config.sublabel}</p>
//               </div>
//             </div>
//             <Badge 
//               variant="outline" 
//               className={cn("mt-4 text-sm", config.textClass, "border-current")}
//             >
//               {grade === '1' && '🟢 Mức độ nhẹ'}
//               {grade === '2a' && '🟡 Cần theo dõi'}
//               {grade === '2b' && '🟠 Cảnh báo'}
//               {grade === '3' && '🔴 Nguy hiểm'}
//               {grade === '4' && '🔴 Rất nguy hiểm'}
//             </Badge>
//           </CardContent>
//         </Card>

//         {/* Treatment Card */}
//         <Card className="border-2 shadow-lg">
//           <CardHeader className="pb-2">
//             <CardTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-primary" />
//               Hướng xử trí
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-lg font-medium">{result.treatment}</p>
//             {grade !== '1' && (
//               <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
//                 <p className="text-sm text-destructive font-medium">
//                   ⚠️ Đưa trẻ đến cơ sở y tế ngay nếu có bất kỳ dấu hiệu nặng thêm!
//                 </p>
//               </div>
//             )}
//             {grade === '1' && (
//               <div className="mt-4 p-3 bg-accent rounded-lg">
//                 <p className="text-sm text-accent-foreground">
//                   ✓ Cho trẻ nghỉ ngơi, uống nhiều nước, ăn thức ăn mềm, nguội.
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Inference Flowchart */}
//       <Card className="border-2 shadow-lg">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <GitBranch className="h-5 w-5 text-primary" />
//             Cây suy diễn (Forward Chaining)
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Quá trình suy luận từ nặng đến nhẹ - Dừng khi gặp luật thỏa mãn đầu tiên
//           </p>
//         </CardHeader>
//         <CardContent>
//           <InferenceFlowchart steps={result.inferenceSteps} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, GitBranch, AlertCircle, Info, Activity, ClipboardList } from 'lucide-react';
import { DiagnosisResult as DiagnosisResultType } from '@/lib/inference-engine';
import { InferenceFlowchart } from './InferenceFlowchart';
import { cn } from '@/lib/utils';

interface DiagnosisResultProps {
  result: DiagnosisResultType;
}

export function DiagnosisResultDisplay({ result }: DiagnosisResultProps) {
  const isDifferential = !!result.differential_alert;
  const hasComplications = Array.isArray(result.complication_type) && result.complication_type.length > 0;
  const hasLabs = Array.isArray(result.lab_orders) && result.lab_orders.length > 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. KẾT LUẬN CHÍNH */}
      <div className={cn(
        "flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl border-4 shadow-xl animate-in fade-in zoom-in duration-500",
        isDifferential ? "border-orange-500/30" : "border-primary/20"
      )}>
        <div className={cn(
          "p-4 rounded-full mb-4",
          isDifferential ? "bg-orange-100" : "bg-primary/10"
        )}>
          {isDifferential ? <AlertCircle className="h-12 w-12 text-orange-600" /> : <Stethoscope className="h-12 w-12 text-primary" />}
        </div>
        
        {/* ✅ YÊU CẦU 2: diagnosis_status nằm trên và nhỏ hơn */}
        <div className="flex flex-col items-center gap-2">
           <Badge variant="outline" className={cn(
             "px-4 py-1 text-sm font-bold rounded-full uppercase tracking-tighter",
             isDifferential ? "text-orange-500 border-orange-200" : "text-primary border-primary/20"
           )}>
             {result.diagnosis_status || "Trạng thái chẩn đoán"}
           </Badge>

           {/* Kết quả chính to nhất */}
           <div className={cn(
             "text-6xl font-black mb-2 drop-shadow-sm",
             isDifferential ? "text-orange-600" : "text-primary"
           )}>
             {isDifferential ? result.differential_alert : (result.current_grade || "Theo dõi thêm")}
           </div>
        </div>

        {result.clinical_form && !isDifferential && (
          <span className="text-slate-500 font-bold italic text-lg mt-2">
            Thể lâm sàng: {result.clinical_form}
          </span>
        )}
      </div>

      {/* ✅ YÊU CẦU 1: LỜI KHUYÊN KHI CÓ BIẾN CHỨNG (LUÔN ƯU TIÊN HIỂN THỊ ĐẦU TIÊN) */}
      {hasComplications && (
        <div className="bg-red-600 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <AlertCircle className="h-10 w-10 flex-shrink-0" />
          <div>
            <p className="font-black text-lg">CẢNH BÁO BIẾN CHỨNG NGUY HIỂM!</p>
            <p className="text-sm opacity-90 font-bold">
              Trẻ có dấu hiệu: {Array.isArray(result.complication_type) ? result.complication_type.join(", ") : result.complication_type}. 
              Cần can thiệp y tế khẩn cấp, không được chậm trễ.
            </p>
          </div>
        </div>
      )}

      {/* 2. CHI TIẾT (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card Biến chứng */}
        <Card className={cn("border-2 shadow-sm", hasComplications ? "border-red-200 bg-red-50/20" : "border-slate-100")}>
          <CardHeader className="py-3 px-4 flex flex-row items-center gap-2 border-b">
            <Activity className={cn("h-5 w-5", hasComplications ? "text-red-600" : "text-slate-400")} />
            <CardTitle className="text-sm font-black uppercase">Danh sách biến chứng</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {hasComplications && Array.isArray(result.complication_type) ? (
              <div className="flex flex-wrap gap-2">
                {result.complication_type.map((comp, i) => (
                  <Badge key={i} variant="destructive" className="bg-red-600">{comp}</Badge>
                ))}
              </div>
            ) : (
              <span className="text-slate-400 text-sm italic">Chưa phát hiện biến chứng cụ thể</span>
            )}
          </CardContent>
        </Card>

        {/* Các thông tin khác */}
        {!isDifferential ? (
          <>
            <Card className={cn("border-2 shadow-sm", hasLabs ? "border-blue-200 bg-blue-50/20" : "border-slate-100")}>
              <CardHeader className="py-3 px-4 flex flex-row items-center gap-2 border-b">
                <ClipboardList className={cn("h-5 w-5", hasLabs ? "text-blue-600" : "text-slate-400")} />
                <CardTitle className="text-sm font-black uppercase">Cận lâm sàng</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {hasLabs && Array.isArray(result.lab_orders) ? (
                  <ul className="space-y-1">
                    {result.lab_orders.map((order, i) => (
                      <li key={i} className="text-xs font-bold text-blue-800">• {order}</li>
                    ))}
                  </ul>
                ) : <span className="text-slate-400 text-sm italic">Không có chỉ định</span>}
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-2 border-primary/10 shadow-md bg-slate-50/50 text-center md:text-left">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Địa điểm điều trị</span>
                  <p className="text-lg font-black text-slate-700">{result.treatment_location || "Theo dõi thêm"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Lời khuyên bác sĩ</span>
                  <p className="text-sm font-bold text-slate-600">{result.recommended_next_step || "Theo dõi sát các dấu hiệu."}</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Lời khuyên cho ca phân biệt */
          <Card className="md:col-span-1 border-2 border-orange-200 shadow-md bg-orange-50">
            <CardHeader className="py-3 px-4 border-b bg-white">
              <CardTitle className="text-sm font-black uppercase text-orange-600">Hướng dẫn tiếp theo</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
               <p className="text-sm font-bold text-orange-900 leading-tight">
                 Trẻ nghi ngờ mắc <strong>{result.differential_alert}</strong>. Cần đưa trẻ đến cơ sở y tế để kiểm tra và làm xét nghiệm loại trừ.
               </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 3. FLOWCHART */}
      {Array.isArray(result.inferenceSteps) && result.inferenceSteps.length > 0 && (
        <Card className="border-2 shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-slate-50 border-b py-4 text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-md font-bold text-primary">
              <GitBranch className="h-5 w-5" /> Tiến trình suy diễn
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-10 bg-slate-50/30">
            <InferenceFlowchart steps={result.inferenceSteps as any[]} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}