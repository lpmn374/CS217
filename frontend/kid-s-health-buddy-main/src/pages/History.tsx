// import { useState, useMemo, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Header } from '@/components/Header';
// import { DiagnosisResultDisplay } from '@/components/DiagnosisResult';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { 
//   getHistory, 
//   deleteDiagnosis, 
//   DiagnosisRecord 
// } from '@/lib/inference-engine';
// import { useToast } from '@/hooks/use-toast';
// import { 
//   Search, 
//   Trash2, 
//   Eye, 
//   Calendar, 
//   User, 
//   Activity,
//   FileX,
//   ArrowLeft 
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const GRADE_LABELS: Record<string, { label: string; className: string }> = {
//   '1': { label: 'Độ 1', className: 'grade-1 border' },
//   '2a': { label: 'Độ 2a', className: 'grade-2a border' },
//   '2b': { label: 'Độ 2b', className: 'grade-2b border' },
//   '3': { label: 'Độ 3', className: 'grade-3 border' },
//   '4': { label: 'Độ 4', className: 'grade-4 border' },
// };

// export default function History() {
// // 1. Khởi tạo là mảng rỗng để không bị lỗi filter khi chưa có dữ liệu
//   const [history, setHistory] = useState<DiagnosisRecord[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [gradeFilter, setGradeFilter] = useState<string>('all');
//   const [selectedRecord, setSelectedRecord] = useState<DiagnosisRecord | null>(null);
//   const { toast } = useToast();

//   // Thêm useEffect để tự động load dữ liệu
//   useEffect(() => {
//     const loadData = async () => {
//       const data = await getHistory();
//       setHistory(Array.isArray(data) ? data : []);
//     };
//     loadData();
//   }, []);

//   const loadHistory = async () => {
//     try {
//       const data = await getHistory(); // Đợi dữ liệu từ MySQL trả về
//       setHistory(Array.isArray(data) ? data : []); 
//     } catch (error) {
//       console.error("Lỗi tải lịch sử:", error);
//     }
//   };

//   const filteredHistory = useMemo(() => {
//     if (!Array.isArray(history)) return [];
//     return history.filter(record => {
//       // Bảo vệ: Nếu childName bị NULL thì hiện "N/A" để không bị trắng trang
//       const name = record.childName || "N/A";
//       const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      
//       // Dùng dấu ?. để không bị lỗi nếu result chưa có trong database
//       const matchesGrade = gradeFilter === 'all' || record.result?.resultGrade === gradeFilter;
//       return matchesSearch && matchesGrade;
//     });
//   }, [history, searchQuery, gradeFilter]);

//   const handleDelete = async (id: string) => {
//       await deleteDiagnosis(id); // Đợi xóa xong trên Server
//       await loadHistory();      // Tải lại danh sách mới
//       toast({
//         title: 'Đã xóa',
//         description: 'Ca chẩn đoán đã được xóa khỏi lịch sử.',
//       });
//     };

//   const formatDate = (isoString: string) => {
//     if (!isoString) return "Chưa rõ ngày";
//     try {
//       const date = new Date(isoString);
//       return new Intl.DateTimeFormat('vi-VN', {
//         day: '2-digit', month: '2-digit', year: 'numeric'
//       }).format(date);
//     } catch (e) { return "Ngày lỗi"; }
//   };

//   const formatGender = (gender: string | null) => {
//     if (!gender || gender === "N/A") return "Chưa rõ";
//     return gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : gender;
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       <main className="container py-8">
//         {/* Page Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Lịch sử chẩn đoán</h1>
//             <p className="text-muted-foreground mt-1">
//               Xem lại các ca bệnh đã được phân tích ({history.length} ca)
//             </p>
//           </div>
//           <Link to="/">
//             <Button variant="outline">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Về trang chẩn đoán
//             </Button>
//           </Link>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Tìm theo tên trẻ..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Select value={gradeFilter} onValueChange={setGradeFilter}>
//             <SelectTrigger className="w-full sm:w-48">
//               <SelectValue placeholder="Lọc theo độ" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Tất cả độ</SelectItem>
//               <SelectItem value="1">Độ 1 - Nhẹ</SelectItem>
//               <SelectItem value="2a">Độ 2a</SelectItem>
//               <SelectItem value="2b">Độ 2b</SelectItem>
//               <SelectItem value="3">Độ 3 - Nặng</SelectItem>
//               <SelectItem value="4">Độ 4 - Rất nặng</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* History List */}
//         {filteredHistory.length === 0 ? (
//           <Card className="border-dashed">
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <FileX className="h-12 w-12 text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium text-muted-foreground">
//                 {history.length === 0 
//                   ? 'Chưa có lịch sử chẩn đoán' 
//                   : 'Không tìm thấy kết quả phù hợp'}
//               </h3>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {history.length === 0 
//                   ? 'Thực hiện chẩn đoán đầu tiên để bắt đầu.' 
//                   : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'}
//               </p>
//               {history.length === 0 && (
//                 <Link to="/" className="mt-4">
//                   <Button>Chẩn đoán ngay</Button>
//                 </Link>
//               )}
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-4">
//             {filteredHistory.map((record) => {
//               const gradeConfig = record.result?.resultGrade 
//                 ? GRADE_LABELS[record.result.resultGrade] 
//                 : null;

//               return (
//                 <Card key={record.id} className="hover:shadow-md transition-shadow">
//                   <CardContent className="p-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                       {/* Info */}
//                       <div className="flex items-start gap-4">
//                         <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center shrink-0">
//                           <User className="h-6 w-6 text-accent-foreground" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-foreground">
//                             {record.childName}
//                           </h3>
//                           <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
//                             <span>{formatGender(record.childGender)}, {record.childAgeMonths} tháng</span>
//                             <span className="flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               {formatDate(record.createdAt)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex items-center gap-3">
//                         {gradeConfig ? (
//                           <Badge className={cn("text-sm px-3 py-1", gradeConfig.className)}>
//                             {gradeConfig.label}
//                           </Badge>
//                         ) : (
//                           <Badge variant="secondary">Không phải TCM</Badge>
//                         )}
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedRecord(record)}
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           Chi tiết
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                           onClick={() => handleDelete(record.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         )}

