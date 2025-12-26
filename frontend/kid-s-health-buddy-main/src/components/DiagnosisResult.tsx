import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Stethoscope, GitBranch } from 'lucide-react';
import { DiagnosisResult as DiagnosisResultType } from '@/lib/inference-engine';
import { InferenceFlowchart } from './InferenceFlowchart';
import { cn } from '@/lib/utils';

interface DiagnosisResultProps {
  result: DiagnosisResultType;
  className?: string;
}

const GRADE_CONFIG = {
  '1': {
    label: 'Độ 1',
    sublabel: 'Thể nhẹ',
    color: 'grade-1',
    bgClass: 'bg-grade-1-bg border-grade-1',
    textClass: 'text-grade-1',
    Icon: CheckCircle,
  },
  '2a': {
    label: 'Độ 2a',
    sublabel: 'Có biến chứng nhẹ',
    color: 'grade-2a',
    bgClass: 'bg-grade-2a-bg border-grade-2a',
    textClass: 'text-grade-2a',
    Icon: AlertTriangle,
  },
  '2b': {
    label: 'Độ 2b',
    sublabel: 'Có biến chứng nặng',
    color: 'grade-2b',
    bgClass: 'bg-grade-2b-bg border-grade-2b',
    textClass: 'text-grade-2b',
    Icon: AlertTriangle,
  },
  '3': {
    label: 'Độ 3',
    sublabel: 'Nguy hiểm',
    color: 'grade-3',
    bgClass: 'bg-grade-3-bg border-grade-3',
    textClass: 'text-grade-3',
    Icon: XCircle,
  },
  '4': {
    label: 'Độ 4',
    sublabel: 'Rất nguy hiểm',
    color: 'grade-4',
    bgClass: 'bg-grade-4-bg border-grade-4',
    textClass: 'text-grade-4',
    Icon: XCircle,
  },
};

export function DiagnosisResultDisplay({ result, className }: DiagnosisResultProps) {
  if (!result.isClinicalCase) {
    return (
      <Card className={cn("border-2 border-muted", className)}>
        <CardContent className="pt-6 text-center">
          <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">
            Không phải ca bệnh Tay Chân Miệng
          </h3>
          <p className="text-muted-foreground mt-2">
            Trẻ không có triệu chứng loét miệng hoặc phát ban da điển hình của bệnh TCM.
          </p>
        </CardContent>
      </Card>
    );
  }

  const grade = result.resultGrade!;
  const config = GRADE_CONFIG[grade];
  const GradeIcon = config.Icon;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Result Card */}
        <Card className={cn("border-2 shadow-lg", config.bgClass)}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className={cn("h-5 w-5", config.textClass)} />
              <span className={config.textClass}>Kết quả chẩn đoán</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <GradeIcon className={cn("h-16 w-16", config.textClass)} />
              <div>
                <h2 className={cn("text-4xl font-bold", config.textClass)}>
                  {config.label}
                </h2>
                <p className={cn("text-lg", config.textClass)}>{config.sublabel}</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn("mt-4 text-sm", config.textClass, "border-current")}
            >
              {grade === '1' && '🟢 Mức độ nhẹ'}
              {grade === '2a' && '🟡 Cần theo dõi'}
              {grade === '2b' && '🟠 Cảnh báo'}
              {grade === '3' && '🔴 Nguy hiểm'}
              {grade === '4' && '🔴 Rất nguy hiểm'}
            </Badge>
          </CardContent>
        </Card>

        {/* Treatment Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Hướng xử trí
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{result.treatment}</p>
            {grade !== '1' && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Đưa trẻ đến cơ sở y tế ngay nếu có bất kỳ dấu hiệu nặng thêm!
                </p>
              </div>
            )}
            {grade === '1' && (
              <div className="mt-4 p-3 bg-accent rounded-lg">
                <p className="text-sm text-accent-foreground">
                  ✓ Cho trẻ nghỉ ngơi, uống nhiều nước, ăn thức ăn mềm, nguội.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inference Flowchart */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Cây suy diễn (Forward Chaining)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Quá trình suy luận từ nặng đến nhẹ - Dừng khi gặp luật thỏa mãn đầu tiên
          </p>
        </CardHeader>
        <CardContent>
          <InferenceFlowchart steps={result.inferenceSteps} />
        </CardContent>
      </Card>
    </div>
  );
}
