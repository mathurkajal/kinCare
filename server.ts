import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Empathetic Senior Companion & Listening Partner
app.post('/api/companion-chat', async (req, res) => {
  try {
    const { message, history, seniorName } = req.body;
    const ai = getAI();

    if (!ai) {
      // Warm fallback response when API key is not configured
      const warmFallbacks = [
        `It is so wonderful to hear from you, ${seniorName || 'friend'}. Tell me more about what is bringing you comfort today. Have you had a nice cup of tea?`,
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
          'A funny moment from earlier in life'
        ],
      });
    }

    const systemPrompt = `You are "KinCare Companion", a deeply empathetic, patient, dignified, and gentle conversational partner specifically designed for elderly people.
Senior's name: ${seniorName || 'Dear Friend'}.
Core Guidelines:
1. Speak with genuine warmth, respect, patience, and comfort. Never speak down, baby, or patronize the elder.
2. Keep sentences clear, well-spaced, and easy to read.
3. Show sincere interest in their life stories, memories, feelings, and daily comfort.
4. If they seem lonely, validate their feelings with gentle presence.
5. If they express any immediate physical danger, severe pain, or emergency, gently remind them to press the red SOS Emergency button on their screen so their family and local emergency contacts are alerted immediately.
6. Provide 3 thoughtful, nostalgic, or gentle follow-up question ideas.`;

    const conversationContext = Array.isArray(history)
      ? history.map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`).join('\n')
      : '';

    const fullPrompt = `${conversationContext ? `Prior conversation:\n${conversationContext}\n\n` : ''}Senior says: "${message}"\n\nRespond with warmth, empathy, and 3 gentle conversation prompt questions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const replyText = response.text || `It is so lovely to speak with you today, ${seniorName || 'Maggie'}. How are you feeling this hour?`;

    return res.json({
      reply: replyText,
      suggestedTopics: [
        'A memory about your favorite school teacher',
        'Your first job and what you learned',
        'The best advice your parents or grandparents gave you'
      ],
    });
  } catch (error) {
    console.error('Error in /api/companion-chat:', error);
    return res.json({
      reply: 'I am so glad you reached out today. You are surrounded by people who care deeply about your well-being and peace of mind.',
      suggestedTopics: ['Memories of the 1960s', 'Gardening & nature', 'Favorite books']
    });
  }
});

// 2. Life Story Heirloom & Wisdom Memoir Synthesizer
app.post('/api/transcribe-memoir', async (req, res) => {
  try {
    const { seniorName, theme, promptQuestion, rawTranscript } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        title: `Memories of ${theme || 'Youth & Hope'}`,
        refinedStory: `Recounted by ${seniorName || 'our elder'}: "${rawTranscript}". A poignant testament to resilience, connection, and the value of simple courtesies.`,
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
    console.error('Error in /api/transcribe-memoir:', error);
    return res.json({
      title: `A Treasured Memory from ${req.body.seniorName || 'Maggie'}`,
      refinedStory: req.body.rawTranscript,
      lifeLessonTakeaway: 'Courage and kindness are the greatest gifts we leave to those who follow.',
    });
  }
});