//         {/* Detail Modal */}
//         <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5 text-primary" />
//                 Chi tiết ca chẩn đoán
//               </DialogTitle>
//             </DialogHeader>
            
//             {selectedRecord && (
//               <div className="space-y-6">
//                 {/* Patient Info */}
//                 <Card>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-base">Thông tin bệnh nhân</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">Họ tên:</span>
//                         <p className="font-medium">{selectedRecord.childName}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Giới tính:</span>
//                         <p className="font-medium">{formatGender(selectedRecord.childGender)}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Tuổi:</span>
//                         <p className="font-medium">{selectedRecord.childAgeMonths} tháng</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Ngày khám:</span>
//                         <p className="font-medium">{formatDate(selectedRecord.createdAt)}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Input Data */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base">Triệu chứng</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <ul className="space-y-1 text-sm">
//                         <SymptomItem label="Loét miệng" value={selectedRecord.symptoms.mouthUlcer} />
//                         <SymptomItem label="Phát ban da" value={selectedRecord.symptoms.rash} />
//                         <SymptomItem label="Sốt ≥ 39°C" value={selectedRecord.symptoms.highFever} />
//                         <SymptomItem label="Sốt > 2 ngày" value={selectedRecord.symptoms.feverOver2Days} />
//                         <SymptomItem label="Nôn nhiều" value={selectedRecord.symptoms.vomiting} />
//                         <SymptomItem label="Lừ đừ" value={selectedRecord.symptoms.lethargy} />
//                         <SymptomItem label="Run/yếu chi" value={selectedRecord.symptoms.limbWeakness} />
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base">Chỉ số sinh hiệu</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <ul className="space-y-2 text-sm">
//                         <li className="flex justify-between">
//                           <span className="text-muted-foreground">Mạch:</span>
//                           <span className="font-medium">{selectedRecord.vitals.heartRate} bpm</span>
//                         </li>
//                         <li className="flex justify-between">
//                           <span className="text-muted-foreground">SpO2:</span>
//                           <span className="font-medium">{selectedRecord.vitals.spo2}%</span>
//                         </li>
//                         <li className="flex justify-between">
//                           <span className="text-muted-foreground">Giật mình:</span>
//                           <span className="font-medium">{selectedRecord.vitals.startleCount} lần/30 phút</span>
//                         </li>
//                         <li className="flex justify-between">
//                           <span className="text-muted-foreground">Nằm yên, không sốt:</span>
//                           <span className="font-medium">{selectedRecord.vitals.isRestingNoFever ? 'Có' : 'Không'}</span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Result with Flowchart */}
//                 <DiagnosisResultDisplay result={selectedRecord.result} />
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </main>
//     </div>
//   );
// }

// function SymptomItem({ label, value }: { label: string; value: boolean }) {
//   return (
//     <li className="flex items-center justify-between">
//       <span className="text-muted-foreground">{label}:</span>
//       <span className={cn("font-medium", value ? "text-destructive" : "text-muted-foreground")}>
//         {value ? '✓ Có' : '✗ Không'}
//       </span>
//     </li>
//   );
// }

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Trash2, Calendar, User, FileX, ArrowLeft, 
  Loader2, AlertCircle, Eye, Activity, Stethoscope, Beaker
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. Interface khớp hoàn toàn với JOIN SQL từ Backend
interface HistoryRecord {
  id: number;
  name: string;
  age_months: number;
  gender: string;
  has_comorbidities: boolean;
  comorbidities_detail?: string;
  epidemiology_contact: boolean;
  date: string;

