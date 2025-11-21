import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DownloadContextType {
    startDownloadProgress: () => void;
    updateDownloadProgress: (progress: number) => void;
    completeDownload: () => void;
    errorDownload: () => void;
    downloadProgress: number | null;
    isDownloadModalVisible: boolean;
    downloadStatus: 'idle' | 'downloading' | 'completed' | 'error';
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle', 'downloading', 'completed', 'error'

    const startDownload = () => {
        setIsDownloadModalVisible(true);
        setDownloadStatus('downloading');
        setDownloadProgress(0);
    };

    const updateDownloadProgress = (progress: number) => {
        setDownloadProgress(progress);
    };

    const completeDownload = () => {
        setDownloadStatus('completed');
        setDownloadProgress(100);
        
        // Auto hide after 2 seconds
        setTimeout(() => {
            setIsDownloadModalVisible(false);
            setDownloadStatus('idle');
            setDownloadProgress(0);
        }, 2000);
    };

    const errorDownload = () => {
        setDownloadStatus('error');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            setIsDownloadModalVisible(false);
            setDownloadStatus('idle');
            setDownloadProgress(0);
        }, 3000);
    };


    return (
        <DownloadContext.Provider value={{
            startDownloadProgress: startDownload,
            updateDownloadProgress,
            completeDownload,
            errorDownload,
            downloadProgress,
            isDownloadModalVisible,
            downloadStatus: downloadStatus as 'idle' | 'downloading' | 'completed' | 'error',
        }}>
            {children}
            
        </DownloadContext.Provider>
    );
}

export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};