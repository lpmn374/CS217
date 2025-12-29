// import { useState } from 'react';
// import { Header } from '@/components/Header';
// import { DiagnosisForm } from '@/components/DiagnosisForm';
// import { DiagnosisResultDisplay } from '@/components/DiagnosisResult';
// import { 
//   runInference, 
//   DiagnosisResult,
//   DiagnosisRecord
// } from '@/lib/inference-engine';
// import { useToast } from '@/hooks/use-toast';
// import { Baby, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

// const Index = () => {
//   const [result, setResult] = useState<DiagnosisResult | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = async (data: DiagnosisRecord) => {
//     setIsLoading(true);
//     setResult(null); 
    
//     try {
//       // Gửi dữ liệu sang Backend (Forward Chaining Engine)
//       const diagnosisResult = await runInference(data);
//       setResult(diagnosisResult);

//       // Xác định mức độ nghiêm trọng để hiển thị thông báo
//       // Sửa lại logic check để khớp với kiểu dữ liệu string từ SQL
//       const isCritical = ['Độ 3', 'Độ 4'].includes(diagnosisResult.current_grade);
//       const isWarning = diagnosisResult.current_grade.includes('2b') || diagnosisResult.current_grade === 'Độ 2a';

//       toast({
//         title: isCritical ? '⚠️ CẢNH BÁO: CA BỆNH NẶNG' : 'Kết quả phân tích',
//         description: `Chẩn đoán: ${diagnosisResult.diagnosis_status} - ${diagnosisResult.current_grade}`,
//         // Hiệu ứng màu sắc cho Toast
//         variant: isCritical ? "destructive" : "default",
//         className: isCritical ? "bg-red-700 text-white border-2 border-white font-bold" : (isWarning ? "bg-orange-500 text-white" : ""),
//       });

//       // Cuộn xuống phần kết quả
//       setTimeout(() => {
//         const resultElement = document.getElementById('diagnosis-result');
//         if (resultElement) {
//           resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//       }, 150);

//     } catch (error: any) {
//       console.error("Lỗi Inference:", error);
//       toast({
//         variant: "destructive",
//         title: "Lỗi hệ thống",
//         description: error.message || "Không thể kết nối với máy chủ chẩn đoán. Vui lòng kiểm tra API Flask.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background selection:bg-primary/10">
//       <Header />
      
//       <main className="container py-8">
//         {/* Header Section */}
//         <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-4">
//             <ShieldCheck className="h-4 w-4" />
//             <span className="text-sm font-semibold tracking-wide uppercase">Phác đồ Bộ Y tế cập nhật 2024</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter">
//             Hệ Chuyên Gia <span className="text-primary">HFMD</span>
//           </h1>
//           <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
//             Sử dụng công nghệ suy diễn tiến (<span className="text-primary italic">Forward Chaining</span>) 
//             hỗ trợ phân tầng điều trị Tay Chân Miệng theo chuẩn y khoa.
//           </p>
//         </div>

//         {/* Feature Cards */}
//         <div className="flex justify-center mb-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
//             <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-border/60 hover:border-primary/40 transition-colors">
//               <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//                 <Baby className="h-6 w-6 text-primary" />
//               </div>
//               <div className="text-left">
//                 <p className="font-bold text-sm">Phân độ thông minh</p>
//                 <p className="text-xs text-muted-foreground">Tự động nhận diện dấu hiệu 2a, 2b, 3, 4</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-border/60 hover:border-red-200 transition-colors">
//               <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
//                 <Activity className="h-6 w-6 text-red-600" />
//               </div>
//               <div className="text-left">
//                 <p className="font-bold text-sm">Cảnh báo "Thác nước"</p>
//                 <p className="text-xs text-muted-foreground">Phát hiện sớm suy hô hấp & tuần hoàn</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Khối Form Nhập Liệu */}
//         <div className="max-w-6xl mx-auto">
//           <div className="mb-4 flex items-center gap-2 text-muted-foreground ml-1">
//             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
//             <span className="text-xs font-bold uppercase tracking-widest">Bảng thu thập dữ liệu lâm sàng & xét nghiệm</span>
//           </div>
//           <DiagnosisForm onSubmit={handleSubmit} isLoading={isLoading} />
//         </div>

//         {/* Khối Hiển Thị Kết Quả */}
//         {result && (
//           <div id="diagnosis-result" className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
//             <div className="flex items-center justify-center gap-4 mb-10">
//               <div className="h-[1px] bg-border flex-1"></div>
//               <div className="bg-primary/5 px-8 py-3 rounded-full border border-primary/20 shadow-md">
//                 <h2 className="text-2xl font-black text-center tracking-tight text-primary uppercase">Kết luận suy diễn</h2>
//               </div>
//               <div className="h-[1px] bg-border flex-1"></div>
//             </div>
            
//             <DiagnosisResultDisplay result={result} />
            