  // Triệu chứng (ClinicalAssessment)
  fever: boolean;
  fever_temp?: number;
  fever_duration_days?: number;
  fever_refractory: boolean;
  mouth_ulcer: boolean;
  skin_rash: boolean;
  vomiting: boolean;
  lethargy: boolean;
  irritable_crying: boolean;

  // Chỉ số sinh tồn (VitalSignsNeuro)
  heart_rate?: number;
  respiratory_rate?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  spo2?: number;
  startle_reflex_history: number;
  ataxia: boolean;
  limb_weakness: boolean;

  // Xét nghiệm (LabTests)
  ev71_result?: string;

  // Kết quả (DiagnosticOutput)
  grade: string;
  diagnosis: string;
  treatment: string;
  complication?: string;
  priority_level?: string;
}

const GRADE_LABELS: Record<string, { label: string; className: string }> = {
  'Độ 1': { label: 'Độ 1', className: 'bg-green-100 text-green-800 border-green-200' },
  'Độ 2a': { label: 'Độ 2a', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'Độ 2b (Nhóm 1)': { label: 'Độ 2b-N1', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  'Độ 2b (Nhóm 2)': { label: 'Độ 2b-N2', className: 'bg-orange-200 text-orange-900 border-orange-300' },
  'Độ 3': { label: 'Độ 3', className: 'bg-red-100 text-red-800 border-red-200' },
  'Độ 4': { label: 'Độ 4', className: 'bg-red-600 text-white border-red-700' },
  'N/A': { label: 'Khác', className: 'bg-blue-100 text-blue-800 border-blue-200' },
};

export default function History() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const API_BASE = 'http://localhost:5000';

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/history`);
      if (!response.ok) throw new Error("Lỗi tải dữ liệu");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi kết nối", description: "Không thể tải danh sách hồ sơ." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      const nameMatch = record.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const gradeMatch = gradeFilter === 'all' || (record.grade && record.grade.includes(gradeFilter));
      return nameMatch && gradeMatch;
    });
  }, [history, searchQuery, gradeFilter]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Xóa vĩnh viễn hồ sơ này khỏi hệ thống?")) return;
    try {
      const response = await fetch(`${API_BASE}/delete_patient/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        toast({ title: 'Thành công', description: 'Đã xóa hồ sơ bệnh nhi.' });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể thực hiện lệnh xóa." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      <main className="container py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Lịch sử hệ thống</h1>
            <p className="text-muted-foreground mt-1">Dữ liệu tổng hợp từ các ca khám lâm sàng</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="shadow-sm border-primary/20 text-primary hover:bg-primary/5">
              <ArrowLeft className="h-4 w-4 mr-2" /> Khám mới
            </Button>
          </Link>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Tìm tên bệnh nhi..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-10 focus-visible:ring-primary"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Lọc theo phân độ" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phân độ</SelectItem>
              <SelectItem value="Độ 1">Độ 1</SelectItem>
              <SelectItem value="Độ 2">Độ 2 (a & b)</SelectItem>
              <SelectItem value="Độ 3">Độ 3</SelectItem>
              <SelectItem value="Độ 4">Độ 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Danh sách */}
        {loading ? (
          <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl text-slate-400"><FileX className="h-12 w-12 mx-auto mb-2" /> Không tìm thấy hồ sơ nào</div>
        ) : (
          <div className="grid gap-3">
            {filteredHistory.map((record) => {
              const gradeConfig = GRADE_LABELS[record.grade] || GRADE_LABELS['N/A'];
              return (
                <Card 
                  key={record.id} 
                  className="group hover:border-primary/40 transition-all cursor-pointer shadow-sm overflow-hidden"
                  onClick={() => { setSelectedRecord(record); setIsDetailsOpen(true); }}
                >
                  <CardContent className="p-0 flex items-stretch">
                    <div className={cn("w-1.5", gradeConfig.className.split(' ')[0])} />
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10">
                          <User className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800">{record.name}</h3>
                            <Badge className={cn("text-[9px] px-1.5 py-0 shadow-none uppercase font-bold", gradeConfig.className)}>{gradeConfig.label}</Badge>
                          </div>
                          <div className="text-[11px] text-slate-500 flex gap-3 mt-0.5">
                            <span>{record.age_months} tháng</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(record.date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={(e) => handleDelete(e, record.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* MODAL CHI TIẾT */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl">
            <DialogHeader className="p-6 bg-slate-900 text-white rounded-t-lg">
              <DialogTitle className="text-xl font-black flex items-center gap-3">
                <User className="h-6 w-6 text-primary-foreground/50" />
                HỒ SƠ: {selectedRecord?.name?.toUpperCase()}
              </DialogTitle>
            </DialogHeader>

            {selectedRecord && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CỘT 1: HÀNH CHÍNH */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter flex items-center gap-2"><AlertCircle className="h-3 w-3" /> Hành chính</h4>
                    <div className="bg-slate-50 p-4 rounded-xl border space-y-2 text-sm">
                      <p><strong>Giới tính:</strong> {selectedRecord.gender}</p>
                      <p><strong>Tuổi:</strong> {selectedRecord.age_months} tháng</p>
                      <p><strong>Tiền sử:</strong> {selectedRecord.has_comorbidities ? `Có (${selectedRecord.comorbidities_detail})` : "Khỏe mạnh"}</p>
                      <p><strong>Dịch tễ:</strong> {selectedRecord.epidemiology_contact ? "Có tiếp xúc nguồn lây" : "Không rõ"}</p>
                    </div>
                  </div>

                  {/* CỘT 2: SINH HIỆU */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter flex items-center gap-2"><Activity className="h-3 w-3" /> Sinh hiệu & Thần kinh</h4>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                      <div><p className="text-[10px] text-blue-500 font-bold uppercase">Mạch</p><p className="font-bold">{selectedRecord.heart_rate || '--'} l/p</p></div>
                      <div><p className="text-[10px] text-blue-500 font-bold uppercase">Nhiệt độ</p><p className="font-bold">{selectedRecord.fever_temp || '--'} °C</p></div>
                      <div><p className="text-[10px] text-blue-500 font-bold uppercase">Huyết áp</p><p className="font-bold">{selectedRecord.systolic_bp}/{selectedRecord.diastolic_bp} mmHg</p></div>
                      <div><p className="text-[10px] text-blue-500 font-bold uppercase">SpO2</p><p className="font-bold">{selectedRecord.spo2 || '--'} %</p></div>
                    </div>
                  </div>

                  {/* CỘT 3: XÉT NGHIỆM */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter flex items-center gap-2"><Beaker className="h-3 w-3" /> Xét nghiệm</h4>
                    <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-sm">
                       <p className="font-medium text-purple-800">EV71: <span className="font-bold uppercase">{selectedRecord.ev71_result || "Chưa làm"}</span></p>
                    </div>
                  </div>
                </div>

                {/* DÒNG 2: TRIỆU CHỨNG & CHẨN ĐOÁN */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter flex items-center gap-2"><Stethoscope className="h-3 w-3" /> Lâm sàng & Kết luận</h4>
                  <div className="border rounded-2xl p-6 bg-white shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedRecord.fever && <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Sốt {selectedRecord.fever_duration_days} ngày</Badge>}
                      {selectedRecord.fever_refractory && <Badge variant="destructive">Sốt khó hạ</Badge>}
                      {selectedRecord.mouth_ulcer && <Badge variant="secondary">Loét miệng</Badge>}
                      {selectedRecord.skin_rash && <Badge variant="secondary">Phát ban</Badge>}
                      {selectedRecord.vomiting && <Badge variant="secondary">Nôn ói</Badge>}
                      {selectedRecord.startle_reflex_history > 0 && <Badge variant="destructive">Giật mình {selectedRecord.startle_reflex_history} lần</Badge>}
                      {selectedRecord.ataxia && <Badge variant="destructive">Thất điều/Run chi</Badge>}
                      {selectedRecord.limb_weakness && <Badge variant="destructive">Yếu liệt chi</Badge>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Chẩn đoán:</strong> <span className="text-primary font-bold">{selectedRecord.diagnosis}</span></p>
                        <p className="text-sm flex items-center gap-2">
                          <strong>Phân độ:</strong> 
                          <Badge className={cn("shadow-none", (GRADE_LABELS[selectedRecord.grade] || GRADE_LABELS['N/A']).className)}>
                            {selectedRecord.grade}
                          </Badge>
                        </p>
                        <p className="text-sm"><strong>Biến chứng:</strong> <span className="text-red-600 font-bold">{selectedRecord.complication || "Không có"}</span></p>
                      </div>
                      <div className="bg-slate-900 text-white p-4 rounded-xl">
                        <p className="text-[10px] uppercase font-black text-primary mb-1">Xử trí / Hướng dẫn tiếp theo</p>
                        <p className="text-sm leading-relaxed">{selectedRecord.treatment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 border-t flex justify-end bg-slate-50">
              <Button onClick={() => setIsDetailsOpen(false)} className="rounded-lg px-8">Đóng hồ sơ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}