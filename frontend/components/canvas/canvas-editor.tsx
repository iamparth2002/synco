"use client";

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ReactFlow,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    Connection,
    Panel,
    Node,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Square, Circle, Type } from "lucide-react";
import { useStore } from '@/context/store';
import { ShapeNode } from './custom-node';
import { fileService } from "@/lib/services/fileService";

export function CanvasEditor({ fileId }: { fileId: string }) {
    const id = fileId;
    const { getItem, updateItemContent, setSaveStatus } = useStore();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const isInitialLoad = useRef(true);

    const nodeTypes = useMemo(() => ({
        shape: ShapeNode,
    }), []);

    // Load initial data
    useEffect(() => {
        const controller = new AbortController();
        if (id) {
            isInitialLoad.current = true;
            fileService.fetchFileContent(id, controller.signal).then((item: any) => {
                if (item) {
                    setNodes((item.nodes as Node[]) || []);
                    setEdges((item.edges as Edge[]) || []);
                    // Small delay to prevent auto-save from triggering immediately after load
                    setTimeout(() => {
                        isInitialLoad.current = false;
                    }, 500);
                } else {
                    isInitialLoad.current = false;
                }
            }).catch(err => {
                if (err.name !== 'CanceledError' && err.code !== "ERR_CANCELED") {
                    console.error("Error loading canvas", err);
                    isInitialLoad.current = false;
                }
            });
        }
        return () => {
            controller.abort();
        };
    }, [id, setNodes, setEdges]);

    // Save data on change
    useEffect(() => {
        if (id) {
            if (isInitialLoad.current) {
                return;
            }
            const timeout = setTimeout(() => {
                setSaveStatus("saving");
                fileService.updateFile(id, { nodes, edges })
                    .then(() => setSaveStatus("saved"))
                    .catch(() => setSaveStatus("error"));
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [nodes, edges, id, setSaveStatus]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const addNode = (type: 'rectangle' | 'circle' | 'text') => {
        const newNode = {
            id: Math.random().toString(36).substr(2, 9),
            position: {
                x: -100 + Math.random() * 50, // Center-ish
                y: -100 + Math.random() * 50
            },
            type: 'shape',
            data: {
                shapeType: type,
                label: type === 'text' ? 'Text' : '',
                color: type === 'text' ? 'transparent' : '#27272a' // Default dark gray
            },
            style: {
                width: type === 'text' ? 100 : 150,
                height: type === 'text' ? 50 : 150
            },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div style={{ width: '100%', height: '100%' }} className="relative bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                colorMode="dark"
                minZoom={0.1}
                maxZoom={4}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                defaultEdgeOptions={{
                    style: { strokeWidth: 3, stroke: '#71717a' },
                    type: 'default',
                    animated: false,
                }}
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={2} color="#555" />

                <Panel position="bottom-center" className="mb-8">
                    <div className="bg-background/80 backdrop-blur-md p-2 rounded-full border border-border flex gap-2 shadow-2xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addNode('rectangle')}
                            title="Add Rectangle"
                            className="hover:bg-muted rounded-full w-10 h-10"
                        >
                            <Square className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addNode('circle')}
                            title="Add Circle"
                            className="hover:bg-muted rounded-full w-10 h-10"
                        >
                            <Circle className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addNode('text')}
                            title="Add Text"
                            className="hover:bg-muted rounded-full w-10 h-10"
                        >
                            <Type className="w-5 h-5" />
                        </Button>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}
