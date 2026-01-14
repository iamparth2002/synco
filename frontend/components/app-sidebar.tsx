"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bot,
  FileText,
  Folder,
  MoreHorizontal,
  Settings2,
  Layers,
  Map,
  Search,
  FilePlus,
  FolderPlus,
  ChevronRight,
  Trash2,
  Edit2,
  Loader2
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { useStore, FileSystemItem } from "@/context/store"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { files, searchQuery, setSearchQuery, createItem, deleteItem, renameItem, moveItem, duplicateItem, isLoading, expandedFolders, toggleFolder } = useStore();
  const { logout, user } = useAuth();
  const [editingId, setEditingId] = React.useState<string | null>(null);

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
    setEditingId(id);

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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Layers className="size-4" />
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
              placeholder="Search..."
              className="pl-8 h-9 bg-sidebar-accent/50 border-sidebar-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Bot className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "User"}</span>
                    <span className="truncate text-xs">{user?.email || "user@example.com"}</span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings2 className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
}

function FileTreeItem({ item, editingId, setEditingId, onRename, onDelete, onMove, onDuplicate, expandedFolders, toggleFolder }: FileTreeItemProps) {
  const Icon = item.type === "folder" ? Folder : (item.type === "canvas" ? Map : FileText);
  const href = item.type === "canvas" ? `/dashboard/canvas?id=${item.id}` : `/dashboard?id=${item.id}`;
  const isEditing = editingId === item.id;
  const [tempName, setTempName] = React.useState(item.name);

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

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId !== item.id && item.type === "folder") {
      onMove(draggedId, item.id);
    }
  };

  const ActionButtons = () => (
    <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity bg-sidebar/80 backdrop-blur-sm rounded-md">
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
            className="group/row relative flex items-center w-full"
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
        className="group/row relative flex items-center w-full"
        draggable
        onDragStart={handleDragStart}
      >
        <SidebarMenuButton asChild tooltip={item.name} className="pr-14 pl-8">
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
            <Link href={href} className="flex items-center gap-2 w-full">
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
