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
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Trash2, 
  Calendar, 
  User, 
  FileX,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Khai báo Interface khớp với Query JOIN từ Flask (đã sửa ở bước trước)
interface HistoryRecord {
  id: number;
  name: string;
  age_months: number;
  date: string;
  grade: string;
  diagnosis: string;
  treatment: string;
  complication?: string; // Thêm trường biến chứng
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
  const { toast } = useToast();

  const API_BASE = 'http://localhost:5000';

  // 1. Tải dữ liệu từ Backend
  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/history`);
      if (!response.ok) throw new Error("Không thể tải dữ liệu");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi kết nối",
        description: "Không thể tải danh sách bệnh nhân từ máy chủ."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 2. Logic tìm kiếm và lọc (Chuẩn hóa chuỗi để lọc chính xác)
  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      const nameMatch = record.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const gradeMatch = gradeFilter === 'all' || (record.grade && record.grade.includes(gradeFilter));
      return nameMatch && gradeMatch;
    });
  }, [history, searchQuery, gradeFilter]);

  // 3. Logic xóa ca bệnh (Đồng bộ URL với app.py)
  const handleDelete = async (id: number) => {
    if (!confirm("Hành động này sẽ xóa vĩnh viễn dữ liệu bệnh nhân và các kết quả xét nghiệm liên quan. Bạn chắc chắn chứ?")) return;

    try {
      const response = await fetch(`${API_BASE}/delete_patient/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        toast({
          title: 'Thành công',
          description: 'Đã xóa hồ sơ bệnh nhân khỏi hệ thống.',
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi xóa dữ liệu",
        description: "Không thể xóa ca bệnh này. Vui lòng thử lại sau."
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />

      <main className="container py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Lịch sử chẩn đoán</h1>
            <p className="text-muted-foreground mt-1">
              Hệ thống lưu trữ {history.length} hồ sơ bệnh nhi TCM
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="shadow-sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại khám bệnh
            </Button>
          </Link>
        </div>

        {/* Thanh công cụ tìm kiếm & Lọc */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm tên bệnh nhân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-200"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-56 border-slate-200">
              <SelectValue placeholder="Lọc theo phân độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phân độ</SelectItem>
              <SelectItem value="Độ 1">Độ 1</SelectItem>
              <SelectItem value="Độ 2">Độ 2 (a & b)</SelectItem>
              <SelectItem value="Độ 3">Độ 3</SelectItem>
              <SelectItem value="Độ 4">Độ 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hiển thị danh sách */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileX className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Không tìm thấy kết quả</h3>
              <p className="text-slate-400 mt-1 text-center max-w-xs">
                Thử thay đổi từ khóa tìm kiếm hoặc lọc theo phân độ khác.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredHistory.map((record) => {
              const gradeConfig = GRADE_LABELS[record.grade] || GRADE_LABELS['N/A'];

              return (
                <Card key={record.id} className="group hover:border-primary/50 transition-all overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      {/* Cột màu sắc bên trái dựa trên độ nặng */}
                      <div className={cn("w-2", gradeConfig.className.split(' ')[0])} />
                      
                      <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                            <User className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-extrabold text-lg text-slate-800">{record.name}</h3>
                              <Badge className={cn("font-bold shadow-none", gradeConfig.className)}>
                                {gradeConfig.label}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                              <span className="font-medium">{record.age_months} tháng tuổi</span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" /> 
                                {new Date(record.date).toLocaleDateString('vi-VN')}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-col gap-1">
                              <p className="text-sm font-bold text-primary flex items-center gap-2">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {record.diagnosis}
                              </p>
                              {record.complication && (
                                <p className="text-xs font-semibold text-destructive px-2 py-0.5 bg-destructive/5 rounded border border-destructive/10 inline-block w-fit">
                                  Biến chứng: {record.complication}
                                </p>
                              )}
                              <p className="text-xs text-slate-500 italic line-clamp-1 mt-1">
                                Xử trí: {record.treatment}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-destructive hover:bg-destructive/5"
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}