//             {/* Cảnh báo an toàn */}
//             <div className="mt-10 p-6 bg-red-50 border-2 border-red-100 rounded-3xl max-w-4xl mx-auto flex gap-5 shadow-sm">
//               <div className="shrink-0 bg-red-100 h-12 w-12 rounded-2xl flex items-center justify-center">
//                 <AlertTriangle className="text-red-600 h-7 w-7" />
//               </div>
//               <div className="space-y-2">
//                 <p className="font-black text-red-900 text-lg uppercase tracking-tight">Lưu ý quan trọng từ Bộ Y Tế:</p>
//                 <p className="text-sm text-red-800 leading-relaxed font-medium">
//                   Kết quả này là công cụ hỗ trợ quyết định lâm sàng cho nhân viên y tế. 
//                   <strong> Tuyệt đối không</strong> tự ý điều trị tại nhà dựa trên kết quả này. 
//                   Nếu trẻ có các dấu hiệu như: <span className="underline decoration-2">Giật mình, đi loạng choạng, sốt cao khó hạ hoặc nôn nhiều</span>, 
//                   phải đưa trẻ đến cơ sở y tế gần nhất ngay lập tức.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer className="border-t py-12 mt-24 bg-slate-50">
//         <div className="container text-center">
//           <div className="flex justify-center gap-8 mb-6 opacity-60">
//              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Forward Chaining</span>
//              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Expert System v2.0</span>
//              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">QĐ 292/BYT 2024</span>
//           </div>
//           <p className="font-bold text-sm text-slate-800">© 2024 HFMD Clinical Decision Support System</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Index;

// Example: Cách sử dụng DiagnosisForm và runInference đúng cách

