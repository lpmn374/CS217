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
import { Baby, ShieldCheck, Activity } from 'lucide-react';

const Index = () => {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: DiagnosisRecord) => {
    setIsLoading(true);
    setResult(null); // Reset kết quả cũ
    
    try {
      // data lúc này đã bao gồm đầy đủ cấu trúc: symptoms, vitals, labTests
      const diagnosisResult = await runInference(data);

      setResult(diagnosisResult);

      // Logic hiển thị Toast thông minh dựa trên kết quả trả về từ SQL
      const isCritical = diagnosisResult.priority_level === "CRITICAL";
      const isWarning = diagnosisResult.priority_level === "WARNING" || diagnosisResult.current_grade === "Độ 2a";

      toast({
        title: isCritical ? 'CẢNH BÁO: CA BỆNH NẶNG' : 'Kết quả phân tích',
        description: `Chẩn đoán: ${diagnosisResult.diagnosis_status} - ${diagnosisResult.current_grade}`,
        variant: isCritical ? "destructive" : (isWarning ? "default" : "default"),
        className: isCritical ? "bg-red-600 text-white" : "",
      });

      // Tự động cuộn xuống phần kết quả một cách mượt mà
      setTimeout(() => {
        const resultElement = document.getElementById('diagnosis-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error: any) {
      console.error("Lỗi Inference:", error);
      toast({
        variant: "destructive",
        title: "Lỗi kết nối Backend",
        description: error.message || "Không thể kết nối với máy chủ chẩn đoán. Vui lòng kiểm tra lại API.",
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
        <div className="text-center mb-12">
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
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-border/60">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Baby className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Cá thể hóa dữ liệu</p>
                <p className="text-xs text-muted-foreground">Tính toán huyết áp theo tháng tuổi</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-border/60">
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground ml-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Bảng thu thập dữ liệu lâm sàng</span>
          </div>
          <DiagnosisForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Khối Hiển Thị Kết Quả */}
        {result && (
          <div id="diagnosis-result" className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] bg-border flex-1"></div>
              <div className="bg-primary/5 px-8 py-3 rounded-full border border-primary/20 shadow-sm">
                <h2 className="text-2xl font-black text-center tracking-tight text-primary">KẾT LUẬN CỦA HỆ THỐNG</h2>
              </div>
              <div className="h-[1px] bg-border flex-1"></div>
            </div>
            
            <DiagnosisResultDisplay result={result} />
            
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl max-w-4xl mx-auto flex gap-4 shadow-sm">
              <div className="shrink-0"><ShieldCheck className="text-amber-600 h-6 w-6" /></div>
              <div className="space-y-1">
                <p className="font-bold text-amber-900 text-sm">Khuyến cáo từ hệ thống:</p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Kết quả phân tích dựa trên thuật toán suy diễn hỗ trợ quyết định lâm sàng. 
                  Người dùng <strong>không được tự ý</strong> dùng kết quả này để điều trị tại nhà mà không có sự giám sát của bác sĩ. 
                  Nếu trẻ có dấu hiệu chuyển nặng như giật mình, nôn nhiều hoặc sốt cao {'>'}39°C liên tục, cần nhập viện cấp cứu ngay lập tức.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-12 mt-24 bg-muted/30">
        <div className="container text-center">
          <div className="flex justify-center gap-8 mb-6 opacity-40">
             <span className="text-[10px] font-bold tracking-widest uppercase">My SQL Rule-Base</span>
             <span className="text-[10px] font-bold tracking-widest uppercase">Inference Engine v2.0</span>
             <span className="text-[10px] font-bold tracking-widest uppercase">QĐ 292/BYT 2024</span>
          </div>
          <p className="font-bold text-sm text-foreground/80">© 2024 HFMD Expert System - Forward Chaining Edition</p>
          <p className="mt-3 max-w-2xl mx-auto text-[11px] text-muted-foreground leading-relaxed">
            Hệ thống chuyên gia hỗ trợ chẩn đoán và phân độ bệnh Tay Chân Miệng. 
            Mọi dữ liệu được bảo mật và chỉ sử dụng cho mục đích hỗ trợ y tế.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;