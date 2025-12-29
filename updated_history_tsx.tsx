import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, Trash2, Calendar, User, FileX, ArrowLeft, 
  Loader2, Eye, Activity, Stethoscope, Beaker, Brain,
  MapPin, HeartPulse, AlertCircle, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryRecord {
  id: number;
  name: string;
  age_months: number;
  gender: string;
  date: string;
  grade: string;
  diagnosis: string;
}

interface PatientDetail {
  patient: any;
  clinical: any;
  vitals: any;
  lab: any;
  result: any;
}

const GRADE_LABELS: Record<string, { label: string; className: string }> = {
  'Độ 1': { label: 'Độ 1', className: 'bg-green-100 text-green-800 border-green-200' },
  'Độ 2a': { label: 'Độ 2a', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'Độ 2b (Nhóm 1)': { label: 'Độ 2b-N1', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  'Độ 2b (Nhóm 2)': { label: 'Độ 2b-N2', className: 'bg-orange-200 text-orange-900 border-orange-300' },
  'Độ 3': { label: 'Độ 3', className: 'bg-red-100 text-red-800 border-red-200' },
  'Độ 4': { label: 'Độ 4', className: 'bg-red-600 text-white border-red-700' },
};

export default function History() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<PatientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  const API_BASE = 'http://localhost:5000';

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/history`);
      if (!response.ok) throw new Error("Lỗi tải dữ liệu");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`${API_BASE}/history/${id}`);
      if (!response.ok) throw new Error("Lỗi tải chi tiết");
      const data = await response.json();
      setDetailData(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setDetailLoading(false);
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
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  const openDetail = (id: number) => {
    setSelectedId(id);
    loadDetail(id);
  };

  const closeDetail = () => {
    setSelectedId(null);
    setDetailData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <main className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Lịch sử hệ thống</h1>
            <p className="text-slate-500 mt-1">Dữ liệu tổng hợp từ các ca khám lâm sàng ({history.length} hồ sơ)</p>
          </div>
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
              const gradeConfig = GRADE_LABELS[record.grade] || { label: 'N/A', className: 'bg-blue-100 text-blue-800' };
              return (
                <Card 
                  key={record.id} 
                  className="group hover:border-primary/40 transition-all cursor-pointer shadow-sm overflow-hidden"
                  onClick={() => openDetail(record.id)}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={(e) => handleDelete(e, record.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* MODAL CHI TIẾT ĐẦY ĐỦ */}
        <Dialog open={!!selectedId} onOpenChange={closeDetail}>
          <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl">
            <DialogHeader className="p-6 bg-slate-900 text-white rounded-t-lg sticky top-0 z-10">
              <DialogTitle className="text-xl font-black flex items-center gap-3">
                <User className="h-6 w-6 text-primary-foreground/50" />
                HỒ SƠ: {detailData?.patient?.full_name?.toUpperCase() || "Đang tải..."}
              </DialogTitle>
            </DialogHeader>

            {detailLoading ? (
              <div className="p-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
            ) : detailData && (
              <div className="p-6 space-y-6">
                
                {/* HÀNH CHÍNH */}
                <Card className="border-2 border-blue-100">
                  <CardHeader className="bg-blue-50 border-b py-3">
                    <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Thông tin hành chính
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><strong>Họ tên:</strong> {detailData.patient.full_name}</div>
                    <div><strong>Giới tính:</strong> {detailData.patient.gender}</div>
                    <div><strong>Tuổi:</strong> {detailData.patient.age_months} tháng</div>
                    <div><strong>Ngày khám:</strong> {new Date(detailData.patient.created_at).toLocaleDateString('vi-VN')}</div>
                    <div className="col-span-2"><strong>Dịch tễ:</strong> {detailData.patient.epidemiology_contact ? "Có tiếp xúc nguồn lây" : "Không rõ"}</div>
                    <div className="col-span-2"><strong>Bệnh nền:</strong> {detailData.patient.has_comorbidities ? detailData.patient.comorbidities_detail || "Có" : "Không"}</div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* LÂM SÀNG */}
                  <Card className="border-2 border-orange-100">
                    <CardHeader className="bg-orange-50 border-b py-3">
                      <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" /> Triệu chứng lâm sàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2 text-xs">
                      <SymptomRow label="Sốt" value={detailData.clinical.fever} extra={detailData.clinical.fever ? `${detailData.clinical.fever_temp}°C, ${detailData.clinical.fever_duration_days} ngày` : null} />
                      <SymptomRow label="Sốt khó hạ" value={detailData.clinical.fever_refractory} />
                      <SymptomRow label="Loét miệng" value={detailData.clinical.mouth_ulcer} extra={detailData.clinical.ulcer_characteristics} />
                      <SymptomRow label="Phát ban da" value={detailData.clinical.skin_rash} extra={detailData.clinical.skin_rash_location} />
                      <SymptomRow label="Nôn ói" value={detailData.clinical.vomiting} />
                      <SymptomRow label="Lơ mơ/Mệt mỏi" value={detailData.clinical.lethargy} />
                      <SymptomRow label="Bỏ ăn" value={detailData.clinical.poor_feeding} />
                    </CardContent>
                  </Card>

                  {/* SINH HIỆU */}
                  <Card className="border-2 border-red-100">
                    <CardHeader className="bg-red-50 border-b py-3">
                      <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" /> Sinh hiệu tuần hoàn
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-3 text-xs">
                      <div><strong>Mạch:</strong> {detailData.vitals.heart_rate} l/p</div>
                      <div><strong>SpO2:</strong> {detailData.vitals.spo2}%</div>
                      <div><strong>HA:</strong> {detailData.vitals.systolic_bp}/{detailData.vitals.diastolic_bp}</div>
                      <div><strong>PP:</strong> <span className={detailData.vitals.pulse_pressure <= 25 ? "text-red-600 font-black" : ""}>{detailData.vitals.pulse_pressure}</span></div>
                      <div><strong>Nhịp thở:</strong> {detailData.vitals.respiratory_rate}</div>
                      <div><strong>CRT:</strong> {detailData.vitals.capillary_refill_time}s</div>
                    </CardContent>
                  </Card>

                  {/* THẦN KINH */}
                  <Card className="border-2 border-purple-100">
                    <CardHeader className="bg-purple-50 border-b py-3">
                      <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                        <Brain className="h-4 w-4" /> Thần kinh
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2 text-xs">
                      <SymptomRow label="Giật mình" value={detailData.vitals.startle_reflex_history > 0} extra={`${detailData.vitals.startle_reflex_history} lần/30p`} />
                      <SymptomRow label="Thất điều" value={detailData.vitals.ataxia} />
                      <SymptomRow label="Yếu chi" value={detailData.vitals.limb_weakness} />
                      <SymptomRow label="Rung nhãn cầu" value={detailData.vitals.nystagmus} />
                      <SymptomRow label="Liệt dây sọ" value={detailData.vitals.cranial_nerve_palsy} />
                      <div><strong>AVPU:</strong> {detailData.vitals.avpu_score}</div>
                      <div><strong>GCS:</strong> {detailData.vitals.coma_gcs}/15</div>
                    </CardContent>
                  </Card>

                  {/* XÉT NGHIỆM */}
                  <Card className="border-2 border-slate-100">
                    <CardHeader className="bg-slate-50 border-b py-3">
                      <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                        <Beaker className="h-4 w-4" /> Xét nghiệm
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2 text-xs">
                      <div><strong>EV71:</strong> <Badge variant={detailData.lab.ev71_result === 'Positive' ? 'destructive' : 'secondary'}>{detailData.lab.ev71_result}</Badge></div>
                      <div><strong>EV khác:</strong> <Badge variant={detailData.lab.other_enterovirus_result === 'Positive' ? 'destructive' : 'secondary'}>{detailData.lab.other_enterovirus_result}</Badge></div>
                      <SymptomRow label="Phù phổi" value={detailData.lab.chest_xray_edema} />
                    </CardContent>
                  </Card>
                </div>

                {/* KẾT QUẢ CHẨN ĐOÁN */}
                <Card className="border-4 border-green-200">
                  <CardHeader className="bg-green-600 text-white py-4">
                    <CardTitle className="text-lg font-black uppercase flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" /> Kết quả chẩn đoán
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Chẩn đoán</p>
                        <p className="font-black text-lg text-primary">{detailData.result.diagnosis_status}</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Phân độ</p>
                        <p className="font-black text-2xl text-red-600">{detailData.result.current_grade}</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Thể lâm sàng</p>
                        <p className="font-bold text-sm">{detailData.result.clinical_form || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {detailData.result.complication_type && (
                      <div className="p-4 bg-red-100 border-2 border-red-200 rounded-lg">
                        <p className="text-xs font-black text-red-900 mb-2">⚠️ BIẾN CHỨNG:</p>
                        <p className="text-sm font-bold text-red-800">{detailData.result.complication_type}</p>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs font-black text-slate-500 mb-2">📍 TUYẾN ĐIỀU TRỊ</p>
                        <p className="text-sm font-bold">{detailData.result.treatment_location}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs font-black text-slate-500 mb-2">📋 HƯỚNG DẪN</p>
                        <p className="text-sm">{detailData.result.recommended_next_step}</p>
                      </div>
                    </div>

                    {detailData.result.lab_orders && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-xs font-black text-purple-900 mb-2">🧪 CHỈ ĐỊNH</p>
                        <p className="text-sm text-purple-800">{detailData.result.lab_orders}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="p-4 border-t flex justify-end bg-slate-50 sticky bottom-0">
              <Button onClick={closeDetail} className="px-8">Đóng</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function SymptomRow({ label, value, extra }: { label: string; value: any; extra?: string | null }) {
  const isPositive = value === 1 || value === true;
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-100">
      <span className="font-medium text-slate-600">{label}:</span>
      <span className={cn("font-bold", isPositive ? "text-red-600" : "text-slate-400")}>
        {isPositive ? '✓ Có' : '✗ Không'} {extra && <span className="text-xs ml-1">({extra})</span>}
      </span>
    </div>
  );
}