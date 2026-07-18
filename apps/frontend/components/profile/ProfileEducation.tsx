import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatYear } from "@/lib/utils";
import type { Education } from "@/types";

interface ProfileEducationProps {
  education: Education[];
}

export function ProfileEducation({ education }: ProfileEducationProps) {
  if (education.length === 0) return null;

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-text-primary">
        Education
      </h2>
      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={edu.id || index} className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light">
              <GraduationCap size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {edu.school}
              </p>
              {edu.degree && (
                <p className="text-xs text-text-secondary">{edu.degree}</p>
              )}
              {edu.fieldOfStudy && (
                <p className="text-xs text-text-muted">{edu.fieldOfStudy}</p>
              )}
              {(edu.startDate || edu.endDate) && (
                <p className="mt-0.5 text-xs text-text-muted">
                  {edu.startDate ? formatYear(edu.startDate) : ""}
                  {edu.startDate && edu.endDate ? " – " : ""}
                  {edu.endDate ? formatYear(edu.endDate) : ""}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