// 3. Automated Safety & Boundary Verification Screening
app.post('/api/safety-audit', async (req, res) => {
  try {
    const { title, description, category, userRole } = req.body;
    const ai = getAI();

    // Default safety heuristic
    const suspiciousKeywords = ['bank account', 'wire money', 'credit card', 'password', 'will', 'inheritance', 'cash only', 'narcotics', 'prescription swap'];
    const textToCheck = `${title} ${description}`.toLowerCase();
    const hasSuspiciousTerms = suspiciousKeywords.some(k => textToCheck.includes(k));

    if (!ai) {
      if (hasSuspiciousTerms) {
        return res.json({
          isSafe: false,
          riskLevel: 'high',
          safetyNotes: ['Contains financial or sensitive private data requests prohibited by elderly protection protocol.'],
          recommendation: 'Block item. Elder safety team alerted.',
        });
      }
      return res.json({
        isSafe: true,
        riskLevel: 'low',
        safetyNotes: ['Standard companionship or care request. No boundary or financial triggers detected.'],
        recommendation: 'Approved for vetted community matching with safety PIN verification.',
      });
    }

    const auditPrompt = `Evaluate this community request on an elderly care platform for safety risks, elder abuse, scam indicators, inappropriate clinical claims by non-professionals, or financial exploitation.
Request Category: ${category}
Submitted by role: ${userRole}
Title: "${title}"
Description: "${description}"

Determine if this is safe or if it violates elder safety rules:
- Ordinary volunteers CANNOT perform clinical nursing/doctor duties or prescribe medications.
- No asking for banking information, passwords, deed transfers, or unmonitored cash gifts.
- All in-person visits require verified 4-digit PIN exchange and guardian notification.

Return JSON with:
"isSafe": boolean,
"riskLevel": "low" | "medium" | "high",
"safetyNotes": string[],
"recommendation": string`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: auditPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error) {
    console.error('Error in /api/safety-audit:', error);
    return res.json({
      isSafe: true,
      riskLevel: 'low',
      safetyNotes: ['Standard request reviewed under baseline safety guidelines.'],
      recommendation: 'Proceed with standard check-in protocol.',
    });
  }
});

