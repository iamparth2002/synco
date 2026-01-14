"use client";

import { CanvasEditor } from "@/components/canvas/canvas-editor";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/store";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
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
      <header className="flex items-center justify-between h-14 px-6 border-b shrink-0 bg-background">
        <h1 className="text-lg font-semibold">{file ? file.name : "Canvas"}</h1>
        <SaveStatusIndicator />
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
