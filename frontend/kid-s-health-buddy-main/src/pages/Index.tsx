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

import { useState } from 'react';
import { Header } from '@/components/Header';
import { DiagnosisForm } from '@/components/DiagnosisForm';
import { DiagnosisResultDisplay } from '@/components/DiagnosisResult';
import { 
  runInference, 
  DiagnosisResult,
  DiagnosisRecord
} from '@/lib/inference-engine';
import { useToast } from '@/hooks/use-toast';
import { Baby, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: DiagnosisRecord) => {
    setIsLoading(true);
    // Lưu ý: Không nên set null ngay lập tức để tránh giao diện bị "giật"
    
    try {
      // 1. Gửi dữ liệu sang Backend
      const diagnosisResult = await runInference(data);
      
      // 2. Kiểm tra an toàn giá trị trả về
      const currentGrade = diagnosisResult?.current_grade || "";
      
      // 3. Xác định mức độ nghiêm trọng (Sửa logic an toàn tại đây)
      const isCritical = ['Độ 3', 'Độ 4'].some(g => currentGrade.includes(g));
      const isWarning = currentGrade.includes('2b') || currentGrade.includes('2a');

      setResult(diagnosisResult);

      // 4. Hiển thị thông báo
      toast({
        title: isCritical ? '⚠️ CẢNH BÁO: CA BỆNH NẶNG' : 'Kết quả phân tích',
        description: `Chẩn đoán: ${diagnosisResult.diagnosis_status || "Nghi ngờ TCM"} - ${currentGrade || "Độ 1"}`,
        variant: isCritical ? "destructive" : "default",
        className: isCritical 
          ? "bg-red-700 text-white border-2 border-white font-bold" 
          : (isWarning ? "bg-orange-500 text-white font-bold" : "bg-green-600 text-white"),
      });

      // 5. Cuộn xuống phần kết quả
      setTimeout(() => {
        const resultElement = document.getElementById('diagnosis-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);

    } catch (error: any) {
      console.error("Lỗi Inference:", error);
      toast({
        variant: "destructive",
        title: "Lỗi kết nối",
        description: "Không thể nhận phản hồi từ Server. Hãy đảm bảo bạn đã chạy file app.py (Flask) ở cổng 5000.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Header />
      
      <main className="container py-8">
        {/* Header Section */}
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

        {/* Feature Cards */}
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

        {/* Khối Form Nhập Liệu */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground ml-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Bảng thu thập dữ liệu lâm sàng & xét nghiệm</span>
          </div>
          <DiagnosisForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Khối Hiển Thị Kết Quả */}
        {result && (
          <div id="diagnosis-result" className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] bg-border flex-1"></div>
              <div className="bg-primary/5 px-8 py-3 rounded-full border border-primary/20 shadow-md">
                <h2 className="text-2xl font-black text-center tracking-tight text-primary uppercase">Kết luận suy diễn</h2>
              </div>
              <div className="h-[1px] bg-border flex-1"></div>
            </div>
            
            <DiagnosisResultDisplay result={result} />
            
            {/* Cảnh báo an toàn */}
            <div className="mt-10 p-6 bg-red-50 border-2 border-red-100 rounded-3xl max-w-4xl mx-auto flex gap-5 shadow-sm">
              <div className="shrink-0 bg-red-100 h-12 w-12 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="text-red-600 h-7 w-7" />
              </div>
              <div className="space-y-2">
                <p className="font-black text-red-900 text-lg uppercase tracking-tight">Lưu ý quan trọng từ Bộ Y Tế:</p>
                <p className="text-sm text-red-800 leading-relaxed font-medium">
                  Kết quả này là công cụ hỗ trợ quyết định lâm sàng cho nhân viên y tế. 
                  <strong> Tuyệt đối không</strong> tự ý điều trị tại nhà dựa trên kết quả này. 
                  Nếu trẻ có các dấu hiệu như: <span className="underline decoration-2">Giật mình, đi loạng choạng, sốt cao khó hạ hoặc nôn nhiều</span>, 
                  phải đưa trẻ đến cơ sở y tế gần nhất ngay lập tức.
                </p>
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