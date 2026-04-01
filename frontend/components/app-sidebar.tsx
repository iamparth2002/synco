"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  FileText,
  Folder,
  Map,
  Search,
  FilePlus,
  FolderPlus,
  ChevronRight,
  Trash2,
  Edit2,
  Loader2,
  MoreVertical,
  LogOut
} from "lucide-react"

// Custom Synco icon matching the favicon
const SyncoIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { useStore, FileSystemItem } from "@/context/store"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFileId = searchParams.get("id");
  const { files, searchQuery, setSearchQuery, createItem, deleteItem, renameItem, moveItem, duplicateItem, isLoading, expandedFolders, toggleFolder } = useStore();
  const { logout, user } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Filter files based on search query
  const filterFiles = (items: FileSystemItem[]): FileSystemItem[] => {
    if (!searchQuery) return items;
    return items.reduce((acc: FileSystemItem[], item) => {
      if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc.push(item);
      } else if (item.children) {
        const filteredChildren = filterFiles(item.children);
        if (filteredChildren.length > 0) {
          acc.push({ ...item, children: filteredChildren });
        }
      }
      return acc;
    }, []);
  };

  const displayFiles = searchQuery ? filterFiles(files) : files;
  // Previously we only showed children of the first item (Root), which hid new top-level items.
  // Now we show all top-level items.
  const rootItems = displayFiles;

  const handleCreate = async (type: "file" | "folder" | "canvas") => {
    const defaultName = type === "folder" ? "New Folder" : (type === "canvas" ? "New Canvas" : "New Note");
    const id = await createItem(type, defaultName, "root");

    // Navigate to the new item
    if (type === "canvas") {
      router.push(`/dashboard/canvas?id=${id}`);
    } else if (type === "file") {
      router.push(`/dashboard?id=${id}`);
    }
    // Folders don't have a specific page, just expand/show in tree (handled by store/component state mostly)
  };

  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                  <SyncoIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Synco</span>
                  <span className="truncate text-xs">Workspace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search..."
              className="pl-8 h-9 bg-sidebar-accent/50 border-sidebar-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => {
                // Prevent auto-focus on mobile when sidebar opens
                if (isMobile && !searchQuery) {
                  e.target.blur();
                }
              }}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <SidebarGroup>
          <SidebarGroupLabel>
            Files
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCreate("file")} title="New Note">
                <FilePlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCreate("canvas")} title="New Canvas">
                <Map className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCreate("folder")} title="New Folder">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8" suppressHydrationWarning>
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <SidebarMenu>
                {rootItems.map((item) => (
                  <FileTreeItem
                    key={item.id}
                    item={item}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    onRename={renameItem}
                    onDelete={deleteItem}
                    onMove={moveItem}
                    onDuplicate={duplicateItem}
                    expandedFolders={expandedFolders}
                    toggleFolder={toggleFolder}
                    isMobile={isMobile}
                    setOpenMobile={setOpenMobile}
                    currentFileId={currentFileId}
                  />
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white shrink-0">
                <SyncoIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold">{user?.name || "User"}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 shrink-0"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

interface FileTreeItemProps {
  item: FileSystemItem;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onMove: (itemId: string, targetId: string | null) => void;
  onDuplicate: (id: string) => void;
  expandedFolders: Record<string, boolean>;
  toggleFolder: (id: string) => void;
  isMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  currentFileId: string | null;
}

function FileTreeItem({ item, editingId, setEditingId, onRename, onDelete, onMove, onDuplicate, expandedFolders, toggleFolder, isMobile, setOpenMobile, currentFileId }: FileTreeItemProps) {
  const Icon = item.type === "folder" ? Folder : (item.type === "canvas" ? Map : FileText);
  const href = item.type === "canvas" ? `/dashboard/canvas?id=${item.id}` : `/dashboard?id=${item.id}`;
  const isEditing = editingId === item.id;
  const isActive = currentFileId === item.id;
  const [tempName, setTempName] = React.useState(item.name);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDropTarget, setIsDropTarget] = React.useState(false);
  const touchStartPos = React.useRef<{ x: number; y: number } | null>(null);
  const draggedItemId = React.useRef<string | null>(null);

  const handleBlur = () => {
    if (tempName.trim() === "") {
      onRename(item.id, item.type === "folder" ? "New Folder" : (item.type === "canvas" ? "New Canvas" : "New Note"));
    } else {
      onRename(item.id, tempName);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  // Desktop drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.type === "folder") {
      setIsDropTarget(true);
    }
  };

  const handleDragLeave = () => {
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId !== item.id && item.type === "folder") {
      onMove(draggedId, item.id);
    }
  };

  // Mobile touch drag and drop
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    draggedItemId.current = item.id;

    // Add a small delay to distinguish from scrolling
    setTimeout(() => {
      if (draggedItemId.current === item.id) {
        setIsDragging(true);
      }
    }, 200);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !touchStartPos.current) return;

    const touch = e.touches[0];
    const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);

    // Find if we're over a folder
    const folderElement = elementAtPoint?.closest('[data-folder-id]');
    if (folderElement) {
      const folderId = folderElement.getAttribute('data-folder-id');
      if (folderId && folderId !== item.id) {
        // Set drop target highlight
        document.querySelectorAll('[data-folder-id]').forEach(el => {
          el.classList.remove('bg-accent');
        });
        folderElement.classList.add('bg-accent');
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !draggedItemId.current) {
      touchStartPos.current = null;
      draggedItemId.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
    const folderElement = elementAtPoint?.closest('[data-folder-id]');

    if (folderElement) {
      const targetFolderId = folderElement.getAttribute('data-folder-id');
      if (targetFolderId && targetFolderId !== draggedItemId.current) {
        onMove(draggedItemId.current, targetFolderId);
      }
    }

    // Cleanup
    document.querySelectorAll('[data-folder-id]').forEach(el => {
      el.classList.remove('bg-accent');
    });

    setIsDragging(false);
    setIsDropTarget(false);
    touchStartPos.current = null;
    draggedItemId.current = null;
  };

  const ActionButtons = () => (
    <>
      {/* Mobile - Always visible three-dot menu */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTempName(item.name);
                setEditingId(item.id);
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop - Hover buttons */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity bg-sidebar/80 backdrop-blur-sm rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTempName(item.name);
            setEditingId(item.id);
          }}
          title="Rename"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(item.id);
          }}
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </>
  );

  if (item.type === "folder") {
    const isExpanded = expandedFolders[item.id] || false;

    return (
      <Collapsible
        className="group/collapsible"
        open={isExpanded}
        onOpenChange={() => toggleFolder(item.id)}
      >
        <SidebarMenuItem>
          <div
            className={cn(
              "group/row relative flex items-center w-full transition-colors",
              isDragging && "opacity-50",
              isDropTarget && "bg-accent"
            )}
            data-folder-id={item.id}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.name} className="pr-14">
                <ChevronRight className="mr-1 size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                <Icon />
                {isEditing ? (
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="h-6 py-0 px-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate flex-1">{item.name}</span>
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {!isEditing && <ActionButtons />}
          </div>

          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((subItem) => (
                <FileTreeItem
                  key={subItem.id}
                  item={subItem}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onRename={onRename}
                  onDelete={onDelete}
                  onMove={onMove}
                  onDuplicate={onDuplicate}
                  expandedFolders={expandedFolders}
                  toggleFolder={toggleFolder}
                  isMobile={isMobile}
                  setOpenMobile={setOpenMobile}
                  currentFileId={currentFileId}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <div
        className={cn(
          "group/row relative flex items-center w-full transition-colors",
          isDragging && "opacity-50"
        )}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <SidebarMenuButton asChild tooltip={item.name} className="pr-14 pl-2" isActive={isActive}>
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <Icon className="h-4 w-4 shrink-0" />
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-6 py-0 px-1"
              />
            </div>
          ) : (
            <Link
              href={href}
              className="flex items-center gap-2 w-full"
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                }
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate flex-1">{item.name}</span>
            </Link>
          )}
        </SidebarMenuButton>
        {!isEditing && <ActionButtons />}
      </div>
    </SidebarMenuItem>
  )
}
