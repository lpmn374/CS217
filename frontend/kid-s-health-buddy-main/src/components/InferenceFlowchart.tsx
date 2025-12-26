import { CheckCircle2, XCircle, ArrowDown, Star } from 'lucide-react';
import { InferenceStep } from '@/lib/inference-engine';
import { cn } from '@/lib/utils';

interface InferenceFlowchartProps {
  steps: InferenceStep[];
  className?: string;
}

export function InferenceFlowchart({ steps, className }: InferenceFlowchartProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {steps.map((step, index) => (
        <div key={step.ruleId} className="flex flex-col items-center w-full max-w-md">
          <FlowchartNode step={step} />
          {index < steps.length - 1 && (
            <div className="flex flex-col items-center py-1">
              <ArrowDown 
                className={cn(
                  "h-5 w-5 transition-colors",
                  step.activated && !step.isFinal 
                    ? "text-node-active" 
                    : "text-muted-foreground/40"
                )} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface FlowchartNodeProps {
  step: InferenceStep;
}

function FlowchartNode({ step }: FlowchartNodeProps) {
  const { ruleId, description, condition, activated, isFinal } = step;

  return (
    <div
      className={cn(
        "w-full p-4 rounded-lg border-2 transition-all duration-300 animate-slide-in",
        isFinal && "ring-2 ring-offset-2 ring-primary shadow-lg",
        activated
          ? isFinal
            ? "border-primary bg-primary/10"
            : "border-node-active bg-accent/50"
          : "border-muted bg-muted/30 opacity-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isFinal && (
            <Star className="h-4 w-4 text-primary fill-primary" />
          )}
          <code 
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded",
              activated 
                ? isFinal 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-node-active/20 text-node-active"
                : "bg-muted text-muted-foreground"
            )}
          >
            {ruleId}
          </code>
        </div>
        {activated ? (
          <CheckCircle2 className={cn(
            "h-5 w-5",
            isFinal ? "text-primary" : "text-node-active"
          )} />
        ) : (
          <XCircle className="h-5 w-5 text-muted-foreground/50" />
        )}
      </div>

      {/* Description */}
      <h4 className={cn(
        "font-medium text-sm mb-1",
        activated ? "text-foreground" : "text-muted-foreground"
      )}>
        {description}
      </h4>

      {/* Condition */}
      <p className={cn(
        "text-xs",
        activated 
          ? isFinal 
            ? "text-primary font-medium" 
            : "text-node-active"
          : "text-muted-foreground"
      )}>
        {condition}
      </p>

      {/* Final indicator */}
      {isFinal && (
        <div className="mt-2 pt-2 border-t border-primary/30">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            ✓ Kích hoạt → Kết luận tại đây
          </span>
        </div>
      )}
    </div>
  );
}
