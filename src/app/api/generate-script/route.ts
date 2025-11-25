
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy',
});

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 500 });
    }

    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const systemPrompt = `
あなたはプロの編集者です。以下の文字起こしテキストを元に、話の流れが分かりやすい「トークスクリプト」を作成してください。
以下のJSON形式で出力してください。

{
    "title": "タイトル",
        "summary": "要約（3〜5行）",
            "sections": [
                {
                    "heading": "セクションの見出し",
                    "points": ["要点1", "要点2"],
                    "timestamp": "おおよその時間（例：00:00–03:00）※もし分かれば"
                }
            ]
}
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No content generated');
        }
        const script = JSON.parse(content);

        return NextResponse.json(script);
    } catch (error: any) {
        console.error('Script generation error:', error);
        return NextResponse.json({ error: error.message || 'Script generation failed' }, { status: 500 });
    }
}
