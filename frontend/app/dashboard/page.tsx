'use client'
import { useSearchParams, useRouter } from "next/navigation";
import Editor from "@/components/editor/editor";
import { CanvasEditor } from "@/components/canvas/canvas-editor";
import { useStore, FileSystemItem } from "@/context/store";
import { Suspense, useEffect } from "react";
import { Loader2, Cloud, AlertCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { SaveStatusIndicator } from "@/components/save-status-indicator";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileId = searchParams.get("id");
  const { getItem, isLoading, files } = useStore();

  // Auto-open first note on load
  useEffect(() => {
    if (!isLoading && !fileId && files.length > 0) {
      // Find the first file (not folder, prefer regular file over canvas)
      const findFirstFile = (items: FileSystemItem[]): FileSystemItem | null => {
        for (const item of items) {
          if (item.type === 'file') {
            return item;
          }
          if (item.children) {
            const found = findFirstFile(item.children);
            if (found) return found;
          }
        }
        // If no regular file found, try canvas
        for (const item of items) {
          if (item.type === 'canvas') {
            return item;
          }
          if (item.children) {
            const found = findFirstFile(item.children);
            if (found) return found;
          }
        }
        return null;
      };

      const firstFile = findFirstFile(files);
      if (firstFile) {
        router.push(`/dashboard?id=${firstFile.id}`);
      }
    }
  }, [isLoading, fileId, files, router]);

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
      <header className="flex items-center gap-2 md:gap-3 h-14 px-3 md:px-6 border-b bg-background shrink-0 z-30">
        <SidebarTrigger className="md:hidden shrink-0" />
        <h1 className="text-base md:text-lg font-semibold flex-1 truncate min-w-0">{file ? file.name : "Welcome"}</h1>
        <div className="shrink-0">
          <SaveStatusIndicator />
        </div>
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
