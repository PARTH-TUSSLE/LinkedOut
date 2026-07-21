import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatYear } from "@/lib/utils";
import type { Education } from "@/types";

interface ProfileEducationProps {
  education: Education[];
}

export function ProfileEducation({ education }: ProfileEducationProps) {
  if (!education || education.length === 0) return null;

  return (
    <Card className="p-5">
      <h3 className="text-label text-text-tertiary mb-4">Education</h3>
      <div className="space-y-4">
        {education.map((item, i) => (
          <div key={item.id ?? i} className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card-hover text-text-tertiary">
              <GraduationCap size={15} />
            </div>
            <div>
              <p className="text-body-sm font-medium text-text-primary">
                {item.degree} in {item.fieldOfStudy}
              </p>
              <p className="text-body-sm text-text-secondary">{item.school}</p>
              {(item.startDate || item.endDate) && (
                <p className="text-caption text-text-tertiary">
                  {item.startDate ? formatYear(item.startDate) : "?"} — {item.endDate ? formatYear(item.endDate) : "Present"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
