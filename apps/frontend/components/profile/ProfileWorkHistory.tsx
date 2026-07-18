import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { WorkHistory } from "@/types";

interface ProfileWorkHistoryProps {
  workHistory: WorkHistory[];
}

export function ProfileWorkHistory({ workHistory }: ProfileWorkHistoryProps) {
  if (workHistory.length === 0) return null;

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-text-primary">
        Experience
      </h2>
      <div className="space-y-4">
        {workHistory.map((work, index) => (
          <div key={work.id || index} className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light">
              <Briefcase size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {work.position}
              </p>
              <p className="text-xs text-text-secondary">{work.company}</p>
              {work.location && (
                <p className="text-xs text-text-muted">{work.location}</p>
              )}
              {(work.startDate || work.endDate || work.years) && (
                <p className="mt-0.5 text-xs text-text-muted">
                  {work.startDate || ""}
                  {work.startDate && work.endDate ? " – " : ""}
                  {work.endDate || ""}
                  {work.years && (work.startDate || work.endDate) ? " · " : ""}
                  {work.years || ""}
                </p>
              )}
              {work.description && (
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {work.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
