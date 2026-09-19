import { Router, Request, Response } from 'express';
import { getAI } from '../ai/geminiClient';
import { Sanitizer } from '../../domain/security/Sanitizer';

export const companionRouter = Router();

companionRouter.post('/', async (req: Request, res: Response) => {
  try {
    const rawMessage = Sanitizer.cleanText(req.body?.message, 1500);
    const seniorName = Sanitizer.cleanText(req.body?.seniorName, 100, 'Friend');
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-6) : [];
    const ai = getAI();

    if (!ai) {
      // Warm fallback response when API key is not configured
      const warmFallbacks = [
        `It is so wonderful to hear from you, ${seniorName}. Tell me more about what is bringing you comfort today. Have you had a nice cup of tea?`,
        `That brings back such meaningful thoughts. You have lived through so much history and have so much wisdom to offer. What was your favorite place to walk or relax when you were younger?`,
        `Thank you for sharing that with me. Please remember that you are valued and never alone. Is there a favorite song or story that always puts a smile on your face?`,
      ];
      const randomReply = warmFallbacks[Math.floor(Math.random() * warmFallbacks.length)];
      return res.json({
        reply: randomReply,
        suggestedTopics: [
          'Favorite childhood recipes & Sunday dinners',
          'Music from your youth & first records',
          'Places you loved traveling to or living in',
          'A funny moment from earlier in life',
        ],
      });
    }

    const systemPrompt = `You are "KinCare Companion", a deeply empathetic, patient, dignified, and gentle conversational partner specifically designed for elderly people.
Senior's name: ${seniorName}.
Core Guidelines:
1. Speak with genuine warmth, respect, patience, and comfort. Never speak down, baby, or patronize the elder.
2. Keep sentences clear, well-spaced, and easy to read.
3. Show sincere interest in their life stories, memories, feelings, and daily comfort.
4. If they seem lonely, validate their feelings with gentle presence.
5. If they express any immediate physical danger, severe pain, or emergency, gently remind them to press the red SOS Emergency button on their screen so their family and local emergency contacts are alerted immediately.
6. Provide 3 thoughtful, nostalgic, or gentle follow-up question ideas.`;

    const conversationContext = history
      .map((h: { sender?: string; text?: string }) => `${Sanitizer.cleanText(h.sender, 50)}: ${Sanitizer.cleanText(h.text, 500)}`)
      .join('\n');

    const fullPrompt = `${conversationContext ? `Prior conversation:\n${conversationContext}\n\n` : ''}Senior says: "${rawMessage}"\n\nRespond with warmth, empathy, and 3 gentle conversation prompt questions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const replyText = response.text || `It is so lovely to speak with you today, ${seniorName}. How are you feeling this hour?`;

    return res.json({
      reply: replyText,
      suggestedTopics: [
        'A memory about your favorite school teacher',
        'Your first job and what you learned',
        'The best advice your parents or grandparents gave you',
      ],
    });
  } catch (error) {
    console.error('Error in companion router:', error);
    return res.json({
      reply: 'I am so glad you reached out today. You are surrounded by people who care deeply about your well-being and peace of mind.',
      suggestedTopics: ['Memories of the 1960s', 'Gardening & nature', 'Favorite books'],
    });
  }
});
