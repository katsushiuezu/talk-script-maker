'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/*': ['.mp3', '.wav', '.m4a', '.mp4', '.mpeg', '.mpga', '.webm'],
        },
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                    {isDragActive ? <FileAudio size={32} /> : <Upload size={32} />}
                </div>
                <div>
                    <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? 'ここにファイルをドロップ' : '音声ファイルをアップロード'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        またはクリックしてファイルを選択
                    </p>
                </div>
                <p className="text-xs text-gray-400">
                    MP3, WAV, M4A などに対応
                </p>
            </div>
        </div>
    );
}
