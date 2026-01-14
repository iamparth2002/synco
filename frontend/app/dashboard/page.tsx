'use client'
import { useSearchParams } from "next/navigation";
import Editor from "@/components/editor/editor";
import { CanvasEditor } from "@/components/canvas/canvas-editor";
import { useStore } from "@/context/store";
import { Suspense } from "react";
import { Loader2, Cloud, AlertCircle } from "lucide-react";

import { SaveStatusIndicator } from "@/components/save-status-indicator";

function DashboardContent() {
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
    <div className="flex-1 h-full flex flex-col relative overflow-hidden">
      <header className="flex items-center justify-between h-14 px-6 border-b bg-background shrink-0 z-30">
        <h1 className="text-lg font-semibold">{file ? file.name : "Welcome"}</h1>
        <SaveStatusIndicator />
      </header>
      <div className="flex-1 min-h-0">
        {fileId && file ? (
          file.type === 'canvas' ? (
            <CanvasEditor fileId={fileId} />
          ) : (
            <Editor fileId={fileId} />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a file to start editing
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
