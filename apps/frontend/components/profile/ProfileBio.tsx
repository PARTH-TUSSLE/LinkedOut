import { Card } from "@/components/ui/Card";

interface ProfileBioProps {
  bio?: string | null;
}

export function ProfileBio({ bio }: ProfileBioProps) {
  if (!bio) return null;

  return (
    <Card className="p-4">
      <h2 className="mb-2 text-sm font-semibold text-text-primary">About</h2>
      <p className="text-sm leading-relaxed text-text-secondary">{bio}</p>
    </Card>
  );
}
