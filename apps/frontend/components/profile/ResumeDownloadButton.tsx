"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/config/axios";
import { addToast } from "@/store/slices/uiSlice";
import { useAppDispatch } from "@/store/hooks";

interface ResumeDownloadButtonProps {
  userId: number;
}

export function ResumeDownloadButton({ userId }: ResumeDownloadButtonProps) {
  const dispatch = useAppDispatch();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await api.get("/user/downloadResume", {
        params: { id: userId },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      dispatch(
        addToast({ message: "Failed to download resume", type: "error" })
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      loading={downloading}
    >
      <Download size={16} />
      Resume
    </Button>
  );
}
