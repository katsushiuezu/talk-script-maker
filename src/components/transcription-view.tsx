'use client';

interface TranscriptionViewProps {
    text: string;
    onChange: (text: string) => void;
    isLoading: boolean;
}

export function TranscriptionView({ text, onChange, isLoading }: TranscriptionViewProps) {
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                📝 文字起こし結果
            </h2>
            <textarea
                className="flex-1 w-full p-4 border rounded-lg resize-none
             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
             text-gray-900 text-base leading-relaxed bg-white"
                placeholder={isLoading ? "文字起こし中..." : "ここに文字起こし結果が表示されます"}
                value={text}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
            />




        </div>
    );
}
