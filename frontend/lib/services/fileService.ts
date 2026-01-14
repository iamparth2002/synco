import api from '@/lib/api';
import { FileSystemItem, FileType } from '@/context/store';

export interface FileUpdatePayload {
    name?: string;
    parentId?: string | null;
    content?: string;
    nodes?: any[];
    edges?: any[];
}


export const fileService = {
    // metadata only
    fetchFileStructure: async (signal?: AbortSignal): Promise<FileSystemItem[]> => {
        const response = await api.get('/files', { signal });
        return response.data;
    },

    fetchFileContent: async (id: string, signal?: AbortSignal) => {
        const response = await api.get(`/files/${id}`, { signal });
        return response.data;
    },

    createFile: async (data: { name: string; type: FileType; parentId: string | null; content?: string; nodes?: any[]; edges?: any[] }): Promise<FileSystemItem> => {
        const response = await api.post('/files', data);
        return response.data;
    },

    updateFile: async (id: string, data: FileUpdatePayload): Promise<FileSystemItem> => {
        const response = await api.put(`/files/${id}`, data);
        return response.data;
    },

    deleteFile: async (id: string) => {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    }
};
