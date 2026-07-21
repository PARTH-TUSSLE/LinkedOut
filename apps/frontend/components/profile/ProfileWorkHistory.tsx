import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatYear } from "@/lib/utils";
import type { WorkHistory } from "@/types";

interface ProfileWorkHistoryProps {
  workHistory: WorkHistory[];
}

export function ProfileWorkHistory({ workHistory }: ProfileWorkHistoryProps) {
  if (!workHistory || workHistory.length === 0) return null;

  return (
    <Card className="p-5">
      <h3 className="text-label text-text-tertiary mb-4">Work History</h3>
      <div className="space-y-4">
        {workHistory.map((item, i) => (
          <div key={item.id ?? i} className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card-hover text-text-tertiary">
              <Briefcase size={15} />
            </div>
            <div>
              <p className="text-body-sm font-medium text-text-primary">{item.position}</p>
              <p className="text-body-sm text-text-secondary">{item.company}</p>
              {(item.startDate || item.endDate || item.years) && (
                <p className="text-caption text-text-tertiary">
                  {item.years || `${item.startDate ? formatYear(item.startDate) : "?"} — ${item.endDate ? formatYear(item.endDate) : "Present"}`}
                </p>
              )}
              {item.description && (
                <p className="mt-1 text-body-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
