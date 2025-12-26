import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DiagnosisResultDisplay } from '@/components/DiagnosisResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  getHistory, 
  deleteDiagnosis, 
  DiagnosisRecord 
} from '@/lib/inference-engine';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Activity,
  FileX,
  ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const GRADE_LABELS: Record<string, { label: string; className: string }> = {
  '1': { label: 'Độ 1', className: 'grade-1 border' },
  '2a': { label: 'Độ 2a', className: 'grade-2a border' },
  '2b': { label: 'Độ 2b', className: 'grade-2b border' },
  '3': { label: 'Độ 3', className: 'grade-3 border' },
  '4': { label: 'Độ 4', className: 'grade-4 border' },
};

export default function History() {
// 1. Khởi tạo là mảng rỗng để không bị lỗi filter khi chưa có dữ liệu
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<DiagnosisRecord | null>(null);
  const { toast } = useToast();

  // Thêm useEffect để tự động load dữ liệu
  useEffect(() => {
    const loadData = async () => {
      const data = await getHistory();
      setHistory(Array.isArray(data) ? data : []);
    };
    loadData();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory(); // Đợi dữ liệu từ MySQL trả về
      setHistory(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
    }
  };

  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return history.filter(record => {
      // Bảo vệ: Nếu childName bị NULL thì hiện "N/A" để không bị trắng trang
      const name = record.childName || "N/A";
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Dùng dấu ?. để không bị lỗi nếu result chưa có trong database
      const matchesGrade = gradeFilter === 'all' || record.result?.resultGrade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [history, searchQuery, gradeFilter]);

  const handleDelete = async (id: string) => {
      await deleteDiagnosis(id); // Đợi xóa xong trên Server
      await loadHistory();      // Tải lại danh sách mới
      toast({
        title: 'Đã xóa',
        description: 'Ca chẩn đoán đã được xóa khỏi lịch sử.',
      });
    };

  const formatDate = (isoString: string) => {
    if (!isoString) return "Chưa rõ ngày";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }).format(date);
    } catch (e) { return "Ngày lỗi"; }
  };

  const formatGender = (gender: string | null) => {
    if (!gender || gender === "N/A") return "Chưa rõ";
    return gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : gender;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lịch sử chẩn đoán</h1>
            <p className="text-muted-foreground mt-1">
              Xem lại các ca bệnh đã được phân tích ({history.length} ca)
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Về trang chẩn đoán
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên trẻ..."
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
              <SelectItem value="all">Tất cả độ</SelectItem>
              <SelectItem value="1">Độ 1 - Nhẹ</SelectItem>
              <SelectItem value="2a">Độ 2a</SelectItem>
              <SelectItem value="2b">Độ 2b</SelectItem>
              <SelectItem value="3">Độ 3 - Nặng</SelectItem>
              <SelectItem value="4">Độ 4 - Rất nặng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileX className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                {history.length === 0 
                  ? 'Chưa có lịch sử chẩn đoán' 
                  : 'Không tìm thấy kết quả phù hợp'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {history.length === 0 
                  ? 'Thực hiện chẩn đoán đầu tiên để bắt đầu.' 
                  : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'}
              </p>
              {history.length === 0 && (
                <Link to="/" className="mt-4">
                  <Button>Chẩn đoán ngay</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredHistory.map((record) => {
              const gradeConfig = record.result?.resultGrade 
                ? GRADE_LABELS[record.result.resultGrade] 
                : null;

              return (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Info */}
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                          <User className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {record.childName}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                            <span>{formatGender(record.childGender)}, {record.childAgeMonths} tháng</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(record.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {gradeConfig ? (
                          <Badge className={cn("text-sm px-3 py-1", gradeConfig.className)}>
                            {gradeConfig.label}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Không phải TCM</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Chi tiết ca chẩn đoán
              </DialogTitle>
            </DialogHeader>
            
            {selectedRecord && (
              <div className="space-y-6">
                {/* Patient Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Thông tin bệnh nhân</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Họ tên:</span>
                        <p className="font-medium">{selectedRecord.childName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Giới tính:</span>
                        <p className="font-medium">{formatGender(selectedRecord.childGender)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tuổi:</span>
                        <p className="font-medium">{selectedRecord.childAgeMonths} tháng</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ngày khám:</span>
                        <p className="font-medium">{formatDate(selectedRecord.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Input Data */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Triệu chứng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <SymptomItem label="Loét miệng" value={selectedRecord.symptoms.mouthUlcer} />
                        <SymptomItem label="Phát ban da" value={selectedRecord.symptoms.rash} />
                        <SymptomItem label="Sốt ≥ 39°C" value={selectedRecord.symptoms.highFever} />
                        <SymptomItem label="Sốt > 2 ngày" value={selectedRecord.symptoms.feverOver2Days} />
                        <SymptomItem label="Nôn nhiều" value={selectedRecord.symptoms.vomiting} />
                        <SymptomItem label="Lừ đừ" value={selectedRecord.symptoms.lethargy} />
                        <SymptomItem label="Run/yếu chi" value={selectedRecord.symptoms.limbWeakness} />
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Chỉ số sinh hiệu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Mạch:</span>
                          <span className="font-medium">{selectedRecord.vitals.heartRate} bpm</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">SpO2:</span>
                          <span className="font-medium">{selectedRecord.vitals.spo2}%</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Giật mình:</span>
                          <span className="font-medium">{selectedRecord.vitals.startleCount} lần/30 phút</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Nằm yên, không sốt:</span>
                          <span className="font-medium">{selectedRecord.vitals.isRestingNoFever ? 'Có' : 'Không'}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Result with Flowchart */}
                <DiagnosisResultDisplay result={selectedRecord.result} />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function SymptomItem({ label, value }: { label: string; value: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn("font-medium", value ? "text-destructive" : "text-muted-foreground")}>
        {value ? '✓ Có' : '✗ Không'}
      </span>
    </li>
  );
}
