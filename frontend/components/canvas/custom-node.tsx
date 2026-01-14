"use client";

import React, { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer, NodeToolbar, useReactFlow } from '@xyflow/react';
import { Trash2, Palette, Copy, ScanLine, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const colors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#27272a' },
  { name: 'Transparent', value: 'transparent' },
];

export const ShapeNode = memo(({ data, id, selected }: any) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local state with data
  const [text, setText] = useState(data.label || '');
  const [color, setColor] = useState(data.color || 'transparent');
  const shapeType = data.shapeType || 'rectangle'; // 'rectangle', 'circle', 'text'

  useEffect(() => {
    setText(data.label || '');
    setColor(data.color || 'transparent');
  }, [data.label, data.color]);

  const updateNodeData = (updates: any) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...updates } };
        }
        return node;
      })
    );
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    updateNodeData({ color: newColor });
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateNodeData({ label: e.target.value });
  };

  // Focus textarea when double clicked
  const handleDoubleClick = () => {
      setIsEditing(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleBlur = () => {
      setIsEditing(false);
  };

  const isTextNode = shapeType === 'text';

  return (
    <>
      <NodeResizer 
        color="#a1a1aa" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={50} 
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
      />
      
      <NodeToolbar 
        isVisible={selected} 
        position={Position.Top}
        offset={20}
        className="flex items-center gap-1 bg-background/90 backdrop-blur-md border rounded-lg p-1 shadow-xl"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <div className="flex gap-1 px-1">
            {colors.map((c) => (
                <button
                    key={c.value}
                    className={cn(
                        "w-4 h-4 rounded-full border border-border transition-transform hover:scale-110",
                        color === c.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    style={{ backgroundColor: c.value === 'transparent' ? 'transparent' : c.value }}
                    onClick={() => handleColorChange(c.value)}
                    title={c.name}
                >
                    {c.value === 'transparent' && <div className="w-full h-full border border-red-500 rotate-45 transform origin-center scale-x-0" />}
                </button>
            ))}
        </div>
      </NodeToolbar>

      <div className="w-full h-full relative group">
        {/* Visual Shape Layer */}
        <div 
            className={cn(
                "absolute inset-0 transition-colors duration-200 flex items-center justify-center overflow-hidden",
                shapeType === 'circle' ? "rounded-full" : "rounded-xl",
                isTextNode ? "border-none bg-transparent" : "border-2 border-transparent",
                !isTextNode && "shadow-sm"
            )}
            style={{ 
                backgroundColor: isTextNode ? 'transparent' : (color === 'transparent' ? 'rgba(39, 39, 42, 0.5)' : color),
                borderColor: selected ? 'var(--ring)' : 'transparent'
            }}
            onDoubleClick={handleDoubleClick}
        >
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onBlur={handleBlur}
                className={cn(
                    "w-full h-full bg-transparent resize-none border-none focus:outline-none text-center p-4 font-medium text-foreground/90 placeholder:text-muted-foreground/50 overflow-hidden",
                    "pointer-events-none", // Disable pointer events when not editing to allow dragging
                    isEditing && "pointer-events-auto"
                )}
                placeholder="Type something..."
                style={{
                    fontSize: '1rem',
                    lineHeight: '1.5',
                }}
            />
        </div>

        {/* Handles Layer - Outside overflow hidden */}
        {/* Top */}
        <Handle type="target" position={Position.Top} id="t-top" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ top: -3 }} />
        <Handle type="source" position={Position.Top} id="s-top" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ top: -3 }} />
        
        {/* Left */}
        <Handle type="target" position={Position.Left} id="t-left" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ left: -3 }} />
        <Handle type="source" position={Position.Left} id="s-left" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ left: -3 }} />
        
        {/* Right */}
        <Handle type="target" position={Position.Right} id="t-right" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ right: -3 }} />
        <Handle type="source" position={Position.Right} id="s-right" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ right: -3 }} />
        
        {/* Bottom */}
        <Handle type="target" position={Position.Bottom} id="t-bottom" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ bottom: -3 }} />
        <Handle type="source" position={Position.Bottom} id="s-bottom" className="w-3 h-3 bg-muted-foreground border-2 border-background opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ bottom: -3 }} />
      </div>
    </>
  );
});

ShapeNode.displayName = "ShapeNode";
