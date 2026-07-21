"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/config/constants";

interface ResumeDownloadButtonProps {
  userId: number;
}

export function ResumeDownloadButton({ userId }: ResumeDownloadButtonProps) {
  const handleDownload = () => {
    window.open(`${API_BASE_URL}/users/${userId}/resume`, "_blank");
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleDownload}>
      <FileDown size={14} />
      Resume
    </Button>
  );
}
