'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export interface ScriptSection {
    heading: string;
    points: string[];
    timestamp?: string;
}

export interface ScriptData {
    title: string;
    summary: string;
    sections: ScriptSection[];
}

interface ScriptViewProps {
    script: ScriptData | null;
    isLoading: boolean;
}

export function ScriptView({ script, isLoading }: ScriptViewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!script) return;

        const text = `
# ${script.title}

## 要約
${script.summary}

${script.sections.map(section => `
## ${section.heading} ${section.timestamp ? `(${section.timestamp})` : ''}
${section.points.map(point => `- ${point}`).join('\n')}
`).join('\n')}
    `.trim();

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <div className="animate-pulse">トークスクリプトを生成中...</div>
            </div>
        );
    }

    if (!script) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg min-h-[300px]">
                トークスクリプトはここに表示されます
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{script.title}</h1>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? 'コピーしました' : 'コピー'}
                </button>
            </div>

            <div className="space-y-6">
                <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">要約</h3>
                    <p className="text-gray-700 leading-relaxed">{script.summary}</p>
                </section>

                <div className="space-y-6">
                    {script.sections.map((section, index) => (
                        <section key={index} className="border-t pt-4">
                            <div className="flex items-baseline justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{section.heading}</h3>
                                {section.timestamp && (
                                    <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {section.timestamp}
                                    </span>
                                )}
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {section.points.map((point, i) => (
                                    <li key={i} className="pl-2">{point}</li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
