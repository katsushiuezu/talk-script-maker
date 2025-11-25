'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { TranscriptionView } from '@/components/transcription-view';
import { ScriptView, ScriptData } from '@/components/script-view';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState('');
    const [script, setScript] = useState<ScriptData | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        // Reset other states when new file is selected
        setTranscription('');
        setScript(null);
    };

    const handleTranscribe = async () => {
        if (!file) return;

        setIsTranscribing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '文字起こしに失敗しました');
            }

            setTranscription(data.text);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleGenerateScript = async () => {
        if (!transcription) return;

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: transcription }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'スクリプト生成に失敗しました');
            }

            setScript(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-900">トークスクリプトメーカー</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
                    {/* Left Column: Upload & Transcription */}
                    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-lg font-semibold mb-4">1. 音声アップロード</h2>
                            <FileUpload onFileSelect={handleFileSelect} />
                            {file && (
                                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center justify-between">
                                    <span className="truncate">{file.name}</span>
                                    <button
                                        onClick={handleTranscribe}
                                        disabled={isTranscribing}
                                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        {isTranscribing ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                処理中...
                                            </>
                                        ) : (
                                            <>
                                                文字起こしを開始
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border min-h-[400px]">
                            <TranscriptionView
                                text={transcription}
                                onChange={setTranscription}
                                isLoading={isTranscribing}
                            />
                            {transcription && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleGenerateScript}
                                        disabled={isGenerating}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm transition-colors"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                スクリプト生成中...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={18} />
                                                トークスクリプトを生成
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Script Result */}
                    <div className="h-full overflow-hidden">
                        <ScriptView script={script} isLoading={isGenerating} />
                    </div>
                </div>
            </main>
        </div>
    );
}
