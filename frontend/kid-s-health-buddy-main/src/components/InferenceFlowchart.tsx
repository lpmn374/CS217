// import { CheckCircle2, XCircle, ArrowDown, Star } from 'lucide-react';
// import { InferenceStep } from '@/lib/inference-engine';
// import { cn } from '@/lib/utils';

// interface InferenceFlowchartProps {
//   steps: InferenceStep[];
//   className?: string;
// }

// export function InferenceFlowchart({ steps, className }: InferenceFlowchartProps) {
//   return (
//     <div className={cn("flex flex-col items-center gap-2", className)}>
//       {steps.map((step, index) => (
//         <div key={step.ruleId} className="flex flex-col items-center w-full max-w-md">
//           <FlowchartNode step={step} />
//           {index < steps.length - 1 && (
//             <div className="flex flex-col items-center py-1">
//               <ArrowDown 
//                 className={cn(
//                   "h-5 w-5 transition-colors",
//                   step.activated && !step.isFinal 
//                     ? "text-node-active" 
//                     : "text-muted-foreground/40"
//                 )} 
//               />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// interface FlowchartNodeProps {
//   step: InferenceStep;
// }

// function FlowchartNode({ step }: FlowchartNodeProps) {
//   const { ruleId, description, condition, activated, isFinal } = step;

//   return (
//     <div
//       className={cn(
//         "w-full p-4 rounded-lg border-2 transition-all duration-300 animate-slide-in",
//         isFinal && "ring-2 ring-offset-2 ring-primary shadow-lg",
//         activated
//           ? isFinal
//             ? "border-primary bg-primary/10"
//             : "border-node-active bg-accent/50"
//           : "border-muted bg-muted/30 opacity-60"
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between gap-2 mb-2">
//         <div className="flex items-center gap-2">
//           {isFinal && (
//             <Star className="h-4 w-4 text-primary fill-primary" />
//           )}
//           <code 
//             className={cn(
//               "text-xs font-mono px-2 py-0.5 rounded",
//               activated 
//                 ? isFinal 
//                   ? "bg-primary text-primary-foreground" 
//                   : "bg-node-active/20 text-node-active"
//                 : "bg-muted text-muted-foreground"
//             )}
//           >
//             {ruleId}
//           </code>
//         </div>
//         {activated ? (
//           <CheckCircle2 className={cn(
//             "h-5 w-5",
//             isFinal ? "text-primary" : "text-node-active"
//           )} />
//         ) : (
//           <XCircle className="h-5 w-5 text-muted-foreground/50" />
//         )}
//       </div>

//       {/* Description */}
//       <h4 className={cn(
//         "font-medium text-sm mb-1",
//         activated ? "text-foreground" : "text-muted-foreground"
//       )}>
//         {description}
//       </h4>

//       {/* Condition */}
//       <p className={cn(
//         "text-xs",
//         activated 
//           ? isFinal 
//             ? "text-primary font-medium" 
//             : "text-node-active"
//           : "text-muted-foreground"
//       )}>
//         {condition}
//       </p>

//       {/* Final indicator */}
//       {isFinal && (
//         <div className="mt-2 pt-2 border-t border-primary/30">
//           <span className="text-xs font-semibold text-primary uppercase tracking-wide">
//             ✓ Kích hoạt → Kết luận tại đây
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

import { CheckCircle2, XCircle, ArrowDown, Star, AlertCircle } from 'lucide-react';
import { InferenceStep } from '@/lib/inference-engine';
import { cn } from '@/lib/utils';

interface InferenceFlowchartProps {
  steps: InferenceStep[];
  className?: string;
}

export function InferenceFlowchart({ steps, className }: InferenceFlowchartProps) {
  // Kiểm tra nếu không có dữ liệu để tránh lỗi render
  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-muted-foreground italic">
        <AlertCircle className="h-5 w-5 mb-2 opacity-50" />
        <p className="text-sm">Chưa có dữ liệu tiến trình suy luận.</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-0 w-full", className)}>
      {steps.map((step, index) => (
        <div key={step.ruleId || index} className="flex flex-col items-center w-full max-w-lg">
          <FlowchartNode step={step} />
          
          {index < steps.length - 1 && (
            <div className="flex flex-col items-center w-full">
              {/* Đường kẻ dọc nối các node */}
              <div className={cn(
                "w-0.5 h-6 transition-all duration-500",
                step.activated && !step.isFinal ? "bg-node-active" : "bg-muted-foreground/20"
              )} />
              <ArrowDown 
                className={cn(
                  "h-4 w-4 -mt-1 mb-1 transition-colors",
                  step.activated && !step.isFinal ? "text-node-active" : "text-muted-foreground/30"
                )} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FlowchartNode({ step }: { step: InferenceStep }) {
  const { ruleId, description, condition, activated, isFinal } = step;

  return (
    <div
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-500 shadow-sm relative overflow-hidden",
        activated
          ? isFinal
            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
            : "border-node-active bg-emerald-50/50 shadow-emerald-100/50"
          : "border-slate-100 bg-slate-50/30 opacity-60 grayscale-[0.5]"
      )}
    >
      {/* Background Decor cho các Node đã kích hoạt */}
      {activated && (
        <div className={cn(
          "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10",
          isFinal ? "bg-primary" : "bg-node-active"
        )} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <code 
            className={cn(
              "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
              activated 
                ? isFinal 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-node-active/10 text-node-active border-node-active/20"
                : "bg-slate-100 text-slate-400 border-slate-200"
            )}
          >
            {ruleId}
          </code>
          {isFinal && (
            <Badge variant="secondary" className="text-[9px] h-4 bg-primary/10 text-primary border-primary/20">
              KẾT LUẬN
            </Badge>
          )}
        </div>
        
        {activated ? (
          <CheckCircle2 className={cn(
            "h-5 w-5",
            isFinal ? "text-primary" : "text-node-active"
          )} />
        ) : (
          <XCircle className="h-5 w-5 text-slate-300" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h4 className={cn(
          "font-bold text-sm leading-snug mb-1",
          activated ? "text-slate-900" : "text-slate-400"
        )}>
          {description}
        </h4>

        <div className={cn(
          "text-xs font-medium font-mono p-2 rounded-md bg-white/60 border border-slate-100/50",
          activated 
            ? isFinal 
              ? "text-primary italic" 
              : "text-emerald-700"
            : "text-slate-400"
        )}>
          <span className="opacity-50 mr-1">IF:</span> {condition}
        </div>
      </div>

      {/* Final indicator decoration */}
      {isFinal && activated && (
        <div className="mt-3 flex items-center gap-2 animate-pulse">
          <Star className="h-3 w-3 text-primary fill-primary" />
          <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
            Hệ thống dừng tại đây vì điều kiện thỏa mãn
          </span>
        </div>
      )}
    </div>
  );
}

// Helper component Badge nếu chưa có
function Badge({ children, className, variant }: any) {
  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold border", className)}>
      {children}
    </span>
  );
}