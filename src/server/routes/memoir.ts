import { Router, Request, Response } from 'express';
import { getAI } from '../ai/geminiClient';
import { Sanitizer } from '../../domain/security/Sanitizer';

export const memoirRouter = Router();

memoirRouter.post('/', async (req: Request, res: Response) => {
  try {
    const seniorName = Sanitizer.cleanText(req.body?.seniorName, 100, 'Our Elder');
    const theme = Sanitizer.cleanText(req.body?.theme, 100, 'Youth & Hope');
    const promptQuestion = Sanitizer.cleanText(req.body?.promptQuestion, 300, '');
    const rawTranscript = Sanitizer.cleanText(req.body?.rawTranscript, 5000);
    const ai = getAI();

    if (!ai) {
      return res.json({
        title: `Memories of ${theme}`,
        refinedStory: `Recounted by ${seniorName}: "${rawTranscript}". A poignant testament to resilience, connection, and the value of simple courtesies.`,
        lifeLessonTakeaway: 'The quiet moments we spend helping others or learning something new often become the cornerstone of who we are.',
      });
    }

    const prompt = `You are a professional biographer specializing in recording the oral histories and life wisdom of elderly individuals.
Senior: ${seniorName}
Theme: ${theme}
Prompt Question: ${promptQuestion}
Raw Spoken/Written Words: "${rawTranscript}"

Please synthesize this into:
1. A poetic, respectful chapter title (5 to 9 words).
2. A refined, heartwarming narrative paragraph preserving their exact voice, dignity, and authenticity.
3. A clear "Core Life Lesson" or nugget of wisdom to pass down to grandchildren and youth.

Return as clean JSON with keys: "title", "refinedStory", "lifeLessonTakeaway".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      title: parsed.title || `Wisdom From ${seniorName}`,
      refinedStory: parsed.refinedStory || rawTranscript,
      lifeLessonTakeaway: parsed.lifeLessonTakeaway || 'Kindness given is never forgotten.',
    });
  } catch (error) {
    console.error('Error in memoir router:', error);
    return res.json({
      title: `A Treasured Memory from ${Sanitizer.cleanText(req.body?.seniorName, 100, 'Friend')}`,
      refinedStory: Sanitizer.cleanText(req.body?.rawTranscript, 5000),
      lifeLessonTakeaway: 'Courage and kindness are the greatest gifts we leave to those who follow.',
    });
  }
});
