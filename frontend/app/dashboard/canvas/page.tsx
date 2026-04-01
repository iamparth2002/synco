"use client";

import { CanvasEditor } from "@/components/canvas/canvas-editor";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/store";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveStatusIndicator } from "@/components/save-status-indicator";

function CanvasContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("id");
  const { getItem, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full" suppressHydrationWarning>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const file = fileId ? getItem(fileId) : null;

  return (
    <div className="flex-1 h-full flex flex-col">
      <header className="flex items-center gap-2 md:gap-3 h-14 px-3 md:px-6 border-b shrink-0 bg-background">
        <SidebarTrigger className="md:hidden shrink-0" />
        <h1 className="text-base md:text-lg font-semibold flex-1 truncate min-w-0">{file ? file.name : "Canvas"}</h1>
        <div className="shrink-0">
          <SaveStatusIndicator />
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        {fileId ? (
          <CanvasEditor fileId={fileId} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a canvas to start editing
          </div>
        )}
      </div>
    </div>
  );
}

export default function CanvasPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <CanvasContent />
    </Suspense>
  );
}
