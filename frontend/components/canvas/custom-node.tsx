"use client";

import React, { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer, NodeToolbar, useReactFlow } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
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
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Transparent', value: 'transparent' },
];

// SVG path definitions for different shapes
const getShapePath = (type: string) => {
  switch (type) {
    case 'triangle':
      return 'M 50 5 L 95 95 L 5 95 Z';
    case 'diamond':
      return 'M 50 5 L 95 50 L 50 95 L 5 50 Z';
    case 'hexagon':
      return 'M 25 5 L 75 5 L 95 50 L 75 95 L 25 95 L 5 50 Z';
    default:
      return '';
  }
};

export const ShapeNode = memo(({ data, id, selected }: any) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local state with data
  const [text, setText] = useState(data.label || '');
  const [color, setColor] = useState(data.color || 'transparent');
  const shapeType = data.shapeType || 'rectangle'; // 'rectangle', 'circle', 'text', 'triangle', 'diamond', 'hexagon'

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
        minWidth={80}
        minHeight={40}
        handleStyle={{
          width: 10,
          height: 10,
          borderRadius: 4
        }}
      />
      
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        offset={10}
        className="flex items-center gap-0.5 md:gap-1 bg-background/95 backdrop-blur-md border rounded-md md:rounded-lg p-1 md:p-1.5 shadow-xl max-w-[90vw] overflow-x-auto"
      >
        <Button variant="ghost" size="icon" className="h-6 w-6 md:h-8 md:w-8 hover:bg-muted touch-manipulation shrink-0" onClick={handleDelete} title="Delete">
          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
        <div className="h-3 md:h-4 w-px bg-border mx-0.5 md:mx-1 shrink-0" />
        <div className="flex gap-0.5 md:gap-1">
            {colors.map((c) => (
                <button
                    key={c.value}
                    className={cn(
                        "w-3.5 h-3.5 md:w-5 md:h-5 rounded-sm md:rounded-md border transition-all active:scale-95 md:hover:scale-110 shrink-0",
                        color === c.value ? "border-primary ring-1 md:ring-2 ring-primary/30" : "border-border"
                    )}
                    style={{
                      backgroundColor: c.value === 'transparent' ? 'transparent' : c.value,
                      backgroundImage: c.value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none',
                      backgroundSize: '5px 5px',
                      backgroundPosition: '0 0, 2.5px 2.5px'
                    }}
                    onClick={() => handleColorChange(c.value)}
                    title={c.name}
                />
            ))}
        </div>
      </NodeToolbar>

      <div className="w-full h-full relative group">
        {/* Visual Shape Layer */}
        <div
            className="absolute inset-0 transition-all duration-200 flex items-center justify-center overflow-visible"
            onDoubleClick={handleDoubleClick}
        >
            {/* SVG-based shapes */}
            {!isTextNode && ['triangle', 'diamond', 'hexagon'].includes(shapeType) && (
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d={getShapePath(shapeType)}
                        fill={color === 'transparent' ? 'rgba(39, 39, 42, 0.5)' : color}
                        stroke={selected ? 'var(--ring)' : color === 'transparent' ? '#71717a' : color}
                        strokeWidth={2}
                    />
                </svg>
            )}

            {/* Circle and Rectangle - regular divs */}
            {!isTextNode && (shapeType === 'circle' || shapeType === 'rectangle') && (
                <div
                    className={cn(
                        "absolute inset-0 transition-all duration-200",
                        shapeType === 'circle' ? "rounded-full" : "rounded-xl"
                    )}
                    style={{
                        backgroundColor: color === 'transparent' ? 'rgba(39, 39, 42, 0.5)' : color,
                        border: `2px solid ${selected ? 'var(--ring)' : (color === 'transparent' ? '#71717a' : color)}`,
                    }}
                />
            )}

            {/* Text overlay - always centered */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    className={cn(
                        "w-full bg-transparent resize-none border-none focus:outline-none text-center font-medium text-foreground/90 placeholder:text-muted-foreground/50 overflow-hidden",
                        "pointer-events-none",
                        isEditing && "pointer-events-auto"
                    )}
                    placeholder="Type something..."
                    style={{
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        textAlign: 'center',
                        maxHeight: '100%',
                    }}
                />
            </div>
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