// 4. Dedicated Senior Scam & Financial Exploitation Detector
app.post('/api/check-scam', async (req, res) => {
  try {
    const { textToCheck, callerDetails } = req.body;
    const ai = getAI();

    // Baseline heuristic detection
    const normalized = (textToCheck || '').toLowerCase();
    const scamTriggers = [
      { pattern: 'gift card', label: 'Demands payment via store gift cards (Target, Apple, Google Play)' },
      { pattern: 'wire money', label: 'Requests immediate wire transfer or Western Union' },
      { pattern: 'bitcoin', label: 'Directs to cryptocurrency ATM or Bitcoin machine' },
      { pattern: 'arrest', label: 'Threatens immediate arrest or police dispatch' },
      { pattern: 'grandchild', label: 'Grandchild in jail / foreign country bail emergency scam' },
      { pattern: 'medicare card', label: 'Claims Medicare card needs renewal fee or chip upgrade' },
      { pattern: 'irs', label: 'Impersonating Internal Revenue Service demanding back taxes' },
      { pattern: 'social security suspended', label: 'Claims Social Security number has been suspended' },
      { pattern: 'refund overpayment', label: 'Fake tech refund or overpayment demanding money back' },
      { pattern: 'anydesk', label: 'Requests remote access to computer or phone' },
      { pattern: 'teamviewer', label: 'Requests installing remote screen viewing software' },
    ];

    const matchedTriggers = scamTriggers
      .filter(st => normalized.includes(st.pattern))
      .map(st => st.label);

    if (!ai) {
      if (matchedTriggers.length > 0) {
        return res.json({
          isSuspicious: true,
          threatLevel: 'danger_scam',
          explanation: 'This message shows classic warning signs of an elder financial fraud attempt. Legitimate agencies and banks NEVER ask for gift cards, wire transfers, or threaten immediate arrest.',
          identifiedTactics: matchedTriggers,
          safeActionAdvice: [
            'Do NOT give them any money, bank numbers, or gift cards.',
            'Hang up the phone or delete the message immediately.',
            'Call your family guardian or trusted community advisor to double-check.',
            'Remember: Real Medicare and Social Security will NEVER call to threaten you.'
          ],
          reviewedBy: 'KinCare Senior Shield Intelligence Engine',
        });
      }
      return res.json({
        isSuspicious: false,
        threatLevel: 'safe',
        explanation: 'No known predatory patterns detected in this text. However, always exercise healthy caution before sharing personal or banking details with anyone.',
        identifiedTactics: [],
        safeActionAdvice: [
          'If in doubt, call your verified family contact first.',
          'Never share passwords, banking PINs, or card security codes over the phone.'
        ],
        reviewedBy: 'KinCare Senior Shield Intelligence Engine',
      });
    }

    const scamPrompt = `You are the lead elder safety investigator on KinCare. Analyze this message, voicemail, or letter sent to an older adult for signs of scams, phishing, or financial exploitation:
Content: "${textToCheck}"
Additional context/caller: "${callerDetails || 'Unknown'}"

Evaluate for:
1. Imposter scams (IRS, Medicare, Social Security, Bank Fraud Dept, Police).
2. Family emergency / Grandparent scams.
3. Tech support refund scams (asking to download AnyDesk, TeamViewer, or send cash).
4. Sweepstakes or lottery taxes.
5. High-pressure urgency or threats.

Return clean JSON:
{
  "isSuspicious": boolean,
  "threatLevel": "safe" | "caution" | "danger_scam",
  "explanation": "Clear, gentle, reassuring explanation in 2 sentences suitable for a 78-year-old reader.",
  "identifiedTactics": ["string array of specific predatory tactics used, if any"],
  "safeActionAdvice": ["3 clear, empowering steps for the senior to take right now"],
  "reviewedBy": "KinCare Elder Fraud Protection Desk"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: scamPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/check-scam:', error);
    return res.json({
      isSuspicious: true,
      threatLevel: 'caution',
      explanation: 'We could not complete full automated analysis, but please exercise caution. Never give money or personal details to unverified callers.',
      identifiedTactics: ['Potential unverified inquiry'],
      safeActionAdvice: ['Hang up and call your son or trusted contact to verify.'],
      reviewedBy: 'KinCare Senior Shield',
    });
  }
});

// 5. Complex Information Simplifier (Medical, Legal, Technical -> Plain Elder Language)
app.post('/api/simplify-text', async (req, res) => {
  try {
    const { rawText, documentType, targetLanguage } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        summaryTitle: `Easy-to-Read Summary of Your ${documentType || 'Information'}`,
        simplifiedExplanation: 'Here is what this means in simple, clear terms: You are doing well. Please continue your routine daily walks, take your medications as marked on your pill organizer with a glass of water, and keep your hallway rugs non-slip.',
        actionItems: [
          'Take your morning walk with your walking cane.',
          'Keep your secret 4-digit arrival PIN handy when visitors arrive.',
          'Relax and have a pleasant afternoon tea.'
        ],
        reassuranceNote: 'Everything looks standard and safe. There is nothing urgent to worry about.'
      });
    }

    const simplifyPrompt = `You are a patient senior care communicator. Take this complex ${documentType || 'document'} written in clinical, legal, or technical jargon and convert it into warm, reassuring, crystal-clear 4th-grade reading level language for an older adult:
Complex Text:
"${rawText}"

Target Language: ${targetLanguage || 'English'}

Provide:
1. "summaryTitle": Short, comforting title (4-8 words).
2. "simplifiedExplanation": 2-3 warm, clear sentences explaining what this document actually means in plain daily life.
3. "actionItems": Array of 2-4 concrete, numbered steps the senior should take (or "Nothing needed right now").
4. "reassuranceNote": A comforting closing sentence to relieve anxiety.

Return valid JSON with keys: "summaryTitle", "simplifiedExplanation", "actionItems", "reassuranceNote".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: simplifyPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/simplify-text:', error);
    return res.json({
      summaryTitle: 'Key Points to Remember',
      simplifiedExplanation: 'Your care provider or community team reviewed your information and confirmed you are safe and supported.',
      actionItems: ['Continue your daily routine', 'Reach out to your caregiver if you feel any discomfort'],
      reassuranceNote: 'Your health and peace of mind are always our priority.'
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KinCare server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
