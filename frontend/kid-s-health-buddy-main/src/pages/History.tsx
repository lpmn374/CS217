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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Khai báo Interface khớp với JSON trả về từ Flask
interface HistoryRecord {
  id: number;
  name: string;
  age: number;
  date: string;
  grade: string;
  diagnosis: string;
  treatment: string;
}

const GRADE_LABELS: Record<string, { label: string; className: string }> = {
  'Độ 1': { label: 'Độ 1', className: 'bg-green-100 text-green-800 border-green-200' },
  'Độ 2a': { label: 'Độ 2a', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'Độ 2b (Nhóm 1)': { label: 'Độ 2b-N1', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  'Độ 2b (Nhóm 2)': { label: 'Độ 2b-N2', className: 'bg-orange-200 text-orange-900 border-orange-300' },
  'Độ 3': { label: 'Độ 3', className: 'bg-red-100 text-red-800 border-red-200' },
  'Độ 4': { label: 'Độ 4', className: 'bg-red-600 text-white border-red-700' },
  'N/A': { label: 'Phân biệt', className: 'bg-blue-100 text-blue-800 border-blue-200' },
};

export default function History() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const { toast } = useToast();

  // 1. Tải dữ liệu từ Backend Flask
  const loadHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/history');
      if (!response.ok) throw new Error("Không thể tải dữ liệu");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể kết nối với máy chủ Backend."
      });
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 2. Logic tìm kiếm và lọc
  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      const matchesSearch = record.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === 'all' || record.grade.includes(gradeFilter);
      return matchesSearch && matchesGrade;
    });
  }, [history, searchQuery, gradeFilter]);

  // 3. Logic xóa ca bệnh
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ca bệnh này khỏi hệ thống?")) return;

    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        toast({
          title: 'Đã xóa',
          description: 'Ca chẩn đoán đã được xóa khỏi cơ sở dữ liệu.',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa ca bệnh."
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lịch sử chẩn đoán</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý danh sách các ca bệnh ({history.length} ca)
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Button>
          </Link>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm tên bệnh nhân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Lọc theo độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phân độ</SelectItem>
              <SelectItem value="Độ 1">Độ 1</SelectItem>
              <SelectItem value="Độ 2">Độ 2 (a & b)</SelectItem>
              <SelectItem value="Độ 3">Độ 3</SelectItem>
              <SelectItem value="Độ 4">Độ 4</SelectItem>
              <SelectItem value="N/A">Chẩn đoán phân biệt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Danh sách */}
        {filteredHistory.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileX className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Không có dữ liệu</h3>
              <p className="text-sm text-muted-foreground mt-1">Hệ thống chưa ghi nhận ca bệnh nào khớp với yêu cầu.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredHistory.map((record) => {
              const gradeConfig = GRADE_LABELS[record.grade] || GRADE_LABELS['N/A'];

              return (
                <Card key={record.id} className="hover:shadow-sm transition-all border-l-4" style={{borderLeftColor: 'var(--primary)'}}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{record.name}</h3>
                            <Badge variant="outline" className={cn(gradeConfig.className)}>
                              {gradeConfig.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground mt-1">
                            <span>{record.age} tháng tuổi</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {record.date}
                            </span>
                          </div>
                          <p className="text-sm mt-2 font-medium text-primary">
                            {record.diagnosis}
                          </p>
                          <p className="text-xs text-muted-foreground italic mt-1 line-clamp-1">
                            HD: {record.treatment}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
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