import { useState } from 'react';
import { Header } from '@/components/Header';
import { DiagnosisForm } from '@/components/DiagnosisForm';
import { DiagnosisResultDisplay } from '@/components/DiagnosisResult';
import { runInference, DiagnosisResult } from '@/lib/inference-engine';
import { useToast } from '@/hooks/use-toast';
import { 
  Baby, ShieldCheck, Activity, AlertTriangle, 
  Brain, CheckCircle2, Info, XCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (dataToSend: any) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log("📤 Index.tsx nhận data:", dataToSend);
      // Gửi trực tiếp data đã chuyển đổi
      const diagnosisResult = await runInference(dataToSend);
      console.log("📥 Kết quả từ backend:", diagnosisResult);
      setResult(diagnosisResult);

      // Kiểm tra nếu là bệnh khác (differential)
      const isDifferential = !!diagnosisResult?.differential_alert;
      
      // Kiểm tra mức độ nghiêm trọng
      // SỬA: Thêm .result vào trước current_grade
      const currentGrade = diagnosisResult?.result?.current_grade || "";
      const isCritical = ['Độ 3', 'Độ 4'].some(g => currentGrade.includes(g));
      const isWarning = currentGrade.includes('2b') || currentGrade.includes('2a');

      //setResult(diagnosisResult);

      // Hiển thị toast tùy theo tình huống
      if (isDifferential) {
        toast({
          title: '⚠️ CẢNH BÁO: Nghi ngờ bệnh khác',
          description: `Phát hiện: ${diagnosisResult.differential_alert}. Cần khám chuyên khoa ngay!`,
          variant: "destructive",
          className: "bg-orange-600 text-white border-2 border-white font-bold",
        });
      } else if (diagnosisResult.diagnosis_status === "Không mắc bệnh/Theo dõi thêm") {
        toast({
          title: 'ℹ️ Kết quả phân tích',
          description: 'Trẻ không có dấu hiệu mắc TCM. Tiếp tục theo dõi.',
          className: "bg-blue-600 text-white font-bold",
        });
      } else {
        toast({
          title: isCritical ? '🚨 CẢNH BÁO: CA BỆNH NẶNG' : '✅ Kết quả phân tích',
          description: `Chẩn đoán: ${diagnosisResult.diagnosis_status || "Nghi ngờ TCM"} - ${currentGrade || "Độ 1"}`,
          variant: isCritical ? "destructive" : "default",
          className: isCritical 
            ? "bg-red-700 text-white border-2 border-white font-bold" 
            : (isWarning ? "bg-orange-500 text-white font-bold" : "bg-green-600 text-white"),
        });
      }

      // Cuộn xuống kết quả
      setTimeout(() => {
        const resultElement = document.getElementById('diagnosis-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);

    } catch (error: any) {
      console.error("❌ Lỗi Inference:", error);
      toast({
        variant: "destructive",
        title: "Lỗi kết nối",
        description: "Không thể nhận phản hồi từ Server. Hãy đảm bảo bạn đã chạy file app.py (Flask) ở cổng 5000.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC NHÓM CÁC BƯỚC SUY DIỄN ---
  const getGroupedTrace = (trace: any[]) => {
  if (!trace || !Array.isArray(trace)) return [];
  
  return trace.reduce((acc: any[], current: any) => {
    // 1. Kiểm tra nếu step bị thiếu thì bỏ qua hoặc đặt tên mặc định
    const stepName = current.step || "XỬ LÝ";
    
    const existing = acc.find(item => item.step === stepName);
    if (existing) {
      existing.details.push({
        message: current.message,
        rule_id: current.rule_id,
        status: current.status || 'info'
      });
      // Ưu tiên hiển thị màu sắc theo độ nghiêm trọng
      if (current.status === 'success' && existing.status !== 'warning') {
        existing.status = 'success';
      }
      if (current.status === 'warning' || current.status === 'danger') {
        existing.status = 'warning';
      }
    } else {
      acc.push({
        step: stepName,
        status: current.status || 'info',
        details: [{
          message: current.message,
          rule_id: current.rule_id,
          status: current.status || 'info'
        }]
      });
    }
    return acc;
  }, []);
};

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Header />
      
      <main className="container py-8">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-4">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Phác đồ Bộ Y tế cập nhật 2024</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter">
            Hệ Chuyên Gia <span className="text-primary">HFMD</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
            Sử dụng công nghệ suy diễn tiến (<span className="text-primary italic">Forward Chaining</span>) 
            hỗ trợ phân tầng điều trị Tay Chân Miệng theo chuẩn y khoa.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-border/60 hover:border-primary/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Baby className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Phân độ thông minh</p>
                <p className="text-xs text-muted-foreground">Tự động nhận diện dấu hiệu 2a, 2b, 3, 4</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-border/60 hover:border-red-200 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Cảnh báo "Thác nước"</p>
                <p className="text-xs text-muted-foreground">Phát hiện sớm suy hô hấp & tuần hoàn</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground ml-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Bảng thu thập dữ liệu lâm sàng & xét nghiệm</span>
          </div>
          <DiagnosisForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {result && (
          <div id="diagnosis-result" className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] bg-border flex-1"></div>
              <div className="bg-primary/5 px-8 py-3 rounded-full border border-primary/20 shadow-md">
                <h2 className="text-2xl font-black text-center tracking-tight text-primary uppercase">Kết luận suy diễn</h2>
              </div>
              <div className="h-[1px] bg-border flex-1"></div>
            </div>
            
            <div className="space-y-8">
                {/* 1. HIỂN THỊ TÓM TẮT KẾT QUẢ */}
                <DiagnosisResultDisplay result={result.result} />

                {/* 2. HIỂN THỊ CÂY SUY DIỄN ĐÃ GỘP NHÓM */}
                <Card className="shadow-xl border-t-4 border-t-slate-800">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-lg flex items-center gap-2 uppercase font-black">
                            <Brain className="text-purple-600 h-5 w-5" /> 
                            Chi tiết quy trình suy luận (Trace)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {getGroupedTrace(result.inference_trace).map((group: any, idx: number) => (
                                <div key={idx} className={`flex gap-4 p-4 rounded-xl border transition-all ${
                                    group.status === 'success' ? 'bg-green-50/50 border-green-100' : 
                                    group.status === 'warning' ? 'bg-yellow-50/50 border-yellow-100' : 'bg-slate-50 border-slate-100'
                                }`}>
                                    {/* Chỉ hiển thị chữ Bước 1 lần duy nhất */}
                                    <div className="font-black text-sm text-slate-400 min-w-[100px] uppercase pt-1 border-r border-slate-200">
                                        {group.step}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        {group.details.map((detail: any, dIdx: number) => (
                                            <div key={dIdx} className="animate-in fade-in slide-in-from-left-2">
                                                <div className="flex items-start gap-2">
                                                    {detail.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />}
                                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                                        {detail.message}
                                                    </p>
                                                </div>
                                                {detail.rule_id && (
                                                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm text-slate-500 font-mono mt-1 inline-block">
                                                        Mã luật: {detail.rule_id}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              
                {/* 3. CẢNH BÁO Y TẾ */}
                <div className="mt-10 p-6 bg-red-50 border-2 border-red-100 rounded-3xl flex gap-5 shadow-sm">
                    <AlertTriangle className="text-red-600 h-10 w-10 shrink-0" />
                    <div className="space-y-2">
                        <p className="font-black text-red-900 text-lg uppercase tracking-tight">Lưu ý quan trọng từ Bộ Y Tế:</p>
                        <p className="text-sm text-red-800 leading-relaxed font-medium">
                            Kết quả này là công cụ hỗ trợ quyết định lâm sàng cho nhân viên y tế. 
                            <strong> Tuyệt đối không</strong> tự ý điều trị tại nhà dựa trên kết quả này. 
                            Nếu trẻ có các dấu hiệu nặng, phải đưa trẻ đến cơ sở y tế gần nhất ngay lập tức.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-12 mt-24 bg-slate-50">
        <div className="container text-center">
          <div className="flex justify-center gap-8 mb-6 opacity-60">
             <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Forward Chaining</span>
             <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Expert System v2.0</span>
             <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">QĐ 292/BYT 2024</span>
          </div>
          <p className="font-bold text-sm text-slate-800">© 2024 HFMD Clinical Decision Support System</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;