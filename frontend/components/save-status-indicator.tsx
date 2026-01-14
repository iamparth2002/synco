"use client";

import { useStore } from "@/context/store";
import { Loader2, Cloud, AlertCircle } from "lucide-react";

export function SaveStatusIndicator() {
    const { saveStatus } = useStore();

    if (saveStatus === "saving") {
        return (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
            </div>
        );
    }
    if (saveStatus === "saved") {
        return (
            <div className="flex items-center gap-2 text-green-500 text-sm">
                <Cloud className="h-4 w-4" />
                <span>Up to date</span>
            </div>
        );
    }
    if (saveStatus === "error") {
        return (
            <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Error saving</span>
            </div>
        );
    }
    return null;
}
