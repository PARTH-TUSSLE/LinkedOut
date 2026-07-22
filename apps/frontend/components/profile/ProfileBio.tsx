import { Card } from "@/components/ui/Card";

interface ProfileBioProps {
  bio?: string | null;
}

export function ProfileBio({ bio }: ProfileBioProps) {
  if (!bio) return null;

  return (
    <Card className="p-5 shadow-sm">
      <h3 className="text-label text-text-tertiary mb-2">About</h3>
      <p className="text-body-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
        {bio}
      </p>
    </Card>
  );
}
